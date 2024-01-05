import { Position, Moved } from "./shishiji";
import { moveMap } from "./touch";


window.addEventListener("mousedown", function(e){
    lastCursorPos = [e.pageX, e.pageY];
});


export function zoomByWheel(event: WheelEvent, zoomTarget: HTMLElement, ta_p: HTMLElement): void{
    function i(p: number): number{
        return p < 0 ? -1 : 1;
    }
    
    function _zoom(elm: HTMLElement, cursorPos?: Position): void{
        cursorPos ??= lastCursorPos;
        var pr = Number(zoomTarget.style.width.replace("%", "") || 100);
        var ne = pr + i(event.deltaY)*-zoomratio;
        var _x = cursorPos[0]!;
        var _y = cursorPos[1]!;
        if (_x < 0 || _y < 0) return;
        var delta: Moved = {
            left: _x * ne/pr,
            top: _y * ne/pr,
        };
        moveMap(ta_p, delta);
        zoomTarget.style.width = ne + "%";
    }
    if (lastCursorPos[0] == null || lastCursorPos[1] == null)
        return;
    _zoom(zoomTarget, lastCursorPos);
}
