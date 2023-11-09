//@ts-check
"use strict";


/**
 * @typedef {import("./shishiji-dts/motion").Position} _Position
 * @typedef {import("./shishiji-dts/motion").Radian} Radian
 */


!function(){
    /** @ts-ignore @type {HTMLCanvasElement}*/
    const map_wrapper = document.getElementById("shishiji-view");
    /** @ts-ignore @type {HTMLCanvasElement}*/
    const canvas = document.getElementById("shishiji-canvas");
    /** @ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");



    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        init_friction();
        initTouch(e);
        set_cursorpos(e.touches);

        if (e.touches.length >= 2)
            setTheta(e.touches);
    });
    canvas.addEventListener("mousedown", (e) => {
        init_friction();
        set_cursorpos(e);
        


        canvas.addEventListener("mousemove", mm);
        map_wrapper.style.cursor = "move";
    });

    

    canvas.addEventListener("touchmove", function(e){
        e.preventDefault();
        onTouchMove(e, this, ctx);
    });



    canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        initTouch(e);
        DRAGGING = false;
        pointerPosition = [ null, null ];
        frict(pointerVelocity.x, pointerVelocity.y);
    });
    canvas.addEventListener("mouseup", mouse_lost);
    canvas.addEventListener("mouseleave", mouse_lost);
    canvas.addEventListener("mouseout", mouse_lost);



    canvas.addEventListener("wheel", wheel_move);
    canvas.addEventListener("mousewheel", wheel_move);



    function wheel_move(e){
        canvasonScroll(e, this);
    }

    function mm(e){
        DRAGGING = !0;
        onMouseMove(e, this, this.getContext("2d"));
    }

    function mouse_lost(e){
        pointerPosition = [ null, null ];
        canvas.removeEventListener("mousemove", mm);
        map_wrapper.style.cursor = "default";

        const vx = pointerVelocity.x,
              vy = pointerVelocity.y;

        if (DRAGGING){
            DRAGGING = false;
            return frict(vx, vy);
        }
    }

    function frict(vx0, vy0){
        function i(n){
            return n < 0 ? -1 : 1;
        }
        if (frictInterval !== null)
            clearInterval(frictInterval);

        var vx = vx0,
            vy = vy0,
            dxa = pointerVelocity.a*i(vx0),
            dya = pointerVelocity.a*i(vy0);

        if (isNaN(vx) || isNaN(vy))
            return 0;

        //@ts-ignore
        frictInterval = setInterval(() => {
            var ag = {top: vy/1000, left: vx/1000};
            if (ag.top*vy0 <= 0) ag.top = 0;
            if (ag.left*vx0 <= 0) ag.left = 0;
            moveMapAssistingNegative(canvas, ctx, ag);
            vx += dxa;
            vy += dya;
            if (vx*vx0 <= 0 && vy*vy0 <= 0 && frictInterval !== null)
                clearInterval(frictInterval);
        }, 1);
        return 0;
    }


    document.body.addEventListener("mousemove", function(e){
        cursorPosition = [e.clientX, e.clientY];
    });


    function init_friction(){
        DRAGGING = false;
        if (frictInterval !== null)
            clearInterval(frictInterval);
    }
    /**
     * 
     * @param {TouchEvent} e 
     */
    function initTouch(e){
        touchCD = 0;
        totalRotateThisTime = 0;
        rotatedThisTime = 0;
        prevTheta = -1;
        previousTouchDistance = { x: -1, y: -1, distance: -1 };
        if (e.touches.length < 2)
            pastRotateMin = false;
    }
    return 0;
}();


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
 * @param {[number, number]} pos
 * @param {boolean} forceRatio 
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
        backcanvas.canvas.coords = { x: transorigin[0], y: transorigin[1] };
    }
    backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;

    _redraw(canvas, ctx, backcanvas,
        backcanvas.canvas.coords.x, backcanvas.canvas.coords.y, backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
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
        backcanvas.canvas.coords = { x: transorigin[0], y: transorigin[1] };
    }
    backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas,
        backcanvas.canvas.coords.x, backcanvas.canvas.coords.y, backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
    );
}


/**
 * Safari doesn't work same as chrome, can't get empty of backcanvas.
 * Fill empty in main canvas when negative coords.
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
        args = [sx, sy, sw, sh, dx, dy, dw, dh];
    }

    //@ts-ignore
    ctx.drawImage(image, ...args);
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {_Position} origin 
 * @param {number | undefined} absRotation 
 */
function rotateCanvas(canvas, ctx, origin, absRotation){
    if (absRotation === void 0){
        absRotation = backcanvas.canvas.rotation;
    }
    // rotate to absRotation from 0
}



