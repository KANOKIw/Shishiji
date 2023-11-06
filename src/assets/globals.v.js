//@ts-check

/**
 * @typedef {import("./ts-check/shishiji").Position} Position
 * @typedef {import("./ts-check/shishiji").BackCanvas} BackCanvas
 */

/**@type {Position} */
var pointerPosition = [ null, null ];
/**@type {Position} */
var cursorPosition = [ null, null ];
var DRAGGING = false;
var zoomRatio = 1;
const backcanvas = document.createElement("canvas");
const bctx = backcanvas.getContext("2d");


/**@type {BackCanvas} */
//@ts-ignore
backcanvas.canvas = {
    /**@type {Position} */
    coords: [0, 0]
};

const MOVEPROPATY = {
    scroll: 1.05,
    caps: {
        ratio: {
            max: Infinity,
            min: NaN,
        },
    },
};

/**
 * @type {{ x: number, y: number, v: number, a: number, method: string | null}}
 */
// velocities are assigned as px/sec
const pointerVelocity = {x: 0, y: 0, v: 0, a: -50, method: null};
var frictInterval = null;
