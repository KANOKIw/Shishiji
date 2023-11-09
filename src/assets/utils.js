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
