import { OrgAdmissionData, OrgDataRecord } from "./dts/org";
import { average, getElapsedTime, writeLog } from "../../utils";
import { User } from "../user/user";
import { orgDB } from "./doubt";
import { websocketio } from "../../drought";
import { ALL_MAP_OBJECTS_ARTICLE, ALL_MAP_OBJECTS_NO_ART } from "../../mapobjs";


export const DEFAULT_ADMISSION_PT = 250;

export class Orgument{
    static _all: string[] = [];
    static _latest_visitpt_calcs: {
        deviation: number;
        average: number;
        ranking: string[][];
    } = {
        deviation: NaN,
        average: NaN,
        ranking: []
    };
    static visit_pt_table: {[key: string]: number} = { };
    static crowd_status: {[key: string]: number} = { };
    static visitpt_stricted = -1;
    oname: string = "";


    constructor(org_name: string){
        this.oname = org_name;
    }


    static async setUp(){
        orgDB.all("SELECT * FROM Org_Data", async (e, rows: OrgDataRecord[]) => {
            const g = [];

            for (const o of rows){
                g.push(o.org_name);
            }

            Orgument._all = g;

            this.setOrgPtTable();
            setInterval(async () => this.setOrgPtTable.apply(Orgument), (2)*60*1000);
        });

        for (const oname in ALL_MAP_OBJECTS_NO_ART){
            const article = ALL_MAP_OBJECTS_NO_ART[oname].article;
            if (!article) continue;
            this.crowd_status[oname] = article.crowd_status;
        }
    }


    async getData(key: null): Promise<OrgDataRecord>
    async getData(key: keyof OrgDataRecord): Promise<string>
    async getData(key: keyof OrgDataRecord | null): Promise<OrgDataRecord | string>{
        return new Promise((r, j) => {
            orgDB.all(`SELECT * FROM Org_Data WHERE org_name=?`,
            [ this.oname ], function(err, rows: OrgDataRecord[]){
                if (err){ j(void 0); return; };

                if (rows && rows[0]){
                    if (key){
                        //@ts-ignore
                        r(rows[0][key]);
                    } else {
                        r(rows[0]);
                    }
                } else {
                    j(void 0);
                }
            });
        });
    }


    async setData(data: { key: keyof OrgDataRecord, value: string}[] | { key: keyof OrgDataRecord, value: string} ): Promise<void>{
        if (!(data instanceof Array)){
            data = [data];
        }

        const values: string[] = [];
        var updateText = "";

        for (const dat of data){
            updateText += `${dat.key} = ?,`;
            values.push(dat.value);
        }
        
        updateText = updateText.slice(0, -1);

        return new Promise((r, j) => {
            orgDB.all(`UPDATE Org_Data
                SET ${updateText}
                WHERE org_name=?`,
            [ ...values, this.oname ], (e) => { e ? j(e) : r(); });
        });
    }


    async addEntered(heads: number, duplication: boolean=false): Promise<OrgAdmissionData>{
        const row = await this.getData(null);
        const sheads = heads.toString();
        const entered_data = JSON.parse(row.entered_data);
        var entered_total = row.entered_total;
        var entered_groups = row.entered_groups;
        const duped_entered_data = JSON.parse(row.duped_entered_data);
        var duped_entered_total = row.duped_entered_total;
        var duped_entered_groups = row.duped_entered_groups;


        entered_data[sheads] ? entered_data[sheads] += 1 : entered_data[sheads] = 0;
        entered_total += heads;
        entered_groups++;

        if (duplication){
            duped_entered_data[sheads] ? duped_entered_data[sheads] += 1 : duped_entered_data[sheads] = 0;
            duped_entered_total += heads;
            duped_entered_groups++;
        }


        await this.setData([
            {
                key: "entered_data",
                value: JSON.stringify(entered_data)
            },
            {
                key: "entered_total",
                value: entered_total.toString()
            },
            {
                key: "entered_groups",
                value: entered_groups.toString()
            },
            {
                key: "duped_entered_data",
                value: JSON.stringify(duped_entered_data)
            },
            {
                key: "duped_entered_total",
                value: duped_entered_total.toString()
            },
            {
                key: "duped_entered_groups",
                value: duped_entered_groups.toString()
            }
        ]);

        const good_data = {
            entered_data: entered_data,
            entered_total: entered_total,
            entered_groups: entered_groups,
            duped_entered_data: duped_entered_data,
            duped_entered_total: duped_entered_total,
            duped_entered_groups: duped_entered_groups,
        };
        websocketio.to("_org-"+this.oname).emit("org.status.update", good_data);

        return good_data;
    }


    static async getFameData(){
        const usersdata = await User.getAllUserData();
        const org_fames: {[key: string]: number} = {};
        
        for (const o of Orgument._all){
            org_fames[o] = 0;
        }

        for (const userdata of usersdata){
            for (const target of JSON.parse(userdata.fame_votes)){
                org_fames[target] ? org_fames[target] += 1 : org_fames[target] = 1;
            }
        }
        
        return org_fames;
    }


