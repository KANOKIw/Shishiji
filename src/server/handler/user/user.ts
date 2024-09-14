import { Request, Response } from "express";
import { random, userDB } from "./doubt";
import { UploadedFile } from "express-fileupload";
import { UserCustomData, UserLoginRecord, UserProfile } from "./dts/user";
import { UserAuth } from "./auth";
import { orgDB } from "../org/doubt";
import { Orgument } from "../org/orgument";
import { UserActivity } from "./activity";
import { ALL_MAP_OBJECTS_ARTICLE, ALL_MAP_OBJECTS_NO_ART } from "../../mapobjs";

import * as AppAPI from "../../utils";

import QRCode from "qrcode";
import fs from "fs";
import sharp from "sharp";
import path from "path";


export class User{
    user_id = "";


    constructor(user_id: string){
        this.user_id = user_id;
    }


    /**
     * 
     * @deprecated -> getAllUserData much more better
     */
    static async getAllUsers(): Promise<User[]>{
        return new Promise((resolve, e) => {
            userDB.all("SELECT * FROM Login_Users", (err, rows: UserLoginRecord[]) => {
                const g = [];
                for (const row of rows){
                    g.push(new User(row.discriminator));
                }
                resolve(g);
            });
        });
    }


    static async getAllUserData(): Promise<UserLoginRecord[]>{
        return new Promise((resolve, e) => {
            userDB.all("SELECT * FROM Login_Users", (err, rows: UserLoginRecord[]) => {
                resolve(rows);
            });
        });
    }

    
    static async requestLogin(request: Request){
        const udata = await UserAuth.fineData(request.cookies["__shjSID"]);
        return new User(udata.discriminator);
    }


    async getData(key: null): Promise<UserLoginRecord>
    async getData(key: keyof UserLoginRecord): Promise<string>
    async getData(key: keyof UserLoginRecord | null): Promise<UserLoginRecord | string>{
        return new Promise((resolve, reject) => {
            userDB.all(`SELECT * FROM Login_Users WHERE discriminator=?`,
            [ this.user_id ], (err, rows: UserLoginRecord[]) => {
                if (err){ reject(err); return; };

                if (rows && rows[0]){
                    if (key){
                        //@ts-ignore
                        resolve(rows[0][key]);
                    } else {
                        resolve(rows[0]);
                    }
                } else {
                    reject("user not found: " + this.user_id);
                }
            });
        });
    }


    async setData(key: keyof UserLoginRecord, value: string): Promise<void>{
        return new Promise((r, j) => {
            userDB.all(`UPDATE Login_Users
                SET ${key} = ?
                WHERE discriminator=?`,
            [ value, this.user_id ], (e) => { e ? j() : r(); });
        });
    }


    async getQRCode(): Promise<string>{
        const qid = random.string(64);
        const data = {
            qid: qid,
            user_id: this.user_id,
        };

        return new Promise((resolve, reject) => {
            QRCode.toDataURL(JSON.stringify(data), {
                width: 380
            }, (err, url)=>{
                if (err){
                    reject(err);
                } else {
                    resolve(url);
                }
            }); 
        });
    }


    /**
     * Due to files...
     * @param request 
     * @param response 
     */
    async saveProfile(request: Request, response: Response){
        try {
            const mydata = await this.getData(null);
            const profiledata: UserProfile = AppAPI.parseJSON(mydata["profile"]);
            const profdata = request.body;
            const files = request.files;
            var _icon_path = profiledata.icon_path || "";


            if (!profdata["nickname"] || profdata["nickname"].length > 12){
                response.status(400).end();
            }
            
            if (files){
                const file: UploadedFile = files.file as UploadedFile;
                const ext = path.extname(file.name);
                const T_icon_path = "./resources/cloud/user/icon/_"+this.user_id+"."+ext;

                if (AppAPI.getMediaType(file.name) != "image"){ 
                    response.status(400).end();
                    return;
                }

                _icon_path = "./resources/cloud/user/icon/"+this.user_id+"."+ext; // kindness (never)

                await file.mv(T_icon_path);
                await resizeImage(T_icon_path, _icon_path);
                await new Promise(r => fs.unlink(T_icon_path, r));
            }

            const nexdata: UserProfile = {
                nickname: profdata["nickname"],
                icon_path: _icon_path?.slice(1),
            };

            await this.setData("profile", JSON.stringify(nexdata));
            await UserActivity.updateRankingProfile.apply(UserActivity, [nexdata, mydata.discriminator]);

            response.status(200).send(nexdata);
        } catch(e){
            AppAPI.writeLog(`[error] [user] Profile update failed: ${e}`);
            response.status(500).end();
        }
    }


