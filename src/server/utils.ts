import fs from "fs";
import crypto from "crypto";
import { mapObject } from "./server-dts/server";


export class Random {
    /**
     * Returns a pseudorandomly chosen int value between the specified origin (inclusive) and the specified bound (inclusive).
     * @param {number} origin the least value that can be returned
     * @param {number} bound the upper bound (inclusive) for the returned value
     *
     * @returns a pseudorandomly chosen int value between the origin (inclusive) and the bound (inclusive)
     * @throws IllegalArgumentException - if origin is greater than or equal to bound
     */
    public nextInt(origin?: number, bound?: number): number{
        if (origin === undefined || bound === undefined){
            if (origin != undefined) {bound = origin; origin = 0;}
            else{
                const num = Math.random();
                return num > 0.5 ? 1 : 0;
            }
        }
        return Math.floor(Math.random() * (bound - origin + 1)) + origin;
    }

    public string(length?: number): string{
        const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (!length) length = 16;
        return Array.from(crypto.randomFillSync(new Uint8Array(length)))
            .map((n) => S[n % S.length])
            .join("");
    }

    public UUID(): string{
        return crypto.randomUUID();
    }

    /**
     * Random choices from given Array
     * @param {Array<T>} list
     * @returns T
     */
    public randomChoice<T>(list: T[]): T{
        return list[this.nextInt(0, list.length - 1)];
    }
}

export function readJSONSync(path: string, options?: {
    encoding: BufferEncoding;
    flag?: string | undefined;
}): any{
    try {
        return JSON.parse(String(fs.readFileSync(path, options)));
    } catch(e){
        return null;
    }
}


export function dumpJSONSync(path: string, data: {} | any[], indent?: number, options?: fs.WriteFileOptions | undefined): void{
    indent ??= 4;
    return fs.writeFileSync(path, JSON.stringify(data, null, indent), options);
}


export function getOrgMdata(orgname: string): mapObject | null{
    const path = toMdatapath(orgname);
    try {
        return readJSONSync(path);
    } catch(e){
        return null;
    }
}


export function saveOrgMdata(orgname: string, data: mapObject): void{
    const path = toMdatapath(orgname);
    dumpJSONSync(path, data, 4, { encoding: "utf-8" });
}


export function toMdatapath(name: string): string{
    return "./resources/map-objects/"+name+".json";
}


export function convertUnit(byte: number, to: ("KB" | "MB" | "GB")): number{
    const kb = 1024;
    const mb = kb * 1024;
    const bg = mb * 1024;

    switch (to.toUpperCase()){
        case "KB":
            return byte / kb;
        case "MB":
            return byte / mb;
        case "GB":
            return byte / bg;
        default:
            throw new Error('Invalid "to" arg.');
    }
}


export function getMediaType(link: string){
    const extension = link.split(".").slice(-1)[0].toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].indexOf(extension) !== -1) {
        return "image";
    }

    if (["mp4", "webm", "avi", "mov", "flv"].indexOf(extension) !== -1) {
        return "video";
    }

    return "unknown";
}


export { }
