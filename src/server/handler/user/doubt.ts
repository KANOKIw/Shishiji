import * as AppAPI from "../../utils";
import sqlite3 from "sqlite3";


export const Database = sqlite3.verbose();
export const random = new AppAPI.Random();
export const userDB = new Database.Database("./.db/user/accounts.db");
export const stampDB = new Database.Database("./.db/stamp/location.db");


export { }
