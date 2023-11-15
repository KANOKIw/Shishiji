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


/**@type {Position} */
var pointerPosition = [ null, null ];
/**@type {Position} */
var cursorPosition = [ null, null ];


/**@ts-ignore @type {Socket} */
const ws = io();

var DRAGGING = false;
var zoomRatio = 1;


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
    }
};


/**
 * velocities are assigned with (px/sec)
 * @type {{ x: number, y: number, v: number, a: number, method: "MOUSE" | "TOUCH" | null }}
 */
var pointerVelocity = { 
    x: 0, y: 0, v: 0, a: -150,
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


/**
 * Minecraft formatting system
 */
const ColorList = {
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
const Dec = {
    "k": 'class="--mcf-obfuscated"',
    "l": 'style="font-weight: bolder;"',
    "m": 'style="text-decoration: line-through;"',
    "n": 'style="text-decoration: underline;"',
    "o": 'style="font-style: italic;"',
    "p": 'style=""',
};
const Color = {
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


var MAPDATA = {

};

var CURRENT_FLOOR = "";
