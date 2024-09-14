import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { OrgAuthDataRecord } from "./dts/org";
import { OrgAuth } from "./auth";
import { responseError, orgDB } from "./doubt";

import fs from "fs";
import * as AppAPI from "../../utils";
import * as path from "path";


export class Cloud{
    async list(req: Request, res: Response): Promise<void>{
        const data = req.body;
        const session = data.session;
        const orgname = await OrgAuth._auth(session);

        if (!orgname){
            responseError(res, 403);
            return;
        }
        
        const dirname = Cloud._toOrgDirname(orgname);

        if (!fs.existsSync(dirname)){
            Cloud._createOrgDir(orgname);
        }

        Cloud._sendOrgdirInfo(orgname, res);
    }


    async overflow(req: Request, res: Response): Promise<void>{
        const data = req.body;
	    const session = data.session;
        const orgname = await OrgAuth._auth(session);
        const incsize = Number(data.size);

        if (!orgname || incsize == null || isNaN(incsize)){
            responseError(res, 400);
            return;
        }

        const dirpath = Cloud._toOrgDirname(orgname);
        const incd = AppAPI.convertUnit((Cloud._getDirsize(dirpath, false) + incsize), "MB");
        const maxClousSize = await Cloud.getOrgMaCloudSize(orgname);
        const responsedata = { acceptable: true, overflow: incd - maxClousSize };

        if (responsedata.overflow > 0){
            responsedata.acceptable = false;
        }

        res.status(200).json(responsedata);
    }


    async upload(req: Request, res: Response): Promise<void>{
        const files = req.files;
	    const session = req.body.session;
        const orgname = await OrgAuth._auth(session);
        
        if (!orgname || !files || Object.keys(files).length != 1){
            responseError(res, 400);
            return;
        }

        const file: UploadedFile = files.file as UploadedFile;
        const dirpath = Cloud._toOrgDirname(orgname);
        const mediatype = AppAPI.getMediaType(file.name);
        const ext = path.extname(file.name);

        if (mediatype == "unknown"){
            responseError(res, 403);
            return;
        }

        if (!fs.existsSync(dirpath))
            Cloud._createOrgDir(orgname);

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

        const currentdirsize = Cloud._getDirsize(dirpath, false);
        const aftersize = AppAPI.convertUnit(currentdirsize + file.size, "MB");
        const maxsize = await Cloud.getOrgMaCloudSize(orgname);

        if (aftersize > maxsize){
            res.status(413).json({ status: 413, error: "Your cloud is overflowing!", overflow: (aftersize - maxsize) });
            return;
        }

        file.mv(dirpath + "/" + filename, err => {
            if (err){
                return res.status(500).send({ error: err });
            }

            Cloud._sendOrgdirInfo(orgname, res, { uploaded: filename });
        });
    }


    async delete(req: Request, res: Response): Promise<void>{
        const data = req.body;
        const files = AppAPI.parseJSON(data.files) || [];
	    const session = data.session;
        const orgname = await OrgAuth._auth(session);
        
        if (files.length == 0 || !orgname){
            responseError(res, 403);
            return;
        }

        const dirpath = Cloud._toOrgDirname(orgname);
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
            Cloud._sendOrgdirInfo(orgname, res, { deleted: files });
        })
        .catch(() => {});
    }


    /**
     * not handling null orgname
     * @param orgname 
     */
    static async _sendOrgdirInfo(orgname: string, res: Response, adjust?: {[key: string]: any}): Promise<void>{
        const dirname = Cloud._toOrgDirname(orgname);
        const sizemap = Cloud._getDirsize(dirname, true);
        var filelist = Cloud._filelist(orgname);
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
            mxcs: await Cloud.getOrgMaCloudSize(orgname),
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
    static getOrgMaCloudSize(orgname: string): Promise<number>{
        return new Promise(function(resolve, reject){
            orgDB.all(`SELECT * FROM Auth_Data WHERE org_name=?`, [ orgname ], (err, rows: OrgAuthDataRecord[]) => {
                if (rows && rows[0]){
                    resolve(rows[0].cloud_size);
                } else {
                    resolve(0);
                }
            });
        });
    }
}


export { }
