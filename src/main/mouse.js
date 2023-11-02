"use strict";
window.addEventListener("mousedown", function (e) {
    lastCursorPos = [e.pageX, e.pageY];
});
function zoomByWheel(event, zoomTarget, ta_p) {
    function i(p) {
        return p < 0 ? -1 : 1;
    }
    function _zoom(elm, cursorPos) {
        cursorPos !== null && cursorPos !== void 0 ? cursorPos : (cursorPos = lastCursorPos);
        var pr = Number(zoomTarget.style.width.replace("%", "") || 100);
        var ne = pr + i(event.deltaY) * -zoomratio;
        var _x = cursorPos[0];
        var _y = cursorPos[1];
        if (_x < 0 || _y < 0)
            return;
        var delta = {
            left: _x * ne / pr,
            top: _y * ne / pr,
        };
        moveMap(ta_p, delta);
        zoomTarget.style.width = ne + "%";
    }
    if (lastCursorPos[0] == null || lastCursorPos[1] == null)
        return;
    //_zoom(zoomTarget, lastCursorPos);
}
