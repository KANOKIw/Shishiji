import { Request, Response } from "express";
import { MiscAuth } from "./auth";
import { restoreMapObjects } from "../../mapobjs";
import { UserActivity } from "../user/activity";
import { Orgument } from "../org/orgument";
import { writeLog } from "../../utils";
import { userDB } from "../user/doubt";


export class Updater{
    static res(response: Response, which: "success" | "forbidden"){
        switch(which){
            case "success":
                response.status(200).send({ message: "success" });
                break;
            case "forbidden":
                response.status(403).send({ message: "forbidden" });
                break;
        }
    }


    static async mapObjects(request: Request, response: Response){
        if (await MiscAuth.auth(request, "update")){
            restoreMapObjects();
            Updater.res(response, "success");
            writeLog("[main/info] [updater] MAP_OBJECTS updated.");
        } else {
            Updater.res(response, "forbidden");
        }
    }

    
    static async ranking(request: Request, response: Response){
        if (await MiscAuth.auth(request, "update")){
            await UserActivity.againMissionRanking();
            Updater.res(response, "success");
            writeLog("[main/info] [updater] Ranking updated.");
        } else {
            Updater.res(response, "forbidden");
        }
    }

    
    static async visitPT(request: Request, response: Response){
        if (await MiscAuth.auth(request, "update")){
            await Orgument.setOrgPtTable();
            Updater.res(response, "success");
            writeLog("[main/info] [updater] VisitPT updated.");
        } else {
            Updater.res(response, "forbidden");
        }
    }


    static async strictVisitPT(request: Request, response: Response){
        const st = Number(request.body["st"]);

        if (await MiscAuth.auth(request, "update")){
            if (Number.isNaN(st)){
                response.status(400).end();
                return;
            }
            Orgument.visitpt_stricted = st;
            await Orgument.setOrgPtTable();
            Updater.res(response, "success");
            writeLog("[main/info] [updater] VisitPT updated.");
        } else {
            Updater.res(response, "forbidden");
        }
    }


    static async runUserDBSQL(request: Request, response: Response){
        const sql = request.body["sql"];

        if (await MiscAuth.auth(request, "update")){
            userDB.run(sql, function(err){
                if (err) response.status(500).send(err);
                else Updater.res(response, "success");
                writeLog("[main/info] [updater] SQL runned on accounts.db: `"+sql+"`");
            });
        } else {
            Updater.res(response, "forbidden");
        }
    }
}


export { }
