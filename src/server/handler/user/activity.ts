import { Request, Response } from "express";
import { UserAuth } from "./auth";
import { OrgAuth } from "../org/auth";
import { random, stampDB, userDB } from "./doubt";
import { User } from "./user";
import { websocketio } from "../../drought";
import { WSbranchResponseBase } from "../../server-dts/server";
import { UserLoginRecord, UserProfile, PublicUserProfile, Claimed_RPT, MissionPTMap, UserCustomData } from "./dts/user";
import { StampDataRecord } from "./dts/user";
import { getElapsedTime, parseJSON, readJSONSync, writeLog } from "../../utils";
import { Orgument } from "../org/orgument";
import { SpecialMission } from "../../../assets/shishiji-dts/supports";
import { TicketAdministrator } from "../misc/ticket";


export class UserActivity{
    static top100_users: PublicUserProfile[] = [];
    static times_ranking_updated = 0;
    static mission_pt: MissionPTMap = readJSONSync("./.data/mission/pt.json");
    static special_missions: SpecialMission[] = readJSONSync("./.data/mission/specials.json");

    
    async enterOrg(request: Request, response: Response){
        const data = parseJSON(request.body["data"]);
        const orgsession = request.cookies["__ogauthk"];
        const orgname = await OrgAuth._auth(orgsession);

        if (!data || !data.user_id || !data.qid || !orgname){
            response.status(404).json({ error: "Not a person" });
        } else {
            try{
                const sorg = new Orgument(orgname);
                const user = new User(data.user_id);
                const udata = await user.getData(null);
                const completed_orgs: string[] = parseJSON(udata.completed_orgs);
                const visitpt = await sorg.getVisitPt();
                var responseFunction: Function;
                var socketsends: WSbranchResponseBase;
                var duplication = false;
    
                websocketio.to(user.user_id).emit("user.admission.pending", { s: orgname });
                
                if (completed_orgs.includes(orgname)){
                    socketsends = {
                        processType: "duplicated",
                        _new: orgname,
                    };
                    responseFunction = () => response.status(200).json({ message: "duped" });
                    duplication = true;
                } else {
                    completed_orgs.push(orgname);
                    await user.setData("completed_orgs", JSON.stringify(completed_orgs));
                    const apt = await user.addPt(visitpt);
                    socketsends = {
                        processType: "included",
                        _new: orgname,
                        _update: completed_orgs,
                        _apt: apt,
                        _pt: visitpt,
                    };
                    responseFunction = () => response.status(200).json({ message: "success" });
                }

                const customdata: UserCustomData = JSON.parse(udata.custom_data);

                await sorg.addEntered(customdata.headcount, duplication);
                websocketio.to(user.user_id).emit("user.admission.register", socketsends);
                
                responseFunction ? responseFunction() : (() => { throw new Error() })();
            } catch(e){
                writeLog(`[error] [admission] ${e}`);
                response.status(500).json({ error: "unhandled" });
            }
        }
    }


    async _devOrg(request: Request, response: Response){
        const self = await User.requestLogin(request);
        const _where =  request.body["_where"];
        const _process =  request.body["_process"];
        var expd: string[] = parseJSON(await self.getData("completed_orgs"));

        if (!expd) return;

        if (_process == "add" && !expd.includes(_where)){
            expd.push(_where);
        } else if (_process == "remove" && expd.includes(_where)){
            expd = expd.filter(f => f !== _where);
        }
        
        await self.setData("completed_orgs", JSON.stringify(expd));
        response.send(expd);
    }


    async giveMissionPt(request: Request, response: Response){
        const floor: keyof MissionPTMap = request.body.f;
        const hg = UserActivity.mission_pt;

        if (!floor){
            response.status(200).send(hg);
        } else {
            const udat = hg[floor];
    
            if (udat) response.status(200).send(udat);
            else response.status(404).end();
        }
    }


    static async getStampData(): Promise<StampDataRecord[]>{
        return new Promise((resolve, reject) => {
            stampDB.all("SELECT * FROM Location", (err, rows: StampDataRecord[]) => {
                resolve(rows);
            });
        });
    }


    static async updateRankingProfile(prof: UserProfile, disc: string){
        for (var i = 0; i < this.top100_users.length; i++){
            if (this.top100_users[i].disc == disc){
                this.top100_users[i].icp = prof.icon_path || "";
                this.top100_users[i].nick = prof.nickname;
                break;
            }
        }
    }


