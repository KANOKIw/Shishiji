import { Database } from "../user/doubt";
import { Request, Response } from "express";
import { Actype, MiscSessionRecord } from "./dts/misc";
import { Random } from "../../utils";


export const miscAuthDB = new Database.Database("./.db/sessions.db");
const random = new Random();

export class MiscAuth{
    static auth(request: Request, actype: keyof Actype): Promise<string | null>{
        return new Promise(resolve => {
            miscAuthDB.all("SELECT * FROM Sessions WHERE sessionid=?", [ request.cookies[`__msid-${actype}`] ], function(err: Error | null, rows: MiscSessionRecord[]){
                if (rows && rows.length > 0){
                    const rec = rows[0];
    
                    if (rec.actype == actype){
                        resolve("good");
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        });
    }


    static setSession(response: Response, actype: keyof Actype){
        return new Promise(resolve => {
            const newkey = random.string(64);
            const done = () => resolve(newkey);

            miscAuthDB.run(`INSERT INTO Sessions (sessionid, actype) VALUES (?, ?)`, [
                newkey,
                actype
            ], done);
        });
    }


    static getAuthed(fp: string, actype: keyof Actype){
        return async function(request: Request, response: Response){
            const au = await MiscAuth.auth(request, actype);
            if (au) response.sendFile(fp);
            else response.redirect("/admin/login");
        }
    }
}


export { }
