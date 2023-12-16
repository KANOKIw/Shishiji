import fs from "fs";
import { DEFAULTOBJECT } from "../mapObjs";
import { Request, Response } from "express";
import * as AppAPI from "../utils";
import * as path from "path";
import { mapObject, mapObjComponent } from "../server-dts/server";
import { UploadedFile } from "express-fileupload";


const random = new AppAPI.Random();
const badrequestJSON = { status: 400, error: "Bad Request" };
const forbiddenJSON = { status: 403, error: "Permission Denied" };


class OrgAuth{
    static login(req: Request, res: Response): void{
        const data = req.body;
        const username = data.username;
        const password = data.password;
    
        if (!username || !password){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }
    
        const datapath = "./.data/organization/authkey.json";
        const sessionpath = "./.data/organization/authsession.json";
        const org_authkeymap: {[key: string]: {password: string, maxcloudsize: number}} = AppAPI.readJSONSync(datapath);
        const correct_data = org_authkeymap[username];
        
        if (!correct_data){
            res.status(404).json({ error: "User name not found" });
            return;
        } else if (correct_data.password != password){
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
    
        const newkey = random.string(24);
        const sessions = AppAPI.readJSONSync(sessionpath);

        sessions[newkey] = username;
    
        AppAPI.dumpJSONSync(sessionpath, sessions, );
    
        res.cookie("__ogauthk", newkey, { path: "/org/manage" });
    
        res.status(200).json({ status: "success" });
    }


    static _login(req: Request, res: Response): void{
        const data = req.body;
        const session = data.session;
        const orgname = OrgAuth._auth(session);

        if (!orgname){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        res.status(200).json({ permitted: true });
    }


    static editor(req: Request, res: Response): void{
        const sessionkey = req.body.session;
        const orgname = OrgAuth._auth(sessionkey);
        
        if (!orgname){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        const mapdata = AppAPI.getOrgMdata(orgname) || {};

        res.status(200).json({ artdata: mapdata, usn: orgname, mxcs: File.getOrgMaCloudSize(orgname) });
    }


    /**
     * get orgname linked session
     * @param session 
     * @returns orgname or null if not found
     */
    static _auth(session: string): string | null{
        if (!session) return null;
        const sessionpath = "./.data/organization/authsession.json";
        const sessions = AppAPI.readJSONSync(sessionpath);
        const orgname = sessions[session];

        return orgname;
    }


    static _endSession(session: string): void{
        const sessionpath = "./.data/organization/authsession.json";
        const sessions = AppAPI.readJSONSync(sessionpath);

        delete sessions[session];
        
        AppAPI.dumpJSONSync(sessionpath, sessions);
    }
}


class Edit{
    static savemain(req: Request, res: Response): void{
        const data = req.body;
        const session = data.session;
        const username = OrgAuth._auth(session);
        const newMapdata: mapObject = JSON.parse(data.nmap);
        
        if (!username || !newMapdata){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        const prevObjdata = AppAPI.getOrgMdata(username) || DEFAULTOBJECT;

        prevObjdata.discriminator = username;
        prevObjdata.article.content = newMapdata.article.content;

        AppAPI.saveOrgMdata(username, prevObjdata);

        res.status(202).end();
    }


    static saveothers(req: Request, res: Response): void{
        const data = req.body;
        const session = data.session;
        const username = OrgAuth._auth(session);
        const newMapdata: mapObject = JSON.parse(data.nmap);
        
        if (!username || !newMapdata){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        const prevObjdata = AppAPI.getOrgMdata(username) || DEFAULTOBJECT;

        prevObjdata.discriminator = username;
        prevObjdata.article.images = newMapdata.article.images;
        prevObjdata.object.images = newMapdata.object.images;
        prevObjdata.article.theme_color = newMapdata.article.theme_color;

        AppAPI.saveOrgMdata(username, prevObjdata);

        res.status(202).end();
    }
}


class File{
    static list(req: Request, res: Response): void{
        const data = req.body;
        const session = data.session;
        const orgname = OrgAuth._auth(session);

        if (!orgname){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }
        
        const dirname = File._toOrgDirname(orgname);

        if (!fs.existsSync(dirname)){
            File._createOrgDir(orgname);
        }

        File._sendOrgdirInfo(orgname, res);
    }


    static overflow(req: Request, res: Response): void{
        const data = req.body;
	    const session = data.session;
        const orgname = OrgAuth._auth(session);
        const incsize = Number(data.size);

        if (!orgname || incsize == null || isNaN(incsize)){
            res.status(badrequestJSON.status).json(badrequestJSON);
            return;
        }

        const dirpath = File._toOrgDirname(orgname);
        const incd = AppAPI.convertUnit((File._getDirsize(dirpath, false) + incsize), "MB");
        const responsedata = { overflow: false, bytesoverflow: incd - File.getOrgMaCloudSize(orgname) };

        if (responsedata.bytesoverflow > 0){
            responsedata.overflow = true;
        }

        res.status(200).json(responsedata);
    }


    static upload(req: Request, res: Response): void{
        const files = req.files;
	    const session = req.body.session;
        const orgname = OrgAuth._auth(session);
        
        if (!orgname || !files || Object.keys(files).length != 1){
            res.status(badrequestJSON.status).json(badrequestJSON);
            return;
        }

        const file: UploadedFile = files.file as UploadedFile;
        const dirpath = File._toOrgDirname(orgname);

        if (AppAPI.getMediaType(file.name) == "unknown"){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        if (!fs.existsSync(dirpath))
            File._createOrgDir(orgname);

        const mediatype = AppAPI.getMediaType(file.name);
        var _findex = 1;

        for (const file of fs.readdirSync(dirpath)){
            const mtype = AppAPI.getMediaType(file);
            if (mtype == mediatype)
                _findex++;
        }

        const filename = mediatype + "_" + _findex + path.extname(file.name);

        const currentdirsize = File._getDirsize(dirpath, false);
        const aftersize = currentdirsize + file.size;
        const maxsize = File.getOrgMaCloudSize(orgname);

        if (AppAPI.convertUnit(aftersize, "MB") > maxsize){
            res.status(413).json({ status: 413, error: "Your cloud is overflowing!", overflow: (aftersize - maxsize) });
            return;
        }

        file.mv(dirpath + "/" + filename, err => {
            if (err){
                return res.status(500).send({ error: err });
            }

            File._sendOrgdirInfo(orgname, res, { uploaded: filename });
        });
    }


    static delete(req: Request, res: Response): void{
        const data = req.body;
        const filename = data.filename;
	    const session = data.session;
        const orgname = OrgAuth._auth(session);
        
        if (!filename || !orgname){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        const dirpath = File._toOrgDirname(orgname);
        fs.unlink(dirpath + "/" + filename, err => {
            if (err){
                res.status(500).send({ error: err });
                return;
            }

            File._sendOrgdirInfo(orgname, res, { deleted: filename });
        });
    }


    /**
     * not handling null orgname
     * @param orgname 
     */
    static _sendOrgdirInfo(orgname: string, res: Response, adjust?: {[key: string]: any}): void{
        const dirname = File._toOrgDirname(orgname);
        const filelist = File._filelist(orgname);
        const sizemap = File._getDirsize(dirname, true);
        var totalsize = 0;
        
        Object.keys(sizemap).forEach(f => {
            const converted = AppAPI.convertUnit(sizemap[f], "MB");

            totalsize += converted;
            sizemap[path.basename(f)] = converted;

            delete sizemap[f];
        });
        
        const defaultres: {[key: string]: any} = { files: filelist, totalsize: totalsize, sizemap: sizemap };

        if (adjust){
            for (const key of Object.keys(adjust)){
                defaultres[key] = adjust[key];
            }
        }
        
        res.send(defaultres);
    }


    static _filelist(orgname: string): string[]{
        return fs.readdirSync(this._toOrgDirname(orgname));
    }


    static _createOrgDir(orgname: string): void{
        fs.mkdirSync(this._toOrgDirname(orgname));
    }

    
    static _toOrgDirname(orgname: string): string{
        return "./resources/cloud/org/"+orgname;
    }


    static _getDirsize(dirpath: string, each: true): {[key: string]: number};
    static _getDirsize(dirpath: string, each: false | null): number;
    static _getDirsize(dirpath: string, each: true | false | null){
        var total = 0;
        var eachtotal: {[key: string]: number} = {};
    
        const files = fs.readdirSync(dirpath);
    
        files.forEach(file => {
            const filePath = path.join(dirpath, file);
            const stats = fs.statSync(filePath);
            
            if (each){
                eachtotal[filePath] = stats.size;
            } else{
                total += stats.size;
            }
        });
    
        if (each)
            return eachtotal;
        else
            return total;
    }

    /**
     * not handling null orgname
     * @param orgname 
     */
    static getOrgMaCloudSize(orgname: string): number{
        const datapath = "./.data/organization/authkey.json";
        const org_authkeymap: {[key: string]: {password: string, maxcloudsize: number}} = AppAPI.readJSONSync(datapath);

        return org_authkeymap[orgname].maxcloudsize;
    }
}

export {
    OrgAuth,
    Edit,
    File,
}
