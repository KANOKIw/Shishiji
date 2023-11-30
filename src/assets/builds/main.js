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
     * @typedef {import("./shishiji-dts/objects").intervals} intervals
     * 
     * @typedef {import("socket.io").Socket} Socket
     */
    
    
    
    /**
     * assign on interaction
     * pointerPosition: temp variable to get previous controler pos (get diff)
     * cursorPosition: current mouse cursor position (zoom origin)
     * @type {Position} */
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
    const MOVEPROPERTY = {
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
        x: 0, y: 0, v: 0, a: -100,
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
     * @see {MOVEPROPERTY.touch.rotate.min}
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
    
    
    /**@type {intervals} */
    var Intervals = {
        
    };
    
    
    /**@type {mapObjComponent} */
    var mapObjectComponent = {};
    
    
    var MAPDATA = {
    
    };
    
    var CURRENT_FLOOR = "";
    
    const overlay_modes = {
        fselector: {
            opened: !!0,
            colors: {
                current: "rgba(0, 100, 0, 0.699)",
                else: "rgba(188, 255, 255, 0.699)",
            }
        },
    };
    
    
    // digit
    const paramAbstractDeg = 4;
    
    const _mcColorList = {
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
    const _mcDec = {
        "k": 'class="--mcf-obfuscated"',
        "l": 'style="font-weight: bolder;"',
        "m": 'style="text-decoration: line-through;"',
        "n": 'style="text-decoration: underline;"',
        "o": 'style="font-style: italic;"',
        "p": 'style=""',
    };
    const _mcColor = {
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
    
    
    function startLoad(){
        $("#place-selector").hide();
        $("#load_spare").removeClass("loaddoneman").show();
        const i = document.getElementById("spare_logo");
        var t = 0;
        var x = -Math.pow(3*100, 1/2);
        /*Intervals.load = setInterval(function(){
            //@ts-ignore
            i.style.transform = `rotateY(${t}deg)`;
            t += 3;
        }, 1);*/
    }
    
    
    function endLoad(){
        setTimeout(() => {
            $("#load_spare").addClass("loaddoneman");
            setTimeout(() => {
                clearInterval(Intervals.load);
                $("#load_spare").hide();
                $("#place-selector").addClass("hello").show();
            }, 950);
        }, 1000);
    }
    
    
    function setPlaceSelColor(p){
        if (p === void 0) p = CURRENT_FLOOR;
        $(".placeOpt").each(function(index, elm){
            if (!this.textContent) return;
            const text = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
            if (text === p)
                $(this).css("background-color", overlay_modes.fselector.colors.current);
            else if (text.length > 1)
                $(this).css("background-color", overlay_modes.fselector.colors.else);
        });
    }
    
    
    /**
     * @deprecated use {@link mcFormat} instead
     * @param {string} str 
     * @returns {string}
     */
    function parseMCFormat(str){
        var cl_count = 0;
        var dec_count = 0;
    
        if (str.length < 1)
            return "";
        
        str = "<mcft-cl>§p" + str;
    
        for (var pat in _mcColorList){
            var str_splited = str.split("\u00A7".concat(pat));
            cl_count += str_splited.length - 1;
            str = str_splited.join("<mcft-cl style=\"color: ".concat(_mcColorList[pat], "\">"));
        }
    
        for (var decoration in _mcDec){
            var code = "\u00A7".concat(decoration);
            while (str.includes(code)) {
                var code = "\u00A7".concat(decoration);
                dec_count++;
                str = str.replace(code, "<mcft-dec ".concat(_mcDec[decoration], ">"));
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
    
    
    /**
     * 
     * @param {JQuery.PlainObject<any>} element 
     * @param {(event: Event) => void} callback 
     * @param {{forceLeft?: boolean}} [options] 
     */
    function listenInterOnEnd(element, callback, options){
        if (typeof options === "undefined")
            options = {};
        $(element).on("touchstart mousedown", function(e){
            if (options){
                if (options.forceLeft && e.button && e.button != 0)
                    return;
            }
            
            var moved = !!0;
            $(this)
            .on("touchmove mousemove wheel mousewheel", onmove)
            .on("touchend mouseup mouseleave touchleave", onleave);
    
            function onmove(){
                moved = !0;
            }
            /**@this {HTMLElement}*/
            function onleave(e){
                if (!moved)
                    callback(e);
                $(this)
                .off("touchmove mousemove wheel mousewheel", onmove)
                .off("touchend mouseup mouseleave touchleave", onleave);
            }
        });
    }
    
    
    /**
     * 
     * @param {string} str 
     * @returns 
     */
    function escapeHTML(str){
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, "&#39;");
        str = str.replace(/ /g, "&nbsp;");
        return str;
    }
    
    
    /**
     * 
     * @param {string} key 
     * @param {string | number} value 
     */
    function setParam(key, value){
        const here = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
    
        urlParams.set(key, encodeURIComponent(String(value)));
    
        const yhere = here.split("?")[0] + "?" + urlParams.toString();
        window.history.replaceState("", "", yhere);
    }
    
    
    /**
     * 
     * @param {string} key 
     * @param {string} [value] 
     */
    function delParam(key, value){
        const here = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
    
        if (value) value = encodeURIComponent(value);
    
        urlParams.delete(key, value);
    
        const yhere = here.split("?")[0] + "?" + urlParams.toString();
        window.history.replaceState("", "", yhere);
    }
    
    
    /**
     * 
     * @param {string} key 
     * @param {string} [url] 
     * @returns {string | null}
     */
    function getParam(key, url){
        if (url === void 0)
            url = window.location.href;
    
        const urlParams = new URLSearchParams(window.location.search);
        const val = urlParams.get(key);
    
        return val ? decodeURIComponent(val) : null;
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     * @returns {mapObject | null}
     */
    function searchObject(discriminator){
        for (const key in mapObjectComponent){
            const data = mapObjectComponent[key];
            if (data.discriminator == discriminator) return data;
        }
        return null;
    }
    
    //@ts-check
    "use strict";
    
    
    
    var STYLES = {
        "§0": "color:#000000",
        "§1": "color:#0000AA",
        "§2": "color:#00AA00",
        "§3": "color:#00AAAA",
        "§4": "color:#AA0000",
        "§5": "color:#AA00AA",
        "§6": "color:#FFAA00",
        "§7": "color:#AAAAAA",
        "§8": "color:#555555",
        "§9": "color:#5555FF",
        "§a": "color:#55FF55",
        "§b": "color:#55FFFF",
        "§c": "color:#FF5555",
        "§d": "color:#FF55FF",
        "§e": "color:#FFFF55",
        "§f": "color:#FFFFFF",
        "§l": "font-weight:bold",
        "§n": "text-decoration:underline", 
        "§o": "font-style:italic",
        "§m": "text-decoration:line-through",
    
        "§L": "font-weight:bolder",
        "§x": "font-size:48px;line-height:1.5",
        "§y": "font-size:36px;line-height:1.333",
        "§z": "font-size:24px;line-height:1",
    };
    
    
    function MCobfuscate(elem){
        elem.classList.add("MCOBF");
        elem.style.fontFamily = "monospace";
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
     * @returns {DocumentFragment}
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
            indexes.push(string.indexOf(codes[i]));
            string = string.replace(codes[i], "\x00\x00");
        }
    
        if(indexes[0] !== 0){
            final.appendChild(applyMCCode(string.substring(0, indexes[0]), []));
        }
    
        for(var i = 0; i < len; i++){
        	indexDelta = indexes[i + 1] - indexes[i];
            if(indexDelta === 2){
                while(indexDelta === 2){
                    apply.push(codes[i]);
                    i++;
                    indexDelta = indexes[i + 1] - indexes[i];
                }
                apply.push (codes[i]);
            } else {
                apply.push(codes[i]);
            }
            if (apply.lastIndexOf("§r") > -1){
                apply = apply.slice(apply.lastIndexOf("§r") + 1);
            }
            tmpStr = string.substring(indexes[i], indexes[i + 1]);
            final.appendChild(applyMCCode(tmpStr, apply));
        }
        return final;
    }
    
    
    /**
     * @param {string} str 
     * @returns {string}
     */
    function mcFormat(str){
        //str = escapeHTML(str);
        var r = "";
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
            var obfs = document.getElementsByClassName("MCOBF");
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
                return { x: k, y: r };
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
    
    
        if (zoomCD > MOVEPROPERTY.touch.zoomCD){
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
    
    
        if (Math.abs(rotatedThisTime) > toRadians(MOVEPROPERTY.touch.rotate.min) || pastRotateMin){
            if (!pastRotateMin){
                rotatedThisTime -= toRadians(MOVEPROPERTY.touch.rotate.min);
            }
            pastRotateMin = !0;
            if (zoomCD > MOVEPROPERTY.touch.zoomCD)
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
     * @param {Function} [callback]
     * @returns {Promise<any>} 
     */
    async function drawMap(canvas, ctx, data, callback){
        const xrange = data.xrange;
        const yrange = data.yrange;
        const tile_width = data.tile_width;
        const tile_height = data.tile_height;
        const src_formatter = data.format;
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
    
    
    /**
     * 
     * @param {boolean} [accurated] 
     */
    function setBehavParam(accurated){
        const abstraction = 10**paramAbstractDeg;
        const K = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
        const zr = accurated ? zoomRatio : Math.round(zoomRatio*abstraction)/abstraction;
        const at = accurated ? K[0]+"*"+K[1] : Math.round(K[0]*abstraction)/abstraction+"*"+Math.round(K[1]*abstraction)/abstraction;
        
        setParam("zr", zr);
        setParam("at", at);
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
        if (MOVEPROPERTY.caps.ratio.max < zoomRatio && ratio > 1
            || MOVEPROPERTY.caps.ratio.min > zoomRatio && ratio < 1
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
        if (MOVEPROPERTY.caps.ratio.max < zoomRatio && ratio > 1
            || MOVEPROPERTY.caps.ratio.min > zoomRatio && ratio < 1
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
    
    
        if (touchCD < MOVEPROPERTY.touch.downCD){
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
                classes += "popups realshadow "
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
            listenInterOnEnd(el, function(e){
                const eventDetails = objectData;
                raiseOverview();
                writeOverview(eventDetails, true);
    
                setParam("art", objectData.discriminator);
            }, { forceLeft: true });
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
    
    
    /**
     * 
     * @param {string} currentfloor 
     * @param {mapObjComponent} objects 
     */
    function showDigitsOnFloor(currentfloor, objects){
        for (const y in objects){
            if (objects[y].object.floor == currentfloor){
                putObjOnMap(objects[y]);
            }
        }
    }
    
    //@ts-check
    "use strict";
    
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
    
    //@ts-check
    "use strict";
    
    
    function raiseOverview(){
        strictMap();
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        const $cp = $("#shishiji-popup-container-c");
        const loadgingsymbol = `<span class="material-symbols-outlined loading-symbol">progress_activity</span>`;
    
        overview.style.top = "0vh";
        $(overview).removeClass("reducedown").addClass("raiseup").scrollTop(0);
        $(overview).show();
        $("#overview-close").on("click", reduceOverview);
        $("#overview-share").on("click", shareContent);
    
        function shareContent(){
            Popup.popupContent(`<div class="realshadow protected" id="ppupds"><div class="mx-text-center flxxt">${loadgingsymbol}</div></div>`);
            function onerr(){
                Popup.popupContent(`<div class="realshadow protected" id="ppupds"><div class="mx-text-center flxxt"><h4>エラーが発生しました！<br>ページを再読み込みしてみてください！</h4></div></div>`);
            }
            $.get("/resources/html-ctx/share.html").done(t => {
                if (Popup.popupping){
                    Popup.popupContent(t, function(){
                        const shareURL = window.location.href;
                        $("#share-copy").on("click", function(){
                            window.navigator.clipboard.writeText(shareURL);
                        });
    
                        const discriminator = getParam("art") || "";
                        const data = searchObject(discriminator);
    
                        if (data == null){
                            onerr();
                            return;
                        }
                        
                        const message = encodeURIComponent(`世田谷学園 獅子児祭のイベント: ${data.article.title}`);
                    
                        for (const ch of document.getElementsByClassName("share_ebtn")){
                            const appname = ch.id.replace("share-", "");
                            const $ch = $(ch);
                            const here = encodeURIComponent(shareURL);
                            var href = "";
                            
                            switch (appname){
                                case "line":
                                    href = `http://line.me/R/msg/text/?${message}%0A${here}`;
                                    break;
                                case "twitter":
                                    href = `https://x.com/intent/tweet?url=${here}&text=${message}&related=shishiji&via=shishijifes&hashtags=${encodeURIComponent("獅子児祭")}`;
                                    break;
                                case "facebook":
                                    href = `http://www.facebook.com/share.php?u=${here}`;
                                    break;
                                case "whatsapp":
                                    href = `https://api.whatsapp.com/send/?text=${message}%0A${here}&type=custom_url&app_absent=0`
                                    break;
                                default:
                                    continue;
                            }
            
                            !function(_href){
                                $ch.on("click", function(){
                                    window.open(_href, "_blank");
                                });
                                return 0;
                            }(href);
                        }
                    });
                }
            })
            .catch(onerr);
        }
    }
    
    
    function strictMap(){
        clearInterval(Intervals.reduceOverview);
        $("#user-stricter").addClass("active").show();
    }
    
    
    function restrictMap(){
        $("#user-stricter").removeClass("active").hide();
    }
    
    
    function reduceOverview(){
        restrictMap();
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        overview.style.top = "100vh";
        $(overview).removeClass("raiseup").addClass("reducedown");
        $("#overview-close").off("click", reduceOverview);
        $("#overview-context").removeClass("fadein");
        
        Intervals.reduceOverview = setTimeout(() => {
            $("#overview-context").html(`<h4 style="text-align: center;">詳細情報を処理中...</h4>`);
            $(overview).scrollTop(0).hide();
        }, 190);
    
        setParam("art", "");
    }
    
    
    /**
     * 
     * @param {mapObject} details 
     * @param {boolean} fadein 
     */
    function writeOverview(details, fadein){
        /**@ts-ignore @type {HTMLElement} */
        const ctx = document.getElementById("overview-context");
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const color = (details.article.theme_color) ? details.article.theme_color : "black";
        const font = (details.article.font_family) ? details.article.font_family : "";
        const imgOnError = `onerror="this.src='/resources/img/noimg.png';"`
    
        var article_mainctx = mcFormat(details.article.content);
        
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
    
        if (fadein)
            $(ctx).addClass("fadein");
        
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
    
    //@ts-check
    "use strict";
    
    
    /**@type {NodeJS.Timeout} FAKE*/
    var lst;
    function toggleFeslOn(openned){
        if (!openned){
            clearTimeout(lst);
            this.addClass("toSel popped");
            $("#place-options-w")
            .show()
            .addClass("toSel");
        } else {
            this.addClass("undoSel").removeClass("popped");
            $("#place-options-w").addClass("undoSel");
            lst = setTimeout(() => {
                this.removeClass("toSel undoSel")
                $("#place-options-w")
                .hide()
                .removeClass("toSel undoSel");
            }, 190);
        }
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
        
        
                toggleFeslOn.apply($(fselector), [!0]);
                overlay_modes.fselector.opened = !!0;
                
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
        
        
                toggleFeslOn.apply($(fselector), [!0]);
                overlay_modes.fselector.opened = !!0;
        
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
        
        
            function wheel_move(e){
                if (illegal(e))
                    return;
                clearInterval(tout);
                //@ts-ignore
                tout = setTimeout(() => {
                    setBehavParam();
                }, 500);
                map_wrapper.style.cursor = "move";
                Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
                    p => {
                        //@ts-ignore
                        p.style.cursor = "move";
                    }
                );
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
                        }, 500)
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
        
    });
    window.addEventListener("load", function(e) {
        //@ts-check
        "use strict";
        
        
        !function(){
            /**@ts-ignore @type {HTMLElement} */
            const fselector = document.getElementById("place-selector");
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = canvas.getContext("2d");
        
            $("#place-options").children().each(function(index, elm){
                if (!this.textContent)
                    return;
                const text = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
                if (text.length < 1)
                    return;
        
                /**@this {HTMLElement} @param {string} name */
                function addListener(name){
                    this.addEventListener("click", function(e){
                        e.preventDefault();
                        const data = MAPDATA[name];
                        if (CURRENT_FLOOR === name || data === undefined){
                            return;
                        }
        
                        startLoad();
                        toggleFeslOn.apply($(fselector), [!0]);
                        overlay_modes.fselector.opened = !!0;
        
                        const data_size = {
                            width: data.tile_width*(data.xrange+1),
                            height: data.tile_height*(data.yrange+1)
                        };
                        backcanvas.width = data_size.width;
                        backcanvas.height = data_size.height;
                        drawMap(canvas, ctx, data, function(){
                            backcanvas.canvas.coords = {
                                x: 0,
                                y: 0
                            };
                            zoomRatio = 1;
                            moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
                            clearObj();
                            showDigitsOnFloor(name, mapObjectComponent);
                            endLoad();
                        });
                        CURRENT_FLOOR = name;
                        setParam("fl", CURRENT_FLOOR);
                        setPlaceSelColor();
                    }, { passive: false });
                    return 0;
                };
        
                addListener.apply(this, [text])
            });
            $(fselector)
            .on("click", function(e){
                if (e.target.classList.contains("fselector-btn") || e.target.id == "psdummy"){
                    toggleFeslOn.apply($(fselector), [overlay_modes.fselector.opened]);
                    overlay_modes.fselector.opened = !overlay_modes.fselector.opened;
                }
            });
            return 0;
        }();
        
        
    });
    window.addEventListener("load", function(e) {
        //@ts-check
        "use strict";
        
        
        !function(){
            const $cp = $("#shishiji-popup-container-c");
        
            /**@param {string} str  */
            function delpxToNum(str){
                return Number(str.replace("px", ""));
            }
        
            const base = {
                width: delpxToNum($cp.css("width")),
                height: delpxToNum($cp.css("height")),
                margin: delpxToNum($cp.css("margin"))
            };
            
            $(window).on("resize", function(e){
                var width = delpxToNum($cp.css("width"));
                var height = delpxToNum($cp.css("height"));
                var margin = delpxToNum($cp.css("margin"));
                
                
                if (window.innerWidth < width+margin*2){
                    $cp.css("width", window.innerWidth-margin*2+"px");
                    width = window.innerWidth-margin*2;
                } else {
                    $cp.css("width", base.width+"px");
                }
        
                $cp
                .css("top", (window.innerHeight-(margin*2+height))/2+"px")
                .css("left", (window.innerWidth-(margin*2+width))/2+"px");
            });
        
            window.dispatchEvent(new Event("resize"));
        
            return 0;
        }();
        
        
        
        class Popup{
            static me = document.getElementById("shishiji-popup-container-c");
            static ppcls = `<div id="ppcls"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z" fill="#ffffff"></path></svg></div>`;
        
            static popupContent(_innerHTML, callback){
                new Promise((resolve, reject) => {
                    $("shishiji-mx-overlay")
                    .removeClass("pipe")
                    .addClass("popen")
                    .on("click", this._dispose);
                    $("#shishiji-popup-container-c")
                    .html(this.ppcls+_innerHTML)
                    .show();
                    resolve("");
                }).then(() => {
                    $("#ppcls").on("click", this.disPop);
                    if (callback !== void 0)
                        callback();
                });
            }
            
            static disPop(){
                $("#ppcls").off("click", this.disPop);
                $("shishiji-mx-overlay")
                .removeClass("popen")
                .addClass("pipe")
                .off("click", this._dispose);
                $("#shishiji-popup-container-c")
                .hide()
                .empty();
            }
        
            static get popupping(){
                return (this.me?.style.display != "none") ? true : false;
            }
        
            static _dispose(){
                if (Popup.popupping)
                    Popup.disPop();
            }
        }
        
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
            /**@ts-ignore @type {string} */
            const loadType = window.performance?.getEntriesByType("navigation")[0].type;
            const PARAMS = {
                article: getParam("art"),
                zoomRatio: Number(getParam("zr")) || 1,
                floor: getParam("fl"),
                coords: getParam("at")?.split("*").map(a => { return (a === String(void 0) || isNaN(Number(a))) ? null : Number(a); }) || [ 0, 0 ],
            };
            if (PARAMS.coords == [null, null]) PARAMS.coords = [0, 0];
        
            if (loadType == "reload"){
                PARAMS.article = null;
                //PARAMS.zoomRatio = 1;
                //PARAMS.coords = [0, 0];
                setParam("art", "");
            }
        
            startLoad();
            setCanvasSizes();
        
            $.get("/data/map-data/conf")
            .done(function(data){
                MAPDATA = data;
                var initial_floor = data.initial_floor;
                var initial_data = data[data.initial_floor];
        
                if (PARAMS.floor && Object.keys(data).includes(PARAMS.floor)){
                    initial_floor = PARAMS.floor;
                    initial_data = data[PARAMS.floor];
                }
        
                backcanvas.width = initial_data.tile_width*(initial_data.xrange+1);
                backcanvas.height = initial_data.tile_height*(initial_data.yrange+1);
        
                drawMap(canvas, ctx, initial_data, callback);
                
                var loaded = 0;
                
                function callback(){
                    loaded++;
                    backcanvas.canvas.coords = {
                        //@ts-ignore
                        x: PARAMS.coords[0], y: PARAMS.coords[1]
                    };
                    zoomRatio = PARAMS.zoomRatio;
                    moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
                    setBehavParam();
                    if (loaded == 2)
                        _loaded();
                }
            
                !function(){
                    $.get("/data/map-data/objects")
                    .done((objdata) => {
                        loaded++;
                        mapObjectComponent = objdata;
            
                        showDigitsOnFloor(initial_floor, mapObjectComponent);
            
                        CURRENT_FLOOR = initial_floor;
        
                        setPlaceSelColor();
        
                        if (loaded == 2)
                            _loaded();
                    })
                    .fail((err) => {
                        
                    });
                    return 0;
                }();
            
                function _loaded(){
                    endLoad();
                    $("#app-mount").show();
                    if (PARAMS.article){
                        const data = searchObject(PARAMS.article);
                        
                        if (data == null){
                            setParam("art", "");
                            return;
                        }
                        setTimeout(() => {
                            raiseOverview();
                            writeOverview(data, true);
                        }, 1000);
                    }
                }
                return 0;
            })
            .fail(function(e){
        
            });
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
        
        document.oncontextmenu = () => { return false; }
        
    });
    
}();
