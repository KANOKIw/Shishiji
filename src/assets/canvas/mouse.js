//@ts-check
"use strict";


/**
 * Zoom canvas by scrolling mouse wheel
 * @param {WheelEvent} e 
 */
function canvasonScroll(e){
    var delta = MOVEPROPERTY.scroll * 1;
    e.deltaY > 0 ? delta = 1/delta : void 0;
    //@ts-ignore
    zoomMapAssistingNegative(delta, cursorPosition);
}


/**
 * Zoom canvas by scrolling mouse wheel
 * @param {WheelEvent} e 
 */
function canvasonCtrScroll(e){
    const rotated = toRadians(2);
    const which_ = e.deltaY < 0 ? 1 : -1;

    moveMapAssistingNegative({ top: 0, left: 0 }, {
        rotated: rotated*which_,
        //@ts-ignore
        origin: cursorPosition
    })
}


/**
 * 
 * @param {MouseEvent} e 
 */
function onMouseMove(e){
    /**@type {NonnullPosition} */
    const pos = [ e.clientX, e.clientY ];
    //@ts-ignore N - null = N
    const moved = { left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1] };

    moveMapAssistingNegative(moved);
    pointerPosition = pos;
}
