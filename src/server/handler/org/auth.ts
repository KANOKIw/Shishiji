import fs from "fs";
import { Request, Response } from "express";
import { DEFAULT_MAP_OBJECT } from "../../mapobjs";
import * as AppAPI from "../../utils";
import { 
    OrgAuthDataRecord,
    OrgAuthSessionRecord,
    OrgDataRecord
    } from "./dts/org";
import { responseError, orgDB, random } from "./doubt";
import { Cloud } from "./cloud";
import * as mapObjAPI from "../../mapobjs";


export class OrgAuth{
    static loginfp: string;


    async login(req: Request, res: Response): Promise<void>{
        const data = req.body;
        const username = data.username;
        const password = data.password;
    
        if (!username || !password){
            responseError(res, 403);
            return;
        }
    
        orgDB.serialize(() => {
            orgDB.all(`SELECT * FROM Auth_Data WHERE org_name=?`,
            [ username ], function(err: Error | null, rows: OrgAuthDataRecord[]){
                if (err){
                    responseError(res, 500);
                    return;
                }
                
                const correct_data = rows[0];

                if (!correct_data){
                    res.status(404).json({ error: "Username not found" });
                    return;
                } else if (correct_data.pass_word != password){
                    res.status(401).json({ error: "Incorrect password" });
                    return;
                }
            
                const newkey = random.string(48);

                orgDB.run(`INSERT INTO Auth_Sessions (sessionid, corresponder) VALUES (?, ?);`, [ newkey, username ], function(err){
                    if (err){
                        responseError(res, 500);
                        return;
                    }
                
                    const date = new Date();

                    date.setMonth(date.getMonth() + 1);
                    res.cookie("__ogauthk", newkey, { path: "/", expires: date });
                    res.cookie("__orgname", username, { path: "/", expires: date });
                    
                    res.status(200).json({ status: "success" });
                });
            });
        });
    }


    async _login(req: Request, res: Response): Promise<void>{
        const data = req.body;
        const session = data.session;
        const orgname = await OrgAuth._auth(session);

        if (!orgname){
            responseError(res, 403);
            return;
        }

        res.status(200).json({ permitted: true });
    }


    async logout(req: Request, res: Response){
        const data = req.body;
        const session = data.session;

        await OrgAuth._endSession(session);
        res.status(202).end();
    }


    async editor(req: Request, res: Response): Promise<void>{
        const sessionkey = req.body.session;
        const orgname = await OrgAuth._auth(sessionkey);
        
        if (!orgname){
            responseError(res, 403);
            return;
        }

        const mapdata = AppAPI.getOrgMdata(orgname) || DEFAULT_MAP_OBJECT;
        const fp = "./resources/cloud/org/"+orgname;

        if (!fs.existsSync(fp))
            fs.mkdirSync(fp);

        res.status(200).json({ artdata: mapdata, usn: orgname, mxcs: await Cloud.getOrgMaCloudSize(orgname) });
        AppAPI.writeLog(`[org/info] [${req.body.type}]: ${orgname} logined`);
    }


    async data(req: Request, res: Response): Promise<void>{
        const orgname = req.body.target || "";

        res.send(mapObjAPI.readObjectFile(orgname));
    }


    async statusdata(req: Request, res: Response): Promise<void>{
        const orgname = await OrgAuth._auth(req.cookies["__ogauthk"]);
        
        orgDB.all("SELECT * FROM Org_Data WHERE org_name=?", [orgname],
            function(err, rows: OrgDataRecord[]){
                if (err || !orgname){
                    res.status(500).end();
                    return;
                }

                const mydata = rows[0];
                const gives = {
                    entered_data: mydata.entered_data,
                    entered_total: mydata.entered_total,
                    entered_groups: mydata.entered_groups,
                    duped_entered_data: mydata.duped_entered_data,
                    duped_entered_total: mydata.duped_entered_total,
                    duped_entered_groups: mydata.duped_entered_groups,
                    visitpt: mydata.visitpt,
                    objdata: mapObjAPI.ALL_MAP_OBJECTS_NO_ART[orgname]
                }

                res.status(200).send(gives);
            }
        )
    }


    /**
     * get orgname linked session
     * @param session 
     * @returns orgname or null if not found
     */
    static async _auth(session?: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            if (!session){ resolve(null); return; }
            
            orgDB.all(`SELECT * FROM Auth_Sessions WHERE sessionid=?`, [ session ], function(err: Error | null, rows: OrgAuthSessionRecord[]) {
                if (err){ resolve(null); return; }
                
                else {
                    if (rows.length > 0){
                        const orgname = rows[0].corresponder;
                        resolve(orgname);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }


    static async _cidAuth(org_name: string, cid: string): Promise<string>{
        return new Promise((resolve, reject) => {
            orgDB.all(`SELECT * FROM Auth_Data WHERE org_name=?`, [ org_name ], function(err: Error | null, rows: OrgAuthDataRecord[]) {
                if (err){ reject("err...?"); return; }
                
                const org_data = rows[0];
    
                if (!org_data){
                    reject("no org found");
                } else if (org_data.confidence != cid){
                    reject("incorrect confidence");
                } else {
                    resolve("matched smorg!!");
                }
            });
        });
    }


    static async _endSession(session: string): Promise<void>{
        return new Promise((r, j) => orgDB.run(`DELETE FROM Auth_Sessions WHERE sessionid=?`, [ session ], r));
    }


    static getAuthed(fp: string){
        return async function(request: Request, response: Response){
            const session = request.cookies["__ogauthk"];
            const orgname = await OrgAuth._auth(session);
            
            if (!orgname){
                response.clearCookie("__ogauthk", { path: "/" });
                response.redirect("/org/manage/login");
            } else {
                response.sendFile(fp);
            }
        }
    }


    static getTicketAuthed(fp: string){
        return async function(request: Request, response: Response){
            const session = request.cookies["__ogauthk"];
            const orgname = await OrgAuth._auth(session);
            
            if (![
                "jetcoaster"
                ].includes(orgname || ""))
            {
                response.clearCookie("__ogauthk", { path: "/" });
                response.redirect("/org/manage/login");
            } else {
                response.sendFile(fp);
            }
        }
    }
}


export { }
