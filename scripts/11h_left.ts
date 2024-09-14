import { orgDB } from "../src/server/handler/org/doubt";



orgDB.run(`
    UPDATE Org_Data SET enbtered_total = 5
`);
