import fs from "fs";
import path from "path";
import { MapObject, MapObjectComponent, MapObjectArticleComponent } from "./server-dts/server";
import { readJSONSync } from "./utils";


export const DEFAULT_MAP_OBJECT: MapObject = {
    article: {
        title: "orgname",
        subtitle: "",
        core_grade: "...",
        theme_color: "#000000",
        content: "",
        crowd_status: 0,
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
        floor: "1F",
    },
    discriminator: ""
};


export function getAllObjects(cache: boolean=true){
    if (cache)
        return ALL_MAP_OBJECTS_NO_ART;
    else
        return getAllObjectsCommandSender();
}


export function getAllObjectsCommandSender(): { noart: MapObjectComponent, onlyart: MapObjectArticleComponent }{
    const objectdata = readAllObjectFiles();
    const realw: MapObjectComponent = { };
    const onlyart: MapObjectArticleComponent = { };

    for (var [odisc, data] of Object.entries(objectdata)){
        if (data.article){
            onlyart[odisc] = data.article.content;
            data.article.content = "null";
        }
        realw[odisc] = data;
    }

    return { noart: realw, onlyart: onlyart };
}


export function updateObject(){
    ALL_MAP_OBJECTS_NO_ART = readAllObjectFiles();
}


export function getArticle(disc: string): string{
    const G = ALL_MAP_OBJECTS_ARTICLE[disc];
    return G || "";
}


export function readObjectFile(disc: string): MapObject | void{
    const dirpath = "./resources/map-objects/";
    const _path = path.join(dirpath, disc+".json");

    if (fs.existsSync(_path)){
        const _data: MapObject = readJSONSync(_path, { encoding: "utf-8" });
        return _data;
    } else {
        return void 0;
    }
}


export function readAllObjectFiles(): MapObjectComponent{
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
    baseCamp("./resources/map-objects/static/");
    
    return data;
}

export var ALL_MAP_OBJECTS_NO_ART: MapObjectComponent;
export var ALL_MAP_OBJECTS_ARTICLE: MapObjectArticleComponent;


export function restoreMapObjects(){
    const k = getAllObjectsCommandSender();

    ALL_MAP_OBJECTS_NO_ART = k.noart;
    ALL_MAP_OBJECTS_ARTICLE = k.onlyart;
}


restoreMapObjects();


export { }
