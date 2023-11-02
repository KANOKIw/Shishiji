function getMiddlePos(touches) {
    var av_x = 0;
    var av_y = 0;
    for (var _i = 0, _a = Array.from(touches); _i < _a.length; _i++) {
        var t = _a[_i];
        av_x += t.clientX;
        av_y += t.clientY;
    }
    av_x /= touches.length;
    av_y /= touches.length;
    return [av_x, av_y];
}
function getTouchesDistance(touches) {
    if (touches.length == 1)
        return 0;
    var amx = 0;
    var amy = 0;
    var am = 0;
    for (var _i = 0, _a = Array.from(touches); _i < _a.length; _i++) {
        var touch = _a[_i];
        amx += touch.clientX;
        amy += touch.clientY;
    }
    var middle = { x: amx / touches.length, y: amy / touches.length };
    for (var _b = 0, _c = Array.from(touches); _b < _c.length; _b++) {
        var touch = _c[_b];
        var dis = Math.abs(Math.sqrt(Math.pow((touch.clientX - middle.x), 2)
            + Math.pow((touch.clientY - middle.y), 2)));
        am += dis;
    }
    return am / touches.length;
}
function moveMap(mapElement, moved) {
    var left = Number(mapElement.style.left.replace("px", ""));
    var top = Number(mapElement.style.top.replace("px", ""));
    var mapImg = mapElement.children[0];
    var mx = left + moved.left;
    var my = top + moved.top;
    var w = mapImg.clientWidth;
    var h = mapImg.clientHeight;
    if (!(mx >= 0 || mx + w <= mapElement.clientWidth))
        mapElement.style.left = left + moved.left + "px";
    if (!(my >= 0 || my + h + 100 <= mapElement.clientHeight))
        mapElement.style.top = top + moved.top + "px";
}
function onTouchDown(event, elm) {
    var touches = event.touches;
    lastTouchPos = getMiddlePos(touches);
}
function onTouchMove(event, elm) {
    var touches = event.touches;
    var movedTo = getMiddlePos(touches);
    // NonNull' from onTouchDown()
    var map_move = { left: movedTo[0] - lastTouchPos[0], top: movedTo[1] - lastTouchPos[1] };
    moveMap(elm, map_move);
    if (touches.length > 1) {
        lastTouchesDis = getTouchesDistance(touches);
    }
    lastTouchPos = movedTo;
}
function onTouchLeave(event, elm) {
    lastTouchPos = [null, null];
}
