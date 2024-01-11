import fs from "fs";
import * as path from "path";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { DEFAULT_MAP_OBJECT } from "../mapobjs";
import * as AppAPI from "../utils";
import { mapObject, mapObjComponent } from "../server-dts/server";
import * as file from "../file";


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
    
        const datapath = "./.data/org/authkey.json";
        const sessionpath = "./.data/org/authsession.json";
        const org_authkeymap: {[key: string]: {password: string, maxcloudsize: number}} = AppAPI.readJSONSync(datapath);
        const correct_data = org_authkeymap[username];
        
        if (!correct_data){
            res.status(404).json({ error: "User name not found" });
            return;
        } else if (correct_data.password != password){
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
    
        const newkey = random.string(48);
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


    static logout(req: Request, res: Response){
        const data = req.body;
        const session = data.session;

        OrgAuth._endSession(session);
        res.status(202).end();
    }


    static editor(req: Request, res: Response): void{
        const sessionkey = req.body.session;
        const orgname = OrgAuth._auth(sessionkey);
        
        if (!orgname){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        console.log(new Date() + ": Editor: "+orgname);

        const mapdata = AppAPI.getOrgMdata(orgname) || DEFAULT_MAP_OBJECT;

        if (!fs.existsSync(File._toOrgDirname(orgname)))
            File._createOrgDir(orgname);

        res.status(200).json({ artdata: mapdata, usn: orgname, mxcs: File.getOrgMaCloudSize(orgname) });
    }


    /**
     * get orgname linked session
     * @param session 
     * @returns orgname or null if not found
     */
    static _auth(session: string): string | null{
        if (!session) return null;
        const sessionpath = "./.data/org/authsession.json";
        const sessions = AppAPI.readJSONSync(sessionpath);
        const orgname = sessions[session];

        return orgname;
    }


    static _endSession(session: string): void{
        const sessionpath = "./.data/org/authsession.json";
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

        const prevObjdata = AppAPI.getOrgMdata(username) || DEFAULT_MAP_OBJECT;

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

        const prevObjdata = AppAPI.getOrgMdata(username) || DEFAULT_MAP_OBJECT;

        prevObjdata.discriminator = username;
        prevObjdata.article.font_family = newMapdata.article.font_family;
        prevObjdata.article.core_grade = newMapdata.article.core_grade;
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
        const responsedata = { acceptable: true, overflow: incd - File.getOrgMaCloudSize(orgname) };

        if (responsedata.overflow > 0){
            responsedata.acceptable = false;
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
        const mediatype = AppAPI.getMediaType(file.name);
        const ext = path.extname(file.name);

        if (mediatype == "unknown"){
            const eres = forbiddenJSON;
            eres.error = "Denied file type";
            res.status(forbiddenJSON.status).json(eres);
            return;
        }

        if (!fs.existsSync(dirpath))
            File._createOrgDir(orgname);

        const existfiles = fs.readdirSync(dirpath)
        .map(fn => { return fn.replace(/\..*/, ""); });
        // Prevent first upload error
        var filename = mediatype + "_0";
        var broken = false;
        
        for (const i in existfiles){
            filename = mediatype + "_" + i;
            
            if (!existfiles.includes(filename)){
                broken = true;
                break;
            }
        }
        if (!broken){
            filename = mediatype + "_" + existfiles.length;
        }
        filename += ext;

        const currentdirsize = File._getDirsize(dirpath, false);
        const aftersize = AppAPI.convertUnit(currentdirsize + file.size, "MB");
        const maxsize = File.getOrgMaCloudSize(orgname);

        if (aftersize > maxsize){
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
        const files = JSON.parse(data.files) || [];
	    const session = data.session;
        const orgname = OrgAuth._auth(session);
        
        if (files.length == 0 || !orgname){
            res.status(forbiddenJSON.status).json(forbiddenJSON);
            return;
        }

        const dirpath = File._toOrgDirname(orgname);
        var deletecount = 0;
        
        new Promise((resolve, reject) => {
            for (const fn of files){
                fs.unlink(dirpath+"/"+fn, err => {
                    if (err){
                        res.status(500).send({ error: err });
                        reject();
                        return;
                    }
                    deletecount++;
                    if (deletecount == files.length)
                        resolve(void 0);
                });
            }
        })
        .then(() => {
            File._sendOrgdirInfo(orgname, res, { deleted: files });
        })
        .catch(() => {});
    }


    /**
     * not handling null orgname
     * @param orgname 
     */
    static _sendOrgdirInfo(orgname: string, res: Response, adjust?: {[key: string]: any}): void{
        const dirname = File._toOrgDirname(orgname);
        const sizemap = File._getDirsize(dirname, true);
        var filelist = File._filelist(orgname);
        var totalsize = 0;

        if (adjust?.deleted){
            filelist = filelist.filter(o=> { 
                if (path.basename(o) !== adjust.deleted)
                    return true;
            });
        }
        
        
        Object.keys(sizemap).forEach(f => {
            const converted = AppAPI.convertUnit(sizemap[f], "MB");

            totalsize += converted;
            sizemap[path.basename(f)] = converted;

            delete sizemap[f];
        });
        
        const defaultres: {[key: string]: any} = {
            files: filelist,
            totalsize: totalsize,
            sizemap: sizemap,
            mxcs: File.getOrgMaCloudSize(orgname),
        };

        if (adjust){
            for (const key of Object.keys(adjust)){
                defaultres[key] = adjust[key];
            }
        }
        
        res.send(defaultres);
    }


    static _filelist(orgname: string): string[]{
        // folder: never
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
            try{
                const stats = fs.statSync(filePath);
            
                if (each){
                    eachtotal[filePath] = stats.size;
                } else{
                    total += stats.size;
                }
            } catch(e){}
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
        const datapath = "./.data/org/authkey.json";
        const org_authkeymap: {[key: string]: {password: string, maxcloudsize: number}} = AppAPI.readJSONSync(datapath);

        return org_authkeymap[orgname].maxcloudsize;
    }
}

export {
    OrgAuth,
    Edit,
    File,
}
