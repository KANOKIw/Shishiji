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
