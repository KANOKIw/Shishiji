export interface TicketUserRecord{
    user_id: string;
    ticket_name: string;
    confidence: string;
}

export interface Actype{
    "scheduler";
    "update";
}

export interface MiscSessionRecord{
    sessionid: string;
    actype: keyof Actype;
}


export { }
