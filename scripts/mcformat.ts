import fs from "fs";
import path from "path";
import { MCSTYLES } from "./mcformat_";


function _MCobfuscate(elem: HTMLElement, ctx: string){
    const child = document.createElement("span");
    elem.appendChild(child);
    child.innerHTML = ctx;
    child.classList.add("MCOBF", "crucial");
}


function _applyMCCode(str: string, codes: string[]){
    const len = codes.length;
    const elem = document.createElement("span");
    var obfuscated = false;

    for (var i = 0; i < len; i++){
        const style = MCSTYLES[codes[i]];
        
        if (typeof style !== "string") continue;
        elem.style.cssText += style + ";";
        if(codes[i] === "§k") {
            _MCobfuscate(elem, str);
            obfuscated = true;
        }
    }

    if (!obfuscated)
        elem.innerHTML = str;

    return elem;
}


function _parseMCFormat(str: string){
    str = str.replace(/§h/g, '<hr class="article-dv">');
    var codes = str.match(/§.{1}/g) || [],
        indexes = [],
        apply: string[] = [],
        tmpStr,
        indexDelta,
        final = document.createDocumentFragment(),
        len = codes.length,
        str = str.replace(/\n|\\n/g, "<br>");
    
    for (var i = 0; i < len; i++){
        indexes.push(str.indexOf(codes[i]));
        str = str.replace(codes[i], "\x00\x00");
    }

    if (indexes[0] !== 0){
        final.appendChild(_applyMCCode(str.substring(0, indexes[0]), []));
    }

    for (var i = 0; i < len; i++){
    	indexDelta = indexes[i+1] - indexes[i];
        if (indexDelta === 2){
            while (indexDelta === 2){
                apply.push(codes[i]);
                i++;
                indexDelta = indexes[i+1] - indexes[i];
            }
            apply.push(codes[i]);
        } else {
            apply.push(codes[i]);
        }
        if (apply.lastIndexOf("§r") > -1){
            apply = apply.slice(apply.lastIndexOf("§r")+1);
        }
        tmpStr = str.substring(indexes[i], indexes[i+1]);
        final.appendChild(_applyMCCode(tmpStr, apply));
    }
    return final;
}



async function fetchVideoAsBlob(videoUrl: string){
    try {
        const response = await fetch(videoUrl);
        return await response.blob();
    } catch(e){
        return null;
    }
}


function escapeHTML(str: string){
    str = str.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#39;")
             .replace(/ /g, "&nbsp;");

    return str;
}


function mcFormat(str: string, srcConverter: (S: string) => string){
    str = escapeHTML(str);

    str = str.replace(/\n/g, "").replace(/§v/g, "\n");

    var r = "";
    const el = _parseMCFormat(str);

    for (var e of Array.from(el.children)){
        r += e.outerHTML;
    }

    const imgreg = /∫\:IMG-S=([^-]+)-W=(\d+);∫/g;
    const vidreg = /∫\:VIDEO-S=([^-]+)-W=(\d+);∫/g;
    const linkreg = /#\:LINK-H=(https?:\/\/(?:(?!-T=).)+)-T=((?:(?!;#).)*);#/g;
    const imgmatches = r.matchAll(imgreg) || [];
    const vidmacthes = r.matchAll(vidreg) || [];
    const linkmacthes = r.matchAll(linkreg) || [];


    for (const imgmacth of imgmatches){
        const width = Number(imgmacth[2]);
        r = r.replace(imgmacth[0], `<img class="article-image doaJSD protected" loading="lazy" draggable="false" src="${srcConverter(imgmacth[1])}" style="width: ${(width > 100 || width < 0) ? 100 : width}%;">`);
    }

    for (const vidmacth of vidmacthes){
        const width = Number(vidmacth[2]);

        r = r.replace(vidmacth[0], `<video class="article-video protected" loading="lazy" draggable="false" src="${srcConverter(vidmacth[1])}" controls preload="metadata" playsinline style="width: ${(width > 100 || width < 0) ? 100 : width}%;"></video>`);
    }

    for (const linkmacth of linkmacthes){
        const href = linkmacth[1];
        r = r.replace(linkmacth[0], `<a class="article-outsidelink notprotected" draggable="true" href="${new URL(href)}" target="_blank">${(linkmacth[2].length > 0) ? linkmacth[2] : linkmacth[1]}</a>`);
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
        const obfs = document.getElementsByClassName("MCOBF");
        for (const obf of obfs){
            for (const ch of obf.childNodes){
                var content = "";
                if (ch.textContent == null)
                    continue;
                for (const char of ch.textContent.split("")){
                    const c = Math.round(Math.random() * (obfuscaters.length -1));
                    content += obfuscaters[c];
                }
                ch.textContent = content;
            }
        }
    }, 10);
    return 0;
}();




function readArticleTexts() {
    const mapObjContents: {[key: string]: string} = {};
    const directoryPath = "./resources/map-objects/";
    const files = fs.readdirSync(directoryPath);
    
    files.forEach(file => {
        if (file.endsWith("static")) return;
        
        const filePath = path.join(directoryPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const objDat = JSON.parse(fileContent);
        
        if (JSON.stringify(objDat).length < 20) return;
        
        mapObjContents[objDat.discriminator] = mcFormat(objDat.article.content, () => "");
    });
    
    const outputFilePath = "./.pickle/mapobjContents.json";
    fs.writeFileSync(outputFilePath, JSON.stringify(mapObjContents, null, 4), { encoding: "utf-8" });
}


readArticleTexts();
