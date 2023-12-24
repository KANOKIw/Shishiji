//@ts-check
"use strict";


/**
 * 
 * @param {TouchEvent} event 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
function onTouchMove(event, canvas, ctx){
    const touches = event.touches;
    const pos = getMiddlePos(touches);
    const prevp = pointerPosition;

    /**@type {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian}} */
    var adjust = { diffRatio: 1, crossPos: [ -1, -1 ], rotation: 0 };


    pointerPosition = pos;


    if (touchCD < MOVEPROPERTY.touch.downCD){
        touchCD++;
        return;
    }
    

    if (touches.length >= 2 && prevTouchINFO.real !== void 0 && prevTouchINFO.real.length >= 2){
        /**@see {@link (./eventCalcu.js).touchZoom} */
        adjust = touchZoom(canvas, ctx, event);
        prevTouchINFO.zoom = true;
    } else {
        pastRotateMin = false;
        rotatedThisTime = 0;
        totalRotateThisTime = 0;
        prevTheta = -1;
        zoomCD = 0;
        prevTouchINFO.cross = [ -1, -1 ];

        function frict(){
            var touch_0 = { clientX: prevTouchINFO.real[0].clientX, clientY: prevTouchINFO.real[0].clientY, velocity: touchZoomVelocity[0] };
            var touch_1 = { clientX: prevTouchINFO.real[1].clientX, clientY: prevTouchINFO.real[1].clientY, velocity: touchZoomVelocity[1] };

            !function(touch_0, touch_1){
                const orig = [ touch_0, touch_1 ];
                const a = touchZoomVelocity.a;

                function i(n){
                    return n < 0 ? -1 : 1;
                }
                if (zoomFrictInterval !== null)
                    clearInterval(zoomFrictInterval);
        
                if (isNaN(touch_0.velocity.x) || isNaN(touch_0.velocity.y)
                    || isNaN(touch_1.velocity.x) || isNaN(touch_1.velocity.y)
                    )
                    return 0;
        
                //@ts-ignore
                zoomFrictInterval = setInterval(() => {
                    touch_0.velocity.x += i(touch_0.velocity.x)*a;
                    touch_0.velocity.y += i(touch_0.velocity.y)*a;
                    touch_1.velocity.x += i(touch_1.velocity.x)*a;
                    touch_1.velocity.y += i(touch_1.velocity.y)*a;

                    touch_0.clientX += touch_0.velocity.x;
                    touch_0.clientY += touch_0.velocity.y;
                    touch_1.clientX += touch_1.velocity.x;
                    touch_1.clientY += touch_1.velocity.y;

                    touchZoom(canvas, ctx, {
                        touches: [
                            //@ts-ignore
                            touch_0, touch_1,
                        ],
                    });
                    if (touch_0.velocity.x*orig[0].velocity.x <= 0 &&
                        touch_0.velocity.y*orig[0].velocity.y <= 0 &&
                        touch_1.velocity.x*orig[1].velocity.x <= 0 &&
                        touch_1.velocity.y*orig[1].velocity.y <= 0
                        )
                        //@ts-ignore
                        clearInterval(zoomFrictInterval);
                }, 1);
                return 0;
            }(touch_0, touch_1);
        }
        if (false)
            frict();

        prevTouchINFO.zoom = false;
    }


    if (!prevp.some(t => t === null) && touches.length == 1){
        //@ts-ignore
        const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
        moveMapAssistingNegative(canvas, ctx, map_move);
    }

    prevTouchINFO.cross = adjust.crossPos;
    savePrevTouches(touches);
}
