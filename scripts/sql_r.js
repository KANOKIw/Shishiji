//@ts-check

const sqlite3 = require("sqlite3");
const database = sqlite3.verbose();
const uDB = new database.Database("./.db/user/accounts.db");

uDB.serialize(() => {
    uDB.run(`CREATE TABLE IF NOT EXISTS Login_Users (
        idx INTEGER,
        discriminator TEXT,
        confidence TEXT,
        PRIMARY KEY (idx)
    );
    `);
    uDB.run(`CREATE TABLE IF NOT EXISTS Login_Sessions (
        idx INTEGER,
        discriminator TEXT,
        session TEXT NOT NULL,
        PRIMARY KEY (idx)
    );
    `);
});

//const oDB = new database.Database("./.db/org/orgument.db");
//oDB.serialize(() => {
//    oDB.run(`CREATE TABLE IF NOT EXISTS Auth_Data (
//    idx INTEGER,
//    org_name TEXT,
//    pass_word TEXT,
//    cloud_size INTEGER,
//    confidence TEXT,
//    PRIMARY KEY (idx)
//);`);
//    oDB.run(`CREATE TABLE IF NOT EXISTS Auth_Sessions (
//    idx INTEGER,
//    sessionid TEXT,
//    corresponder TEXT, -- Account Name
//    PRIMARY KEY (idx)
//);`);
//oDB.run(`INSERT INTO Auth_Data (org_name, pass_word, cloud_size) VALUES ("root", "root", 500);`);
//
//});
