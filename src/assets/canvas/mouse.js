//@ts-check
"use strict";


/**
 * Zoom canvas by scrolling mouse wheel
 * @param {WheelEvent} e 
 * @param {HTMLCanvasElement} canvas 
 */
function canvasonScroll(e, canvas){
    var delta = MOVEPROPERTY.scroll * 1;
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
