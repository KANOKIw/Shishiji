import { Reward } from "../../../assets/shishiji-dts/supports";
import { Random } from "../../utils";
import { Ticket, TicketRecord } from "../user/dts/user";
import { User } from "../user/user";
import { ticketDB } from "./doubt";
import { Request, Response } from "express";

import QRCode from "qrcode";
import fs from "fs";
import { formToJSON } from "axios";
import { websocketio } from "../../drought";


async function fileExists(filePath: string){
    try {
        await fs.promises.access(filePath);
        return true;
    } catch (e){
        return false;
    }
}


export class TicketAdministrator{
    static random = new Random();


    static getTicketTables(): Promise<TicketRecord[]>{
        return new Promise(resolve => {
            ticketDB.all(`SELECT * FROM Tickets`, function(err, rows: TicketRecord[]){
                resolve(rows);
            });
        });
    }


    static async createTicket(user: User, ticket_name: string, visual: Reward){
        const udata = await user.getData(null);
        const confidence = this.random.string(64);
        const user_id = udata.discriminator;
        const utickets: Ticket[] = JSON.parse(udata.tickets);
        const use_coords = utickets
        const towaits = [];

        towaits.push(new Promise(resolve => {
            ticketDB.run(`
                INSERT INTO Tickets (user_id, ticket_name, confidence) 
                VALUES (?, ?, ?)
            `, [ user_id, ticket_name, confidence ], resolve);
        }));

        const userqrspath = `./resources/cloud/user/tickets/${user_id}/`;
        
        if (!(await fileExists(userqrspath)))
            await fs.promises.mkdir(userqrspath);

        const ticket_qr_path = `./resources/cloud/user/tickets/${user_id}/${ticket_name}.png`;
        towaits.push(new Promise(async resolve => {
            QRCode.toFile(ticket_qr_path, JSON.stringify({
                confidence: confidence,
                ticket_name: ticket_name,
                user_id: user_id,
            }), {
                width: 380
            }, async err => {
                utickets.push({
                    ticket_name: ticket_name,
                    visual: visual,
                    qrcode: ticket_qr_path,
                    confidence: confidence
                });
                await user.setData("tickets", JSON.stringify(utickets));
                resolve(null);
            }); 
        }));

        await Promise.all(towaits);

        return utickets;
    }


    static async useTicket(request: Request, response: Response){
        const requested_ticket: TicketRecord = JSON.parse(request.body["data"]);
        const uid = requested_ticket.user_id;
        const tickets = await TicketAdministrator.getTicketTables();
        const user = new User(uid);
        const udat = await user.getData(null);
        const mytickets: Ticket[] = JSON.parse(udat.tickets);
        var myticket: TicketRecord | null = null;
        var consumed_ticket: Ticket | null = null;
        var ticket_index = -1;
        

        for (const ticket_record of tickets){
            if (ticket_record.user_id == uid
                && ticket_record.confidence == requested_ticket.confidence){
                myticket = ticket_record;
                break;
            }
        }

        for (var j = 0; j < mytickets.length; j++){
            const ticket = mytickets[j];
            if (ticket.confidence == myticket?.confidence){
                consumed_ticket = ticket;
                ticket_index = j;
                break;
            }
        }

        if (!myticket || !consumed_ticket){
            response.status(403).send({ message: "ticket not found" });
            return;
        }


        mytickets.splice(j, 1);

        await user.setData("tickets", JSON.stringify(mytickets));

        websocketio.to(uid).emit("user.ticket.consumption", { 
            used: consumed_ticket,
            _newtickets: mytickets
        });
        ticketDB.all("DELETE FROM Tickets WHERE confidence=?", [ myticket.confidence ]);
        response.status(200).send({ message: "success", _used: consumed_ticket });
    }
}


export { }