//#region 
const log = document.getElementById("log");
function LOG(...str){
    if (log!=null)
    log.innerHTML += str.join(" ")+"<br>";
}
function _LOG(...str){
    if (log!=null)
    log.innerHTML = str.join(" ")+"<br>";
}

window.onerror = (e, url, linenumber)=>{_LOG(e, url, linenumber)}
//#endregion 



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

    const prevMiddle = prevTouchINFO.middle;


    pointerPosition = pos;


    if (touchCD < MOVEPROPATY.touch.downCD){
        touchCD++;
        return;
    }


    if (touches.length >= 2 && prevTouchINFO.touches !== void 0 && prevTouchINFO.touches.length >= 2){
        const abs = Math.abs;

        /**@graph */
        const Fx = {
            previous: {
                slope: (prevTouchINFO.touches[0].y - prevTouchINFO.touches[1].y) / (prevTouchINFO.touches[0].x - prevTouchINFO.touches[1].x),
            },
            this: {
                slope: (touches[0].clientY - touches[1].clientY) / (touches[0].clientX - touches[1].clientX),
            }
        };

        const distance = get_midestOfTouches(touches);
        var diffRatio = distance / previousTouchDistance.distance;

        if (previousTouchDistance.x == -1 && previousTouchDistance.y == -1 && previousTouchDistance.distance == -1){
            diffRatio = 1;
        }

        previousTouchDistance.distance = distance;

        if (Fx.previous.slope == Fx.this.slope || true /**@delete_this */){
            var D1 = touches[0].clientX - prevTouchINFO.touches[0].x;
            var D2 = touches[1].clientX - prevTouchINFO.touches[1].x;

            (D1 === 0 && D2 === 0 || D1+D2 == 0) ? D1 = D2 = 1 : 0;
            _LOG(D1, D2)

            var R = D1 / (abs(D1) + abs(D2));

            // ignore slope
            var addD1x = abs(touches[0].clientX - touches[1].clientX) * R;
            var addD1y = abs(touches[0].clientY - touches[1].clientY) * R;

            var middle = {
                x: touches[0].clientX + addD1x,
                y: touches[0].clientY + addD1y,
            };
            
            prevTouchINFO.middle = middle;

            //#region 
            //@ts-ignore
            document.getElementById("middle-pointer").style.left = middle.x-3+"px";
            //@ts-ignore
            document.getElementById("middle-pointer").style.top = middle.y-3+"px";
            //#endregion

            //@ts-ignore
            zoomMapAssistingNegative(canvas, ctx, diffRatio, [ middle.x, middle.y ]);
        }


        /**
         * rotates
         */
        const PI = Math.PI;
        const theta = getThouchesTheta(event.touches);
        
        /**@type {Radian} */
        var rotation;

        if (prevTheta === -1)
            rotation = 0;
        else if (
            0 <= prevTheta && prevTheta <= PI
                &&
            PI*(3/2) <= theta && theta <= 2*PI
            )
            rotation = -(2*PI - theta + prevTheta);
        else if (
            0 <= theta && theta <= PI
                &&
            PI*(3/2) <= prevTheta && prevTheta <= 2*PI
            )
            rotation = 2*PI - prevTheta + theta;
        else 
            rotation = theta - prevTheta;

        prevTheta = theta;


        totalRotateThisTime += Math.abs(rotation);
        rotatedThisTime += rotation;


        if (Math.abs(rotatedThisTime) > toRadians(MOVEPROPATY.touch.rotate.min) || pastRotateMin){
            if (!pastRotateMin){
                rotatedThisTime -= toRadians(MOVEPROPATY.touch.rotate.min);
            }
            pastRotateMin = !0;
            backcanvas.canvas.rotation += rotation;
            const middle = getMiddlePosForZoom(touches);
        }//_LOG("rotate: "+toDegrees(backcanvas.canvas.rotation));

        rotatedThisTime += rotation;
    
    } else {
        pastRotateMin = false;
        rotatedThisTime = 0;
        totalRotateThisTime = 0;
        prevTheta = -1;
    }


    if (!prevp.some(i => i === null)){
        if (touches.length == 1){
            //@ts-ignore
            const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
            moveMapAssistingNegative(canvas, ctx, map_move);
        } else {
            if (prevMiddle !== void 0){
                   /* moveMapAssistingNegative(canvas, ctx, {
                        left: prevTouchINFO.middle.x - prevMiddle.x,
                        top: prevTouchINFO.middle.y - prevMiddle.y,
                    });*/
            }
        }
    }

    setPrevTouches(touches);
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
    const pos = [e.clientX, e.clientY];
    //@ts-ignore
    const moved = { left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1] };

    moveMapAssistingNegative(canvas, ctx, moved);
    pointerPosition = pos;
}
