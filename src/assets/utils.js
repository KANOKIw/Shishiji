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
    const p = x;
    Intervals.load = setInterval(function(){
        //@ts-ignore
        i.style.transform = `rotateY(${t}deg)`;
        t++;
    }, 1);
}


function endLoad(){
    $("#load_spare").addClass("loaddoneman");
    clearInterval(Intervals.load);
    setTimeout(() => {
        $("#load_spare").hide();
        $("#place-selector").addClass("hello").show();
    }, 1000);
}


function setPlaceSelColor(p){
    if (p === void 0) p = CURRENT_FLOOR;
    $(".placeOpt").each(function(index, elm){
        if (!this.textContent) return;
        const text = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
        if (text === p)
            $(this).css("background-color", "rgba(0, 100, 0, 0.699)");
        else if (text.length > 1)
            $(this).css("background-color", "rgba(188, 255, 255, 0.699)");
    });
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
