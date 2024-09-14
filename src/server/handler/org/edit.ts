import { Request, Response } from "express";
import { OrgAuth } from "./auth";
import { ALL_MAP_OBJECTS_ARTICLE, ALL_MAP_OBJECTS_NO_ART, DEFAULT_MAP_OBJECT } from "../../mapobjs";
import * as AppAPI from "../../utils";
import { MapObject } from "../../server-dts/server";
import { responseError } from "./doubt";
import { Orgument } from "./orgument";
import { websocketio } from "../../drought";


export class Edit extends OrgAuth{
    async savemain(req: Request, res: Response): Promise<void>{
        const data = req.body;
        const session = data.session;
        const username = await OrgAuth._auth(session);
        const newMapdata: MapObject = AppAPI.parseJSON(data.nmap);
        
        if (!username || !newMapdata){
            responseError(res, 403);
            return;
        }

        const prevObjdata = AppAPI.getOrgMdata(username) || DEFAULT_MAP_OBJECT;

        prevObjdata.discriminator = username;
        prevObjdata.article.content = newMapdata.article.content;

        ALL_MAP_OBJECTS_ARTICLE[username] = prevObjdata.article.content;

        AppAPI.saveOrgMdata(username, prevObjdata);

        res.status(202).end();

        if (username == "jetcoaster"){
            websocketio.to("__jetcoaster_receiver")
            .emit("data.article", { article: prevObjdata.article.content });
        }
    }


    async saveothers(req: Request, res: Response): Promise<void>{
        const data = req.body;
        const session = data.session;
        const username = await OrgAuth._auth(session);
        const newMapdata: MapObject = AppAPI.parseJSON(data.nmap);
        
        if (!username || !newMapdata){
            responseError(res, 403);
            return;
        }

        const prevObjdata = AppAPI.getOrgMdata(username) || DEFAULT_MAP_OBJECT;

        prevObjdata.discriminator = username;
        prevObjdata.article.font_family = newMapdata.article.font_family;
        prevObjdata.article.core_grade = newMapdata.article.core_grade;
        prevObjdata.article.images = newMapdata.article.images;
        prevObjdata.object.images = newMapdata.object.images;
        prevObjdata.article.theme_color = newMapdata.article.theme_color;

        ALL_MAP_OBJECTS_NO_ART[username].article.font_family = newMapdata.article.font_family;
        ALL_MAP_OBJECTS_NO_ART[username].article.core_grade = newMapdata.article.core_grade;
        ALL_MAP_OBJECTS_NO_ART[username].article.images = newMapdata.article.images;
        ALL_MAP_OBJECTS_NO_ART[username].object.images = newMapdata.object.images;
        ALL_MAP_OBJECTS_NO_ART[username].article.theme_color = newMapdata.article.theme_color;

        AppAPI.saveOrgMdata(username, prevObjdata);

        res.status(202).end();
    }

    
    async setCrowd(req: Request, res: Response){
        const oname = await OrgAuth._auth(req.cookies["__ogauthk"]);
        const nstat = Number(req.body.prog);

        if (!oname || ![1, 2, 3].includes(nstat)){
            res.status(400).end();
            return;
        }

        const odata = AppAPI.getOrgMdata(oname);

        if (!odata){
            res.status(500).end();
            return;
        }

        odata.article.crowd_status = nstat;
        ALL_MAP_OBJECTS_NO_ART[oname].article.crowd_status = nstat;
        Orgument.crowd_status[oname] = nstat;

        AppAPI.saveOrgMdata(oname, odata);

        res.status(200).send({ i: "ok" });
    }
}


export { }
