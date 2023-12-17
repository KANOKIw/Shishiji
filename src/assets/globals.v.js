//@ts-check
"use strict";


/**
 * @typedef {import("./shishiji-dts/motion").Position} Position
 * @typedef {import("./shishiji-dts/motion").BackCanvas} BackCanvas
 * @typedef {import("./shishiji-dts/motion").Distance} Distance
 * @typedef {import("./shishiji-dts/motion").Coords} Coords
 * @typedef {import("./shishiji-dts/motion").touchINFO} touchINFO
 * @typedef {import("./shishiji-dts/objects").mapObjComponent} mapObjComponent
 * @typedef {import("./shishiji-dts/objects").intervals} intervals
 * 
 * @typedef {import("socket.io").Socket} Socket
 */


var LANGUAGE = "JA";

/**
 * assign on interaction
 * pointerPosition: temp variable to get previous controler pos (get diff)
 * cursorPosition: current mouse cursor position (zoom origin)
 * @type {Position} */
var pointerPosition = [ null, null ];
/**@type {Position} */
var cursorPosition = [ null, null ];


var DRAGGING = false;
var zoomRatio = 1;

const href_replaceDuration = 350;


/**
 * @type {BackCanvas} 
 * @readonly
 *@ts-ignore*/
const backcanvas = document.createElement("canvas");
/**@ts-ignore @type {CanvasRenderingContext2D} */
const bctx = backcanvas.getContext("2d");


//@ts-ignore
backcanvas.canvas = {
    coords: { 
        x: 0,
        y: 0,
    },
    rotation: 0,
};


/**
 * limit map motion and set magnification of any
 * @readonly
 */
const MOVEPROPERTY = {
    scroll: 1.05,
    object: {
        /**{@link MOVEPROPERTY.caps.ratio.max} < over & {@link MOVEPROPERTY.caps.ratio.min} > under & over > under*/
        dynamic_to_static: {
            over: 3,
            under: 0.3,
        },
    },
    caps: {
        ratio: {
            max: Infinity, // dev
            min: NaN, // dev
        },
    },
    touch: {
        /**
         * how many events to wait before start moving 
         * !high value prevents insta scrolling! (makes more likely to iPhone map tho)
         * @fix
         *   do by velocity
         */
        downCD: 1,
        zoomCD: -1,
        rotate: {
            // degree
            min: 15,
        }
    },
    arrowkeys: {
        interval: 5,
        move: 4,
    },
};


/**
 * velocities are assigned with (px/sec)
 * @type {{ x: number, y: number, v: number, a: number, method: "MOUSE" | "TOUCH" | null }}
 */
var pointerVelocity = {
    x: 0, y: 0, v: 0, a: -75,
    method: null 
};

var touchZoomVelocity = {
    0: {
        x: 0,
        y: 0,
    },
    1: {
        x: 0,
        y: 0,
    },
    a: -150,
};

/**@type {number | null} */
var frictInterval = null;
/**@type {number | null} */
var zoomFrictInterval = null;


/**@type {Distance} */
var previousTouchDistance = { 
    x: -1, y: -1,
    distance: -1 
};
/**@type {touchINFO} */
//@ts-ignore
var prevTouchINFO = {};


/**
 * relative radian
 * assign on touch move
 * @type {Radian} 
 */
var rotatedThisTime = 0;
/**
 * rotated amount of one pitch time use to limit start of rotation
 * init once when passed min
 * @see {MOVEPROPERTY.touch.rotate.min}
 * @type {Radian}
 */
var totalRotateThisTime = 0;
/**
 * mark rotatedThisTime has been bigger than min even once
 */
var pastRotateMin = false;
/**
 * @type {Radian} 
 */
var prevTheta = 0;

/**
 * use to make smooth map interaction.
 * not map moved, swiping instantly cause proble.
 * init on touch down
 */
var touchCD = 0;
var zoomCD = 0;


/**@type {intervals} */
var Intervals = {
    
};


/**@type {mapObjComponent} */
var mapObjectComponent = {};


var MAPDATA = {

};

