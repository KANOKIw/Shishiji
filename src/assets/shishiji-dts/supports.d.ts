export interface PopupOptions {
    /**
     * Popup's width.
     * 
     * Default to 500.
     */
    width?: number;
    /**
     * Popup's height.
     * 
     * Default to 450.
     */
    height?: number;
    /**
     * Whether hide X button.
     */
    hideclosebutton?: boolean;
    /**
     * Allow Popup to be closed only with X button.
     * 
     * Otherwise it's able to be closed with ESC key or black overlay.
     */
    forceclosebutton?: boolean;
}

export type PopupCloseMethod = "KEYBOARD" | "X BUTTON" | "OVERLAY" | "JAVASCRIPT";

export type PopupCloseListener = (method: PopupCloseMethod) => void;

export interface BaseNotifierOptions {
    /**
     * duration to show
     * @default 3000
     */
    duration?: number;
    /**
     * some unique id
     * @default html
     */
    discriminator?: string;
    /**
     * Wheter user can't close notifier clicking on it.
     */
    deny_userclose?: boolean;
}

export interface NotifierOptions extends BaseNotifierOptions {
    /**
     * Wheter don't keep even if same discriminator notice has been invoked.
     */
    do_not_keep_previous?: boolean;
}

export interface NoticeComponent {
    html: string;
    options?: NotifierOptions;
}

export interface PendingNoticeComponent extends NoticeComponent {
    options?: BaseNotifierOptions;
}

export type NotifierArgs = [
    string,
    NotifierOptions?
];

export type Pictograms = {
    "info",
    "link",
    "no-wifi",
    "success",
    "warn",
    "error",
    "save",
    "input",
    "school",
    "zoom",
    "smile",
    "new",
    "calculating",
    "copy",
    "thanks"
};

export interface PictoNotifierOptions extends NotifierOptions {
    addToPending?: boolean;
}

export interface RaidNotifierOptions extends BaseNotifierOptions {}

export interface RaidNoticeComponent {
    html: string;
    options?: RaidNotifierOptions;
}

export interface RaidNotifierEvent{
    time: string;
    discriminator: string;
    event_details: string;
    // whether discriminator isn't related
    no_relation?: boolean;
    // read by only when `no_relation` is `true`
    image_src?: string;
}

export type RaidNotifierArgs = [
    RaidNotifierEvent,
    NotifierOptions?
];

export function jsQR(data?, width?, height?, providedOptions?): {
    binaryData: any;
    data: any;
    chunks: any;
    version: any;
    location: {
        topRightCorner: any;
        topLeftCorner: any;
        bottomRightCorner: any;
        bottomLeftCorner: any;
        topRightFinderPattern: any;
        topLeftFinderPattern: any;
        bottomLeftFinderPattern: any;
        bottomRightAlignmentPattern: any;
    };
} | null;

export interface EventData{
    name: string;
    venue: string;
    takes: string;
}

type Minute = number;

export type Time24 = string;

type Venue = string;

export interface EventScheduleElement{
    name: string;
    description: string;
    takes: Minute;
    starts: Time24;
}

export interface BanceScheduleElement extends EventScheduleElement{
    musics: string[];
}

export interface MiscScheduleElement extends EventScheduleElement{ }

export interface EventDataWrapper{
    vote: string[];
    day1: BanceScheduleElement[];
    day2: BanceScheduleElement[];
}

export interface MiscEventDataWrapper{
    day1: MiscScheduleElement[];
    day2: MiscScheduleElement[];
}

export interface MiscEventDataWrapperWrapper{
    vote: string[];
    [key: Venue]: MiscEventDataWrapper;
}

export interface EventDataComponent{
    band: EventDataWrapper;
    dance: EventDataWrapper;
    misc: MiscEventDataWrapperWrapper;
}

export type Reward = {
    image: string;
    description: string;
    moredetails: string;
    use_coords: Coords;
}

export interface SpecialMission{
    title: string;
    required_pt: number;
    reward: Reward;
    mission_id: string;
    ticket: Reward;
}


export { }
