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
 * @param {string | null} discriminator 
 * @returns {mapObject | null}
 */
function searchObject(discriminator){
    for (const key in mapObjectComponent){
        const data = mapObjectComponent[key];
        if (data.discriminator == discriminator) return data;
    }
    return null;
}


/**
 * 
 * @param {Coords} coords 
 * @param {number} [abs_zoomRatio] 
 */
function screenCoordsOnMiddle(coords, abs_zoomRatio){
    if (abs_zoomRatio === void 0){
        abs_zoomRatio = zoomRatio;
    }
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    const style = {
        top: window.innerHeight/2,
        left: window.innerWidth/2,
    };
    /**@type {Coords} */
    const bcoords = {
        x: (abs_zoomRatio*coords.x - style.left)/abs_zoomRatio,
        y: (abs_zoomRatio*coords.y - style.top)/abs_zoomRatio,
    };

    zoomRatio = abs_zoomRatio;
    backcanvas.canvas.coords = bcoords;
    moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
}
