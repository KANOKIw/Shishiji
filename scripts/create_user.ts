import sqlite3 from "sqlite3";
import { Random } from "../src/server/utils";


const random = new Random();
const db = new (sqlite3.verbose()).Database("./.db/user/accounts.db");
const HOW_MANY = 20;


async function create(idx: number): Promise<void>{
    const confidence = random.string(64);
    const user_id = `OP${idx.toString().padStart(4, '0')}`;

    return new Promise((r, j) => {
        db.run(`INSERT INTO Login_Users (confidence, discriminator) VALUES (?, ?)`, [ confidence, user_id ], r);
    });
}


!async function(){
    for (var i=3; i <= HOW_MANY; i++){
        await create(i);
    }
}();
