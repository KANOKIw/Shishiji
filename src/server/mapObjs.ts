import fs from "fs";
import path from "path";
import { mapObject, mapObjComponent } from "./server-dts/server";


/**@global */
var ALLOBJECTS: mapObjComponent;


function getAllObjects(cache: boolean=true){
    ALLOBJECTS ??= readAllObjectFiles();
    if (cache)
        return ALLOBJECTS;
    else
        return readAllObjectFiles();
}

function updateObject(){

}

function readAllObjectFiles(): mapObjComponent{
    const dirpath = "./resources/map-objects/";
    var data: mapObjComponent = {};

    try{
        const files = fs.readdirSync(dirpath);

        for (const file of files) {
            const _path = path.join(dirpath, file);
            const _data: mapObject = JSON.parse(fs.readFileSync(_path, "utf8"));
            const _name = path.basename(file, path.extname(file));
            data[_name] = _data;
        }
    } catch (e){}

    return data;
}


export { getAllObjects }