var CURRENT_FLOOR = "";

const overlay_modes = {
    fselector: {
        opened: !!0,
        colors: {
            current: "rgba(0, 100, 0, 0.699)",
            else: "rgba(188, 255, 255, 0.699)",
        }
    },
};


/**@enum {string} */
const Symbol_Span = {
    loadgingsymbol: `<span class="material-symbols-outlined loading-symbol">progress_activity</span>`,
    refreshsymbol: `<span class="material-symbols-outlined">refresh</span>`,
};

/**
 * :literal:
 * @enum {number} 
 */
const reloadInitializeLevels = {
    DO_NOTHING: 0,
    CLOSE_ARTICLE: 1,
    INIT_ZOOMRADIO: 2,
    INIT_COORDS: 3,
    INIT_FLOOR: 4,
    DO_EVERYTHING: 5,
}

/**
 * @see {@link reloadInitializeLevels}
 */
const reloadInitializeLevel = reloadInitializeLevels.DO_NOTHING;


// digit
const paramAbstractDeg = 4;
/**@enum {string} */
const ParamNames = {
    ZOOM_RATIO: "zr",
    COORDS: "at",
    ARTICLE_ID: "art",
    FLOOR: "fl",
    URL_FROM: "storm",
    LANGUAGE: "lang",
    SCROLL_POS: "scrp",
    ART_TARGET: "atg",
};
/**@enum {string} */
const ParamValues = {
    FROM_ARTICLE_SHARE: "attsrh",
}
const objectIdFormat = "disc-{0}";

const ZOOMRATIO_ON_SHARE = 2;


const Notifier_prop = {
    /**@ts-ignore @type {NodeJS.Timeout} FAKE */
    Timeout: 0,
    /**@ts-ignore @type {NodeJS.Timeout} FAKE */
    _Timeout: 0,
    /**@ts-ignore @type {NodeJS.Timeout} FAKE */
    __Timeout: 0,
    current: "",
    notifying: !!0,
};

/**milisecond */
const WAIT_BETWEEN_EACH_MAP_IMAGE = 100;

const Ovv_tg_listener = {
    description: () => {},
    details: () => {},
    else: () => {},
};

const _mcColorList = {
    "0": "#000000",  // Black
    "1": "#0000AA",  // Dark Blue
    "2": "#00AA00",  // Dark Green
    "3": "#00AAAA",  // Dark Aqua
    "4": "#AA0000",  // Dark Red
    "5": "#AA00AA",  // Dark Purple
    "6": "#FFAA00",  // Gold
    "7": "#AAAAAA",  // Gray
    "8": "#555555",  // Dark Gray
    "9": "#5555FF",  // Blue
    "a": "#55FF55",  // Green
    "b": "#55FFFF",  // Aqua
    "c": "#FF5555",  // Red
    "d": "#FF55FF",  // Light Purple
    "e": "#FFFF55",  // Yellow
    "f": "#FFFFFF",  // White
};
const _mcDec = {
    "k": 'class="--mcf-obfuscated"',
    "l": 'style="font-weight: bolder;"',
    "m": 'style="text-decoration: line-through;"',
    "n": 'style="text-decoration: underline;"',
    "o": 'style="font-style: italic;"',
    "p": 'style=""',
};
const _mcColor = {
    BLACK: "§0",
    DARK_BLUE: "§1",
    DARK_GREEN: "§2",
    DARK_AQUA: "§3",
    DARK_RED: "§4",
    DARK_PURPLE: "§5",
    GOLD: "§6",
    GRAY: "§7",
    DARK_GRAY: "§8",
    BLUE: "§9",
    GREEN: "§a",
    AQUA: "§b",
    RED: "§c",
    LIGHT_PURPLE: "§d",
    YELLOW: "§e",
    WHITE: "§f",
    MAGIC: "§k",
    BOLD: "§l",
    STRIKETHROUGH: "§m",
    UNDERLINE: "§n",
    ITALIC: "§o",
    RESET: "§r",
};


/**@ts-ignore @type {Socket} */
const ws = io();
