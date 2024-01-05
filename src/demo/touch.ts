import { Position, Moved, Coordinate } from "./shishiji";


export function getMiddlePos(touches: TouchList): Position{
    var av_x = 0;
    var av_y = 0;
    
    for (var t  of Array.from(touches)){
        av_x += t.clientX;
        av_y += t.clientY;
    }

    av_x /= touches.length;
    av_y /= touches.length;

    return [av_x, av_y];
}


export function getTouchesDistance(touches: TouchList): number{
    if (touches.length == 1)
        return 0;
    var amx = 0;
    var amy = 0;
    var am = 0;

    for (var touch of Array.from(touches)){
        amx += touch.clientX;
        amy += touch.clientY;
    }

    var middle: Coordinate = {x: amx/touches.length, y: amy/touches.length};

    for (var touch of Array.from(touches)){
        var dis = Math.abs(Math.sqrt((touch.clientX - middle.x)**2 
            + (touch.clientY - middle.y)**2));
        am += dis;
    }

    return am/touches.length;
}


export function moveMap(mapElement: HTMLElement, moved: Moved): void{
    var left = Number(mapElement.style.left.replace("px", ""));
    var top = Number(mapElement.style.top.replace("px", ""));
    var mapImg: Element = mapElement.children[0];
    var mx = left + moved.left;
    var my = top + moved.top;
    var w = mapImg.clientWidth;
    var h = mapImg.clientHeight;

    if (!(
        mx >= 0 || mx+w <= mapElement.clientWidth 
        ))
        mapElement.style.left = left + moved.left + "px";
    if (!(
        my >= 0 || my+h <= mapElement.clientHeight 
        ))
        mapElement.style.top = top + moved.top + "px";
}


export function onTouchDown(event: TouchEvent, elm: HTMLElement): void{
    var touches = event.touches;
    lastTouchPos = getMiddlePos(touches);
}


export function onTouchMove(event: TouchEvent, elm: HTMLElement): void{
    var touches = event.touches;
    var movedTo = getMiddlePos(touches);
    var map_move: Moved = {left: movedTo[0]! - lastTouchPos[0]!, top: movedTo[1]! - lastTouchPos[1]!};

    moveMap(elm, map_move);
    if (touches.length > 1){
        lastTouchesDis = getTouchesDistance(touches);
    }
    lastTouchPos = movedTo;
}


export function onTouchLeave(event: TouchEvent, elm: HTMLElement): void{
    lastTouchPos = [null, null];
}
