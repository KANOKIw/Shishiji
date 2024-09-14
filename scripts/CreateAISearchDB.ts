import fs from "fs";
import sqlite3 from "sqlite3";
import path from "path";

import { readJSONSync } from "../src/server/utils";
import { MapObject, MapObjectComponent } from "../src/server/server-dts/server";


interface orgRecord{
    title: string;
    article: string;
    discriminator: string;
    venue: string;
    floor: string;
}
const orgArtDB = new (sqlite3.verbose()).Database("./.db/org/AIsearch.db");


orgArtDB.run(`CREATE TABLE IF NOT EXISTS Org_AISerach (
            idx INTEGER,
            title TEXT,
            article TEXT,
            discriminator TEXT,
            venue TEXT,
            floor TEXT,
            PRIMARY KEY (idx));
`);


function readAllObjectFiles(): MapObjectComponent{
    const data: MapObjectComponent = {};

    function baseCamp(dirpath: string){
        const files = fs.readdirSync(dirpath);
        
        for (const file of files){
            if (file == ".sample.json" || file == "static")
                continue;
            const _path = path.join(dirpath, file);
            const _data: MapObject = readJSONSync(_path, { encoding: "utf-8" });
            const _name = path.basename(file, path.extname(file));
            data[_name] = _data;
        }
    }

    baseCamp("./resources/map-objects/");
    
    return data;
}


async function convertToDatabase(){
    const mapobjs = readAllObjectFiles();
    const articleComponent: {[key: string]: string} = readJSONSync("./.pickle/mapobjContents.json");

    for (const [disc, data] of Object.entries(mapobjs)){
        if (data.object.type.event != "org") continue;
        const hisdata: orgRecord = {
            title: data.article.title,
            article: articleComponent[disc],
            discriminator: disc,
            venue: data.article.venue,
            floor: data.object.floor,
        }
        await new Promise(resolve => {
            orgArtDB.run(`
                INSERT INTO Org_AISerach (title, article, discriminator, venue, floor) 
                VALUES (?, ?, ?, ?, ?)
            `, [...Object.values(hisdata)], resolve);
        });
    }
}


convertToDatabase();
