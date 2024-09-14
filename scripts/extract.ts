import { Cloud } from "../src/server/handler/org/cloud";
import { orgDB, random } from "../src/server/handler/org/doubt";
import { UserLoginRecord, UserSessionRecord } from "../src/server/handler/user/dts/user";
import { OrgAuthDataRecord } from "../src/server/handler/org/dts/org";
import { DEFAULT_MAP_OBJECT } from "../src/server/mapobjs";
import * as AppAPI from "../src/server/utils";
import * as QRcode from "qrcode";
import { userDB, stampDB } from "../src/server/handler/user/doubt";
import { orgeees } from "./extract_";
import { miscAuthDB } from "../src/server/handler/misc/auth";

import fs from "fs";
import path from 'path';


interface Org_Editor_Record{
    title: string;
    disc: string;
    pwd: string;
}
const domain = "open-campus.shishiji.com";
const cloud = new Cloud();


function createUserDB(){
    userDB.serialize(() => {
        userDB.run(`CREATE TABLE IF NOT EXISTS Login_Users (
            idx INTEGER,
            discriminator TEXT,
            confidence TEXT,
            completed_orgs TEXT,
            profile TEXT,
            fame_votes TEXT,
            band_votes TEXT,
            dance_votes TEXT,
            misc_votes TEXT,
            favorited_orgs TEXT,
            isstudent BOOLEAN,
            pt INTEGER,
            claimed_rpt TEXT,
            tickets TEXT,
            custom_data TEXT,
            PRIMARY KEY (idx)
        );
        `);
        userDB.run(`CREATE TABLE IF NOT EXISTS Login_Sessions (
            idx INTEGER,
            discriminator TEXT,
            session TEXT NOT NULL,
            PRIMARY KEY (idx)
        );
        `);
    });
}


function createOrgDB(){
    orgDB.serialize(() => {
        orgDB.run(`CREATE TABLE IF NOT EXISTS Auth_Data (
            idx INTEGER,
            org_name TEXT,
            pass_word TEXT,
            cloud_size INTEGER,
            confidence TEXT,
            PRIMARY KEY (idx)
        );`);
        orgDB.run(`CREATE TABLE IF NOT EXISTS Auth_Sessions (
            idx INTEGER,
            sessionid TEXT,
            corresponder TEXT,
            PRIMARY KEY (idx)
        );`);
        orgDB.run(`CREATE TABLE IF NOT EXISTS Org_Data (
            idx INTEGER,
            org_name TEXT,
            entered INTEGER,
            duped_entered INTEGER,
            fame INTEGER,
            visitpt INTEGER,
            PRIMARY KEY (idx)
        );`);
    });
}


async function insertOrg(name: string, pw: string, size: number, conf: string){
    return new Promise((resolve, reject) => {
        orgDB.run(
            `INSERT INTO Auth_Data (org_name, pass_word, cloud_size, confidence) 
            VALUES (?, ?, ?, ?)`, [ name, pw, size, conf ], resolve);
        orgDB.run(
            `INSERT INTO Org_Data (org_name, entered_data, entered_groups, entered_total, duped_entered_data, duped_entered_groups, duped_entered_total, fame) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [ name, "{}", 0, 0, "{}", 0, 0, 0 ], resolve);
    });
}


async function getLastUseridx(): Promise<number>{
    createUserDB();
    return new Promise((resolve, reject) => {
        userDB.all("SELECT MAX(idx) FROM Login_Users", function(e,r: {[key:string]:number}[]){
            resolve(r[0]["MAX(idx)"]);
        });
    });
}


function convertToCSV(columns: Org_Editor_Record[]): string {
    const headers = "title,disc,pwd\n";
    const rows = columns.map(column => `${column.title},${column.disc},${column.pwd}`).join("\n");
    return headers + rows;
}


var useridx = 0;


function adveEditor(){
    orgDB.all("SELECT * FROM Auth_Data", function(err: Error | null, rows: OrgAuthDataRecord[]){
        const orgv: Org_Editor_Record[] = [];
        for (const row of rows){
            orgv.push({
                title: findtitle(row.org_name),
                disc: row.org_name,
                pwd: row.pass_word,
            });
        }
        const csvData = convertToCSV(orgv);
        fs.writeFileSync("./.data/org/org_pwd.csv", csvData);
    });
}


function saveFile(blob: Blob, fp: string){
    blob.arrayBuffer().then((buffer) => {
    fs.writeFile(fp, Buffer.from(buffer), (err) => {
        
        });
    });
}


async function userLoginQRcode(): Promise<void>{
    return new Promise((resolve, reject) => {
        userDB.all("SELECT * FROM Login_Users", [],
        async function(err: Error | null, rows: UserLoginRecord[]){
            for (const row of rows){
                const username = row.discriminator;
                const url = `https://${domain}/qr_login?glog=${username}&kry=${row.confidence}`;
    
                await QRcode.toDataURL(url, {width: 256}, (err, QRDataURL) => {
                    fetch(QRDataURL)
                    .then(response => response.blob())
                    .then(blob => {
                        saveFile(blob, `./.data/user/login/${username}.png`);
                    });
                });
            }
            resolve();
        });  
    });
}

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer>{
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            //@ts-ignore
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(new Error("Failed to read the blob as ArrayBuffer"));
        };
        reader.readAsArrayBuffer(blob);
    });
}

