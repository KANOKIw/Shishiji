import fs from "fs";
import path from "path";
import { mapObject, mapObjComponent } from "./server-dts/server";
import { readJSONSync } from "./utils";


var ALL_MAP_OBJECTS: mapObjComponent;
export const DEFAULT_MAP_OBJECT: mapObject = {
    article: {
        title: "orgname",
        core_grade: "...",
        theme_color: "#000000",
        content: "",
        crowd_status: {
            level: 0,
            estimated: 0,
        },
        font_family: null,
        custom_tr: [],
        images: {
            header: "",
        },
        venue: "",
        schedule: "",
    },
    object: {
        type: {
            event: "org",
            behavior: "dynamic"
        },
        coordinate: {
            x: 0,
            y: 0
        },
        images: {
            icon: "",
        },
        size: {
            width: 50,
            height: 50
        },
        floor: "F2",
    },
    discriminator: ""
};

export function getAllObjects(cache: boolean=true){
    ALL_MAP_OBJECTS ??= readAllObjectFiles();
    if (cache)
        return ALL_MAP_OBJECTS;
    else
        return readAllObjectFiles();
}

export function updateObject(){
    ALL_MAP_OBJECTS = readAllObjectFiles();
}

function readAllObjectFiles(): mapObjComponent{
    const dirpath = "./resources/map-objects/";
    var data: mapObjComponent = {};

    try{
        const files = fs.readdirSync(dirpath);

        for (const file of files) {
            if (file == ".sample.json")
                continue;
            const _path = path.join(dirpath, file);
            const _data: mapObject = readJSONSync(_path, { encoding: "utf-8" });
            const _name = path.basename(file, path.extname(file));
            data[_name] = _data;
        }
    } catch (e){}

    return data;
}


export { }