    /**
     * NEVER AWAITS
     * @param _newdata 
     * @returns 
     */
    static updateMissionRanking(_newdata: UserLoginRecord): void{
        const data = _newdata;
        const mypt = Number(data.pt);
        const prof: UserProfile = parseJSON(data.profile);
        const ranking = [...this.top100_users];
        const bworst = ranking[ranking.length - 1];
        var breakpoint = 0;
        
        if (
            (ranking.length >= 100 && bworst && mypt <= bworst.pt)
            || !prof
        ) return;

        const myrankeddata = {
            nick: prof.nickname,
            pt: mypt,
            icp: prof.icon_path || "",
            disc: data.discriminator
        };

        for (var i = 0; i < ranking.length; i++){
            if (ranking[i].disc == _newdata.discriminator){
                ranking.splice(i, 1);
                break;
            }
        }

        if (ranking.length == 0){
            ranking.push(myrankeddata);
        } else if (ranking.length < 100 && ranking[ranking.length - 1].pt >= mypt){
            ranking.push(myrankeddata);
        } else {
            for (var j = ranking.length - 1; j >= 0; j--){
                if (j == 0 
                    || (ranking[j].pt < mypt && ranking[j - 1].pt >= mypt)
                ){
                    ranking.splice(j, 0, {
                        nick: prof.nickname,
                        pt: mypt,
                        icp: prof.icon_path || "",
                        disc: data.discriminator
                    });
                    breakpoint = j;
                    break;
                }
            }
        }

        
        this.top100_users = ranking;
        
        this.top100_users.length > 100 ? this.top100_users.splice(100) : void 0;

        writeLog(`[user/info] [Ranking] New update(n:${++this.times_ranking_updated}). Placed: ${breakpoint+2}. Length of ranked users: ${this.top100_users.length}.`);

        return;
    }


    static async againMissionRanking(){
        try {
            const elapsed = getElapsedTime();
            const users = [];
            const user_records: Promise<UserLoginRecord[]> = User.getAllUserData();
            
            for (const userdata of await user_records){
                const prof: UserProfile = parseJSON(userdata.profile);
                const mpt = Number(userdata.pt);
    
                if (mpt == 0) continue;
    
                users.push({
                    nick: prof.nickname,
                    pt: mpt,
                    icp: prof.icon_path || "",
                    disc: userdata.discriminator
                });
            }
            
            this.top100_users = users
                .sort((a, b) => b.pt - a.pt)
                .slice(0, 100);
            writeLog(`[user/info] [ranking] First update done. (len ${this.top100_users.length}) (${elapsed.end()/1000} seconds)`);
        } catch (error: any){
            writeLog(`[error] [ranking] Failed to update ranking: ${error.message}`);
        }
    }

    
    async claimMissionrpt(request: Request, response: Response){
        const user = await User.requestLogin(request);
        const claim_data: {
            floor: keyof MissionPTMap;
            idx: number;
        } = request.body;
        const userdata = await user.getData(null);
        const uclaimed: Claimed_RPT = JSON.parse(userdata.claimed_rpt);

        claim_data.idx = Number(claim_data.idx);
        
        if (uclaimed[claim_data.floor] >= claim_data.idx){
            response.status(400).send({message: "Illegal receiption"});
            return;
        } else {
            // This still can be illegal!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const ptgets = UserActivity.mission_pt[claim_data.floor][claim_data.idx];
            
            uclaimed[claim_data.floor] = claim_data.idx;
            userdata.pt += ptgets;

            await user.addPt(ptgets);
            await user.setData("claimed_rpt", JSON.stringify(uclaimed));

            UserActivity.updateMissionRanking(userdata);
            
            response.status(200).send({ neu: userdata.pt, ucl: uclaimed, _gets: ptgets });
        }
    }


    async claimSpecialMissionrpt(request: Request, response: Response){
        const user = await User.requestLogin(request);
        const claim_data: {
            mission_id: string;
        } = request.body;
        const userdata = await user.getData(null);
        const uclaimed: Claimed_RPT = JSON.parse(userdata.claimed_rpt);
        const oldclaimeds: Claimed_RPT = JSON.parse(userdata.claimed_rpt);
        var missondata: SpecialMission | null = null;
        var legal = false;

        for (const specialmission of UserActivity.special_missions){
            if (
                specialmission.mission_id == claim_data.mission_id
                && Number(userdata.pt) >= specialmission.required_pt
            ){
                missondata = specialmission;
                legal = true;
                break;
            }
        }

        if (oldclaimeds.specials.includes(claim_data.mission_id)) legal = false;

        if (!legal || !missondata){
            response.status(403).end();
            return;
        }
        
        oldclaimeds.specials.push(claim_data.mission_id);

        await user.setData("claimed_rpt", JSON.stringify(oldclaimeds));

        const new_user_ticket_data = await TicketAdministrator.createTicket(user, missondata.mission_id, missondata.reward);

        response.status(200).send({
            _new: new_user_ticket_data,
            _dnew: oldclaimeds // <- new!
        });
    }
}


export { }
