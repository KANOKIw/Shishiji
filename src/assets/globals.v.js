//@ts-check
"use strict";


/**
 * @typedef {import("./shishiji-dts/motion").Position} Position
 * @typedef {import("./shishiji-dts/motion").BackCanvas} BackCanvas
 * @typedef {import("./shishiji-dts/motion").Distance} Distance
 * @typedef {import("./shishiji-dts/motion").Coords} Coords
 * @typedef {import("./shishiji-dts/motion").touchINFO} touchINFO
 */


/**@type {Position} */
var pointerPosition = [ null, null ];
/**@type {Position} */
var cursorPosition = [ null, null ];


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
const MOVEPROPATY = {
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
const pointerVelocity = { 
    x: 0, y: 0, v: 0, a: -150,
    method: null 
};

/**@type {number | null} */
var frictInterval = null;


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
 * @see {MOVEPROPATY.touch.rotate.min}
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
