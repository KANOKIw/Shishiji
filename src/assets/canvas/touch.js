//@ts-check
"use strict";


/**
 * @param {TouchEvent} event 
 * @returns {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian, allowRotation: boolean}}
 */
function touchZoom(event){
    /**@type {NonnullPosition} */
    var crossPos = [ -1, -1 ];
    const abs = Math.abs;
    const touches = event.touches;
    var allowRotation = false;


    zoomCD++;
    const Fx = {
        previous: {
            slope: (prevTouchINFO.real[0].clientY - prevTouchINFO.real[1].clientY) / (prevTouchINFO.real[0].clientX - prevTouchINFO.real[1].clientX),
        },
        this: {
            slope: (touches[0].clientY - touches[1].clientY) / (touches[0].clientX - touches[1].clientX),
        }
    };

    const distance = getMidestOfTouches(touches);
    var diffRatio = distance / previousTouchDistance.distance;

    if (previousTouchDistance.x == -1 && previousTouchDistance.y == -1 && previousTouchDistance.distance == -1){
        diffRatio = 1;
    }

    previousTouchDistance.distance = distance;

    //#region 
    if (Fx.previous.slope == Fx.this.slope){
        var D1 = touches[0].clientX - prevTouchINFO.touches[0].x;
        var D2 = touches[1].clientX - prevTouchINFO.touches[1].x;

        (D1 === 0 && D2 === 0 || D1 + D2 == 0) ? D1 = D2 = 1 : void 0;

        const R = D1 / (abs(D1) + abs(D2));

        const addD1x = abs(touches[0].clientX - touches[1].clientX) * R;
        const addD1y = abs(touches[0].clientY - touches[1].clientY) * R;

        /**@type {NonnullPosition} */
        const middle = [
            touches[0].clientX + addD1x,
            touches[0].clientY + addD1y,
        ];
        
        prevTouchINFO.middle = middle;
    } else {
        const crossX = (
                prevTouchINFO.real[0].clientX * Fx.previous.slope - touches[0].clientX * Fx.this.slope
                - prevTouchINFO.real[0].clientY + touches[0].clientY
            )
                /
            (Fx.previous.slope - Fx.this.slope);
        const crossY = (
            Fx.this.slope * (crossX - touches[0].clientX) + touches[0].clientY
        );
        
        crossPos = [ crossX, crossY ];

        if (!crossPos.some(t => { return isNaN(t) })) 0;
    }
    //#endregion

    if (willOverflow(diffRatio, false)) diffRatio = 1;

    const prevOrigin = getMiddlePos(prevTouchINFO.real);
    const currentOrigin = getMiddlePos(touches);
    const x1d = prevOrigin[0] * diffRatio;
    const y1d = prevOrigin[1] * diffRatio;
    const diffx = currentOrigin[0] - x1d;
    const diffy = currentOrigin[1] - y1d;
    /**@type {Radian} */
    var rotation = 0;
    //#region 
    +function(){
        const PI = Math.PI;
        const theta = getThouchesTheta(touches);

        if (prevTheta === -1)
            rotation = 0;
        else if (
            0 <= prevTheta && prevTheta <= PI
                &&
            PI*(3/2) <= theta && theta <= 2*PI
            )
            rotation = -(2*PI - theta + prevTheta);
        else if (
            0 <= theta && theta <= PI
                &&
            PI*(3/2) <= prevTheta && prevTheta <= 2*PI
            )
            rotation = 2*PI - prevTheta + theta;
        else 
            rotation = theta - prevTheta;

        prevTheta = theta;


        totalRotateThisTime += Math.abs(rotation);
        rotatedThisTime += rotation;


        if (Math.abs(rotatedThisTime) > toRadians(MOVEPROPERTY.touch.rotate.min) || pastRotateMin){
            if (!pastRotateMin){
                rotatedThisTime -= toRadians(MOVEPROPERTY.touch.rotate.min);
            }
            pastRotateMin = allowRotation = true;
        }
    }();
    //#endregion


    if (zoomCD > MOVEPROPERTY.touch.zoomCD){
        zoomMapAssistingNegative(diffRatio, [ 0, 0 ], void 0, void 0, true);
        moveMapAssistingNegative({
            top: diffy,
            left: diffx
        }, allowRotation ? {
            rotated: rotation,
            origin: crossPos
        } : void 0);
    }

    return { diffRatio: diffRatio, crossPos: crossPos, rotation: rotation, allowRotation: allowRotation };
}


/**
 * 
 * @param {TouchEvent} event 
 */
function onTouchMove(event){
    const touches = event.touches;
    const pos = getMiddlePos(touches);
    const prevp = pointerPosition;

    /**@type {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian, allowRotation: boolean}} */
    var adjust = { diffRatio: 1, crossPos: [ -1, -1 ], rotation: 0, allowRotation: false };


    pointerPosition = pos;


    if (touchCD < MOVEPROPERTY.touch.downCD){
        touchCD++;
        return;
    }
    

    if (touches.length >= 2 && prevTouchINFO.real !== void 0 && prevTouchINFO.real.length >= 2){
        /**@see {@link (./eventCalcu.js).touchZoom} */
        adjust = touchZoom(event);
        prevTouchINFO.zoom = true;
    } else {
        pastRotateMin = false;
        rotatedThisTime = 0;
        totalRotateThisTime = 0;
        prevTheta = -1;
        zoomCD = 0;
        prevTouchINFO.cross = [ -1, -1 ];

        //#region 
        function frict(){
            var touch_0 = { clientX: prevTouchINFO.real[0].clientX, clientY: prevTouchINFO.real[0].clientY, velocity: touchZoomVelocity[0] };
            var touch_1 = { clientX: prevTouchINFO.real[1].clientX, clientY: prevTouchINFO.real[1].clientY, velocity: touchZoomVelocity[1] };

            +function(touch_0, touch_1){
                const orig = [ touch_0, touch_1 ];
                const a = touchZoomVelocity.a;

                function i(n){
                    return n < 0 ? -1 : 1;
                }
                if (zoomFrictInterval !== null)
                    clearInterval(zoomFrictInterval);
        
                if (isNaN(touch_0.velocity.x) || isNaN(touch_0.velocity.y)
                    || isNaN(touch_1.velocity.x) || isNaN(touch_1.velocity.y)
                    ) return;
            }(touch_0, touch_1);
        }
        if (false)
            frict();
        //#endregion

        prevTouchINFO.zoom = false;
    }


    if (!prevp.some(t => t === null) && touches.length == 1){
        //@ts-ignore
        const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
        moveMapAssistingNegative(map_move);
    }

    prevTouchINFO.cross = adjust.crossPos;
    savePrevTouches(touches);
}
