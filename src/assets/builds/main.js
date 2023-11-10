!function(){
    
    "use strict";
    
    
    
    
    
    
    var pointerPosition = [ null, null ];
    
    var cursorPosition = [ null, null ];
    
    
    var DRAGGING = false;
    var zoomRatio = 1;
    
    
    
    
    const backcanvas = document.createElement("canvas");
    const bctx = backcanvas.getContext("2d");
    
    
    
    backcanvas.canvas = {
        coords: { 
            x: 0,
            y: 0,
        },
        rotation: 0,
    };
    
    
    
    const MOVEPROPATY = {
        scroll: 1.05,
        caps: {
            ratio: {
                max: Infinity, 
                min: NaN, 
            },
        },
        touch: {
            
            downCD: 1,
            rotate: {
                
                min: 15,
            }
        }
    };
    
    
    
    const pointerVelocity = { 
        x: 0, y: 0, v: 0, a: -150,
        method: null 
    };
    
    
    var frictInterval = null;
    
    
    
    var previousTouchDistance = { 
        x: -1, y: -1,
        distance: -1 
    };
    
    
    var prevTouchINFO = {};
    
    
    
    var rotatedThisTime = 0;
    
    var totalRotateThisTime = 0;
    
    var pastRotateMin = false;
    
    var prevTheta = 0;
    
    
    var touchCD = 0;
    
    
    
    "use strict";
    
    
    
    
    
    function formatString(str, ...args){
        for (const [i, arg] of args.entries()){
            const regExp = new RegExp(`\\{${i}\\}`, "g");
            str = str.replace(regExp, arg);
        }
        return str;
    }
    
    
    
    function toRadians(deg){
        return deg*(Math.PI/180);
    }
    
    
    
    function toDegrees(rad){
        return rad*(180/Math.PI)
    }
    
    
    
    function avg(...n){
        var t = 0;
        n.forEach(i => {
            t += i;
        });
        return t/n.length;
    }
    
    
    
    "use strict";
    
    
    
    async function drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height, src_formatter, callback){
        
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
            if (typeof callback === "function")
                callback(al);
        }).then(() => {
            window.scroll({ top: 0, behavior: "instant" });
        });
    }
    
    
    
    
    
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
    
    
    
    "use strict";
    
    
    
    
    
    
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
    
    
    
    function getThouchesTheta(touches){
        const abs = Math.abs,
              sqrt = Math.sqrt,
              pow = Math.pow;
        
        const t1 = [touches[0].clientX, window.innerHeight - touches[0].clientY],
              
              t2 = [touches[1].clientX, window.innerHeight - touches[1].clientY];
        const S = [t1, t2];
    
        const distance = abs(sqrt(pow(S[0][0] - S[1][0], 2) + pow(S[0][1] - S[1][1], 2)));
        const sinTheta = (1 / distance)*(S[1][1] - S[0][1]);
        const cosTheta = (1 / distance)*(S[1][0] - S[0][0]);
    
        
        var theta = Math.acos(cosTheta);
        
        if (sinTheta < 0){
            theta = 2*Math.PI - theta;
        }
        
        if (Math.abs(theta - prevTheta) > Math.PI/2){
    
        }
        return theta;
    }
    
    
    
    function setPrevTouches(touches){
        prevTouchINFO.touches = [];
        for (var t of touches){
            prevTouchINFO.touches.push({
                x: t.clientX,
                y: t.clientY
            });
            prevTouchINFO.real = touches;
        }
    }
    
    
    
    function getMiddlePosForZoom(touches){
        const S = [[touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]];
        
        const middle = [S[0][0] + S[1][0] / 2, S[1][1] + S[0][1] / 2];
        return middle;
    }
    
    
    
    function touchDistance(t1, t2){
        return Math.abs(
            Math.sqrt(
                (t1.clientX - t2.clientX)**2 + (t1.clientY - t2.clientY)**2
            )
        );
    }
    
    
    window.addEventListener("load", function(e){
        
        "use strict";
        
        
        
        
        
        !function(){
            
            const map_wrapper = document.getElementById("shishiji-view");
            
            const canvas = document.getElementById("shishiji-canvas");
            
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
                canvasonScroll(e, this);
            }
        
            function mm(e){
                DRAGGING = !0;
                onMouseMove(e, this, this.getContext("2d"));
            }
        
            function mouse_lost(e){
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
                cursorPosition = [e.clientX, e.clientY];
            });
        
        
            function init_friction(){
                DRAGGING = false;
                if (frictInterval !== null)
                    clearInterval(frictInterval);
            }
            
            function initTouch(e){
                touchCD = 0;
                totalRotateThisTime = 0;
                rotatedThisTime = 0;
                prevTheta = -1;
                previousTouchDistance = { x: -1, y: -1, distance: -1 };
                if (e.touches.length < 2)
                    pastRotateMin = false;
            }
            return 0;
        }();
        
        
        
        function set_cursorpos(y){
            if (y instanceof TouchList)
                pointerPosition = get_middlePos(y);
            else
                pointerPosition = [ y.clientX, y.clientY ];
        }
        
        
        
        function setTheta(touches){
            prevTheta = getThouchesTheta(touches);
        }
        
        
        
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
                
                var transorigin = [];
                for (var i = 0; i < 2; i++){
                    transorigin.push(
                        (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
                    );
                }
                backcanvas.canvas.coords = { x: transorigin[0], y: transorigin[1] };
            }
            backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
        
            _redraw(canvas, ctx, backcanvas,
                backcanvas.canvas.coords.x, backcanvas.canvas.coords.y, backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
            );
        }
        
        
        
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
                backcanvas.canvas.coords = { x: transorigin[0], y: transorigin[1] };
            }
            backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backcanvas,
                backcanvas.canvas.coords.x, backcanvas.canvas.coords.y, backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
            );
        }
        
        
        
        function _redraw(canvas, ctx, image, sx, sy, sw, sh, dx, dy, dw, dh){
            
            const canvasCoords = [sx, sy];
            
            var transCoords;
            
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
                args = [sx, sy, sw, sh, dx, dy, dw, dh];
            }
        
            
            ctx.drawImage(image, ...args);
        }
        
        
        
        function rotateCanvas(canvas, ctx, origin, absRotation){
            if (absRotation === void 0){
                absRotation = backcanvas.canvas.rotation;
            }
            
        }
        
        
        
        
        const log = document.getElementById("log");
        function LOG(...str){
            if (log!=null)
            log.innerHTML += str.join(" ")+"<br>";
        }
        function _LOG(...str){
            if (log!=null)
            log.innerHTML = str.join(" ")+"<br>";
        }
        
        window.onerror = (e, url, linenumber)=>{_LOG(e, url, linenumber)}
        
        
        
        
        
        function onTouchMove(event, canvas, ctx){
            const touches = event.touches;
            const pos = get_middlePos(touches);
            const prevp = pointerPosition;
        
            const prevMiddle = prevTouchINFO.middle;
        
        
            pointerPosition = pos;
        
        
            if (touchCD < MOVEPROPATY.touch.downCD){
                touchCD++;
                return;
            }
        
        
            if (touches.length >= 2 && prevTouchINFO.touches !== void 0 && prevTouchINFO.touches.length >= 2){
                const abs = Math.abs;
        
                
                const Fx = {
                    previous: {
                        slope: (prevTouchINFO.touches[0].y - prevTouchINFO.touches[1].y) / (prevTouchINFO.touches[0].x - prevTouchINFO.touches[1].x),
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
        
                if (Fx.previous.slope == Fx.this.slope || true ){
                    var D1 = touches[0].clientX - prevTouchINFO.touches[0].x;
                    var D2 = touches[1].clientX - prevTouchINFO.touches[1].x;
        
                    (D1 === 0 && D2 === 0 || D1+D2 == 0) ? D1 = D2 = 1 : 0;
        
                    var R = D1 / (abs(D1) + abs(D2));
        
                    
                    var addD1x = abs(touches[0].clientX - touches[1].clientX) * R;
                    var addD1y = abs(touches[0].clientY - touches[1].clientY) * R;
        
                    var middle = {
                        x: touches[0].clientX + addD1x,
                        y: touches[0].clientY + addD1y,
                    };
                    
                    prevTouchINFO.middle = middle;
        
                    
                    
                    document.getElementById("middle-pointer").style.left = middle.x-3+"px";
                    
                    document.getElementById("middle-pointer").style.top = middle.y-3+"px";
                    
        
        _LOG(JSON.stringify(middle))
        
                    
                    zoomMapAssistingNegative(canvas, ctx, diffRatio, [ middle.x, middle.y ]);
                }
        
        
                
                const PI = Math.PI;
                const theta = getThouchesTheta(event.touches);
                
                
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
                    backcanvas.canvas.rotation += rotation;
                    const middle = getMiddlePosForZoom(touches);
                }
        
                rotatedThisTime += rotation;
            
            } else {
                pastRotateMin = false;
                rotatedThisTime = 0;
                totalRotateThisTime = 0;
                prevTheta = -1;
            }
        
        
            if (!prevp.some(i => i === null)){
                if (touches.length == 1){
                    
                    const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
                    moveMapAssistingNegative(canvas, ctx, map_move);
                } else {
                    if (prevMiddle !== void 0){
                           /* moveMapAssistingNegative(canvas, ctx, {
                                left: prevTouchINFO.middle.x - prevMiddle.x,
                                top: prevTouchINFO.middle.y - prevMiddle.y,
                            });*/
                    }
                }
            }
        
            setPrevTouches(touches);
        }
        
        
        
        function canvasonScroll(e, canvas){
            var delta = MOVEPROPATY.scroll * 1;
            if (e.deltaY > 0)
                delta = 1/delta;
            
            zoomMapAssistingNegative(canvas, canvas.getContext("2d"), delta, cursorPosition);
        }
        
        
        
        function onMouseMove(e, canvas, ctx){
            
            const pos = [e.clientX, e.clientY];
            
            const moved = { left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1] };
        
            moveMapAssistingNegative(canvas, ctx, moved);
            pointerPosition = pos;
        }
        
    });
    window.addEventListener("load", function(e){
        
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
