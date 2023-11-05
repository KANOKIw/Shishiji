!function(){
    const map_wrapper = document.getElementById("shishiji-view");
    const canvas = document.getElementById("shishiji-canvas");
    const ctx = canvas.getContext("2d");

    canvas.addEventListener("touchstart", function(e){
        init_friction();
        set_cursorpos(e.touches);
    });
    canvas.addEventListener("mousedown", function(e){
        init_friction();
        set_cursorpos(e);
        canvas.addEventListener("mousemove", mm);
        map_wrapper.style.cursor = "move";
    });

    canvas.addEventListener("touchmove", function(e){
        onTouchMove(e, this, this.getContext("2d"));
    });

    canvas.addEventListener("touchend", function(e){
        DRAGGING = 0;
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
        var vx = pointerVelocity.x,
            vy = pointerVelocity.y;
        if (DRAGGING){
            DRAGGING = 0;
            return frict(vx, vy);
        }
    }
    function frict(vx0, vy0){
        function i(n){
            return n < 0 ? -1 : 1;
        }
        clearInterval(frictInterval);
        var vx = vx0,
            vy = vy0,
            dxa = pointerVelocity.a*i(vx0),
            dya = pointerVelocity.a*i(vy0);
        if (isNaN(vx) || isNaN(vy)) return 0;
        frictInterval = setInterval(function(){
            var ag = {top: vy/1000, left: vx/1000};
            if (ag.top*vy0 <= 0) ag.top = 0;
            if (ag.left*vx0 <= 0) ag.left = 0; 
            moveMap(canvas, ctx, ag);
            vx += dxa;
            vy += dya;
            if (vx*vx0 <= 0 && vy*vy0 <= 0)
                clearInterval(frictInterval);
        }, 1);
    }

    document.body.addEventListener("mousemove", function(e){
        cursorPosition = [e.clientX, e.clientY];
    });

    function init_friction(){
        DRAGGING = 0;
        clearInterval(frictInterval);
    }
}();


/**
 * 
 * @param {TouchList} touches 
 * @returns 
 */
function get_middlepos(touches){
    var av_x = 0;
    var av_y = 0;
    for (var t  of touches){
        av_x += t.clientX;
        av_y += t.clientY;
    }
    av_x /= touches.length;
    av_y /= touches.length;
    return [av_x, av_y];
}


/**
 * 
 * @param {TouchList | MouseEvent} y 
 */
function set_cursorpos(y){
    if (typeof y[0] != "undefined")
        pointerPosition = get_middlepos(y);
    else
        pointerPosition = [y.clientX, y.clientY];
}


/**
 * 
 * @param {TouchList} touches 
 * @returns {number}
 */
function get_midest_touches(touches){
    if (touches.length == 1) return 0;
    var amx = 0;
    var amy = 0;
    var am = 0;

    for (var touch of Array.from(touches)){
        amx += touch.clientX;
        amy += touch.clientY;
    }
    var middle = {x: amx/touches.length, y: amy/touches.length};

    for (var touch of Array.from(touches)){
        var dis = Math.abs(Math.sqrt((touch.clientX - middle.x)**2 
            + (touch.clientY - middle.y)**2));
        am += dis;
    }
    return am/touches.length;
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{top: number, left: number}} moved
 */
function moveMap(canvas, ctx, moved){
    var x = backcanvas.canvas.coords[0]-moved.left/zoomRatio;
    var y = backcanvas.canvas.coords[1]-moved.top/zoomRatio;
    backcanvas.canvas.coords = [x, y];
    backcanvas.canvas.width = canvas.width/zoomRatio;
    backcanvas.canvas.height = canvas.height/zoomRatio;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas, ...backcanvas.canvas.coords,
                              backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
        );
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} ratio 
 * @param {[number, number]} origin
 *   T: cursor pos
 * @param {[number, number]} pos
 */
function zoomMap(canvas, ctx, ratio, origin, pos){
    if (MOVEPROPATY.caps.ratio.max < zoomRatio && ratio > 1
        || MOVEPROPATY.caps.ratio.min > zoomRatio && ratio < 1
        ) return;
    if (typeof pos == "undefined") pos = backcanvas.canvas.coords;

    zoomRatio *= ratio;

    if (origin.length == 2 && ratio != 1){
        var transorigin = [
            (origin[0]*(ratio - 1))/(zoomRatio),
            (origin[1]*(ratio - 1))/(zoomRatio)
        ];
        backcanvas.canvas.coords = [pos[0]+transorigin[0], pos[1]+transorigin[1]];
    }
    var i = 0;
    backcanvas.canvas.width = canvas.width/zoomRatio;
    backcanvas.canvas.height = canvas.height/zoomRatio;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas,
        ...backcanvas.canvas.coords,
        backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
        );
}


/**
 * 
 * @param {TouchEvent} event 
 * @param {HTMLCanvasElement} canvas 
 */
function onTouchMove(event, canvas, ctx){
    var touches = event.touches;
    var pos = get_middlepos(touches);
    
    if (!pointerPosition.some(i => i === null)){
        var map_move = {left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1]};
        moveMap(canvas, ctx, map_move);
        if (touches.length > 1)
            touchesDistance = getTouchesDistance(touches);
    }
    pointerPosition = pos;
}


/**
 * 
 * @param {WheelEvent} e 
 * @param {HTMLCanvasElement} canvas 
 */
function canvasonScroll(e, canvas){
    var delta = MOVEPROPATY.scroll * 1;
    if (e.deltaY > 0)
        delta = 1/delta;
    zoomMap(canvas, canvas.getContext("2d"), delta, cursorPosition);
}


/**
 * 
 * @param {MouseEvent} e 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
function onMouseMove(e, canvas, ctx){
    var pos = [e.clientX, e.clientY];
    var moved = {left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1]};
    moveMap(canvas, ctx, moved);
    pointerPosition = pos;
}
