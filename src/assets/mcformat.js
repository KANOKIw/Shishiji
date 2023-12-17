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
 * @param {(S: string) => string} srcConverter 
 * @returns {string}
 */
function mcFormat(str, srcConverter){
    str = escapeHTML(str);

    str = str.replace(/\n/g, "").replace(/§v/g, "\n");

    var r = "";
    const el = _parseMCFormat(str);

    for (var e of Array.from(el.children)){
        r += e.outerHTML;
    }

    const imgreg = /%:IMG-S=([^\-]+)-W=(\d+);%/g;
    const vidreg = /%:VIDEO-S=([^\-]+)-W=(\d+);%/g;
    const linkreg = /#:LINK-H=(https?:\/\/?[\w.]+\.\w+\/?\S*)-T=(.*?);#/g;
    const imgmatches = r.matchAll(imgreg) || [];
    const vidmacthes = r.matchAll(vidreg) || [];
    const linkmacthes = r.matchAll(linkreg) || [];

    for (const imgmacth of imgmatches){
        const width = Number(imgmacth[2]);
        r = r.replace(imgmacth[0], `<img class="article-image" src="${srcConverter(imgmacth[1])}" style="width: ${(width > 100 || width < 0) ? 100 : width}%;">`);
    }

    for (const vidmacth of vidmacthes){
        const width = Number(vidmacth[2]);
        r = r.replace(vidmacth[0], `<video class="article-video" src="${srcConverter(vidmacth[1])}#t=0.001" controls preload="metadata" playsinline style="width: ${(width > 100 || width < 0) ? 100 : width}%;"></video>`);
    }

    for (const linkmacth of linkmacthes){
        r = r.replace(linkmacth[0], `<a class="article-outsidelink" href="${new URL(linkmacth[1])}" style="color: #5555ee;" target="_blank">${(linkmacth[2].length > 0) ? linkmacth[2] : linkmacth[1]}</a>`);
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
