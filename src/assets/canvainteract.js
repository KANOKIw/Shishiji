!function(){
    var canvas = document.getElementById("shishiji-canvas");
    canvas.addEventListener("touchstart", function(e){
        setCursorPos(e.touches);
    });
    canvas.addEventListener("mousedown", function(e){
        //setCursorPos(e.touches);
    });
    canvas.addEventListener("touchmove", function(e){
        onTouchMove(e, this, this.getContext("2d"));
    });
    canvas.addEventListener("mousemove", function(e){
        //onTouchMove(e, this, this.getContext("2d"));
    });
    canvas.addEventListener("touchend", function(e){
        pointerPosition = [ null, null ];
    });
    canvas.addEventListener("mouseup", function(e){
        pointerPosition = [ null, null ];
    });
    canvas.addEventListener("wheel", wh);
    canvas.addEventListener("mousewheel", wh);
    function wh(e){
        canvasonScroll(e, this);
    }
}();


/**
 * 
 * @param {TouchList} touches 
 * @returns 
 */
function getMiddlePos(touches){
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
 * @param {TouchList} touches 
 */
function setCursorPos(touches){
    pointerPosition = getMiddlePos(touches);
}


/**
 * 
 * @param {TouchList} touches 
 * @returns {number}
 */
function getTouchesMiddleAverage(touches){
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
 * @param {Array} moved 
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
 * @param {Array} origin
 *   T: cursor pos
 * @param {Array} pos
 */
function zoomMap(canvas, ctx, ratio, origin, pos){
    if (typeof pos == "undefined") pos = canvasCoordinate;
    zoomRatio *= ratio;
    /*
    if (origin.length == 2 && ratio != 1){
        var deltax = origin[0] - pos[0];
        var deltay = origin[1] - pos[1];
        if (ratio > 1)
            canvasCoordinate = [pos[0]-deltax, pos[1]-deltay];
        else 
            canvasCoordinate = [pos[0]+deltax, pos[1]+deltay];
        console.log(canvasCoordinate)
    }*/
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas, canvasCoordinate[0], canvasCoordinate[1], canvas.width*zoomRatio, canvas.height*zoomRatio);
}

/**
 * 
 * @param {TouchEvent} event 
 * @param {HTMLCanvasElement} canvas 
 */
function onTouchMove(event, canvas, ctx){
    var touches = event.touches;
    var movedTo = getMiddlePos(touches);
    if (!pointerPosition.some(i => i === null)){
        var map_move = {left: movedTo[0] - pointerPosition[0], top: movedTo[1] - pointerPosition[1]};
        moveMap(canvas, ctx, map_move);
        if (touches.length > 1){
            touchesDistance = getTouchesDistance(touches);
        }
    }
    pointerPosition = movedTo;
}


/**
 * 
 * @param {WheelEvent} e 
 * @param {HTMLCanvasElement} canvas 
 */
function canvasonScroll(e, canvas){
    var delta = zoomPropaties.scroll * 1;
    if (e.deltaY > 0){
        delta = 1/delta;
    }
    console.log(delta)
    zoomMap(canvas, canvas.getContext("2d"), delta, cursorPosition);
}
