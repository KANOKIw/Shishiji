//@ts-check
"use strict";



/**
 * @typedef {import("../shishiji-dts/motion").Position} _Position
 * @typedef {import("../shishiji-dts/motion").Radian} Radian
 * @typedef {import("../shishiji-dts/motion").MoveData} MoveData
 */



/**
 * 
 * @param {TouchList | MouseEvent} y 
 */
function setCursorpos(y){
    if (y instanceof MouseEvent)
        pointerPosition = [ y.clientX, y.clientY ];
    else
        pointerPosition = getMiddlePos(y);
}


/**
 * 
 * @param {TouchList} touches 
 */
function setTheta(touches){
    prevTheta = getThouchesTheta(touches);
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {MoveData} moved
 */
function moveMapAssistingNegative(canvas, ctx, moved){
    const x = backcanvas.canvas.coords.x - moved.left/zoomRatio;
    const y = backcanvas.canvas.coords.y - moved.top/zoomRatio;

    backcanvas.canvas.coords = { x: x, y: y };
    backcanvas.canvas.width = canvas.width/zoomRatio;
    backcanvas.canvas.height = canvas.height/zoomRatio;

    _redraw(canvas, ctx, backcanvas,
        ...[ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ],
        backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
    );
}


/**
 * @deprecated use {@linkcode moveMapAssistingNegative} instead for safari support
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {MoveData} moved
 */
function moveMap(canvas, ctx, moved){
    const x = backcanvas.canvas.coords.y-moved.left/zoomRatio;
    const y = backcanvas.canvas.coords.x-moved.top/zoomRatio;

    backcanvas.canvas.coords = { x: x, y: y }; 
    backcanvas.canvas.width = canvas.width/zoomRatio;
    backcanvas.canvas.height = canvas.height/zoomRatio;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas, backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
        backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
    );
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} ratio 
 * @param {NonnullPosition | [number, number]} origin
 *   (cursorPosition)
 * @param {NonnullPosition | [number, number]} [pos]
 * @param {boolean} [forceRatio] 
 */
function zoomMapAssistingNegative(canvas, ctx, ratio, origin, pos, forceRatio){
    if (willOverflow(ratio)) return;

    if (pos === void 0)
        pos = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];

    if (forceRatio)
        zoomRatio = ratio;
    else
        zoomRatio *= ratio;

    if (origin.length == 2 && ratio != 1){
        /**@type {number[]} */
        var transorigin = [];
        for (var i = 0; i < 2; i++){
            transorigin.push(
                (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
            );
        }
        backcanvas.canvas.coords = {
            x: transorigin[0],
            y: transorigin[1]
        };
    }
    backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;

    _redraw(canvas, ctx, backcanvas,
        backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
        backcanvas.canvas.width, backcanvas.canvas.height,
        0, 0, canvas.width, canvas.height,
    );
}


/**
 * @deprecated use {@linkcode zoomMapAssistingNegative} instead for safari support
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} ratio 
 * @param {[number, number]} origin
 *   (cursorPosition)
 * @param {[number, number] | undefined} pos
 */
function zoomMap(canvas, ctx, ratio, origin, pos){
    if (MOVEPROPERTY.caps.ratio.max < zoomRatio && ratio > 1
        || MOVEPROPERTY.caps.ratio.min > zoomRatio && ratio < 1
        ) return;

    if (pos === void 0)
        pos = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];

    zoomRatio *= ratio;

    if (origin.length == 2 && ratio != 1){
        var transorigin = [];
        for (var i = 0; i < 2; i++){
            transorigin.push(
                (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
            );
        }
        backcanvas.canvas.coords = {
            x: transorigin[0],
            y: transorigin[1]
        };
    }
    backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas,
        backcanvas.canvas.coords.x, backcanvas.canvas.coords.y, backcanvas.canvas.width, backcanvas.canvas.height,
        0, 0, canvas.width, canvas.height,
    );
}


/**
 * iOS browser doesn't get empty of backcanvas.
 * Fill empty in main canvas when caught negative coords.
 * 
 * USE:: `_redraw(canvas, ctx, backcanvas,
 *      backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
 *      backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height);`
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {CanvasImageSource} image 
 * @param {number} sx 
 * @param {number} sy 
 * @param {number} sw 
 * @param {number} sh 
 * @param {number} dx 
 * @param {number} dy 
 * @param {number} dw 
 *   canvas width
 * @param {number} dh 
 *   canvas height
 */
function _redraw(canvas, ctx, image, sx, sy, sw, sh, dx, dy, dw, dh){
    /**@type {_Position} */
    const canvasCoords = [sx, sy];
    /**@type {NonnullPosition} */
    var transCoords;
    /**@type {number[]} */
    var args;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (sx < 0 || sy < 0){
        transCoords = canvasCoords.map(
            n => { return -n; }
        );
        args = [
            0, 0,
            backcanvas.canvas.width - transCoords[0],
            backcanvas.canvas.height - transCoords[1],
            transCoords[0]*zoomRatio,
            transCoords[1]*zoomRatio,
            dw - transCoords[0]*zoomRatio,
            dh - transCoords[1]*zoomRatio
        ];
    } else {
        args = [ sx, sy, sw, sh, dx, dy, dw, dh ];
    }

    //@ts-ignore
    ctx.drawImage(image, ...args);

    updatePositions();
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {NonnullPosition} origin 
 * @param {number} [rotation] 
 */
function rotateCanvas(canvas, ctx, origin, rotation){
    if (rotation === void 0){
        rotation = backcanvas.canvas.rotation;
    }
    
    /*var d = backcanvas.toDataURL();
    var _img = new Image();
    _img.src = d;
    bctx.clearRect(0, 0, backcanvas.width, backcanvas.height);
    bctx.translate(origin[0] * zoomRatio, origin[1] * zoomRatio);
    bctx.rotate(rotation);
    bctx.translate(-origin[0] * zoomRatio, -origin[1] * zoomRatio);
    
    _img.onload = function(e){
        bctx.drawImage(_img, 0, 0);
    }*/

    _redraw(canvas, ctx, backcanvas, backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
        backcanvas.canvas.width, backcanvas.canvas.height,
        0, 0, canvas.width, canvas.height
    );

    backcanvas.canvas.rotation += rotation;
}