    async saveFameVote(famevotes: string[]){
        await this.setData("fame_votes", JSON.stringify(famevotes));
        await Orgument.setFame();
    }


    async saveEventVote(eveotes: string[], eventtype: "band" | "dance" | "misc"){
        //@ts-ignore
        await this.setData(eventtype+"_votes", JSON.stringify(eveotes));
    }

    
    async addPt(amount: number){
        const cpt = Number(await this.getData("pt")) + amount;

        await this.setData("pt", cpt.toString());
        UserActivity.updateMissionRanking.apply(UserActivity, [await this.getData(null)]);
        return cpt;
    }


    static async giveQRCode(request: Request, response: Response){
        const _self = await User.requestLogin(request);
        response.status(200).send(await _self.getQRCode());
    }


    static async callSaveProfile(request: Request, response: Response){
        const _self = await User.requestLogin(request);
        await _self.saveProfile(request, response);
    }


    static async setFameVote(request: Request, response: Response){
        const _self = await User.requestLogin(request);
        await _self.saveFameVote(AppAPI.parseJSON(request.body["votes"]));
        response.status(200).send({condition: "You are good."});
    }


    static async setEventvote(request: Request, response: Response){
        const _self = await User.requestLogin(request);
        await _self.saveEventVote(AppAPI.parseJSON(request.body["evotes"]), request.body["et"]);
        response.status(200).send({condition: "You are amazing."});
    }


    static async setFavorite(request: Request, response: Response){
        const _self = await User.requestLogin(request);
        await _self.setData("favorited_orgs", request.body["favorites"]);
        response.status(200).send({condition: "You are marvelous."});
    }


    static async giveOrgSituation(request: Request, response: Response){
        const oname = request.body.o;
        response.status(200).send({
            pt: Orgument.visit_pt_table[oname],
            crowd: ALL_MAP_OBJECTS_NO_ART[oname].article.crowd_status
        });
    }


    static async setCustoms(request: Request, response: Response){
        const adcustoms = JSON.parse(request.body.customs);
        const user = await User.requestLogin(request);
        const pcustoms = JSON.parse(await user.getData("custom_data"));
        
        if (adcustoms.headcount && adcustoms.headcount > 5) adcustoms.headcount = 5;

        for (const [key, value] of Object.entries(adcustoms)){
            pcustoms[key] = value;
        }

        await user.setData("custom_data", JSON.stringify(pcustoms));
        response.status(200).send({ message: "I'm sweet" });
    }
}


/**
 * @throws {Error}
 * @param fp 
 */
async function resizeImage(fp: string, ofp: string){
    const image = sharp(fp);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error("Failed to get meta data.");
    }

    var newWidth: number;
    var newHeight: number;

    if (metadata.width > metadata.height){
        if (metadata.width > 256){
            newWidth = 256;
            newHeight = Math.round((metadata.height / metadata.width) * 256);
        } else {
            newWidth = metadata.width;
            newHeight = metadata.height;
        }
    } else {
        if (metadata.height > 256){
            newHeight = 256;
            newWidth = Math.round((metadata.width / metadata.height) * 256);
        } else {
            newWidth = metadata.width;
            newHeight = metadata.height;
        }
    }

    const im = await image
        .resize(newWidth, newHeight)
        .toFile(ofp);
}


export { }
