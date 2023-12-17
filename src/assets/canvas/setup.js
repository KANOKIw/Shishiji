//@ts-check
"use strict";


!function(){
    /** @ts-ignore @type {HTMLCanvasElement}*/
    const map_wrapper = document.getElementById("shishiji-view");
    /** @ts-ignore @type {HTMLCanvasElement}*/
    const canvas = document.getElementById("shishiji-canvas");
    /** @ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    /** @ts-ignore @type {HTMLElement}*/
    const fselector = document.getElementById("place-selector");
    /**window.location.href replace timeout */
    var tout = 0;


    /**
     * @param {Event} e  
     * @returns {boolean}
     */
    function illegal(e){
        const target = e.target;
        //@ts-ignore
        if (target?.classList.contains("canvas_interactive") || target?.tagName.toLowerCase() === "canvas"){
            return !!0;
        }
        return !0;
    }

    window.addEventListener("touchstart", (e) => {
        if (illegal(e))
            return;

        e.preventDefault();

        
        clearTimeout(tout);


        if (overlay_modes.fselector.opened){
            toggleFeslOn.apply($(fselector), [!0]);
            overlay_modes.fselector.opened = !!0;
        }
        
        init_friction();
        initTouch(e);
        set_cursorpos(e.touches);

        if (e.touches.length >= 2)
            setTheta(e.touches);
    }, { passive: false });
    window.addEventListener("mousedown", (e) => {
        if (illegal(e))
            return;

        e.preventDefault();


        clearTimeout(tout);

        
        if (overlay_modes.fselector.opened){
            toggleFeslOn.apply($(fselector), [!0]);
            overlay_modes.fselector.opened = !!0;
        }

        init_friction();
        set_cursorpos(e);

        window.addEventListener("mousemove", mm, { passive: false });
    }, { passive: false });

    

    window.addEventListener("touchmove", function(e){
        if (illegal(e))
            return;
        e.preventDefault();
        onTouchMove(e, canvas, ctx);
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


    /**@type {{[key: string]: {pressing: boolean, _do: (arg0: MoveData) => MoveData, _leave: () => void}}} */
    var arrowkeyBehavs = {
        arrowup: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                moves.top += MOVEPROPERTY.arrowkeys.move;
                return moves;
            },
            _leave: function(){
                frict(0, MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval);
            },
        },
        arrowdown: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                moves.top += -MOVEPROPERTY.arrowkeys.move;
                return moves;
            },
            _leave: function(){
                frict(0, -MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval);
            },
        },
        arrowleft: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                moves.left += MOVEPROPERTY.arrowkeys.move;
                return moves;
            },
            _leave: function(){
                frict(MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval, 0);
            },
        },
        arrowright: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                moves.left += -MOVEPROPERTY.arrowkeys.move;
                return moves;
            },
            _leave: function(){
                frict(-MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval, 0);
            },
        },
    };

    
    /**@ts-ignore @type {NodeJS.Timeout} */
    var _ami = 0;
    function _arrowmoves(){
        clearInterval(_ami);
        _ami = setInterval(() => {
            /**@type {MoveData} */
            var _moves = { top: 0, left: 0 };
            for (const _key in arrowkeyBehavs){
                if (arrowkeyBehavs[_key].pressing)
                    _moves = arrowkeyBehavs[_key]._do(_moves);
            }
            moveMapAssistingNegative(canvas, ctx, _moves);
        }, MOVEPROPERTY.arrowkeys.interval);
    }
    function _stopArrowmoves(){
        clearInterval(_ami);
    }

    window.addEventListener("keydown", function(e){
        const key = e.key.toLowerCase();
        
        if (key in arrowkeyBehavs){
            var actives = 0;
            Object.keys(arrowkeyBehavs).forEach(o => { if (arrowkeyBehavs[o].pressing) actives++; })
            if (actives == 0){
                _arrowmoves();
            }

            arrowkeyBehavs[key].pressing = true;
        }
    });

    
    window.addEventListener("keyup", function(e){
        const key = e.key.toLowerCase();

        if (key in arrowkeyBehavs){
            arrowkeyBehavs[key].pressing = false;

            var actives = 0;
            Object.keys(arrowkeyBehavs).forEach(o => { if (arrowkeyBehavs[o].pressing) actives++; })
            if (actives == 0){
                _stopArrowmoves();
            }
        }
    });


    function wheel_move(e){
        if (illegal(e))
            return;
        clearInterval(tout);
        //@ts-ignore
        tout = setTimeout(() => {
            setBehavParam();
        }, href_replaceDuration);
        canvasonScroll(e, canvas);
    }

    function mm(e){
        e.preventDefault();
        map_wrapper.style.cursor = "move";
        Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
            p => {
                //@ts-ignore
                p.style.cursor = "move";
            }
        );
        DRAGGING = !0;
        onMouseMove(e, canvas, ctx);
    }

    function mouse_lost(e){
        e.preventDefault();
        pointerPosition = [ null, null ];
        window.removeEventListener("mousemove", mm);
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

        if (frictInterval !== null)
            clearInterval(frictInterval);

        var vx = vx0,
            vy = vy0,
            dxa = pointerVelocity.a*i(vx0),
            dya = pointerVelocity.a*i(vy0);

        if (isNaN(vx) || isNaN(vy))
            return 0;

        //@ts-ignore
        frictInterval = setInterval(() => {
            var ag = { top: vy/1000, left: vx/1000 };
            if (ag.top*vy0 <= 0) ag.top = 0;
            if (ag.left*vx0 <= 0) ag.left = 0;

            moveMapAssistingNegative(canvas, ctx, ag);

            vx += dxa;
            vy += dya;
            if (vx*vx0 <= 0 && vy*vy0 <= 0 && frictInterval !== null){
                //@ts-ignore
                tout = setTimeout(function(){
                    setBehavParam();
                }, href_replaceDuration)
                clearInterval(frictInterval);
            }
        }, 1);
        return 0;
    }


    document.body.addEventListener("mousemove", function(e){
        e.preventDefault();
        cursorPosition = [ e.clientX, e.clientY ];
    });


    function init_friction(){
        DRAGGING = false;
        if (frictInterval !== null)
            clearInterval(frictInterval);
        if (zoomFrictInterval !== null)
            clearInterval(zoomFrictInterval);
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
