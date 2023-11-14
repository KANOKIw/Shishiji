//@ts-check
"use strict";



/**
 * @typedef {import("../shishiji-dts/motion").Position} _Position
 * @typedef {import("../shishiji-dts/motion").Radian} Radian
 */



/**
 * 
 * @param {TouchList | MouseEvent} y 
 */
function set_cursorpos(y){
    if (y instanceof TouchList)
        pointerPosition = get_middlePos(y);
    else
        pointerPosition = [ y.clientX, y.clientY ];
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
 * @param {{top: number, left: number}} moved
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
 * @deprecated use moveMapAssistingNegative instead for safari support
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{top: number, left: number}} moved
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
 * @param {[number, number]} origin
 *   (cursorPosition)
 * @param {[number, number]} [pos]
 * @param {boolean} [forceRatio] 
 */
function zoomMapAssistingNegative(canvas, ctx, ratio, origin, pos, forceRatio){
    if (MOVEPROPATY.caps.ratio.max < zoomRatio && ratio > 1
        || MOVEPROPATY.caps.ratio.min > zoomRatio && ratio < 1
        ) return;

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
 * @deprecated use zoomMapAssistingNegative instead for safari support
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} ratio 
 * @param {[number, number]} origin
 *   (cursorPosition)
 * @param {[number, number] | undefined} pos
 */
function moveMap(canvas, ctx, ratio, origin, pos){
    if (MOVEPROPATY.caps.ratio.max < zoomRatio && ratio > 1
        || MOVEPROPATY.caps.ratio.min > zoomRatio && ratio < 1
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



/**
 * 
 * @param {TouchEvent} event 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
function onTouchMove(event, canvas, ctx){
    const touches = event.touches;
    const pos = get_middlePos(touches);
    const prevp = pointerPosition;

    /**@type {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian}} */
    var adjust = { diffRatio: 1, crossPos: [-1, -1], rotation: 0 };


    pointerPosition = pos;


    if (touchCD < MOVEPROPATY.touch.downCD){
        touchCD++;
        return;
    }
    

    if (touches.length >= 2 && prevTouchINFO.real !== void 0 && prevTouchINFO.real.length >= 2){
        /**@see {@link (./eventCalcu.js).touchZoom} */
        adjust = touchZoom(canvas, ctx, event);
        prevTouchINFO.zoom = !0;
    } else {
        pastRotateMin = false;
        rotatedThisTime = 0;
        totalRotateThisTime = 0;
        prevTheta = -1;
        zoomCD = 0;
        prevTouchINFO.cross = [ -1, -1 ];

        function frict(){
            var touch_0 = { clientX: prevTouchINFO.real[0].clientX, clientY: prevTouchINFO.real[0].clientY, velocity: touchZoomVelocity[0] };
            var touch_1 = { clientX: prevTouchINFO.real[1].clientX, clientY: prevTouchINFO.real[1].clientY, velocity: touchZoomVelocity[1] };

            !function(touch_0, touch_1){
                const orig = [ touch_0, touch_1 ];
                const a = touchZoomVelocity.a;

                function i(n){
                    return n < 0 ? -1 : 1;
                }
                if (zoomFrictInterval !== null)
                    clearInterval(zoomFrictInterval);
        
                if (isNaN(touch_0.velocity.x) || isNaN(touch_0.velocity.y)
                    || isNaN(touch_1.velocity.x) || isNaN(touch_1.velocity.y)
                    )
                    return 0;
        
                //@ts-ignore
                zoomFrictInterval = setInterval(() => {
                    touch_0.velocity.x += i(touch_0.velocity.x)*a;
                    touch_0.velocity.y += i(touch_0.velocity.y)*a;
                    touch_1.velocity.x += i(touch_1.velocity.x)*a;
                    touch_1.velocity.y += i(touch_1.velocity.y)*a;

                    touch_0.clientX += touch_0.velocity.x;
                    touch_0.clientY += touch_0.velocity.y;
                    touch_1.clientX += touch_1.velocity.x;
                    touch_1.clientY += touch_1.velocity.y;

                    touchZoom(canvas, ctx, {
                        touches: [
                            //@ts-ignore
                            touch_0, touch_1,
                        ],
                    });
                    if (touch_0.velocity.x*orig[0].velocity.x <= 0 &&
                        touch_0.velocity.y*orig[0].velocity.y <= 0 &&
                        touch_1.velocity.x*orig[1].velocity.x <= 0 &&
                        touch_1.velocity.y*orig[1].velocity.y <= 0
                        )
                        //@ts-ignore
                        clearInterval(zoomFrictInterval);
                }, 1);
                return 0;
            }(touch_0, touch_1);
        }
        if (false)
            frict();

        prevTouchINFO.zoom = !!0;
    }


    if (!prevp.some(t => t === null) && touches.length == 1){
        //@ts-ignore
        const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
        moveMapAssistingNegative(canvas, ctx, map_move);
    }

    prevTouchINFO.cross = adjust.crossPos;
    savePrevTouches(touches);
}


/**
 * zoom canvas by scrolling mouse wheel
 * @param {WheelEvent} e 
 * @param {HTMLCanvasElement} canvas 
 */
function canvasonScroll(e, canvas){
    var delta = MOVEPROPATY.scroll * 1;
    if (e.deltaY > 0)
        delta = 1/delta;
    //@ts-ignore
    zoomMapAssistingNegative(canvas, canvas.getContext("2d"), delta, cursorPosition);
}


/**
 * 
 * @param {MouseEvent} e 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
function onMouseMove(e, canvas, ctx){
    /**@type {NonnullPosition} */
    const pos = [ e.clientX, e.clientY ];
    //@ts-ignore
    const moved = { left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1] };

    moveMapAssistingNegative(canvas, ctx, moved);
    pointerPosition = pos;
}
