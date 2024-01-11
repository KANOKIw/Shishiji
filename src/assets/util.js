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
 * 
 * @param {Degree} deg 
 * @returns {Radian}
 */
function toRadians(deg){
    return deg*(Math.PI/180);
}


/**
 * 
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
 * @param {string} message 
 */
function startLoad(message){
    $(cssName.app).show();
    $(cssName.fselector).hide();
    $(cssName.lospare)
    .removeClass("loaddoneman")
    .show();
    $(cssName.losparemsg).html(message);
}


/**
 * 
 * @param {string} html 
 */
function setLoadMessage(html){
    $(cssName.losparemsg).html(html);
}


/**
 * 
 * @param {string} [message] 
 * @param {number} [wait] 
 */
function endLoad(message, wait){
    if (message)
        setTimeout(() => {
            $(cssName.losparemsg).text(message);
        }, wait);
    setTimeout(() => {
        $(cssName.lospare).addClass("loaddoneman");
        setTimeout(() => {
            clearInterval(Intervals.load);
            $(cssName.lospare).hide();
            $(cssName.fselector).addClass("hello").show();
            $(cssName.losparemsg).text("");
        }, 950);
    }, typeof wait === "number" ? wait+1000 : wait);
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
 * @param {(event: JQuery.TriggeredEvent<any, undefined, any, any>) => void} callback 
 * @param {{forceLeft?: boolean}} [options] 
 */
function listenInterOnEnd(element, callback, options){
    if (typeof options === "undefined")
        options = {};
    $(element).on("touchstart mousedown", function(e){
        e.preventDefault();
        if (options){
            if (options.forceLeft && e.button && e.button != 0)
                return;
        }
        
        var moved = 0;
        $(this)
        .on("touchmove mousemove wheel mousewheel", onmove)
        .on("touchend mouseup mouseleave touchleave", onleave);

        function onmove(){
            e.preventDefault();
            moved++;
        }
        /**@this {HTMLElement}*/
        function onleave(e){
            e.preventDefault();
            // Tolerance!!
            if (moved <= 2)
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
    str = str.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#39;")
             .replace(/ /g, "&nbsp;");

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
    var yhere = "";

    if (key == ParamName.COORDS){
        if (urlParams.toString() != ""){
            const _h = getParam(ParamName.ZOOM_RATIO);
            yhere = here.includes("@") ? here.replace(/@.*/, "")+"@"+value+"x"+(_h === null ? 1 : _h)+"?"+urlParams.toString() : here.replace(/\?.*/, "")+"@"+value+"?"+urlParams.toString();
        } else {
            yhere = here+"@"+value;
        }
    } else if (key == ParamName.ZOOM_RATIO){
        if (urlParams.toString() != ""){
            const _c = getParam(ParamName.COORDS);
            yhere = here.includes("@") ? here.replace(/@.*/, "")+"@"+(_c === null ? "0,0" : _c)+"x"+value+"?"+urlParams.toString() : here.replace(/\?.*/, "")+"@"+value+"?"+urlParams.toString();
        } else {
            yhere = here+"@"+getParam(ParamName.COORDS)+value;
        }
    } else {
        urlParams.set(key, encodeURIComponent(String(value)));
    
        yhere = here.split("?")[0] + "?" + urlParams.toString();
    }

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

    if (key == ParamName.COORDS){
        const reg = /@([^?&]+)x([^?&]+)/;
        const _reg = /@([^?&]+)/;
        var res = url.match(reg);

        if (!res)
            res = url.match(_reg);
        
        return res ? res[1].replace(/x/g, "") : null;
    } else if (key == ParamName.ZOOM_RATIO){
        const reg = /@([^?&]+)x([^?&]+)/;
        const res = url.match(reg);

        return res ? res[2] : null;
    }

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
 * @param {number} diffratio 
 * @param {boolean} setzr
 *      set to the limit when this gets invoked
 */
function willOverflow(diffratio, setzr){
    const _r = zoomRatio*diffratio;
    
    if (MOVEPROPERTY.caps.ratio.max < _r && diffratio > 1){
        if (setzr)
            zoomRatio = MOVEPROPERTY.caps.ratio.max;
        return true;
    }
    if (MOVEPROPERTY.caps.ratio.min > _r && diffratio < 1){
        if (setzr)
            zoomRatio = MOVEPROPERTY.caps.ratio.min;
        return true;
    }

    return false;
}


/**
 * 
 * @param {string} key 
 */
function getCookie(key){
    const cookies = document.cookie.split("; ");
  
    for (const cookie of cookies) {
        const [ckey, cval] = cookie.split("=");
        if (ckey === key){
            return decodeURIComponent(cval);
        } 
    }
  
    return null;
}


/**
 * 
 * @param {string} key 
 */
function delCookie(key){
    document.cookie = `${key}=; max-age=0;`;
}


/**
 * 
 * @param {string} key 
 * @param {string} value 
 */
function setLocalStorage(key, value){
    window.localStorage.setItem(key,value);
}


/**
 * 
 * @param {string} key 
 */
function getLocalStorage(key){
    return window.localStorage.getItem(key);
}


/**
 * 
 * @param {string} key 
 */
function delLocalStorage(key){
    window.localStorage.removeItem(key);
}


/**
 * 
 * @param {string} orgname 
 * @param {string} filename 
 */
function toOrgFilepath(orgname, filename){
    return "/resources/cloud/org/"+orgname+"/"+filename;
}


/**
 * 
 * @param {string} orgname 
 * @param {string} filename 
 */
function toAdminFilepath(orgname, filename){
    return "/resources/img/static/"+orgname+"/"+filename;
}


/**
 * 
 * @param {mapObject} mapobject 
 */
function getPathConverter(mapobject){
    return mapobject.object.type.event === "org" ? toOrgFilepath : toAdminFilepath;
}


/**
 * 
 * @returns {"JA" | "EN" | null}
 */
function getUserLang(){
    const lang = navigator.language;

    return digitLang(lang);
}


/**
 * 
 * @param {string | null} lang 
 * @returns {"JA" | "EN" | null}
 */
function digitLang(lang){
    if (lang)
        switch (lang.toUpperCase()){
            case "JA":
                return "JA";
            default:
                return "EN";
        }
    else 
        return null;
}


/**
 * 
 * @param {string} link 
 * @returns {"image" | "video" | "unknown"}
 */
function getMediaType(link){
    var extension = link.split(".").slice(-1)[0].toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].indexOf(extension) !== -1) {
        return "image";
    }

    if (["mp4", "webm", "avi", "mov", "flv"].indexOf(extension) !== -1) {
        return "video";
    }

    return "unknown";
}
