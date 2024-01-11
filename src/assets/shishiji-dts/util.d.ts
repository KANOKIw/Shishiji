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
     * Wheter don't keep even if same discriminator notice was invoked.
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
    "info", "success", "error",
    "link", "no-wifi", "warn",
    "save", "input", "zoom"
};

export interface PictoNotifierOptions extends NotifierOptions {
    addToPending?: boolean;
}


export { }
