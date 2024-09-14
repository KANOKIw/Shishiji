import { Request, Response } from "express";

import * as AppAPI from "../../utils";
import sqlite3 from "sqlite3";


const Database = sqlite3.verbose();
export const ticketDB = new Database.Database("./.db/mission/tickets.db");
