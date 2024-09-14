import fs from "fs";
import express, { NextFunction } from "express";
import https from "https";
import fileUpload from "express-fileupload";
import tls from "tls";
import sqlite3 from "sqlite3";

import * as cookieParser from "cookie-parser";

import { Request, Response } from "express";
import { Socket, Server as SocketIO, ServerOptions } from "socket.io";
import { readJSONSync, writeLog } from "./utils";
import { OrgAuth } from "./handler/org/auth";
import { Edit } from "./handler/org/edit";
import { Cloud } from "./handler/org/cloud";
import { UserAuth } from "./handler/user/auth";
import { UserActivity } from "./handler/user/activity";
import { setAccount } from "./handler/user/setAccount";
import { Orgument } from "./handler/org/orgument";
import { createShishijiAdapter } from "./adapter";


__dirname = __dirname.replace(/[/, \\]src[/, \\]server/, "");


export const HOST_NAME = "shishijifes.com";
const httpsOptions = {
    cert: fs.readFileSync("./.cert/shishiji/fullchain.pem").toString("utf-8"),
    key: fs.readFileSync("./.cert/shishiji/privkey.pem").toString("utf-8"),
    SNICallback: (hostname: string, callback: Function) => {
        if (hostname === "open-campus.shishijifes.com"){
            const key = fs.readFileSync("./.cert/open-campus/privkey.pem");
            const cert = fs.readFileSync("./.cert/open-campus/fullchain.pem");
            callback(null, tls.createSecureContext({ key: key, cert: cert }));
        } else if (hostname === "shishiji.kanokiw.com"){
            const key = fs.readFileSync("./.cert/shishiji/privkey.pem");
            const cert = fs.readFileSync("./.cert/shishiji/fullchain.pem");
            callback(null, tls.createSecureContext({ key: key, cert: cert }));
        } else if (hostname === "test.kanokiw.com"){
            const key = fs.readFileSync("./.cert/test/privkey.pem");
            const cert = fs.readFileSync("./.cert/test/fullchain.pem");
            callback(null, tls.createSecureContext({ key: key, cert: cert }));
        } else if (hostname === "dev.kanokiw.com"){
            const key = fs.readFileSync("./.cert/dev/privkey.pem");
            const cert = fs.readFileSync("./.cert/dev/fullchain.pem");
            callback(null, tls.createSecureContext({ key: key, cert: cert }));
        } else if (hostname === "shishijifes.com"){
            const key = fs.readFileSync("./.cert/shishijifes/privkey.pem");
            const cert = fs.readFileSync("./.cert/shishijifes/fullchain.pem");
            callback(null, tls.createSecureContext({ key: key, cert: cert }));
        } else {
            const key = fs.readFileSync("./.cert/dev/privkey.pem");
            const cert = fs.readFileSync("./.cert/dev/fullchain.pem");
            callback(null, tls.createSecureContext({ key: key, cert: cert }));
        }
    }
};
const socketOptions: Partial<ServerOptions> = {
    cors: {
        origin: function (origin, fn){
            fn(null, origin);
        },
        credentials: true
    }
};
const denied_directories = [
    "/.",
    "/artillerry",
    "/devm",
    "/extensions",
    "/logs",
    "/minecraft",
    "/node_modules",
    "/scripts",
    "/LICENCE",
    "/package",
    "/README.md",
    "/tsconfig.json"
];


export const mapConfData = readJSONSync("./.data/app/map.json");
export const mapPointData = readJSONSync("./.data/app/point.json");
export const advData = readJSONSync("./.data/adv/data.json");
export const app = express();
export const server = https.createServer(httpsOptions, app);
export const websocketio = new SocketIO(server, socketOptions);
export const countDB = new (sqlite3.verbose()).Database("./.db/user/count.db");


OrgAuth.loginfp = __dirname + "/src/manage/org/login.html";
Orgument.setUp();
UserActivity.againMissionRanking.call(UserActivity);


app.all("*", function(request, response, next){
    if (request.hostname != "localhost" && request.hostname != HOST_NAME)
        response.redirect(`https://${HOST_NAME}${request.url}`);
    else next();
});


app.use((req, res, next) => {
    if (req.method === "GET"){
        const path = req.path;
        for (const denied of denied_directories){
            if (path.startsWith(denied)){
                res.status(403).send({ status: 403, message: "Forbidden" });
                return;
            }
        }
    }
    next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser.default());
app.use(express.static("./"));


countDB.exec(`
    CREATE TABLE IF NOT EXISTS Counts (
        name TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
    )
`);


export const orgauth = new OrgAuth();
export const edit = new Edit();
export const cloud = new Cloud();
export const userauth = new UserAuth();
export const useractivity = new UserActivity();


export function resFile(fp: string, countname?: string){
    return async function(req: Request, res: Response){
        res.sendFile(fp);
        countname ? countAccess(countname) : void 0;
    }
}


export function resData(data: any){
    return async function(req: Request, res: Response){
        res.send(data);
    }
}


export function countAccess(name: string, count: number=1){
    if (count == 0) return;
    try {
        countDB.all("SELECT count FROM Counts WHERE name = ?", [name],
            function(err, rows){
                if (!rows || rows.length < 1){
                    countDB.run(`INSERT INTO Counts (name, count) VALUES (?, ${count})`, [name]);
                } else {
                    countDB.run(`UPDATE Counts SET count = count + ${count} WHERE name = ?`, [name]); 
                }
            }
        );
    } catch (e){}
}


export function resMainApp(type: "student" | "general", appfp: string){
    switch (type){
        case "student":
            return async function(req: Request, res: Response){
                try{
                    await setAccount(true, req, res);
                } catch(e){}
                resFile(appfp)(req, res);
            }
        case "general":
            return async function(req: Request, res: Response){
                try{
                    await setAccount(false, req, res);
                } catch(e){}
                resFile(appfp)(req, res);
            }
    }
}


export function substituteErrorHandler(ajfunc: (request: Request, response: Response, next?: NextFunction) => Promise<unknown>){
    return async function(request: Request, response: Response, next: NextFunction){
        try{
            ajfunc.call(void 0, request, response);
        } catch(e: unknown){
            response.status(500).end();
            writeLog(`[error] [handler] ERR_UNHANDLED_REJECTION: ${e instanceof Error ? `${e.name}: ${e.message}` : String(e)}`);
        }
    }
}


process.on("unhandledRejection", (reason, promise) => {
    writeLog(["[error] [listener] ERR_UNHANDLED_REJECTION at:", promise, "reason:", reason].join(" "));
});


export { }
