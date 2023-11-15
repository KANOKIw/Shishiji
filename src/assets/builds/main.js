!function() {
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("./shishiji-dts/motion").Position} Position
     * @typedef {import("./shishiji-dts/motion").BackCanvas} BackCanvas
     * @typedef {import("./shishiji-dts/motion").Distance} Distance
     * @typedef {import("./shishiji-dts/motion").Coords} Coords
     * @typedef {import("./shishiji-dts/motion").touchINFO} touchINFO
     * @typedef {import("./shishiji-dts/objects").mapObjComponent} mapObjComponent
     * 
     * @typedef {import("socket.io").Socket} Socket
     */
    
    
    /**@type {Position} */
    var pointerPosition = [ null, null ];
    /**@type {Position} */
    var cursorPosition = [ null, null ];
    
    
    /**@ts-ignore @type {Socket} */
    const ws = io();
    
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
    var pointerVelocity = { 
        x: 0, y: 0, v: 0, a: -150,
        method: null 
    };
    
    var touchZoomVelocity = {
        0: {
            x: 0,
            y: 0,
        },
        1: {
            x: 0,
            y: 0,
        },
        a: -150,
    };
    
    /**@type {number | null} */
    var frictInterval = null;
    /**@type {number | null} */
    var zoomFrictInterval = null;
    
    
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
    
    
    
    var Intervals = {
        raise: 0,
        reduce: 0,
    }
    
    
    /**@type {mapObjComponent} */
    var mapObjectComponent = {};
    
    
    /**
     * Minecraft formatting system
     */
    const ColorList = {
        "0": "#000000",  // Black
        "1": "#0000AA",  // Dark Blue
        "2": "#00AA00",  // Dark Green
        "3": "#00AAAA",  // Dark Aqua
        "4": "#AA0000",  // Dark Red
        "5": "#AA00AA",  // Dark Purple
        "6": "#FFAA00",  // Gold
        "7": "#AAAAAA",  // Gray
        "8": "#555555",  // Dark Gray
        "9": "#5555FF",  // Blue
        "a": "#55FF55",  // Green
        "b": "#55FFFF",  // Aqua
        "c": "#FF5555",  // Red
        "d": "#FF55FF",  // Light Purple
        "e": "#FFFF55",  // Yellow
        "f": "#FFFFFF",  // White
    };
    const Dec = {
        "k": 'class="--mcf-obfuscated"',
        "l": 'style="font-weight: bolder;"',
        "m": 'style="text-decoration: line-through;"',
        "n": 'style="text-decoration: underline;"',
        "o": 'style="font-style: italic;"',
        "p": 'style=""',
    };
    const Color = {
        BLACK: "§0",
        DARK_BLUE: "§1",
        DARK_GREEN: "§2",
        DARK_AQUA: "§3",
        DARK_RED: "§4",
        DARK_PURPLE: "§5",
        GOLD: "§6",
        GRAY: "§7",
        DARK_GRAY: "§8",
        BLUE: "§9",
        GREEN: "§a",
        AQUA: "§b",
        RED: "§c",
        LIGHT_PURPLE: "§d",
        YELLOW: "§e",
        WHITE: "§f",
        MAGIC: "§k",
        BOLD: "§l",
        STRIKETHROUGH: "§m",
        UNDERLINE: "§n",
        ITALIC: "§o",
        RESET: "§r",
    };
    
    
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
    
    
    /**
     * 
     * @param {mapObjectElement} elm 
     * @returns {Coords}
     */
    function getCoords(elm){
        /**@ts-ignore @type {number[]} */
        const r = elm.getAttribute("coords")?.split(" ").map(t => { return Number(t); });
        return { x: r[0], y: r[1] };
    }
    
    
    /**
     * 
     * @param {mapObjectElement} elm 
     * @returns {string}
     */
    function getBehavior(elm){
        /**@ts-ignore @type {number[]} */
        return elm.getAttribute("behavior");
    }
    
    
    /**
     * 
     * @param {mapObjectElement} elm 
     * @returns {{width: number, height: number}}
     */
    function getDefaultSize(elm){
        /**@ts-ignore @type {number[]} */
        const r = elm.getAttribute("dfsize")?.split(" ").map(t => { return Number(t); });
        return { width: r[0], height: r[1] };
    }
    
    
    /**
     * 
     * @param {string} str 
     * @returns {string}
     */
    function minecraft_formattingSystem(str){
        var cl_count = 0;
        var dec_count = 0;
    
        if (str.length < 1)
            return "";
        
        str = "<mcft-cl>§p" + str;
    
        for (var pat in ColorList) {
            var str_splited = str.split("\u00A7".concat(pat));
            cl_count += str_splited.length - 1;
            str = str_splited.join("<mcft-cl style=\"color: ".concat(ColorList[pat], "\">"));
        }
    
        for (var decoration in Dec) {
            var code = "\u00A7".concat(decoration);
            while (str.includes(code)) {
                var code = "\u00A7".concat(decoration);
                dec_count++;
                str = str.replace(code, "<mcft-dec ".concat(Dec[decoration], ">"));
                if (str.indexOf("§r") < str.indexOf(code) || str.indexOf(code) == -1) {
                    var esc = "";
                    for (var i = 0; i <= cl_count; i++) {
                        esc += "</mcft-cl>";
                    }
                    for (var i = -2; i < dec_count; i++) {
                        esc += "</mcft-dec>";
                    }
                    str = str.replace("§r", esc);
                    cl_count = 0;
                    dec_count = 0;
                }
            }
        }
    
        for (var i = 0; i <= cl_count; i++) {
            str += "</mcft-cl>";
        }
    
        for (var i = 0; i < dec_count; i++) {
            str += "</mcft-dec>";
        }
    
        return str;
    }
    
    //@ts-check
    "use strict";
    
    
    var obfuscators = [];
    var STYLES = {
        "§4": "font-weight:normal;text-decoration:none;color:#be0000",
        "§c": "font-weight:normal;text-decoration:none;color:#fe3f3f",
        "§6": "font-weight:normal;text-decoration:none;color:#d9a334",
        "§e": "font-weight:normal;text-decoration:none;color:#fefe3f",
        "§2": "font-weight:normal;text-decoration:none;color:#00be00",
        "§a": "font-weight:normal;text-decoration:none;color:#3ffe3f",
        "§b": "font-weight:normal;text-decoration:none;color:#3ffefe",
        "§3": "font-weight:normal;text-decoration:none;color:#00bebe",
        "§1": "font-weight:normal;text-decoration:none;color:#0000be",
        "§9": "font-weight:normal;text-decoration:none;color:#3f3ffe",
        "§d": "font-weight:normal;text-decoration:none;color:#fe3ffe",
        "§5": "font-weight:normal;text-decoration:none;color:#be00be",
        "§f": "font-weight:normal;text-decoration:none;color:#ffffff",
        "§7": "font-weight:normal;text-decoration:none;color:#bebebe",
        "§8": "font-weight:normal;text-decoration:none;color:#3f3f3f",
        "§0": "font-weight:normal;text-decoration:none;color:#000000",
        "§l": "font-weight:bold",
        "§n": "text-decoration:underline;text-decoration-skip:spaces",
        "§o": "font-style:italic",
        "§m": "text-decoration:line-through;text-decoration-skip:spaces",
    
        "§x": "font-size:36px;line-height:1.333",
        "§y": "font-size:24px;line-height:1",
    };
    
    
    function MCobfuscate(elem){
        elem.classList.add("mc_obfucated");
    }
    
    
    /**
     * 
     * @param {string} string 
     * @param {Array} codes 
     * @returns {HTMLSpanElement}
     */
    function applyMCCode(string, codes){
        var len = codes.length;
        var elem = document.createElement("span"),
            obfuscated = false;
        for (var i = 0; i < len; i++){
            elem.style.cssText += STYLES[codes[i]] + ";";
            if(codes[i] === "§k") {
                MCobfuscate(elem);
                obfuscated = true;
            }
        }
    
        elem.innerHTML = string;
    
        return elem;
    }
    
    
    /**
     * 
     * @param {string} string 
     * @returns 
     */
    function _parseMCFormat(string){
        var codes = string.match(/§.{1}/g) || [],
            indexes = [],
            apply = [],
            tmpStr,
            indexDelta,
            noCode,
            final = document.createDocumentFragment(),
            len = codes.length,
            string = string.replace(/\n|\\n/g, "<br>");
        
        for(var i = 0; i < len; i++){
            indexes.push( string.indexOf(codes[i]));
            string = string.replace(codes[i], "\x00\x00");
        }
    
        if(indexes[0] !== 0){
            final.appendChild(applyMCCode(string.substring(0, indexes[0]), []));
        }
    
        for(var i = 0; i < len; i++){
        	indexDelta = indexes[i + 1] - indexes[i];
            if(indexDelta === 2){
                while(indexDelta === 2){
                    apply.push (codes[i]);
                    i++;
                    indexDelta = indexes[i + 1] - indexes[i];
                }
                apply.push (codes[i]);
            } else {
                apply.push(codes[i]);
            }
            if (apply.lastIndexOf("§r") > -1){
                apply = apply.slice( apply.lastIndexOf("§r") + 1 );
            }
            tmpStr = string.substring( indexes[i], indexes[i + 1] );
            final.appendChild( applyMCCode(tmpStr, apply) );
        }
        return final;
    }
    
    
    /**
     * void
     */
    function clearObfuscators(){
        var i = obfuscators.length;
    
        for(;i--;){
            clearInterval(obfuscators[i]);
        }
    
        obfuscators = [];
    }
    
    
    /**
     * module.exports this
     * @param {string} str 
     * @returns {string}
     */
    function mcFormat(str){
        var r = "";
        clearObfuscators();
        const el = _parseMCFormat(str);
        for (var e of Array.from(el.children)){
            r += e.outerHTML;
        }
        return r;
    }
    
    
    /**
     * Obfucated font
     */
    !function(){
        const abc = "123456789abcdefghijklmnopqrstuvwxyz";
        const obfuscaters = abc.split("").concat(abc.slice(9).toUpperCase().split(""));
    
        setInterval(function(){
            var obfs = document.getElementsByClassName("mc_obfucated");
            for (var obf of obfs){
                for (var ch of obf.childNodes){
                    var content = "";
                    if (ch.textContent == null)
                        continue;
                    for (var char of ch.textContent.split("")){
                        var c = Math.round(Math.random() * (obfuscaters.length -1));
                        content += obfuscaters[c];
                    }
                    ch.textContent = content;
                }
            }
        }, 10);
        return 0;
    }();
    
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
    
        !function(){
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
                var movements = {
                    0: {
                        x: 0,
                        y: 0,
                    },
                    1: {
                        x: 0,
                        y: 0,
                    },
                };
    
                if (!currentEvent && !prevEvent || currentEvent.touches.length == 1) 
                    return;
    
                if (prevEvent && currentEvent && currentEvent.touches.length == 1){
                    for (var i = 0; i < 2; i++){
                        var p = currentEvent.touches[i];
                        var j = prevEvent.touches[i];
                        movements[i].x = p.clientX - j.clientX;
                        movements[i].y = p.clientY - j.clientY;
                    }
                }
                
                prevEvent = currentEvent;
    
                if (pointerVelocity.method == "TOUCH"){
                    for (var i = 0; i < 2; i++){
                        touchZoomVelocity[i].x = 100*movements[i].x;
                        touchZoomVelocity[i].y = 100*movements[i].y;
                    }
                }
            }, 20);
            return 0;
        }();
        return 0;
    }();
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("../shishiji-dts/motion").NonnullPosition} NonnullPosition
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
    
    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {TouchEvent} event 
     * @returns {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian}}
     */
    function touchZoom(canvas, ctx, event){
        /**@type {NonnullPosition} */
        var crossPos = [ -1, -1 ];
        const abs = Math.abs;
        const touches = event.touches;
    
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
        const theta = getThouchesTheta(touches);
        
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
                rotateCanvas(canvas, ctx, crossPos, rotation);
        }
        
    
        rotatedThisTime += rotation;
        //#endregion
    
        return { diffRatio: diffRatio, crossPos: crossPos, rotation: rotation };
    }
    
    
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
     */
    async function drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height, src_formatter, callback){
        /**@type {HTMLImageElement[]} */
        var al = [];
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        backcanvas.width = tile_width*(xrange+1);
        backcanvas.height = tile_height*(yrange+1);
    
        return new Promise((resolve) => {
            for (var y = 0; y <= yrange; y++){
                for (var x = 0; x <= xrange; x++){
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
                                resolve("map loaded");
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
    
    
    
    /**
     * @typedef {import("../shishiji-dts/motion").Position} _Position
     * @typedef {import("../shishiji-dts/motion").Radian} Radian
     */
    
    
    
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
    
        updatePositions();
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
    
        /**@type {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian}} */
        var adjust = { diffRatio: 1, crossPos: [-1, -1], rotation: 0 };
    
    
        pointerPosition = pos;
    
    
        if (touchCD < MOVEPROPATY.touch.downCD){
            touchCD++;
            return;
        }
        
    
        if (touches.length >= 2 && prevTouchINFO.real !== void 0 && prevTouchINFO.real.length >= 2){
            /**@see {@link (./eventCalcu.js).touchZoom} */
            adjust = touchZoom(canvas, ctx, event);
            prevTouchINFO.zoom = !0;
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
    
            prevTouchINFO.zoom = !!0;
        }
    
    
        if (!prevp.some(t => t === null) && touches.length == 1){
            //@ts-ignore
            const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
            moveMapAssistingNegative(canvas, ctx, map_move);
        }
    
        prevTouchINFO.cross = adjust.crossPos;
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
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("../shishiji-dts/objects").mapObjElement} mapObjectElement
     * @typedef {import("../shishiji-dts/objects").mapObject} mapObject
     */
    
    
    /**
     * use /scripts/coords.py to find coordinate
     * @param {mapObject} objectData 
     */
    function putObjOnMap(objectData){
        /**@ts-ignore @type {HTMLElement} */
        const viewer = document.getElementById("shishiji-view");
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        const behavior = objectData.object.type.behavior;
        var zIndex = 1001;
    
        const objectCoords_fromCanvas = {
            x: (objectData.object.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (objectData.object.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
        };
        var styles = "";
        var attrs = "";
        var classes = "";
        var dfcursor = "pointer";
    
        switch (behavior){
            case "dynamic":
                classes += "popups "
                break;
            default:
            case "static":
                zIndex = 999;
                classes += "mapObj_static"
                if (!objectData.object.type.border)
                    styles += "border: none; border-radius: 0; background-color: transparent;"
                if (!objectData.article){
                    styles += "cursor: default;";
                    dfcursor = "default";
                }
                break;
        }
    
    
    
        const element_outerHTML = `
            <div class="mapObj mapObj_centerAlign" style="top: ${objectCoords_fromCanvas.y}px; left: ${objectCoords_fromCanvas.x}px; z-index: ${zIndex};"
                coords="${objectData.object.coordinate.x} ${objectData.object.coordinate.y}"
                behavior="${objectData.object.type.behavior}"
                dfsize="${objectData.object.size.width} ${objectData.object.size.height}">
                <div class="canvas_interactive mapObj_mainctx ${classes}" style="background-image: url('${objectData.object.images.icon}');
                    min-width: ${objectData.object.size.width}px;
                    min-height: ${objectData.object.size.height}px;
                    max-width: ${objectData.object.size.width}px;
                    max-height: ${objectData.object.size.height}px; ${styles}" dfcs="${dfcursor}">
    
                </div>
            </div>
        `;
    
        $(viewer).append(element_outerHTML)
        const el = $(viewer).children()[$(viewer).children().length - 1];
        if (objectData.article){
            $(el).on("touchstart mousedown", function(event){
                var moved = !!0;
                function ch(){
                    moved = !0;
                }
                function rm(){
                    if (!moved){
                        raiseOverview();
                        writeOverview(eventDetails);
                    }
                    $(this).off("touchmove mousemove", ch);
                    $(this).off("touchend mouseup", rm);
                }
                $(el).on("touchmove mousemove", ch);
                $(el).on("touchend mouseup", rm);
                const eventDetails = objectData;
                /**@ts-ignore @type {HTMLCanvasElement} */
                const canvas = document.getElementById("shishiji-canvas");
            });
        }
    }
    
    
    function clearObj(){
        $(".mapObj").remove();
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    function grayScaledCanvas(canvas){
        /**@ts-ignore @type {CanvasRenderingContext2D}*/
        var ctx = canvas.getContext("2d");
            
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        
        /**@ts-ignore @type {ImageData}*/
        var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        var data = imageData.data;
        
        for (var i = 0; i < data.length; i += 4){
            data[i] *= 0.75;
            data[i + 1] *= 0.75;
            data[i + 2] *= 0.75;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    function normalCanvas(canvas){
        /**@ts-ignore @type {CanvasRenderingContext2D}*/
        var ctx = canvas.getContext("2d");
            
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        
        /**@ts-ignore @type {ImageData}*/
        var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        var data = imageData.data;
        
        for (var i = 0; i < data.length; i += 4){
            data[i] /= 0.75;
            data[i + 1] /= 0.75;
            data[i + 2] /= 0.75;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    function updatePositions(){
        for (var _mapObj of document.getElementsByClassName("mapObj")){
            /**@ts-ignore @type {mapObjectElement} */
            const mapObj = _mapObj;
            const coords = getCoords(mapObj);
    
            const objectCoords_fromCanvas = {
                x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
                y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
            };
    
            const behavior = getBehavior(mapObj);
            const dfsize = getDefaultSize(mapObj);
    
            var size = dfsize;
    
            switch (behavior){
                case "static":
                    size.width = dfsize.width*zoomRatio;
                    size.height = dfsize.height*zoomRatio;
                    break;
                case "dynamic":
                default:
    
                    break;
            }
    
            mapObj.style.top = objectCoords_fromCanvas.y+"px";
            mapObj.style.left = objectCoords_fromCanvas.x+"px";
            
            $($(mapObj).children()[0])
                .css("min-width", size.width+"px")
                .css("min-height", size.height+"px")
                .css("max-width", size.width+"px")
                .css("max-height", size.height+"px");
        }
    }
    
    function raiseOverview(){
        clearInterval(Intervals.raise);
        clearInterval(Intervals.reduce);
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        $(overview).show();
        var he = 100;
        //@ts-ignore
        Intervals.raise = setInterval(function(){
            overview.style.top = he+"vh";
            if (he < 0){
                overview.style.top = "0vh";
                clearInterval(Intervals.raise);
            }
            he -= 1.5;
        }, 5);
        $("#overview-close").on("click", reduceOverview);
    }
    
    
    function reduceOverview(){
        clearInterval(Intervals.raise);
        clearInterval(Intervals.reduce);
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        var he = 0;
        //@ts-ignore
        Intervals.reduce = setInterval(function(){
            overview.style.top = he+"vh";
            if (he > 100){
                /**@ts-ignore @type {HTMLElement} */
                const ctx = document.getElementById("overview-context");
                overview.style.top = "100vh";
                $(overview).hide();
                $(ctx).html(`
                    <div style="position: absolute; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
                        <h3>読み込んでいます...</h3>
                    </div>
                `);
                clearInterval(Intervals.reduce);
            }
            he += 4;
        }, 5);
        $("#overview-close").off("click", reduceOverview);
    }
    
    
    /**
     * 
     * @param {mapObject} details 
     */
    function writeOverview(details){
        /**@ts-ignore @type {HTMLElement} */
        const ctx = document.getElementById("overview-context");
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const color = (details.article.theme_color) ? details.article.theme_color : "black";
        const font = (details.article.font_family) ? details.article.font_family : "";
        const imgOnError = `onerror="this.src='/resources/img/noimg.png';"`
    
        var article_mainctx = mcFormat(details.article.content.replace(/\n/g, "<br>"));
        
        if (article_mainctx === "<span></span>"){
            article_mainctx = '<h4 style="width: 100%; margin-top: 50px; margin-bottom: 50px; text-align: center;">このイベントに関する記載はありません</h4>';
        }
    
        var custom_tr = "";
    
        for (var tr of details.article.custom_tr){
            if (tr.title && tr.content)
                custom_tr += `
                    <tr class="ev_property">
                        <th class="ev_property_cell" aria-label="${tr.title}">
                            ${tr.title}
                        </th>
                        <th class="ev_property_cell" aria-label="${tr.content}">
                            ${tr.content}
                        </th>
                    </tr>
                `;
        }
    
        
        overview.style.borderTop = "solid 20px "+color;
        $(overview).css("font-family", font);
    
    
        $(ctx).html(`
            <img class="article header" src="${details.article.images.header}" aria-label="ヘッダー画像" ${imgOnError}>
            <div class="article titleC">
                <img src="${details.object.images.icon}" style="width: 48px" alt="アイコン" ${imgOnError}>
                <h1 id="ctx-title" style="margin: 5px">${details.article.title}</h1>
            </div>
            <div id="ctx-article" style="margin: 10px;">
                <div class="ev_property" style="color: green; font-weight: bold; margin: 20px;">
                    <p>▷中心学年: ${details.article.core_grade}</p>
                </div>
                ${article_mainctx}
                <hr style="margin-top: 20px;">
                <div class="ev_property">
                    <table style="width: 100%;">
                        <tbody>
                            <tr class="ev_property">
                                <th class="ev_property_cell" aria-label="開催場所">
                                    開催場所
                                </th>
                                <th class="ev_property_cell" aria-label="${details.article.venue}">
                                    ${details.article.venue}
                                </th>
                            </tr>
                            <tr class="ev_property">
                                <th class="ev_property_cell">
                                    開催時間
                                </th>
                                <th class="ev_property_cell">
                                    ${details.article.schedule}
                                </th>
                            </tr>
                            ${custom_tr}
                            <tr class="ev_property">
                                <th class="ev_property_cell">
                                    予想待ち時間
                                </th>
                                <th class="ev_property_cell" aria-label="${details.article.crowd_status.estimated}分">
                                    ${details.article.crowd_status.estimated}分
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <div class="crowded_lim">
                        <p style="font-weight: bold; margin: 10px; margin-top: 0; margin-bottom: 5px;" aria-label="混み具合">
                            混み具合
                        </p>
                        <div class="crowded_deg_bar"></div>
                        <div id="crowed_pointer" style="position: relative;">
                            <div class="ccENTER_B" style="position: absolute; left: ${details.article.crowd_status.level}%;">
                                <span class="material-symbols-outlined"
                                    style="position: absolute; margin-top: 5px;">
                                    north
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style="margin-bottom: 20px;">
            </div>
        `);
    }
    
    
    
    function init(){
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const closebtn = document.getElementById("overview-close");
    }
    
    window.addEventListener("load", function(e) {
        //@ts-check
        "use strict";
        
        
        
        
        !function(){
            /** @ts-ignore @type {HTMLCanvasElement}*/
            const map_wrapper = document.getElementById("shishiji-view");
            /** @ts-ignore @type {HTMLCanvasElement}*/
            const canvas = document.getElementById("shishiji-canvas");
            /** @ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = canvas.getContext("2d");
        
        
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
        
            //window.addEventListener("mouseleave", mouse_lost, { passive: false });
            //window.addEventListener("mouseout", mouse_lost, { passive: false });
        
        
        
            window.addEventListener("wheel", wheel_move, { passive: true });
            window.addEventListener("mousewheel", wheel_move, { passive: true });
        
        
        
            function wheel_move(e){
                if (illegal(e))
                    return;
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
        
    });
    window.addEventListener("load", function(e) {
        //@ts-check
        "use strict";
        
        
        
        function setCanvasSizes(){
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
            backcanvas.canvas.width = canvas.width;
            backcanvas.canvas.height = canvas.height;
        }
        
        
        !function(){
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = canvas.getContext("2d");
            const tile_width = 500;
            const tile_height = 500;
            const xrange = 3;
            const yrange = 2;
        
        
            setCanvasSizes();
        
            backcanvas.width = tile_width*(xrange+1);
            backcanvas.height = tile_height*(yrange+1);
        
            drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
                "/resources/map_divided/mc4k/tile_{0}_{1}.png", callback);
            var loaded = 0;
            
            function callback(){
                loaded++;
                backcanvas.canvas.coords = {
                    x: 0,
                    y: 0
                };
                zoomRatio = 0.5;
                moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
                if (loaded == 2)
                    _loaded();
            }
        
            !function(){
                $.get("/data/map-objects")
                .done((objdata) => {
                    loaded++;
                    mapObjectComponent = objdata;
        
                    for (var key in mapObjectComponent){
                        const data = mapObjectComponent[key];
        
                        putObjOnMap(data);
                    }
        
                    if (loaded == 2)
                        _loaded();
                })
                .fail((err) => {
                    
                });
                return 0;
            }();
        
            function _loaded(){
                $("#load_spare").hide();
                $("#app-mount").show();
                setInterval(() => {
                    window.dispatchEvent(new Event("resize"));
                }, 50);
            }
            return 0;
        }();
        
        
        
        window.addEventListener("resize", function(e){
            e.preventDefault();
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            setCanvasSizes();
            //@ts-ignore
            moveMapAssistingNegative(canvas, canvas.getContext("2d"), { top: 0, left: 0 });
            window.scroll({ top: 0, behavior: "instant" });
        }, { passive: false });
        
        
        window.addEventListener("gesturestart", function(e){
            e.preventDefault();
        }, { passive: false });
        
        
        window.addEventListener("dblclick", function(e){
            e.preventDefault();
        }, { passive: false });
        
        
        window.addEventListener("load", function(e){
            window.scroll({ top: 0, behavior: "instant" });
        });
        
    });
    
}();
