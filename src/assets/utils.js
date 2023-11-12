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
 * @param {mapObject} elm 
 * @returns {Coords}
 */
function getCoords(elm){
    /**@ts-ignore @type {number[]} */
    const r = elm.getAttribute("coords")?.split(" ").map(t => { return Number(t); });
    return { x: r[0], y: r[1] };
}


/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function minecraft_formattingSystem(str){
    var cl_count = 0;
    var dec_count = 0;
    
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
                for (var i = 0; i < cl_count; i++) {
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
