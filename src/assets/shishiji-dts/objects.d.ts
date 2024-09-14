import { Claimed_RPT, Ticket, UserCustomData } from "../../server/handler/user/dts/user";
import { UserProfile } from "../../server/server-dts/server";
import { Reward } from "./supports";

type MinecraftFormat = string;

export interface DrawMapData {
    tile_width: number;
    tile_height: number;
    xrange: number;
    yrange: number;
    format: string;
    spare: string;
    spareImage?: HTMLImageElement;
}

export interface mapObjElement extends Element {
    coords: string;
    style: { [key: string]: any; };
}

interface LoginData {
    completed_orgs: string[];
    profile: UserProfile;
    fame_votes: string[];
    band_votes: string[];
    dance_votes: string[];
    misc_votes: string[]; 
    favorited_orgs: string[];
    pt: number;
    claimed_rpt: Claimed_RPT;
    tickets: Ticket[];
    custom_data: UserCustomData;
    isstudent: boolean;
}

export interface PendingCollect{
    name: string;
    count: number;
}

export interface LoginInfo {
    logined: boolean;
    sid: string | null;
    discriminator: string | null;
    data: LoginData;
    pending_collects: PendingCollect[];
}

type tr = {
    title: string;
    content: string;
}

type ArticleLike = {
    title: string;
    subtitle: string;
    core_grade: string;
    theme_color: #ff00ff;
    content: MinecraftFormat;
    crowd_status: number;
    font_family: string | null;
    custom_tr: tr[];
    images: {
        header: string;
    };
    venue: string;
    schedule: string;
};

export interface Sizes {
    width: number;
    height: number;
}

type ObjectLike = {
    type: {
        event: string;
        behavior: "dynamic" | "static";
        border?: string;
    };
    coordinate: {
        x: number;
        y: number;
    };
    images: {
        icon: string;
    };
    size: Sizes;
    floor: string;
    no_admission?: boolean;
    open_screen?: string;
    day?: number;
};

export interface MapObject {
    article: ArticleLike;
    object: ObjectLike;
    discriminator: string;
}

export interface mapObjComponent {
    [key: string]: MapObject;
}

export interface advertisementData {
    title: string;
    subtitle: string;
    article: MinecraftFormat;
    image: { 
        icon: string;
        header: string; 
    };
    url: string;
}

export interface Intervals {
    /**LIE */
    [key: string]: NodeJS.Timeout;
}

export interface LanguageComponent {
    [key: string]: { [key: string]: string };
}

// Dummy
export interface ComplexClass { }

interface RotationHistoryCell {
    canvasOrigin: Complex;
    BackOrigin: Complex;
    arg: Radian;
}

export type RotationHistory = RotationHistoryCell[];

export interface mapPoint{
    name: string;
    coords: Coords;
}

export interface mapPointComponent{
    [key: string]: mapPoint[]
}

export interface StampCompletionData{
    title: string;
    progress: number;
    compPT: number;
    reelcount: number;
}

export interface SpecialMissionCompletionData{
    title: string;
    reward: Reward;
    reelcount?: null;
}


export { }