async function createUserLogin(col: { [key: string]: string, discriminator: string, confidence: string }): Promise<void>{
    const username = col.discriminator;
    const url = `https://${domain}/qr_login?glog=${username}&kry=${col.confidence}`;

    return new Promise((resolve, reject) => {
        QRcode.toDataURL(url, {width: 256}, (err, QRDataURL) => {
            fetch(QRDataURL)
            .then(response => response.blob())
            .then(async blob => {
                saveFile(blob, `./.data/user/login/originals/${username}.png`);
                resolve();
            });
        });
    });
}

function orgCompletionQRcode(){
    orgDB.all("SELECT * FROM Auth_Data", [],
    function(err: Error | null, rows: OrgAuthDataRecord[]){
        for (const row of rows){
            const orgname = row.org_name;
            const url = `https://${domain}/org/completion?oname=${orgname}&cid=${row.confidence}`;

            QRcode.toDataURL(url, {width: 256}, (err, QRDataURL) => {
                fetch(QRDataURL)
                .then(response => response.blob())
                .then(blob => {
                    saveFile(blob, `./.data/org/completion/${orgname}.png`);
                });
            });
        }
    });
}

function initUserData(){
    userDB.run("UPDATE Login_Users SET explored_org=? ",["[]"]);
    userDB.run("DELETE FROM Login_Sessions")
}

async function createUser(): Promise<void>{
    if (useridx == 0){
        useridx = await getLastUseridx() + 1;
    }
    const uid = useridx;
    const confidence = random.string(64);
    const user_id = `BAKA${uid.toString().padStart(4, '0')}`;

    useridx++;
    
    return new Promise((resolve, reject) => {
        userDB.run(`INSERT INTO Login_Users (confidence, discriminator, explored_org) VALUES (?, ?, ?)`, [ confidence, user_id, "[]" ],
        async function(e){
            await createUserLogin({ discriminator: user_id, confidence: confidence });
            resolve();
        });
    });
}

async function serializeOrg(oname: string, title: string, venue: string){
    try{
        Cloud._createOrgDir(oname);
    } catch(e){}

    const objdata = AppAPI.getOrgMdata(oname) || DEFAULT_MAP_OBJECT;

    objdata.discriminator = oname;
    objdata.article.title = title;
    objdata.article.venue = venue;

    AppAPI.saveOrgMdata(oname, objdata);
}


function findtitle(oname: string){
    for (const l of orgeees){
        if (l[1] == oname)
            return l[0];
    }
    return "";
}


async function mainw(){
    createOrgDB();
    for (const value of orgeees){
        await insertOrg(value[1], value[2], value[3], value[4]);
    }
}


function createStampDB(){
    stampDB.run(`CREATE TABLE IF NOT EXISTS Location (
            idx INTEGER,
            stampid TEXT,
            _where TEXT,
            PRIMARY KEY (idx)
        );`);
}


function reminin(){
    for (const org of orgeees){
        const md = AppAPI.getOrgMdata(org[1]);
        if (!md){console.log(org[1]);continue;}
        md.article.crowd_status = 0;
        AppAPI.saveOrgMdata(org[1], md);
    }
}


function createMiscAuthDB(){
    miscAuthDB.run(`CREATE TABLE IF NOT EXISTS Sessions (
        idx INTEGER,
        actype TEXT,
        sessionid TEXT,
        PRIMARY KEY (idx)
    )`)
}


createMiscAuthDB();