    static async setFame(): Promise<unknown>{
        const org_fames = await this.getFameData();
        const queries = Object.entries(org_fames)
        .map(([oname, fame]) => `UPDATE Org_Data SET fame=${fame} WHERE org_name="${oname.replace(/\"/g, "")}";`)
        .join(' ');
        
        return new Promise(r => orgDB.exec(queries, r));
    }


    static async getRanking(){
        const org_fames = await this.getFameData();
        const entries = Object.entries(org_fames);
        
        entries.sort((a, b) => b[1] - a[1]);

        const ranking_groups: string[][] = [];
        var currentrank = 1;
        var currentfame = entries[0][1];

        ranking_groups.push([entries[0][0]]);

        for (var i = 1; i < entries.length; i++){
            const [oname, fame] = entries[i];
            if (fame === currentfame){
                ranking_groups[currentrank - 1].push(oname);
            } else {
                currentrank++;
                currentfame = fame;
                ranking_groups.push([oname]);
            }
        }

        return ranking_groups;
    }


    async getRank(){
        const ranking_groups = Orgument._latest_visitpt_calcs.ranking;
        for (var i = 0; i < ranking_groups.length; i++){
            if (ranking_groups[i].includes(this.oname)){
                return i + 1;
            }
        }
        return null;
    }


    async getAdmissionCount(): Promise<number>{
        return Number(await this.getData("entered_total"));
    }


    static async getAllOrgument(): Promise<OrgDataRecord[]>{
        return new Promise((resolve, reject) => {
            orgDB.all("SELECT * FROM Org_Data", function(err, rows: OrgDataRecord[]){
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }


    static async getAdmissionSequence(): Promise<number[]>{
        const orgdata = await Orgument.getAllOrgument();
        const rs = orgdata.map(orgdat => Number(orgdat.entered_total));
        
        return rs;
    }


    static async getAdmissionCountAverage(){
        const rs: number[] = await this.getAdmissionSequence();
        const sum = rs.reduce((acc, cv) => acc+cv);

        return sum/Orgument._all.length;
    }

    static async getAdmissionCountDeviation(){
        const values: number[] = await this.getAdmissionSequence();
        const mean = await this.getAdmissionCountAverage();
        const squared_diffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquared_diff = average(squared_diffs);

        return Math.sqrt(avgSquared_diff);
    }


    async getAdmissionZScore(){
        const mine = await this.getAdmissionCount();
        const devi = Orgument._latest_visitpt_calcs.deviation;
        const mean = Orgument._latest_visitpt_calcs.average;

        if (devi == 0) return 50;

        return (mine - mean) / devi;
    }


    /**
     * idea from {@link /devm/illustration/orgpt.png} (inversed)
     * @param oname 
     * @returns 
     */
    async calcVisitPt(): Promise<number>{
        const org = new Orgument(this.oname);
        const d = DEFAULT_ADMISSION_PT;
        const M = 500;
        const m = 5;

        async function rankingcalc(){
            const n = Orgument._all.length;
            const r = await org.getRank() || n/2;
            const k = 1/100;
            
            if (r == 0)
                return 0;
    
            const pt = Math.floor(
                k*((r - n/2)**3)
            );
            
            return pt;
        }

        async function admissioncalc(){
            const g = (await org.getAdmissionZScore()) - 50;
            const k = 1/50;
            const p = -k*(g**3);
            
            return p;
        }

        const pt = Math.floor(d + (await admissioncalc()) + (await rankingcalc()));

        if (pt > M) return M;
        else if (pt < m) return M;
        else return pt;
    }


    static async setOrgPtTable(){
        if (this.visitpt_stricted >= 0){
            for (const oname in this.visit_pt_table){
                this.visit_pt_table[oname] = this.visitpt_stricted;
            }
            writeLog(`[org/warn] [Pt] PtTable updated, which is stricted: ${this.visitpt_stricted}.`);
            return;
        }

        const elapsed = getElapsedTime();

        this._latest_visitpt_calcs.average = await Orgument.getAdmissionCountAverage();
        this._latest_visitpt_calcs.deviation = await Orgument.getAdmissionCountDeviation();
        this._latest_visitpt_calcs.ranking = await Orgument.getRanking();

        const promises = this._all.map(async oname => new Promise(async (resolve) => {
            const org = new this(oname);
            org.calcVisitPt().then(async pt => {
                this.visit_pt_table[oname] = pt;
                websocketio.to("_org-"+oname).emit("org.status.update", {
                    pt: pt
                });
                resolve(org.setData({ key: "visitpt", value: pt.toString() }));
            });
        }));

        await Promise.all(promises);
        const executiontime = elapsed.end();

        writeLog(`[org/info] [Pt] PtTable updated. (${executiontime/1000} seconds)`);
    }


    async getVisitPt(){
        return Number(await this.getData("visitpt"));    
    }
}


export { }
