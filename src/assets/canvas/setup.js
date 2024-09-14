//@ts-check
"use strict";


!function(){
    /** @ts-ignore @type {HTMLCanvasElement}*/
    const map_wrapper = document.getElementById("shishiji-view");
    /** @ts-ignore @type {HTMLElement}*/
    const fselector = document.getElementById("#place-selector".slice(1));


    /**
     * @param {Event} e  
     * @returns {boolean}
     */
    function illegal(e){
        const target = e.target;
        if (MOVEPROPERTY.deny) return true;
        //@ts-ignore
        if (target?.classList.contains("canvas_interactive") || target?.tagName.toLowerCase() === "canvas"){
            return false;
        }
        return true;
    }

    window.addEventListener("touchstart", (e) => {
        if (illegal(e))
            return;

        e.preventDefault();

        
        clearTimeout(WH_CHANGE_TM);


        if (overlay_modes.fselector.opened){
            toggleFeslOn.apply($(fselector), [true]);
            overlay_modes.fselector.opened = false;
        }
        
        init_friction();
        initTouch(e);
        setCursorpos(e.touches);

        if (e.touches.length >= 2)
            setTheta(e.touches);
    }, { passive: false });
    window.addEventListener("mousedown", (e) => {
        if (illegal(e))
            return;

        e.preventDefault();


        clearTimeout(WH_CHANGE_TM);

        
        if (overlay_modes.fselector.opened){
            toggleFeslOn.apply($(fselector), [true]);
            overlay_modes.fselector.opened = false;
        }

        init_friction();
        setCursorpos(e);

        window.addEventListener("mousemove", mose_move, { passive: false });
    }, { passive: false });

    

    window.addEventListener("touchmove", function(e){
        if (illegal(e))
            return;
        e.preventDefault();
        onTouchMove(e);
    }, { passive: false });



    window.addEventListener("touchend", (e) => {
        if (illegal(e))
            return;
        e.preventDefault();
        initTouch(e);
        DRAGGING = false;
        pointerPosition = [ null, null ];
        frict(pointerVelocity.x, pointerVelocity.y);
    }, { passive: false });
    window.addEventListener("mouseup", mouse_lost, { passive: false });


    window.addEventListener("wheel", wheel_move, { passive: true });
    window.addEventListener("mousewheel", wheel_move, { passive: true });


    function wheel_move(e){
        if (illegal(e))
            return;
        clearInterval(WH_CHANGE_TM);
        //@ts-ignore
        WH_CHANGE_TM = setTimeout(() => {
            setBehavParam();
        }, href_replaceCD);
        if (spckeystatus.ctr)
            canvasonCtrScroll(e);
        else
            canvasonScroll(e);
    }


    function mose_move(e){
        if (MOVEPROPERTY.deny) return;
        e.preventDefault();
        map_wrapper.style.cursor = "move";
        Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
            p => {
                //@ts-ignore
                p.style.cursor = "move";
            }
        );
        DRAGGING = true;
        onMouseMove(e);
    }


    function mouse_lost(e){
        e.preventDefault();
        pointerPosition = [ null, null ];
        window.removeEventListener("mousemove", mose_move);
        map_wrapper.style.cursor = "default";
        Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
            p => {
                //@ts-ignore
                p.style.cursor = p.getAttribute("dfcs");
            }
        )

        const vx = pointerVelocity.x,
              vy = pointerVelocity.y;

        if (DRAGGING){
            DRAGGING = false;
            return frict(vx, vy);
        }
    }

    
    function frict(vx0, vy0){
        function i(n){
            return n < 0 ? -1 : 1;
        }

        var vx = vx0,
            vy = vy0,
            dxa = pointerVelocity.a*i(vx0),
            dya = pointerVelocity.a*i(vy0);

        if (isNaN(vx) || isNaN(vy))
            return 0;

        const selfi = setInterval(function(){
            var ag = { top: vy/1000, left: vx/1000 };
            if (ag.top*vy0 <= 0) ag.top = 0;
            if (ag.left*vx0 <= 0) ag.left = 0;

            moveMapAssistingNegative(ag);

            vx += dxa;
            vy += dya;
            if (vx*vx0 <= 0 && vy*vy0 <= 0){
                //@ts-ignore
                WH_CHANGE_TM = setTimeout(function(){
                    setBehavParam();
                }, href_replaceCD);
                clearInterval(selfi);
                return;
            }
        }, 1);
        frictDiscount = selfi;

        return 0;
    }


    document.body.addEventListener("mousemove", function(e){
        e.preventDefault();
        cursorPosition = [ e.clientX, e.clientY ];
    });


    function init_friction(){
        DRAGGING = false;
        //@ts-ignore
        clearInterval(frictDiscount);
    }
    /**
     * 
     * @param {TouchEvent} e 
     */
    function initTouch(e){
        touchCD = 0;
        zoomCD = 0;
        totalRotateThisTime = 0;
        rotatedThisTime = 0;
        prevTheta = -1;
        previousTouchDistance = { x: -1, y: -1, distance: -1 };
        prevTouchINFO.real = [];
        if (e.touches.length < 2)
            pastRotateMin = false;
    }
    
    return 0;
}();
