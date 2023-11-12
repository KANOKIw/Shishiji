!function() {
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("./shishiji-dts/motion").Position} Position
     * @typedef {import("./shishiji-dts/motion").BackCanvas} BackCanvas
     * @typedef {import("./shishiji-dts/motion").Distance} Distance
     * @typedef {import("./shishiji-dts/motion").Coords} Coords
     * @typedef {import("./shishiji-dts/motion").touchINFO} touchINFO
     */
    
    
    /**@type {Position} */
    var pointerPosition = [ null, null ];
    /**@type {Position} */
    var cursorPosition = [ null, null ];
    
    
    var DRAGGING = false;
    var zoomRatio = 1;
    
    
    /**
     * @type {BackCanvas} 
     * @readonly
     *@ts-ignore*/
    const backcanvas = document.createElement("canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const bctx = backcanvas.getContext("2d");
    
    
    //@ts-ignore
    backcanvas.canvas = {
        coords: { 
            x: 0,
            y: 0,
        },
        rotation: 0,
    };
    
    
    /**
     * limit map motion and set magnification of any
     * @readonly
     */
    const MOVEPROPATY = {
        scroll: 1.05,
        caps: {
            ratio: {
                max: Infinity, // dev
                min: NaN, // dev
            },
        },
        touch: {
            /**
             * how many events to wait before start moving 
             * !high value prevents insta scrolling! (makes more likely to iPhone map tho)
             * @fix
             *   do by velocity
             */
            downCD: 1,
            zoomCD: -1,
            rotate: {
                // degree
                min: 15,
            }
        }
    };
    
    
    /**
     * velocities are assigned with (px/sec)
     * @type {{ x: number, y: number, v: number, a: number, method: "MOUSE" | "TOUCH" | null }}
     */
    const pointerVelocity = { 
        x: 0, y: 0, v: 0, a: -150,
        method: null 
    };
    
    /**@type {number | null} */
    var frictInterval = null;
    
    
    /**@type {Distance} */
    var previousTouchDistance = { 
        x: -1, y: -1,
        distance: -1 
    };
    /**@type {touchINFO} */
    //@ts-ignore
    var prevTouchINFO = {};
    
    
    /**
     * relative radian
     * assign on touch move
     * @type {Radian} 
     */
    var rotatedThisTime = 0;
    /**
     * rotated amount of one pitch time use to limit start of rotation
     * init once when passed min
     * @see {MOVEPROPATY.touch.rotate.min}
     * @type {Radian}
     */
    var totalRotateThisTime = 0;
    /**
     * mark rotatedThisTime has been bigger than min even once
     */
    var pastRotateMin = false;
    /**
     * @type {Radian} 
     */
    var prevTheta = 0;
    
    /**
     * use to make smooth map interaction.
     * not map moved, swiping instantly cause proble.
     * init on touch down
     */
    var touchCD = 0;
    var zoomCD = 0;
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("./shishiji-dts/motion").Degree} Degree
     */
    
    /**
     * 
     * @param {string} str 
     * @param  {any[]} args 
     * @returns {string}
     */
    function formatString(str, ...args){
        for (const [i, arg] of args.entries()){
            const regExp = new RegExp(`\\{${i}\\}`, "g");
            str = str.replace(regExp, arg);
        }
        return str;
    }
    
    
    /**
     * deg -> rad
     * @param {Degree} deg 
     * @returns {Radian}
     */
    function toRadians(deg){
        return deg*(Math.PI/180);
    }
    
    
    /**
     * rad -> deg
     * @param {Degree} rad 
     * @returns {Radian}
     */
    function toDegrees(rad){
        return rad*(180/Math.PI)
    }
    
    
    /**
     * 
     * @param  {...number} n 
     * @returns {number}
     */
    function avg(...n){
        var t = 0;
        n.forEach(i => {
            t += i;
        });
        return t/n.length;
    }
    
    
    /**
     * @param {NonnullPosition} backcanvasPos 
     */
    function toCanvasPos(backcanvasPos){
        var u = backcanvasPos.map(k => {
            
        });
    }
    
    //@ts-check
    "use strict";
    
    
    /**
     * Draw tiles
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} xrange 
     * @param {number} yrange 
     * @param {number} tile_width 
     * @param {number} tile_height 
     * @param {string} src_formatter 
     * @param {Function} [callback]
     * @returns {Promise<any>}
     *   callbacked promise
     */
    async function drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height, src_formatter, callback){
        /**@type {HTMLImageElement[]} */
        var al = [];
        return new Promise((resolve, reject) => {
            for (var y = 0; y <= yrange; y++){
                for (var x=0; x <= xrange; x++){
                    var dh = tile_width,
                        dw = tile_height,
                        dx = dw*x,
                        dy = dh*y;
    
                    !function(x, y, dx, dy, dw, dh){
                        var img = new Image();
    
                        img.onload = function(){
                            //@ts-ignore
                            this.loaded = true;
                            bctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                            ctx.drawImage(backcanvas, ...[ backcanvas.canvas.coords.x ,backcanvas.canvas.coords.y ]);
                            al.push(img);
                            if (al.length >= (xrange+1)*(yrange+1))
                                resolve("canvas loaded");
                        }
    
                        img.src = formatString(src_formatter, y, x);
    
                        return 0;
                    }(x, y, dx, dy, dw, dh);
                }
            }
        }).then(() => {
            window.scroll({ top: 0, behavior: "instant" });
            
            if (typeof callback === "function")
                callback(al);
        });
    }
    
    
    
    //@ts-check
    "use strict";
    
    
    
    !function(){
        !function(){
            var prevEvent,
                currentEvent;
    
            document.documentElement.addEventListener("mousemove", function(event){
                pointerVelocity.method = "MOUSE";
                currentEvent = event;
            });
        
            setInterval(function(){
                var movementX = 0;
                var movementY = 0;
                var movement = 0;
    
                if (prevEvent && currentEvent){
                    var movementX = currentEvent.screenX - prevEvent.screenX;
                    var movementY = currentEvent.screenY - prevEvent.screenY;
                    var movement = Math.sqrt(movementX*movementX + movementY*movementY);
                }
                
                prevEvent = currentEvent;
    
                if (pointerVelocity.method == "MOUSE"){
                    pointerVelocity.x = 100*movementX;
                    pointerVelocity.y = 100*movementY;
                    pointerVelocity.v = 100*movement;
                }
            }, 20);
            return 0;
        }();
        
        !function(){
            var wait_o2 = 0;
            /**@type {NodeJS.Timeout} */
            var t;
    
            function g(t){
                var k = 0;
                var r = 0;
                for (var w  of t){
                    k += w.clientX;
                    r += w.clientY;
                }
                k /= t.length;
                r /= t.length;
                return {x: k, y: r};
            }
    
            var prevEvent,
                currentEvent;
    
            document.documentElement.addEventListener("touchmove", function(event){
                pointerVelocity.method = "TOUCH";
                currentEvent = event;
            });
        
            setInterval(function(){
                var movementX = 0;
                var movementY = 0;
                var movement = 0;
    
    
                if (currentEvent && currentEvent.touches.length >= 2){
                    wait_o2 = 1;
                    if (t)
                        clearTimeout(t);
                    t = setTimeout(()=>{
                        wait_o2 = 0;
                    }, 250);
                }
    
                if (prevEvent && currentEvent && currentEvent.touches.length == 1 && wait_o2 === 0){
                    var p = g(currentEvent.touches),
                        j = g(prevEvent.touches);
                    movementX = p.x - j.x;
                    movementY = p.y - j.y;
                    movement = Math.sqrt(movementX*movementX + movementY*movementY);
                }
                
                prevEvent = currentEvent;
    
                if (pointerVelocity.method == "TOUCH"){
                    pointerVelocity.x = 100*movementX;
                    pointerVelocity.y = 100*movementY;
                    pointerVelocity.v = 100*movement;
                }
            }, 20);
            return 0;
        }();
        return 0;
    }();
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("./shishiji-dts/motion").NonnullPosition} NonnullPosition
     */
    
    
    /**
     * 
     * @param {TouchList} touches 
     * @returns {number}
     */
    function get_midestOfTouches(touches){
        if (touches.length == 1)
            return 0;
    
        var amx = 0;
        var amy = 0;
        var am = 0;
    
        for (var touch of Array.from(touches)){
            amx += touch.clientX;
            amy += touch.clientY;
        }
    
        const middle = {x: amx/touches.length, y: amy/touches.length};
    
        for (var touch of Array.from(touches)){
            const dis = Math.abs(Math.sqrt((touch.clientX - middle.x)**2 
                + (touch.clientY - middle.y)**2));
            am += dis;
        }
        return 2*am/touches.length;
    }
    
    
    /**
     * 
     * @param {TouchList} touches 
     * @returns {NonnullPosition}
     */
    function get_middlePos(touches){
        var av_x = 0;
        var av_y = 0;
        for (var t  of touches){
            av_x += t.clientX;
            av_y += t.clientY;
        }
        av_x /= touches.length;
        av_y /= touches.length;
        return [av_x, av_y];
    }
    
    
    /**
     * get vertical tilt from touches[0:2]
     * @param {TouchList} touches 
     * @returns {Radian}
     */
    function getThouchesTheta(touches){
        const abs = Math.abs,
              sqrt = Math.sqrt,
              pow = Math.pow;
        /**@type {NonnullPosition} */
        const t1 = [touches[0].clientX, window.innerHeight - touches[0].clientY],
              /**@type {NonnullPosition} */
              t2 = [touches[1].clientX, window.innerHeight - touches[1].clientY];
        const S = [t1, t2];
    
        const distance = abs(sqrt(pow(S[0][0] - S[1][0], 2) + pow(S[0][1] - S[1][1], 2)));
        const sinTheta = (1 / distance)*(S[1][1] - S[0][1]);
        const cosTheta = (1 / distance)*(S[1][0] - S[0][0]);
    
        /**@type {Radian} */
        var theta = Math.acos(cosTheta);
        
        if (sinTheta < 0){
            theta = 2*Math.PI - theta;
        }
        // about 1/2
        if (Math.abs(theta - prevTheta) > Math.PI/2){
    
        }
        return theta;
    }
    
    
    /**
     * 
     * @param {TouchList} touches 
     */
    function savePrevTouches(touches){
        prevTouchINFO.touches = [];
        for (var t of touches){
            prevTouchINFO.touches.push({
                x: t.clientX,
                y: t.clientY
            });
            prevTouchINFO.real = Array.from(touches);
        }
    }
    
    
    /**
     * get middle position between touches[0:2]
     * @param {TouchList} touches 
     * @returns {NonnullPosition}
     */
    function getMiddlePosForZoom(touches){
        const S = [[touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]];
        /**@type {NonnullPosition} */
        const middle = [S[0][0] + S[1][0] / 2, S[1][1] + S[0][1] / 2];
        return middle;
    }
    
    
    /**
     * @param {Touch} t1 
     * @param {Touch} t2 
     * @returns {number}
     */
    function touchDistance(t1, t2){
        return Math.abs(
            Math.sqrt(
                (t1.clientX - t2.clientX)**2 + (t1.clientY - t2.clientY)**2
            )
        );
    }
    
    window.addEventListener("load", function(e) {
        //@ts-check
        "use strict";
        
        
        /**
         * @typedef {import("./shishiji-dts/motion").Position} _Position
         * @typedef {import("./shishiji-dts/motion").Radian} Radian
         */
        
        
        !function(){
            /** @ts-ignore @type {HTMLCanvasElement}*/
            const map_wrapper = document.getElementById("shishiji-view");
            /** @ts-ignore @type {HTMLCanvasElement}*/
            const canvas = document.getElementById("shishiji-canvas");
            /** @ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = canvas.getContext("2d");
        
        
        
            canvas.addEventListener("touchstart", (e) => {
                e.preventDefault();
                init_friction();
                initTouch(e);
                set_cursorpos(e.touches);
        
                if (e.touches.length >= 2)
                    setTheta(e.touches);
            });
            canvas.addEventListener("mousedown", (e) => {
                e.preventDefault();
                init_friction();
                set_cursorpos(e);
        
                canvas.addEventListener("mousemove", mm);
                map_wrapper.style.cursor = "move";
            });
        
            
        
            canvas.addEventListener("touchmove", function(e){
                e.preventDefault();
                onTouchMove(e, this, ctx);
            });
        
        
        
            canvas.addEventListener("touchend", (e) => {
                e.preventDefault();
                initTouch(e);
                DRAGGING = false;
                pointerPosition = [ null, null ];
                frict(pointerVelocity.x, pointerVelocity.y);
            });
            canvas.addEventListener("mouseup", mouse_lost);
            canvas.addEventListener("mouseleave", mouse_lost);
            canvas.addEventListener("mouseout", mouse_lost);
        
        
        
            canvas.addEventListener("wheel", wheel_move);
            canvas.addEventListener("mousewheel", wheel_move);
        
        
        
            function wheel_move(e){
                e.preventDefault();
                canvasonScroll(e, this);
            }
        
            function mm(e){
                e.preventDefault();
                DRAGGING = !0;
                onMouseMove(e, this, this.getContext("2d"));
            }
        
            function mouse_lost(e){
                e.preventDefault();
                pointerPosition = [ null, null ];
                canvas.removeEventListener("mousemove", mm);
                map_wrapper.style.cursor = "default";
        
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
                    var ag = {top: vy/1000, left: vx/1000};
                    if (ag.top*vy0 <= 0) ag.top = 0;
                    if (ag.left*vx0 <= 0) ag.left = 0;
                    moveMapAssistingNegative(canvas, ctx, ag);
                    vx += dxa;
                    vy += dya;
                    if (vx*vx0 <= 0 && vy*vy0 <= 0 && frictInterval !== null)
                        clearInterval(frictInterval);
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
        
        
        /**
         * 
         * @param {TouchList | MouseEvent} y 
         */
        function set_cursorpos(y){
            if (y instanceof TouchList)
                pointerPosition = get_middlePos(y);
            else
                pointerPosition = [ y.clientX, y.clientY ];
        }
        
        
        /**
         * 
         * @param {TouchList} touches 
         */
        function setTheta(touches){
            prevTheta = getThouchesTheta(touches);
        }
        
        
        /**
         * 
         * @param {HTMLCanvasElement} canvas 
         * @param {CanvasRenderingContext2D} ctx 
         * @param {{top: number, left: number}} moved
         */
        function moveMapAssistingNegative(canvas, ctx, moved){
            const x = backcanvas.canvas.coords.x - moved.left/zoomRatio;
            const y = backcanvas.canvas.coords.y - moved.top/zoomRatio;
        
            backcanvas.canvas.coords = { x: x, y: y };
            backcanvas.canvas.width = canvas.width/zoomRatio;
            backcanvas.canvas.height = canvas.height/zoomRatio;
        
            _redraw(canvas, ctx, backcanvas,
                ...[ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ],
                backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
            );
        }
        
        
        /**
         * @deprecated use moveMapAssistingNegative instead for safari support
         * @param {HTMLCanvasElement} canvas 
         * @param {CanvasRenderingContext2D} ctx 
         * @param {{top: number, left: number}} moved
         */
        function moveMap(canvas, ctx, moved){
            const x = backcanvas.canvas.coords.y-moved.left/zoomRatio;
            const y = backcanvas.canvas.coords.x-moved.top/zoomRatio;
        
            backcanvas.canvas.coords = { x: x, y: y }; 
            backcanvas.canvas.width = canvas.width/zoomRatio;
            backcanvas.canvas.height = canvas.height/zoomRatio;
        
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backcanvas, backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
                backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
            );
        }
        
        
        /**
         * 
         * @param {HTMLCanvasElement} canvas 
         * @param {CanvasRenderingContext2D} ctx 
         * @param {number} ratio 
         * @param {[number, number]} origin
         *   (cursorPosition)
         * @param {[number, number]} [pos]
         * @param {boolean} [forceRatio] 
         */
        function zoomMapAssistingNegative(canvas, ctx, ratio, origin, pos, forceRatio){
            if (MOVEPROPATY.caps.ratio.max < zoomRatio && ratio > 1
                || MOVEPROPATY.caps.ratio.min > zoomRatio && ratio < 1
                ) return;
        
            if (pos === void 0)
                pos = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
        
            if (forceRatio)
                zoomRatio = ratio;
            else
                zoomRatio *= ratio;
        
            if (origin.length == 2 && ratio != 1){
                /**@type {number[]} */
                var transorigin = [];
                for (var i = 0; i < 2; i++){
                    transorigin.push(
                        (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
                    );
                }
                backcanvas.canvas.coords = {
                    x: transorigin[0],
                    y: transorigin[1]
                };
            }
            backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
        
            _redraw(canvas, ctx, backcanvas,
                backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
                backcanvas.canvas.width, backcanvas.canvas.height,
                0, 0, canvas.width, canvas.height,
            );
        }
        
        
        /**
         * @deprecated use zoomMapAssistingNegative instead for safari support
         * @param {HTMLCanvasElement} canvas 
         * @param {CanvasRenderingContext2D} ctx 
         * @param {number} ratio 
         * @param {[number, number]} origin
         *   (cursorPosition)
         * @param {[number, number] | undefined} pos
         */
        function moveMap(canvas, ctx, ratio, origin, pos){
            if (MOVEPROPATY.caps.ratio.max < zoomRatio && ratio > 1
                || MOVEPROPATY.caps.ratio.min > zoomRatio && ratio < 1
                ) return;
        
            if (pos === void 0)
                pos = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
        
            zoomRatio *= ratio;
        
            if (origin.length == 2 && ratio != 1){
                var transorigin = [];
                for (var i = 0; i < 2; i++){
                    transorigin.push(
                        (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
                    );
                }
                backcanvas.canvas.coords = {
                    x: transorigin[0],
                    y: transorigin[1]
                };
            }
            backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backcanvas,
                backcanvas.canvas.coords.x, backcanvas.canvas.coords.y, backcanvas.canvas.width, backcanvas.canvas.height,
                0, 0, canvas.width, canvas.height,
            );
        }
        
        
        /**
         * iOS browser doesn't get empty of backcanvas.
         * Fill empty in main canvas when caught negative coords.
         * 
         * USE:: `_redraw(canvas, ctx, backcanvas,
         *      backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
         *      backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height);`
         * @param {HTMLCanvasElement} canvas 
         * @param {CanvasRenderingContext2D} ctx 
         * @param {CanvasImageSource} image 
         * @param {number} sx 
         * @param {number} sy 
         * @param {number} sw 
         * @param {number} sh 
         * @param {number} dx 
         * @param {number} dy 
         * @param {number} dw 
         *   canvas width
         * @param {number} dh 
         *   canvas height
         */
        function _redraw(canvas, ctx, image, sx, sy, sw, sh, dx, dy, dw, dh){
            /**@type {_Position} */
            const canvasCoords = [sx, sy];
            /**@type {NonnullPosition} */
            var transCoords;
            /**@type {number[]} */
            var args;
        
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            if (sx < 0 || sy < 0){
                transCoords = canvasCoords.map(
                    n => { return -n; }
                );
                args = [
                    0, 0,
                    backcanvas.canvas.width - transCoords[0],
                    backcanvas.canvas.height - transCoords[1],
                    transCoords[0]*zoomRatio,
                    transCoords[1]*zoomRatio,
                    dw - transCoords[0]*zoomRatio,
                    dh - transCoords[1]*zoomRatio
                ];
            } else {
                args = [ sx, sy, sw, sh, dx, dy, dw, dh ];
            }
        
            //@ts-ignore
            ctx.drawImage(image, ...args);
        }
        
        
        /**
         * 
         * @param {HTMLCanvasElement} canvas 
         * @param {CanvasRenderingContext2D} ctx 
         * @param {NonnullPosition} origin 
         * @param {number} [rotation] 
         */
        function rotateCanvas(canvas, ctx, origin, rotation){
            if (rotation === void 0){
                rotation = backcanvas.canvas.rotation;
            }
            
            /*var d = backcanvas.toDataURL();
            var _img = new Image();
            _img.src = d;
            bctx.clearRect(0, 0, backcanvas.width, backcanvas.height);
            bctx.translate(origin[0] * zoomRatio, origin[1] * zoomRatio);
            bctx.rotate(rotation);
            bctx.translate(-origin[0] * zoomRatio, -origin[1] * zoomRatio);
            
            _img.onload = function(e){
                bctx.drawImage(_img, 0, 0);
            }*/
        
            _redraw(canvas, ctx, backcanvas, backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
                backcanvas.canvas.width, backcanvas.canvas.height,
                0, 0, canvas.width, canvas.height
            );
        
            backcanvas.canvas.rotation += rotation;
        }
        
        
        
        /**
         * 
         * @param {TouchEvent} event 
         * @param {HTMLCanvasElement} canvas 
         * @param {CanvasRenderingContext2D} ctx 
         */
        function onTouchMove(event, canvas, ctx){
            const touches = event.touches;
            const pos = get_middlePos(touches);
            const prevp = pointerPosition;
        
            /**@type {NonnullPosition} */
            var crossPos = [ -1, -1 ];
        
        
            pointerPosition = pos;
        
        
            if (touchCD < MOVEPROPATY.touch.downCD){
                touchCD++;
                return;
            }
            
        
            if (touches.length >= 2 && prevTouchINFO.real !== void 0 && prevTouchINFO.real.length >= 2){
                const abs = Math.abs;
        
                zoomCD++;
        
                /**@graph */
                const Fx = {
                    previous: {
                        slope: (prevTouchINFO.real[0].clientY - prevTouchINFO.real[1].clientY) / (prevTouchINFO.real[0].clientX - prevTouchINFO.real[1].clientX),
                    },
                    this: {
                        slope: (touches[0].clientY - touches[1].clientY) / (touches[0].clientX - touches[1].clientX),
                    }
                };
        
                const distance = get_midestOfTouches(touches);
                var diffRatio = distance / previousTouchDistance.distance;
        
                if (previousTouchDistance.x == -1 && previousTouchDistance.y == -1 && previousTouchDistance.distance == -1){
                    diffRatio = 1;
                }
        
                previousTouchDistance.distance = distance;
        
                //#region 
                if (Fx.previous.slope == Fx.this.slope){
                    var D1 = touches[0].clientX - prevTouchINFO.touches[0].x;
                    var D2 = touches[1].clientX - prevTouchINFO.touches[1].x;
        
                    (D1 === 0 && D2 === 0 || D1 + D2 == 0) ? D1 = D2 = 1 : 0;
        
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
                    
                    crossPos = [ Math.ceil(crossX), Math.ceil(crossY) ];
        
                    if (!crossPos.some(t => { return isNaN(t) })) 0;
                }
                //#endregion
        
        
                //#region 
                const x1d = prevTouchINFO.real[0].clientX * diffRatio;
                const y1d = prevTouchINFO.real[0].clientY * diffRatio;
        
                const diffx = touches[0].clientX - x1d;
                const diffy = touches[0].clientY - y1d;
        
        
                if (zoomCD > MOVEPROPATY.touch.zoomCD){
                    zoomMapAssistingNegative(canvas, ctx, diffRatio, [0, 0]);
                    moveMapAssistingNegative(canvas, ctx, {
                        top: diffy,
                        left: diffx
                    });
                }
                //#endregion
        
        
                //#region 
                const PI = Math.PI;
                const theta = getThouchesTheta(event.touches);
                
                /**@type {Radian} */
                var rotation;
        
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
        
        
                if (Math.abs(rotatedThisTime) > toRadians(MOVEPROPATY.touch.rotate.min) || pastRotateMin){
                    if (!pastRotateMin){
                        rotatedThisTime -= toRadians(MOVEPROPATY.touch.rotate.min);
                    }
                    pastRotateMin = !0;
                    if (zoomCD > MOVEPROPATY.touch.zoomCD)
                        rotateCanvas(canvas, ctx, crossPos, Math.PI/4);
                }
                
        
                rotatedThisTime += rotation;
                //#endregion
            } else {
                pastRotateMin = false;
                rotatedThisTime = 0;
                totalRotateThisTime = 0;
                prevTheta = -1;
                zoomCD = 0;
                prevTouchINFO.cross = [ -1, -1 ];
            }
        
        
            if (!prevp.some(t => t === null) && touches.length == 1){
                //@ts-ignore
                const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
                moveMapAssistingNegative(canvas, ctx, map_move);
            }
        
            prevTouchINFO.cross = crossPos;
            savePrevTouches(touches);
        }
        
        
        /**
         * zoom canvas by scrolling mouse wheel
         * @param {WheelEvent} e 
         * @param {HTMLCanvasElement} canvas 
         */
        function canvasonScroll(e, canvas){
            var delta = MOVEPROPATY.scroll * 1;
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
        
    });
    window.addEventListener("load", function(e) {
        //@ts-nocheck
        "use strict";
        
        
        
        function set_canvassize(){
            const canvas = document.getElementById("shishiji-canvas");
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
            backcanvas.canvas.width = canvas.width;
            backcanvas.canvas.height = canvas.height;
        }
        
        
        !function(){
            const canvas = document.getElementById("shishiji-canvas");
            const ctx = canvas.getContext("2d");
            const tile_width = 500;
            const tile_height = 500;
            const xrange = 3;
            const yrange = 1;
        
        
            set_canvassize();
            
            backcanvas.width = tile_width*(xrange+1);
            backcanvas.height = tile_height*(yrange+1);
        
            drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
                "/resources/map_divided/dokoka/tile_{0}_{1}.png", callback);
        
            function callback(){
                
            }
            return 0;
        }();
        
        
        window.addEventListener("resize", function(e){
            const canvas = document.getElementById("shishiji-canvas");
            set_canvassize();
            moveMapAssistingNegative(canvas, canvas.getContext("2d"), {top: 0, left: 0});
            window.scroll({ top: 0, behavior: "instant" });
        }, { passive: false });
        
        
        window.addEventListener("gesturestart", function(e){
            e.preventDefault();
        });
        
        
        window.addEventListener("load", function(e){
            window.scroll({ top: 0, behavior: "instant" });
        });
        
    });
    
}();
