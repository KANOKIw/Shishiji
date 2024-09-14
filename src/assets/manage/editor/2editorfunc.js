//@ts-check
"use strict";


/**
 * 
 * @param {boolean} [do_hadericonimg] 
 * @param {boolean} [sysmove] 
 * @param {boolean} [do_articleimg] 
 */
function rewrite(do_hadericonimg, sysmove, do_articleimg){
    /**@ts-ignore @type {HTMLElement} */
    var editor = document.getElementById("main-editor");

    var scr = $("#shishiji-overview").scrollTop();
        

    setEditorcdColor();

    const _ihtml = document.getElementById("main-editor")?.innerHTML;
    if (!sysmove){
        if (HIST_INDEX < EDITOR_HISTORY.raw.length-1)
            EDITOR_HISTORY.raw.splice(HIST_INDEX+1);
        if (_ihtml && EDITOR_HISTORY.raw.slice(-1)[0] !== _ihtml)
            EDITOR_HISTORY.raw.push(_ihtml);
        HIST_INDEX = EDITOR_HISTORY.raw.length - 1;
    }
    colhistbtn();
    
    ARTICLEDATA.article.content = editor.innerText;
    writePreviewerOverview(ARTICLEDATA, false, scr, void 0, true, true, do_articleimg, true);

    if (do_hadericonimg){
        /**
         * 
         * @param {"h" | "i"} a 
         */
        function imageRel(a){
            if (a == "h")
                this.outerHTML = `<img id="--art-header" class="article-image article header doaJSD" alt="" aria-label="${TEXTS[LANGUAGE].ARIA_ARTICLE_HEADER}">`;
            else if (a == "i")
                this.outerHTML = `<img id="--art-icon" class="article-image doaJSD" style="width: 48px" alt="" aria-label="${TEXTS[LANGUAGE].ARIA_ARTICLE_ICON}">`;
        }

        const _dummy = { outerHTML: "", };
        
        imageRel.apply(document.getElementById("no-del-image-h") || _dummy, ["h"]);
        imageRel.apply(document.getElementById("no-del-image-i") || _dummy, ["i"]);

        const t = "?"+(new Date).getTime();
        $("#--art-header").on("error", function(){ imageError.apply(this, ["h"]); }).attr("src", toOrgFilepath(username, ARTICLEDATA.article.images.header)+t);
        $("#--art-icon").on("error", function(){ imageError.apply(this, ["i"]); }).attr("src", toOrgFilepath(username, ARTICLEDATA.object.images.icon)+t);
    }
}


/**
 * 
 * @param {string} text 
 * @param {(err: Error) => void} [errcb] 
 */
function insertText(text, errcb){
    /**@ts-ignore @type {HTMLElement} */
    const editor = document.getElementById("main-editor");

    editor.focus();

    const sel = EDITORSR.selection;
    const range = EDITORSR.range;

    const textNode = document.createTextNode(text);

    try{
        range.deleteContents();
        range.insertNode(textNode);
    } catch (e){
        if (errcb)
            errcb(e);
        return;
    }

    range.setStartAfter(textNode);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);

    change_not_saved_remaining = true;
    $("#sv_msg").text("");
    $("#save_data_norm")
    .css("background-color", "rgb(247, 255, 142)")
    .css("cursor", "pointer");

    if (SETTINGS.quickInputNotification)
        PictoNotifier.notify(
            "input", text, { duration: 1000, do_not_keep_previous: true }
        );

    
    nextAutoSave();
    editor.focus();
    rewrite();
}


/**
 * 
 * @param {string} ctx
 * @param {boolean} [renewmedia] 
 * @param {() => void} [callback] 
 */
async function writePreviewerOverviewContent(ctx, renewmedia, callback){
    new Promise((resolve, reject) => {
        const shown = document.getElementById("ctx-article");
        const willbe = document.createElement("span");
        /**@type {{[key: string]: Element[]}} */
        const shownmedias = {};
        const mediatypes = [ "IMG", "VIDEO" ]


        willbe.innerHTML = ctx;

        if (!renewmedia){
            /**
             * Prevent media elements from reloading with every input to avoid flashing in the previewer.
             */
            for (const _shownchild of shown?.querySelectorAll("*") || []){
                const tagName = _shownchild.tagName.toUpperCase();
                if (!mediatypes.includes(tagName))
                    continue;
                
                const src = _shownchild.getAttribute("src")?.replace(/\?.*/, "");

                if (typeof src !== "undefined"){
                    if (shownmedias[src]?.length > 0){
                        shownmedias[src].push(_shownchild);
                    } else {
                        shownmedias[src] = [_shownchild];
                    }
                }
            }
            
            for (const _willbechild of willbe.querySelectorAll("*")){
                const tagName = _willbechild.tagName.toUpperCase();
                if (!mediatypes.includes(tagName))
                    continue;

                const src = _willbechild.getAttribute("src");

                if (src !== null){
                    const replaceables = shownmedias[src];
                    const replaceable = replaceables?.length > 0 ? replaceables[0] : _willbechild.cloneNode(true);

                    _willbechild.parentNode?.replaceChild(replaceable, _willbechild);
                    //@ts-ignore
                    replaceable.style.width = _willbechild.style.width;
                    shownmedias[src] = shownmedias[src]?.filter(elem => {
                        if (elem !== replaceable)
                            return true;
                    });
                }
            }
        } else {
            for (const _willbechild of willbe.querySelectorAll("*")){
                const tagName = _willbechild.tagName.toUpperCase();
                if (!mediatypes.includes(tagName))
                    continue;
                _willbechild.setAttribute("src", _willbechild.getAttribute("src")?.replace(/\?.*/, "")+"?"+(new Date()).getTime());
            }
        }

        $("#ctx-article").empty().append(willbe);
        resolve("");
    }).then(() => {
        if (callback !== void 0)
            callback();
    });
}


/**
 * 
 * @deprecated ****
 * @param {string} ctx
 * @param {() => void} [callback] 
 */
async function _writeOverviewContent(ctx, callback){
    new Promise((resolve, reject) => {
        const shown = document.getElementById("ctx-article");
        const willbe = document.createElement("span");
        const useds = [];
        const dids = [];


        willbe.innerHTML = ctx;
        
        for (const _shownchild of shown?.querySelectorAll("*") || []){
            if (_shownchild.tagName.toUpperCase() !== "IMG")
                continue;
            
            for (const _willbechild of willbe.querySelectorAll("*")){
                if (_willbechild.tagName.toUpperCase() !== "IMG")
                    continue;

                if (_shownchild.getAttribute("src") === _willbechild.getAttribute("src")){
                    _willbechild.parentNode?.replaceChild(_shownchild, _willbechild);
                    //@ts-ignore
                    _shownchild.style.width = _willbechild.style.width;
                    useds.push(_shownchild);
                    dids.push(_willbechild);
                    break;
                }
            }
        }

        $("#ctx-article").empty().append(willbe);
        resolve("");
    }).then(() => {
        if (callback !== void 0)
            callback();
    });
}


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
