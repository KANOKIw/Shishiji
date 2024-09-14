import { userDB } from "../../src/server/handler/user/doubt";


userDB.serialize(() => {
    userDB.run(`UPDATE Login_Users SET claimed_rpt = '{"1F":-1,"2F":-1,"3F":-1,"4F":-1,"specials":[]}'`);
    userDB.run(`UPDATE Login_Users SET pt = 0`);
    userDB.run(`UPDATE Login_Users SET completed_orgs = "[]"`);
});
