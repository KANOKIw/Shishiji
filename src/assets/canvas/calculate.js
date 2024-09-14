//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/motion").NonnullPosition} NonnullPosition
 */


/**
 * 
 * @param {TouchList} touches 
 * @returns {number}
 */
function getMidestOfTouches(touches){
    if (touches.length == 1)
        return 0;

    var amx = 0;
    var amy = 0;
    var am = 0;

    for (var touch of Array.from(touches)){
        amx += touch.clientX;
        amy += touch.clientY;
    }

    const middle = {x: amx/touches.length, y: amy/touches.length};

    for (var touch of Array.from(touches)){
        const dis = Math.abs(Math.sqrt((touch.clientX - middle.x)**2 
            + (touch.clientY - middle.y)**2));
        am += dis;
    }
    return 2*am/touches.length;
}


/**
 * 
 * @param {TouchList | Touch[]} touches 
 * @returns {NonnullPosition}
 */
function getMiddlePos(touches){
    var av_x = 0;
    var av_y = 0;
    const _a = touches.length;

    for (const t  of touches){
        av_x += t.clientX;
        av_y += t.clientY;
    }

    av_x /= _a;
    av_y /= _a;
    return [ av_x, av_y ];
}


/**
 * get vertical tilt from touches[0:2]
 * @param {TouchList} touches 
 * @returns {Radian}
 */
function getThouchesTheta(touches){
    const abs = Math.abs,
          sqrt = Math.sqrt,
          pow = Math.pow;
    /**@type {NonnullPosition} */
    const t1 = [touches[0].clientX, window.innerHeight - touches[0].clientY],
          /**@type {NonnullPosition} */
          t2 = [touches[1].clientX, window.innerHeight - touches[1].clientY];
    const S = [t1, t2];

    const distance = abs(sqrt(pow(S[0][0] - S[1][0], 2) + pow(S[0][1] - S[1][1], 2)));
    const sinTheta = (1 / distance)*(S[1][1] - S[0][1]);
    const cosTheta = (1 / distance)*(S[1][0] - S[0][0]);

    /**@type {Radian} */
    var theta = Math.acos(cosTheta);
    
    if (sinTheta < 0){
        theta = 2*Math.PI - theta;
    }
    // about 1/2
    if (Math.abs(theta - prevTheta) > Math.PI/2){

    }
    return theta;
}


/**
 * 
 * @param {TouchList} touches 
 */
function savePrevTouches(touches){
    prevTouchINFO.touches = [];
    for (var t of touches){
        prevTouchINFO.touches.push({
            x: t.clientX,
            y: t.clientY
        });
        prevTouchINFO.real = Array.from(touches);
    }
}


/**
 * 
 * @param {NonnullPosition} position 
 */
function toRotatedCoords(position){
    var coordsC = new Complex(position[0], position[1]);

    for (const rotcell of rotationHistory){
        coordsC = coordsC.rotate(-rotcell.arg, rotcell.canvasOrigin);
    }

    return _toBackCanvasCoords([ coordsC.real, coordsC.imag ]);
}


/**
 * get middle position between touches[0:2]
 * @param {TouchList} touches 
 * @returns {NonnullPosition}
 */
function getMiddlePosForZoom(touches){
    const S = [[touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]];
    /**@type {NonnullPosition} */
    const middle = [S[0][0] + S[1][0] / 2, S[1][1] + S[0][1] / 2];
    return middle;
}


/**
 * @param {Touch} t1 
 * @param {Touch} t2 
 * @returns {number}
 */
function touchDistance(t1, t2){
    return Math.abs(
        Math.sqrt(
            (t1.clientX - t2.clientX)**2 + (t1.clientY - t2.clientY)**2
        )
    );
}


/**
 * @param {Coords} backcanvasCoords 
 * @returns {NonnullPosition}
 */
function toCanvasPos(backcanvasCoords){
    return [
        (backcanvasCoords.x - backcanvas.canvas.coords.x) * zoomRatio,
        (backcanvasCoords.y - backcanvas.canvas.coords.y) * zoomRatio,
    ];
}


/**
 * 
 * @param {NonnullPosition} canvasPos 
 * @returns {Coords}
 */
function _toBackCanvasCoords(canvasPos){
    return {
        x: (canvasPos[0]/zoomRatio) + backcanvas.canvas.coords.x,
        y: (canvasPos[1]/zoomRatio) + backcanvas.canvas.coords.y,
    };
}

/**
 * 
 * @param {NonnullPosition} canvasPos 
 * @returns {Coords}
 */
function toBackCanvasCoords(canvasPos){
    return {
        x: (canvasPos[0]/zoomRatio) + backcanvas.canvas.coords.x,
        y: (canvasPos[1]/zoomRatio) + backcanvas.canvas.coords.y,
    };
}
