!function(){
    const map_wrapper = document.getElementById("shishiji-view");
    const canvas = document.getElementById("shishiji-canvas");
    canvas.addEventListener("touchstart", function(e){
        set_cursorpos(e.touches);
    });
    canvas.addEventListener("mousedown", function(e){
        set_cursorpos(e);
        canvas.addEventListener("mousemove", wp);
        map_wrapper.style.cursor = "move";
    });

    canvas.addEventListener("touchmove", function(e){
        onTouchMove(e, this, this.getContext("2d"));
    });

    canvas.addEventListener("touchend", function(e){
        pointerPosition = [ null, null ];
    });
    canvas.addEventListener("mouseup", function(e){
        pointerPosition = [ null, null ];
        canvas.removeEventListener("mousemove", wp);
        map_wrapper.style.cursor = "default";
    });

    canvas.addEventListener("wheel", wh);
    canvas.addEventListener("mousewheel", wh);
    function wh(e){
        canvasonScroll(e, this);
    }
    function wp(e){
        onMouseMove(e, this, this.getContext("2d"));
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
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array} movedTo
 *   {top: number, left: number}
 */
function moveMap(canvas, ctx, moved){
    var x = canvasCoordinate[0]+moved.left;
    var y = canvasCoordinate[1]+moved.top;
    canvasCoordinate = [x, y];
    zoomMap(canvas, ctx, 1, cursorPosition, canvasCoordinate);
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
    if (typeof pos == "undefined") pos = canvasCoordinate;
    zoomRatio *= ratio;
    var delta_width = canvas.width*(zoomRatio - 1);
    var delta_height = canvas.height*(zoomRatio - 1);
    if (origin.length == 2 && ratio != 1){
        var deltax = origin[0] - pos[0];
        var deltay = origin[1] - pos[1];
        console.log(origin)
        console.log(deltax, deltay)
        if (ratio > 1)
            canvasCoordinate = [pos[0]-deltax/ratio, pos[1]-deltay/ratio];
        else 
            canvasCoordinate = [pos[0]+deltax/ratio, pos[1]+deltay/ratio];
        console.log(canvasCoordinate)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas, canvasCoordinate[0], canvasCoordinate[1],
        backcanvas.width*zoomRatio, backcanvas.height*zoomRatio
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
    var delta = zoomPropaties.scroll * 1;
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
