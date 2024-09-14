//@ts-check
"use strict";


/**
 * Return with success data.
 * @param {string} text 
 * @param {boolean} [isHTML] 
 */
function decorateFonts(text, isHTML){
    const res = { result: text, found: false };
    const p = text;

    for (const sectionkey in DOFONTS){
        if (!text.includes(sectionkey))
            continue;
        if (isHTML){
            const _element = document.createElement("span");
            
            _element.innerHTML = text;
            for (const child of _element.childNodes){
                //@ts-ignore
                if (child.tagName?.toUpperCase() === "SPAN" && child.textContent === sectionkey){console.log(child)
                    child.remove();}
            }
            
            if (!_element.innerHTML.includes(sectionkey))
                continue;
        }
        text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DOFONTS.defaultcls}">${sectionkey}</span>`);
    }

    if (p != text){
        res.found = true;
        res.result = text;
    }
    
    return res;
}


/**
 * 
 * @param {string} htmlLike 
 */
function visibleOnlyEndSpace(htmlLike){
    htmlLike = htmlLike.replace(/\u00A0/g, " ");
    return htmlLike.replace(/(&nbsp;|　)+<br>/g, function(match){
        const points = match.replace(/&nbsp;/g, "·").replace(/　/g, "・").slice(0, -"<br>".length);
        return `<span class="sheart35">${points}</span><br>`;
    });
}


/**
 * 
 * @param {string} str 
 */
function legalHTML(str){
    return escapeHTML(str)
           .replace(/\u00A0/g, " ")
           .replace(/\n/g, "<br>")
           .replace(/ /g, "&nbsp;");
}


/**
 * 
 * @param {string} str 
 */
function replaceTab(str){
    return str.replace(/	/g, "  ")
}


/**
 * 
 * @param {string} text 
 */
function tranparentedXtext(text){
    return text.replace(/\n/g, "<br>");
}


/**
 * 
 * @param {string} text 
 */
function parseXtext(text){
    return text.replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&nbsp;/g, " ")
                .replace(/<br>/g, "\n");
}


function allowNsave(){
    if (lscontent === ARTICLEDATA.article.content){
        $("#save_data_norm")
        .css({
            "background-color": "rgb(144 149 81)",
            "cursor": "not-allowed",
        });
        return false;
    } else {
        $("#save_data_norm")
        .css({
            "background-color": "rgb(247, 255, 142)",
            "cursor": "pointer",
        });
        return true;
    }
}


function colhistbtn(){
    class D{
        /**@ts-ignore @type {CSSStyleDeclaration} */
        style = {};
        classList = { add: ()=>{}, remove: ()=>{} };
    }
    const undob = document.getElementById("__undo_-") || new D();
    const redob = document.getElementById("__redo_-") || new D();

    if (HIST_INDEX <= 0){
        undob.style.backgroundColor = HIST_COLOR.unhistable;
        undob.style.cursor = "not-allowed";
    } else {
        undob.style.backgroundColor = "";
        undob.style.cursor = "pointer";
    }
    if (HIST_INDEX >= EDITOR_HISTORY.raw.length-1){
        redob.style.backgroundColor = HIST_COLOR.unhistable;
        redob.style.cursor = "not-allowed";
    } else {
        redob.style.backgroundColor = "";
        redob.style.cursor = "pointer";
    }
}


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
