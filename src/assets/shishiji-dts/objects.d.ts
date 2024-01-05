export interface DrawMapData {
    tile_width: number;
    tile_height: number;
    xrange: number;
    yrange: number;
    format: string;
}

export interface mapObjElement extends Element {
    coords: string;
    style: { [key: string]: any; };
}

type ArticleLike = {
    title: string;
    core_grade: string;
    theme_color: #ff00ff;
    content: string;
    crowd_status: {
        level: number;
        estimated: number;
    };
    font_family: string | null;
    custom_tr: tr[];
    images: {
        header: string;
    };
    venue: string;
    schedule: string;
};

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
    size: {
        width: number;
        height: number;
    };
    floor: string;
};

export interface mapObject {
    article: ArticleLike;
    object: ObjectLike;
    discriminator: string;
}

export interface mapObjComponent {
    [key: string]: mapObject;
}

export interface Intervals {
    /**LIE */
    [key: string]: NodeJS.Timeout;
}

export interface NoticeComponent {
    html: string;
    term: number;
    discriminator: string;
    options?: NotifierOptions;
}

export interface LanguageComponent {
    [key: string]: { [key: string]: string };
}

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

export interface NotifierOptions {
    /**
     * Wheter don't keep even if same discriminator notice was invoked.
     */
    do_not_keep?: boolean;
    /**
     * Wheter user can't close notifier clicking on it.
     */
    deny_userclose?: boolean;
}

export type NotifierArgs = [
    string,
    number?,
    string?,
    NotifierOptions?
];

export type PopupCloseMethod = "KEYBOARD" | "X BUTTON" | "OVERLAY" | "JAVASCRIPT";

export type PopupCloseListener = (method: PopupCloseMethod) => void;


export { }
