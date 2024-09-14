import { Request, Response } from "express";
import { userDB } from "./doubt";

import { UserCustomData, UserLoginRecord, UserSessionRecord } from "./dts/user";
import { random } from "./doubt";
import { User } from "./user";
import { countAccess } from "../../drought";


function rejectReq(res: Response, status: number, msg: string): void{
    res.status(status).json({status: status, message: msg});
}


export class UserAuth{
    static clmrpt = JSON.stringify({
        "1F": -1,
        "2F": -1,
        "3F": -1,
        "4F": -1,
        specials: []
    });


    static async warrant(discriminator: string, preconfidence: string): Promise<string>{
        return new Promise((resolve, reject) => {
            userDB.all(`SELECT * FROM Login_Users WHERE discriminator=?`,
            [ discriminator ], function(err, rows: UserLoginRecord[]){
                if (err){
                    reject("unknown");
                    return;
                }

                const user_data = rows[0];
    
                if (!user_data){
                    reject("no user found");
                } else if (user_data.confidence != preconfidence){
                    reject("incorrect confidence");
                } else {
                    const session_id = random.string(64);
                    resolve(session_id);
                }
            });
        });
    }


    static async insertSession(discriminator: string, session_id: string): Promise<void>{
        return new Promise((resolve, reject) => {
            userDB.run(`INSERT INTO Login_Sessions (discriminator, session) VALUES (?, ?)`,
                [ discriminator, session_id ], resolve
            );
        });
    }


    static async fineData(session_id: string): Promise<UserLoginRecord>{
        return new Promise((resolve, reject) => {
            userDB.all(`SELECT * FROM Login_Sessions WHERE session=?`, [ session_id ],
                async function(err, rows: UserSessionRecord[]){
                    if (err){
                        reject("unknown");
                        return;
                    }

                    const row = rows[0];

                    if (!row){
                        reject("no user found");
                    } else {
                        const user = new User(row.discriminator);
                        
                        resolve(await user.getData(null));
                    }
                }
            )
        });
    }


    static async newUser(isstudent: boolean): Promise<UserLoginRecord>{
        const confi = random.string(64);

        return new Promise((re, je) => {
            userDB.all("SELECT MAX(idx) FROM Login_Users", function(e, r: {[key:string]:number}[]){
                const maxidx = r[0]["MAX(idx)"] + 1;
                const user_id = "GUEST"+maxidx.toString().padStart(5, "0");
                const custom_data: UserCustomData = {
                    headcount: isstudent ? 1 : 0
                };
                const matrix: UserLoginRecord = {
                    idx: maxidx,
                    discriminator: user_id,
                    confidence: confi,
                    completed_orgs: "[]",
                    profile: JSON.stringify({
                        nickname: user_id,
                    }),
                    fame_votes: "[]",
                    band_votes: "[]",
                    dance_votes: "[]",
                    misc_votes: "[]",
                    favorited_orgs: "[]",
                    pt: 0,
                    claimed_rpt: UserAuth.clmrpt,
                    tickets: "[]",
                    custom_data: JSON.stringify(custom_data),
                    isstudent: isstudent
                };
                userDB.run(`INSERT INTO Login_Users (
                    confidence, discriminator, completed_orgs, profile,
                    fame_votes, band_votes, dance_votes, misc_votes, favorited_orgs, isstudent, pt, claimed_rpt, tickets, custom_data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    matrix.confidence, matrix.discriminator, matrix.completed_orgs, matrix.profile,
                    matrix.fame_votes, matrix.band_votes, matrix.dance_votes, matrix.misc_votes, matrix.favorited_orgs, matrix.isstudent,
                    matrix.pt, matrix.claimed_rpt, matrix.tickets, matrix.custom_data
                ],
                (e) => re(matrix));
            });
        });
    }


    async giveSession(request: Request, response: Response): Promise<void>{
        const reqData = {
            discriminator: typeof request.query.glog === "string" ? request.query.glog : "",
            confidence: typeof request.query.kry === "string" ? request.query.kry : "",
        };
        
        UserAuth.warrant(reqData.discriminator, reqData.confidence)
        .then(async session_id => {
            const date = new Date();

            await UserAuth.insertSession(reqData.discriminator, session_id);

            date.setMonth(date.getMonth() + 1);
            countAccess("login");
            response.cookie("__shjSID", session_id, { path: "/", expires: date }).status(202).redirect("/");
        })
        .catch((msg: string) => {
            rejectReq(response, 403, msg);
            return;
        });
    }


    async giveFine(request: Request, response: Response): Promise<void>{
        const session_id = request.cookies.__shjSID;
        
        await UserAuth.fineData(session_id)
        .then(row => {
            row.confidence = "";
            response.status(200).json(row);
        })
        .catch(err => {
            response.status(404).end();
        });
    }
}


export { }
