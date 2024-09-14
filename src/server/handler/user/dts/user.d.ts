import { Reward } from "../../../../assets/shishiji-dts/supports";
import { DBColumn } from "../../../server-dts/server";


export interface StampDataRecord{
    stampid: string;
    _where: string;
}

export interface UserProfile{
    nickname: string;
    icon_path?: string;
}

export interface Ticket{
    ticket_name: string;
    visual: Reward;
    qrcode: string;
    confidence: string;
}

export interface TicketRecord{
    user_id: string;
    ticket_name: string;
    confidence: string;
}

export interface UserLoginRecord extends DBColumn {
    confidence: string;
    discriminator: string;
    completed_orgs: string;
    fame_votes: string;
    band_votes: string;
    dance_votes: string;
    misc_votes: string;
    profile: string;
    favorited_orgs: string;
    pt: number;
    claimed_rpt: string;
    tickets: string;
    custom_data: string;
    isstudent: boolean;
}

export interface UserCustomData{
    headcount: number;
    
    gender?: number;
    generation?: number;
}

export interface UserSessionRecord extends DBColumn {
    session: string;
    discriminator: string;
}

export interface Claimed_RPT {
    "1F": number;
    "2F": number;
    "3F": number;
    "4F": number;
    specials: string[];
}

export interface MissionPTMap{
    "1F": number[];
    "2F": number[];
    "3F": number[];
    "4F": number[]; 
}

export interface PublicUserProfile {
    disc: string;
    icp: string;
    nick: string;
    pt: number;
}

export { }
