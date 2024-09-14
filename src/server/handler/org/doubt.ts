import { Request, Response } from "express";

import * as AppAPI from "../../utils";
import sqlite3 from "sqlite3";


const Database = sqlite3.verbose();
export const random = new AppAPI.Random();
export const orgDB = new Database.Database("./.db/org/orgument.db");
export const Responses = {
    "400": { status: 400, error: "Bad Request" },
    "403": { status: 403, error: "Permission Denied" },
    "500": { status: 500, err: "Internal Server Error" }
};


export function responseError(res: Response, code: 400 | 403 | 500): void{
    res.status(code).json(Responses[code]);
}


export { }
