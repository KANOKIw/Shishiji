(() => {
    //@ts-check
    
    
    
    /**
     * @typedef {import("../../shishiji-dts/objects").MapObject} DmapObject
    */
    
    
    const secReg = /(§[a-zA-Z0-9]){1}/g,
        session = getCookie(SESSIONKEY),
        orgCloudfi = { maxsize: 0 },
        /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
        _t = { a: 0, },
        /**@type {{raw: string[], colored: string[]}} */
        EDITOR_HISTORY = { raw: [], colored: [] },
        HIST_COLOR = { unhistable: "rgb(143 73 73)", histable: "rgb(255, 142, 142)" },
        /**@type {{[key: string]: string}} */
        DOCORATION_TEXT = {
            "黒": "§0",
            "暗い青": "§1",
            "暗い緑": "§2",
            "暗い水色": "§3",
            "暗い赤": "§4",
            "暗い紫": "§5",
            "金色": "§6",
            "灰色": "§7",
            "暗い灰色": "§8",
            "青色": "§9",
            "緑色": "§a",
            "水色": "§b",
            "赤色": "§c",
            "ピンク": "§d",
            "黄色": "§e",
            "白色": "§f",
    
            "Mark1": "§j",
            "Mark2": "§i",
            "Mark3": "§p",
            "Mark4": "§g",
            "横線": "§h",
    
            "大lvl.1": "§z",
            "大lvl.2": "§y",
            "大lvl.3": "§x",
            "太字": "§l",
            "更に太字": "§L",
            "下線": "§n",
            "italic": "§o",
            "中線": "§m",
            "改行": "§v",
    
            "リセット": "§r",
        },
        DOCOLS = {
            "§0": "sheart1",
            "§1": "sheart2",
            "§2": "sheart3",
            "§3": "sheart4",
            "§4": "sheart5",
            "§5": "sheart6",
            "§6": "sheart7",
            "§7": "sheart8",
            "§8": "sheart9",
            "§9": "sheart10",
            "§a": "sheart11",
            "§b": "sheart12",
            "§c": "sheart13",
            "§d": "sheart14",
            "§e": "sheart15",
            "§f": "sheart16",
            "§h": "sheart99",
    
            "§j": "sheart100",
            "§i": "sheart101",
            "§p": "sheart102",
            "§g": "sheart103",
        },
        DOSTS = {
            "§l": "sheart17",
            "§n": "sheart18", 
            "§o": "sheart19",
            "§m": "sheart26",
        },
        DODEFS = {
            "§x": "sheart28",
            "§y": "sheart29",
            "§z": "sheart30",
            defaultcls: "sheart31",
        },
        DOFONTS = {
            "§q": "sheart36",
            "§w": "sheart37",
            "§t": "sheart38",
            "§u": "sheart39",
            defaultcls: "sheart40",
        },
        EDITORSR = {
            range: Range.prototype,
            selection: Selection.prototype,
        },
        accepted_cloudfileExtensions = [
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".avi", ".mov", ".flv"
        ],
        DURATION_BETWEEN_LAST_EDIT_AND_AUTO_SAVE = 2000,
        WRITE_PREVIEW_COOLDOWN = 250,
        _zrs = [
            0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9,
            1,
            1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5
        ],
        _zr = Number(getLocalStorage(ZOOMRATIOKEY)),
        _top = Number(getLocalStorage(TOPKEY)),
        PVSTATUS = {
            zooms: { delta: 1.1, max: 5, min: 0.4,
                ratios: _zrs, ratio: _zrs.includes(_zr) ? _zr : 1,
            },
            moves: {
                delta: 20,
                top: isNaN(_top) ? 0 : _top,
            }
        };
    var username = "",
        /**@ts-ignore @type {DmapObject} */
        ARTICLEDATA = {},
        change_not_saved_remaining = false,
        /**@ts-ignore @type {NodeJS.Timeout} */
        kes = 0,
        HIST_INDEX = 0,
        STORAGESAVES,
        gglmats,
        /**@type {mapObject} */
        lastsaved,
        LOADW = 0,
        scriptlen = 16,
        lscontent = "";
    
    
    try {
        STORAGESAVES = JSON.parse(getLocalStorage(EDITORCONFIGKEY) || "{}");
    } catch (e){
        STORAGESAVES = {};
        delLocalStorage(EDITORCONFIGKEY)
    }
    
    for (const G of document.getElementsByTagName("script")){
        const src = G.src;
        if (src && src.includes("/src/assets/manage/editor/"))
            scriptlen++;
    }
    
    const SETTINGS = { 
        autosave: STORAGESAVES[AUTOSAVEKEY] === true ? true : true,
        autosaveNotification: STORAGESAVES[AUTOSAVENOTIFICATIONKEY] === false ? false : true,
        colorEditor: STORAGESAVES[COLOREDITORKEY] === false ? false : true,
        instapreview: STORAGESAVES[INSTAPREVIEWKEY] === true ? true : false,
        quickInputNotification: STORAGESAVES[QUICKINPUTNOTIFICATIONKEY] === false ? false : true,
        visibleSpace: STORAGESAVES[VISIBLESPACEKEY] === false ? false : true,
        visibleOnlyEndSpace: STORAGESAVES[VISIBLEONLYENDSPACEKEY] === false ? false : true,
        solidObject: STORAGESAVES[SOLIDOBJECTKEY] === false ? false : true,
        _solidObject: STORAGESAVES[_SOLIDOBJECTKEY] === false ? false : true,
    };
    var logout_is_peiding = false;
    
    
    /**
     * 
     * @param {any} [force] 
     *     `if (this instanceof HTMLElement) denyforce();`
     */
    function leaveherep(force){
        function f(){
            logout_is_peiding = false;
            delCookie(SESSIONKEY); 
            window.history.replaceState("", "", "/org/manage/login");
            window.location.assign("/org/manage/login");
        }
    
        logout_is_peiding = true;
        $.ajax({
            type: "POST",
            url: "/org/manage/auth/logout",
            timeout: 5000,
            data: { session: session },
            success: f,
            error: () => {
                logout_is_peiding = false;
                if (force === true && !(this instanceof HTMLElement)){
                    f();
                    return;
                }
                if (this instanceof HTMLElement)
                    $(this)
                    .text("ログアウト")
                    .css("color", "black");
                PictoNotifier.notify("error", "通信エラー", { duration: 10000, do_not_keep_previous: true, deny_userclose: true });
            }
        });
    }
    
    
    /**
     * 
     * @param {{over?: string; under?: string;}} [messages] 
     */
    function loadsProgBar(messages){
        const loadmsg = `<h4>${messages?.over || ""}</h4><div id="map_load_progress"><div id="ml_progress"></div></div><h4>${messages?.under || ""}</h4>`;
    
        startLoad(loadmsg);
        
        return function d(p){
            //@ts-ignore
            //document.getElementById("map_load_progress").children[0].style.width = p + "%";
            return d;
        }
    }
    
    
    /**
     * 
     * @param {Event} e 
     */
    function preventDefault(e){
        e.preventDefault();
    }
    
    
    window.addEventListener("gesturestart", preventDefault, { passive: false });
    
    
    window.addEventListener("dblclick", preventDefault, { passive: false });
    
    
    window.addEventListener("click", function(e){
        const target = e.target;
        //@ts-ignore
        if (target.tagName.toUpperCase() === "VIDEO" && target.classList.contains("cloudfileel") && target.classList.contains("cloudsh"))
            e.preventDefault();
    }, { passive: false });
    
    
    window.addEventListener("DOMContentLoaded", function(){
        document.getElementById("shishiji-overview")?.addEventListener("click", preventDefault, { passive: false });
    });
    
    
    document.getElementById("__cover__")?.remove();
    
    
    const updatestartupProgress = loadsProgBar({ over: "Welcome to Shishiji Editor" })(0);
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    /**
     * 
     * @param {"h" | "i"} a 
     */
    function imageError(a){
        try{
            if (a == "h")
                this.outerHTML = `<div id="no-del-image-h" class="flxxt nImg-a">${GPATH.ERROR_ZAHUMARU}<h4>No Image</h4></div>`;
            else if (a == "i")
                this.outerHTML = `<div id="no-del-image-i" class="flxxt no-del-image" style="width:48px;height:48px;">${GPATH.ERROR_ZAHUMARU}</div>`;
        } catch(e){}
    };
    
    
    /**
     * 
     * @param {mapObject} details 
     * @param {boolean} fadein 
     * @param {number} [scroll_top]
     * @param {string} [target] 
     * @param {boolean} [FORCE] 
     * @param {boolean} [_fadein] 
     * @param {boolean} [renewimg] 
     * @param {boolean} [whaaatifh]
     */
    function writePreviewerOverview(details, fadein, scroll_top, target, FORCE, _fadein, renewimg, whaaatifh){
        /**@ts-ignore @type {HTMLElement} */
        const ctx = document.getElementById("overview-context");
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const color = (details.article.theme_color) ? details.article.theme_color : "black";
        const font = (details.article.font_family) ? details.article.font_family : "";
    
        var article_mainctx = mcFormat(details.article.content, fn => { return toOrgFilepath(username, fn); });
    
    
        if (!window.navigator.onLine){
            PictoNotifier.notify(
                "error",
                TEXTS[LANGUAGE].NOTIFICATION_CONNECTION_ERROR,
                {
                    duration: 2500,
                    discriminator: "article connection error",
                    do_not_keep_previous: true
                }
            );
            $("#ovv-ctx-loading").html(`<div class="flxxt"><div style="width:40%;">${GPATH.ERROR_ZAHUMARU}</div></div>${TEXTS[LANGUAGE].ARTICLE_CONNECTION_ERROR}`);
            $("#overview-share").hide();
            return;
        }
        
        if (article_mainctx === "<span></span>"){
            article_mainctx = `<h4 style="width: 100%; margin-top: 50px; margin-bottom: 50px; text-align: center;">${TEXTS[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
        }
    
        var custom_tr = "";
    
        for (var tr of details.article.custom_tr){
            if (tr.title && tr.content)
                custom_tr += `
                    <tr class="ev_property">
                        <th class="ev_property_cell" aria-label="${tr.title}">
                            ${tr.title}
                        </th>
                        <th class="ev_property_cell" aria-label="${tr.content}">
                            ${tr.content}
                        </th>
                    </tr>
                `;
        }
    
        if (fadein)
            $(ctx).addClass("fadein");
        
        overview.style.borderTop = "solid var(--shishiji-ovv-theme-height) "+color;
        $(overview).css("font-family", font);
    
        const EVENT_HEADER = `<img id="--art-header" class="article-image article header" alt="" aria-label="${TEXTS[LANGUAGE].ARIA_ARTICLE_HEADER}"><div class="article titleC"><img id="--art-icon" class="article-image" style="width: 48px" alt="" aria-label="${TEXTS[LANGUAGE].ARIA_ARTICLE_ICON}"><h1 id="ctx-title" style="margin: 5px; font-family: var(--font-view);">${escapeHTML(details.article.title)}</h1></div>`;
    
    
        function __onload(){
            setTimeout(() => {
                if (scroll_top !== void 0)
                    $("#shishiji-overview").scrollTop(scroll_top);
                scroll_top = 0;
            }, 25);
        }
    
        var glen = 0;
        /**@this {HTMLElement} */
        function showDescription(){
            var glens = 0;
            if ($(this).hasClass("tg-active") && (!FORCE || glen > 0))
                return;
            
            if (!whaaatifh || glen > 0) $("#ctx-article").hide().removeClass("fadein").removeClass("_fadein");
            if (glen > 0) glens++;
            glen++;
            $("#oop").show();
    
            writePreviewerOverviewContent(article_mainctx, renewimg, __onload);
            $("#core_grade_vh").text(ARTICLEDATA.article.core_grade);
            if (!$("#ovv-t-description-sd").hasClass("tg-active"))
            $(".tg-active").removeClass("tg-active");
            $(this).addClass("tg-active");
            $(".article-image").addClass("doaJSD");
            setTimeout(() => (!whaaatifh || glens == 1) ? $("#ctx-article").show().addClass("_fadein") : void 0, 5);
        }
    
        /**@this {HTMLElement} */
        function showDetails(){
            if ($(this).hasClass("tg-active"))
                return;
    
            $("#ctx-article").hide().removeClass("fadein").removeClass("_fadein");
            $("#oop").hide();
    
            const container = document.createElement('div');
            container.className = 'ev_property';
            const hr1 = document.createElement('hr');
            hr1.style.margin = '20px';
            hr1.style.marginTop = "40px";
            container.appendChild(hr1);
            const table = document.createElement('table');
            table.style.width = '100%';
            const tbody = document.createElement('tbody');
            tbody.className = 'ev_property';
            const tr = document.createElement('tr');
            tr.className = 'ev_property';
            const th1 = document.createElement('th');
            th1.className = 'ev_property_cell';
            th1.setAttribute('aria-label', '開催場所');
            th1.textContent = '開催場所';
            const th2 = document.createElement('th');
            th2.className = 'ev_property_cell';
            th2.setAttribute('aria-label', details.article.venue);
            th2.textContent = details.article.venue;
            tr.appendChild(th1);
            tr.appendChild(th2);
            tbody.appendChild(tr);
            table.appendChild(tbody);
            container.appendChild(table);
            const hr2 = document.createElement('hr');
            hr2.style.margin = '20px';
            container.appendChild(hr2);
    
            writePreviewerOverviewContent(`
                <hr style="margin: 40px 20px 20px 20px;">
                <div class="ev_property">
                    <table style="width: 100%;">
                        <tbody>
                            <tr class="ev_property">
                                <th class="ev_property_cell" aria-label="開催場所">
                                    開催場所
                                </th>
                                <th class="ev_property_cell" aria-label="${details.article.venue}">
                                    ${details.article.venue}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr style="margin: 20px;">
            `, renewimg, __onload);
    
            $("#ctx-article").removeClass("fadein").removeClass("_fadein");
            $(".tg-active").removeClass("tg-active");
            $(this).addClass("tg-active");
            $(".article-image").addClass("doaJSD");
            setTimeout(() => $("#ctx-article").show().addClass("_fadein"), 5);
        }
        
        /**@this {HTMLElement} */
        function showCommands(){
            if ($(this).hasClass("tg-active"))
                return;
    
            $("#ctx-article").addClass("_wait_f");
            $("#oop").hide();
    
            writePreviewerOverviewContent(`
                <div class="sajNF">
    
                </div>
            `, renewimg, __onload);
    
            $("#ctx-article").removeClass("fadein").removeClass("_fadein");
            $(".tg-active").removeClass("tg-active");
            $(this).addClass("tg-active");
            $(".article-image").addClass("doaJSD");
        }
    
        $("#ovv-t-description-sd").off("click", Ovv_tg_listener.description).on("click", showDescription);
        $("#ovv-t-details-sd").off("click", Ovv_tg_listener.details).on("click", showDetails);
        $("#ovv-t-else-sd").off("click", Ovv_tg_listener.commands).on("click", showCommands);
        Ovv_tg_listener.description = showDescription;
        Ovv_tg_listener.details = showDetails;
        Ovv_tg_listener.commands = showCommands;
    
        if (!target || !["description", "details", "else"].includes(target))
            target = "description";
        
        document.getElementById(`ovv-t-${target}-sd`)?.dispatchEvent(new Event("click"));
    }
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
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
    
    
    
    
    function setEditorcdColor(){
        const ncoloredText = document.getElementById("main-editor")?.innerText || "";
        const colorRes = colorXtext(ncoloredText);
        const editor = $("#main-editor");
        const editorcd = $("#main-editor-cd");
        var gCos = editor.html().replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
        var cdHTML = gCos;
    
        
        if (SETTINGS.colorEditor || SETTINGS.solidObject){
            if (Object.keys(colorRes.removebrs).length > 0){
                var lineBreaks = 0;
                for (var [rmpls, rmd] of Object.entries(colorRes.removebrs)){
                    lineBreaks += (rmpls.match(/<br>/g) || []).length;
                    rmpls = rmpls.replace(/\u00A0/g, " ");
                    cdHTML = cdHTML.replace(rmpls.replace(/ /g, "&nbsp;"), rmd);
                }
                const single = lineBreaks <= 1;
                editor
                .trigger("blur")
                .html(cdHTML.replace(/ /g, "&nbsp;").replace("	", "   "));
                PictoNotifier.notify(
                    "info",
                    `Oops, you can't insert ${single ? "a " : ""}line break${single ? "" : "s"} there!!`,
                    {
                        discriminator: "no line break there",
                        do_not_keep_previous: true
                    }
                );
            }
        }
    
    
        if (SETTINGS.colorEditor){
            /**
             * Transparented main editor text size fitter!!
             * This is awesome!!
             */
            /*const fontcolorres = colorFonts(editor.html(), true);
            if (fontcolorres.found)
                editor
                .trigger("blur")
                .html(
                    fontcolorres.result
                );*/
            cdHTML = colorRes.text;
        }
    
    
        if (SETTINGS.visibleSpace){
            if (SETTINGS.visibleOnlyEndSpace)
                cdHTML = visibleOnlyEndSpace(cdHTML);
            else
                cdHTML = visibleSpace(cdHTML);
        }
    
        editorcd.html(cdHTML);
    }
    
    
    /**
     * 
     * @param {string | null | undefined} text 
     * @returns {{text: string, removebrs: {[key: string]: string} | {}}}
     */
    function colorXtext(text){
        if (text === null || text === void 0)
            return { text: "", removebrs: {} };
    
        const htmlParser = document.createElement("span");
    
        text = legalHTML(text);
    
        for (const sectionkey in DOCOLS){
            text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DOCOLS[sectionkey]}">${sectionkey}</span>`);
        }
    
        for (const sectionkey in DOSTS){
            text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DOSTS[sectionkey]}">${sectionkey}</span>`);
        }
        
        for (const sectionkey in DODEFS){
            text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DODEFS.defaultcls}">${sectionkey}</span>`);
        }
    
        text = decorateFonts(text).result;
        text = text.replace(/§v/g, `<span class="sheart32">§v</span>`);
        text = text.replace(/§r/g, `<span class="sheart33">§r</span>`);
        text = text.replace(/§k/g, `<span class="sheart34">§<span class="MCOBF">r</span></span>`);
    
    
        /**
         * 
         * @param {string} htmlLike 
         */
        function getTextContent(htmlLike){
            htmlParser.innerHTML = htmlLike;
            return htmlParser.textContent || "";
        }
    
        
        const removebrs = {};
        const Regs = {
            image: /∫\:(IMG)-S=([^-]+)-W=(\d+);∫/,
            video: /∫\:(VIDEO)-S=([^-]+)-W=(\d+);∫/,
            link: /#\:LINK-H=(https?:\/\/(?:(?!-T=).)+)-T=((?:(?!;#).)*);#/
        };
        const mediable = text.matchAll(/∫(?:(?!∫).)+∫/g);   //*/const mediable = text.matchAll(/(∫:(?:(?!;∫).)+;∫)|(∫<br>:(?:(?!;∫).)+;∫)|(∫:(?:(?!;<br>∫).)+;<br>∫)/g);
        const linkable = text.matchAll(/#(?:(?!#).)+#/g);   //*/const linkable = text.matchAll(/(#:(?:(?!;#).)+;#)|(#<br>:(?:(?!;#).)+;#)|(#:(?:(?!;<br>#).)+;<br>#)/g);
        
    
        for (const mediam of mediable){
            const matchHTML = mediam[0];
            const _componented = getTextContent(matchHTML);
            const thismatch = Regs.image.exec(_componented) || Regs.video.exec(_componented);
       
            if (thismatch){
                const type = thismatch[1];
                const src = thismatch[2].replace(/ |\u00A0/g, "&nbsp;");
                const width = thismatch[3];
                const colored = `<span class="sheart22">∫:${type}-S=<span class="sheart23">${src}</span>-W=<span class="sheart23">${width}</span>;∫</span>`;
    
                text = text.replace(matchHTML, colored);
                if (matchHTML.includes("<br>"))
                    removebrs[matchHTML] = _componented;
            }
        }
    
        for (const linkm of linkable){
            const matchHTML = linkm[0];
            const _componented = getTextContent(matchHTML);
            const thismatch = Regs.link.exec(_componented);
            
            if (thismatch){
                const href = thismatch[1].replace(/ |\u00A0/g, "&nbsp;");
                const _text = thismatch[2].replace(/ |\u00A0/g, "&nbsp;");
                const colored = `<span class="sheart24">#:LINK-H=<span class="sheart25">${href}</span>-T=<span class="sheart25">${_text}</span>;#</span>`;
            
                text = text.replace(matchHTML, colored);
                if (matchHTML.includes("<br>"))
                    removebrs[matchHTML] = _componented;
            }
        }
    
        
        htmlParser.remove();
        return { text: text, removebrs: removebrs };
    }
    
    
    /**
     * 
     * @param {string} htmlLike 
     */
    function visibleSpace(htmlLike){
        htmlLike = htmlLike.replace(/\u00A0/g, " ");
        return htmlLike.replace(/(&nbsp;)+/g, function(match){
            const points = "·".repeat(match.length / "&nbsp;".length);
            return `<span class="sheart35">${points}</span>`;
        }).replace(/　+/g, function(match){
            console.log(match)
            const points = "・".repeat(match.length);
            return `<span class="sheart35">${points}</span>`;
        });
    }
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
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
    
    
    
    
    /**
     * @returns {boolean}
     */
    function isSavable(){
        function _(){
            if ($(this).css("background-color") == "rgb(247, 255, 142)")
                return true;
            else
                return false;
        }
        return _.call(document.getElementById("save_data_norm"));
    }
    
    
    /**
     * @this {HTMLElement}
     * @param {boolean} [do_not_showmessage] 
     * @param {() => void} [donecallback] 
     * @param {() => void} [errorcallback] 
     */
    function saveMainEditorctx(do_not_showmessage, donecallback, errorcallback){
        if (!isSavable())
            return;
    
        $("#sv_msg").text("保存しています...").css("color", "orange");
        $("#save_data_norm")
        .css("background-color", "rgb(144 149 81)")
        .css("background-color", "rgb(144 149 81)");
    
        setTimeout(() => {
            $.post("/org/manage/edit/savemain", { session: session, nmap: JSON.stringify(ARTICLEDATA) })
            .done(d => {
                change_not_saved_remaining = false;
                lastsaved = ARTICLEDATA;
                lscontent = ARTICLEDATA.article.content;
    
                clearTimeout(_t.a);
    
                if (!do_not_showmessage){
                    $("#sv_msg").text("保存しました").css("color", "green");
                    _t.a = setTimeout(() => {
                        $("#sv_msg").text("");
                    }, 3000);
                }
                $("#save_data_norm")
                .css({
                    "background-color": "rgb(144 149 81)",
                    "cursor": "not-allowed",
                });
    
                rewrite(false, true);
                if (donecallback)
                    donecallback();
            })  
            .catch(err => {
                clearTimeout(_t.a);
                allowNsave();
                $("#sv_msg").text("失敗しました").css("color", "red");
                _t.a = setTimeout(() => {
                    $("#sv_msg").text("");
                }, 3000);
    
                if (errorcallback)
                    errorcallback();
            });
        }, 250);
    }
    
    
    function setLineN(){
        const brs = $("#main-editor").html().matchAll(/<br>/g);
        const bns = $("#main-editor").html().matchAll(/\n/g);
        
        $("#main-editor-linen").html("");
        var i = 1;
        for (const r of brs){
            $("#main-editor-linen").append(i+"<br>");
            i++;
        }
        for (const n of bns){
            $("#main-editor-linen").append(i+"<br>");
            i++;
        }
    }
    
    
    function nextAutoSave(){
        clearTimeout(kes);
        if (SETTINGS.autosave){
            kes = setTimeout(() => {
                if (!isSavable())
                    return;
                PictoNotifier.notifySave("オートセーブ中...", { duration: 30000 });
                saveMainEditorctx.apply(document.getElementById("save_data_norm"), [true, () => {
                    $("#sv_msg").text("オートセーブ完了").css("color", "green");
                    if (SETTINGS.autosaveNotification)
                        PictoNotifier.notify("save", "オートセーブ完了");
                }, () => {
                    allowNsave();
                    $("#sv_msg").text("オートセーブ失敗").css("color", "red");
                    PictoNotifier.notify("error", "オートセーブに失敗");
                }]);
            }, DURATION_BETWEEN_LAST_EDIT_AND_AUTO_SAVE);
        }
    }
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    setInterval(() => {
        var sel = window.getSelection();
        //@ts-ignore
        if (!sel || (sel.anchorNode?.parentElement?.id != "main-editor" && sel.anchorNode?.id != "main-editor"))
            return;
        try {
            var rag = sel.getRangeAt(0);
            EDITORSR.selection = sel;
            EDITORSR.range = rag;
        } catch(e){}
    }, 1);
    
    $("#app-mount").show();
    
    $.ajaxSetup({ async: false });
    $.post("/org/manage/auth/editor", { session: session, type: "Editor" })
    .done(data => {
        const error = data.error;
    
        username = data.usn;
        
        if (error)
            leaveherep();
    
        ARTICLEDATA = lastsaved = data.artdata;
        lscontent = ARTICLEDATA.article.content;
        orgCloudfi.maxsize = data.mxcs;
    })
    .catch(leaveherep);
    $.ajaxSetup({ async: true });
    
    
    if (!ARTICLEDATA || Object.keys(ARTICLEDATA).length < 1){
        ARTICLEDATA = lastsaved = {
            article: {
                title: "orgname",
                subtitle: "",
                core_grade: "...",
                theme_color: "#000000",
                content: "",
                crowd_status: 0,
                font_family: null,
                custom_tr: [],
                images: {
                    header: "",
                },
                venue: "",
                schedule: "",
            },
            object: {
                type: {
                    event: "org",
                    behavior: "dynamic"
                },
                coordinate: {
                    x: 0,
                    y: 0
                },
                images: {
                    icon: "",
                },
                size: {
                    width: 50,
                    height: 50
                },
                floor: "2F",
            },
            discriminator: ""
        };
    };
    
    $("#username-d").text(username);
    $("#main-editor").html(tranparentedXtext(escapeHTML(ARTICLEDATA.article.content)));
    setEditorcdColor();
    $("#ctx-title").text(ARTICLEDATA.article.title || "NAME");
    
    
    Array.from(document.getElementsByClassName("motd-dec-b")).forEach((l) => {
        l.addEventListener("click", function(e){
            e.preventDefault();
            const color = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
            if (color == void 0)
                return;
            const decorator = DOCORATION_TEXT[color] || "§k";
    
            insertText(decorator);
        }, { passive: false });
    });
    
    
    var doing = false;
    var remaining = false;
    function nextWrite(){
        if (doing){
            remaining = true;
        } else {
            doing = true;
            setTimeout(() => {
                write();
                doing = false;
                if (remaining){
                    remaining = false;
                    nextWrite();
                }
            }, WRITE_PREVIEW_COOLDOWN);
        }
    }
    
    
    function write(){
        const scr = $("#shishiji-overview").scrollTop();
        writePreviewerOverview(ARTICLEDATA, false, scr, void 0, true, true, void 0, true);
    }
    
    
    document.getElementById("main-editor")?.addEventListener("input", function(e){
        const me = $("#main-editor");
    
        // Illegal TAB
        if (me.text().includes("	")){
            me
            .html(
                replaceTab($("#main-editor").html()).replace(/ /g, "&nbsp;")
            )
            .trigger("blur");
        }
    
        change_not_saved_remaining = true;
        $("#sv_msg").text("");
        setEditorcdColor();
        
        const _ihtml = document.getElementById("main-editor")?.innerHTML;
    
        if (HIST_INDEX < EDITOR_HISTORY.raw.length-1){
            EDITOR_HISTORY.raw.splice(HIST_INDEX+1);
        }
        if (_ihtml && EDITOR_HISTORY.raw.slice(-1)[0] !== _ihtml)
            EDITOR_HISTORY.raw.push(_ihtml);
        HIST_INDEX = EDITOR_HISTORY.raw.length - 1;
        colhistbtn();
        
        ARTICLEDATA.article.content = parseXtext(this.innerHTML);
        if (SETTINGS.instapreview)
            write();
        else
            nextWrite();
    
        if (!allowNsave())
            change_not_saved_remaining = false;
        nextAutoSave();
    });
    
    
    document.getElementById("main-editor")?.addEventListener("keydown", function(ke){
        const key = ke.key.toUpperCase();
        if (key === "TAB"){
            ke.preventDefault();
            // Indent Using Spaces: 4
            insertText("    ");
        }
    }, { passive: false });
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    document.getElementById("smthElse")?.addEventListener("click", function(e){
        Popup.popupContent(`
        <div class="protected aioshud" id="ppupds" style="display:flex;align-items:center;justify-content:center;flex-flow:column;">
            <h4 style="padding-top: 5px;">テーマカラー</h4>
            <input type="color" id="theme_color_picker" value="${ARTICLEDATA.article.theme_color}">
            <hr class="dhr-ppo rsgafwad">
            <h4>フォント</h4>
            <select id="font_family_input">
                <option value="">標準</option>
                <option value="Horror">ホラー</option>
                <option value="Handwritten">手書き風</option>
                <option value="Calligraphed">筆記体</option>
            </select>
            <div style="width: 95%;margin-top:8px;">
                <div class="oodAOIj">
                    <div class="oodaji">
                        <span style="font-size:12px;" class="flxxt">
                            <p>標準</p>
                            <div class="code-pre ASOKJjmm">
                                <span class="sheart40">§q</span>
                            </div>
                        </span>
                        <div id="sans-serif-pre" class="jkhafuis">
                            <span class="sheart36">あいう 亜伊卯 abc 123</span>
                        </div>
                    </div>
                    <div class="oodaji">
                        <span style="font-size:12px;" class="flxxt">
                            <p>ホラー</p>
                            <div class="code-pre ASOKJjmm">
                                <span class="sheart40">§w</span>
                            </div>
                        </span>
                        <div id="horror-pre" class="jkhafuis">
                            <span class="sheart37">あいう 亜伊卯 abc 123</span>
                        </div>
                    </div>
                    <div class="oodaji">
                        <span style="font-size:12px;" class="flxxt">
                            <p>手書き風</p>
                            <div class="code-pre ASOKJjmm">
                                <span class="sheart40">§t</span>
                            </div>
                        </span>
                        <div id="handwritten-pre" class="jkhafuis">
                            <span class="sheart38">あいう 亜伊卯 abc 123</span>
                        </div>
                    </div>
                    <div class="oodaji">
                        <span style="font-size:12px;" class="flxxt">
                            <p>筆記体</p>
                            <div class="code-pre ASOKJjmm">
                                <span class="sheart40">§u</span>
                            </div>
                        </span>
                        <div id="calligraphed-pre" class="jkhafuis">
                            <span class="sheart39">あいう 亜伊卯 abc 123</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="dhr-ppo rsgafwad">
            <h4>中心学年</h4>
            <select id="core_grade_input">
                <option value="...">特になし</option>
                <option value="1年生">1年生</option>
                <option value="2年生">2年生</option>
                <option value="3年生">3年生</option>
                <option value="4年生">4年生</option>
                <option value="5年生">5年生</option>
                <option value="6年生">6年生</option>
            </select>
            <hr class="dhr-ppo rsgafwad">
            <h4>ヘッダー画像; (5:2)</h4>
            <input type="text" id="header_path_input" value="${ARTICLEDATA.article.images.header}" placeholder="ファイル名">
            <hr class="dhr-ppo rsgafwad">
            <h4>アイコン画像; (1:1)</h4>
            <input type="text" id="icon_path_input" value="${ARTICLEDATA.object.images.icon}" placeholder="ファイル名">
            <hr class="dhr-ppo rsgafwad">
            <button id="save_data_else" class="ppu-decb"><h4 id="save_data_else_www">保存</h4></button>
            <h4 id="others---meg"></h4>
        </div>
        `, () => {
            const _this = document.getElementById("save_data_else_www") || document.createElement("span"),
                _save = "保存";
    
                
            function _k(){
                _this.remove();
                Popup.removeCloseListener(_k);
            }
    
            Popup.addCloseListener(_k);
    
            for (const op of document.querySelectorAll("option")){
                if (
                    op.parentElement?.id == "font_family_input" && op.value === ARTICLEDATA.article.font_family
                    || op.parentElement?.id == "core_grade_input" && op.value === ARTICLEDATA.article.core_grade
                ){
                    op.selected = true;
                }
            }
    
            /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
            var _t = { a: 0, };
            document.getElementById("save_data_else")?.addEventListener("click", function(e){
                //@ts-ignore
                const color = document.getElementById("theme_color_picker")?.value || "#ffffff";
                //@ts-ignore
                const font_family = document.getElementById("font_family_input")?.value || "";
                //@ts-ignore
                const core_grade = document.getElementById("core_grade_input")?.value || "特になし";
                //@ts-ignore
                var venue = document.getElementById("venue_input")?.value || "";
                //@ts-ignore
                var header_path = document.getElementById("header_path_input")?.value.replace(" ", "") || "";
                //@ts-ignore
                var icon_path = document.getElementById("icon_path_input")?.value.replace(" ", "") || "";
    
    
                if ($(_this).text() == "保存しています")
                    return;
                
                const fns = [ header_path, icon_path ];
                if (fns.some(a => a.includes("/") || (!a.includes(".") && a.length > 0))){
                    clearTimeout(_t.a);
                    $(_this).text("画像に誤りがあります").css("color", "red");
                    _t.a = setTimeout(() => {
                        $(_this).text(_save).css("color", "black");
                    }, 3000);
                    return;
                }
    
                ARTICLEDATA.article.theme_color = color;
                ARTICLEDATA.article.font_family = font_family;
                ARTICLEDATA.article.core_grade = core_grade;
                ARTICLEDATA.article.venue = venue;
                ARTICLEDATA.article.images.header = header_path;
                ARTICLEDATA.object.images.icon = icon_path;
                
                $(_this).text("保存しています").css("color", "orange");
    
                setTimeout(() => {
                    $.post("/org/manage/edit/saveothers", { session: session, nmap: JSON.stringify(ARTICLEDATA) })
                    .done(d => {
                        lastsaved = ARTICLEDATA;
                        clearTimeout(_t.a);
                        $(_this).text("保存しました").css("color", "green");
                        rewrite(true);
                        _t.a = setTimeout(() => {
                            $(_this).text(_save).css("color", "black");
                        }, 3000);
                    })  
                    .catch(err => {
                        clearTimeout(_t.a);
                        $(_this).text("失敗しました").css("color", "red");
                        _t.a = setTimeout(() => {
                            $(_this).text(_save).css("color", "black");
                        }, 3000);
                    });
                }, 250);
            });
        }, { 
            width: 500,
            height: 620,
            forceclosebutton: true
        });
    });
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    document.getElementById("logout__")?.addEventListener("click", () => {
        Popup.popupContent(`
        <div class="protected aioshud" id="ppupds" style="display: flex; align-items: center; justify-content: center;">
            <span style="display: flex; align-items: center; flex-direction: column;">
                <h2>ついでにログアウトしますか？</h2>
                    <p id="--logout-adjustmsg"></p>
                    <span style="height: 20px;"></span>
                    <button id="--yesilogout" style="color:${logout_is_peiding ? "orange" : "black"}">${logout_is_peiding ? "ログアウト中" : "ログアウト"}</button>
                    <hr style="width:100px;margin:10px">
                    <button id="byebyebyebye" style="color:black">MENU へ</button>
            </span>
        </div>`,
        function(){
            if (change_not_saved_remaining){
                $("#--logout-adjustmsg")
                .text("保存していない変更があります")
                .css("margin-top", "10px")
                .css("color", "red");
            }
            document.getElementById("byebyebyebye")?.addEventListener("click", function(){
                window.location.href = "/org/manage/menu";
            });
            document.getElementById("--yesilogout")?.addEventListener("click", function(){
                if (logout_is_peiding){ 
                    PictoNotifier.notify("error", "Already logging out");
                    return;
                }
                $(this)
                .text("ログアウト中")
                .css("color", "purple");
                setTimeout(() => {
                    leaveherep.call(this);
                }, 5);
            });
        }, {
            width: 400, height: 300
        });
    });
    
    
    document.getElementById("save_data_norm")?.addEventListener("click", function(){
        clearTimeout(kes);
        saveMainEditorctx.apply(this);
    });
    
    
    document.getElementById("__undo_-")?.addEventListener("click", function(){
        if (HIST_INDEX <= 0)
            return;
        HIST_INDEX--;
        $("#main-editor").html(EDITOR_HISTORY.raw[HIST_INDEX]);
        rewrite(false, true);
        allowNsave();
        nextAutoSave();
    });
    
    
    document.getElementById("__redo_-")?.addEventListener("click", function(){
        if (HIST_INDEX >= EDITOR_HISTORY.raw.length-1)
            return;
        HIST_INDEX++;
        $("#main-editor").html(EDITOR_HISTORY.raw[HIST_INDEX]);
        rewrite(false, true);
        allowNsave();
        nextAutoSave();
    });
    
    
    window.addEventListener("resize", function(e){
        //@ts-ignore
        const xpre_height = document.getElementById("editsplitter").clientHeight;
        //@ts-ignore
        const xpre_width = document.getElementById("--ppo").clientWidth;
    
        const iphone_12_pro_max = {
            height: xpre_height*0.8,
            width: (xpre_height*0.8)*0.46,
        }
    
        if (iphone_12_pro_max.width > xpre_width-20){
            iphone_12_pro_max.width = xpre_width-20;
            iphone_12_pro_max.height = iphone_12_pro_max.width*2.16;
        }
    
        $("#article-preview").css("transform", "scale("+iphone_12_pro_max.width/430+")");
    });
    
    
    window.dispatchEvent(new Event("resize"));
    setInterval(() => {
        window.dispatchEvent(new Event("resize"));
    }, 500);
    
    
    window.addEventListener("keydown", function(e){
        const KEY = e.key.toUpperCase();
    
        if (e.ctrlKey || e.metaKey){
            switch (KEY){
                case "S":
                    e.preventDefault();
                    const elesaver = this.document.getElementById("save_data_else");
                    if (elesaver){
                        elesaver.dispatchEvent(new Event("click"));
                    } else {
                        if (!isSavable())
                            return;
                        clearTimeout(kes);
                        PictoNotifier.notifySave("保存しています...", { duration: 30000, deny_userclose: true });
                        saveMainEditorctx.call(document.getElementById("save_data_norm"), void 0, () => {
                            PictoNotifier.notify("save", "保存しました");
                        }, () => {
                            allowNsave();
                            PictoNotifier.notify("error", "保存に失敗しました");
                        });
                    }
                    break;
                case "Z":
                    if (Popup.isPoppingup)
                        break;
                    e.preventDefault();
                    $("#__undo_-").trigger("click");
                    rewrite(false, true);
                    break;
                case "Y":
                    if (Popup.isPoppingup)
                        break;
                    e.preventDefault();
                    $("#__redo_-").trigger("click");
                    rewrite(false, true);
                    break;
            }
        }
    }, { passive: false });
    
    
    $("#--art-header").on("error", function(){ imageError.call(this, "h"); }).attr("src", "");
    $("#--art-icon").on("error", function(){ imageError.call(this, "i"); }).attr("src", "");
    
    rewrite(true);
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    document.getElementById("addImageb")?.addEventListener("click", e => {
        Popup.popupContent(`
        <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
            <h2 style="padding-top: 30px;">写真を挿入</h2>
            <h4 id="__caut_imad"></h4>
            <hr class="dhr-ppo">
            <h4>ファイル名</h4>
            <input id="addImg_path_" type="text" style="margin-bottom: 20px;" placeholder="ファイル名"></input>
            <h4>写真の幅(画面の横幅に対する %)</h4>
            <input id="addImg_width_" type="text" placeholder="0 ~ 100" value="100"></input>
            <hr class="dhr-ppo">
            <button id="insertImgb" class="ppu-decb"><h4>追加</h4></button>
            <h4 id="others---meg"></h4>
        </div>
        `, function(){
            /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
            var _t = { a: 0, };
            var tm = 0;
            document.getElementById("insertImgb")?.addEventListener("click", function(){
                //@ts-ignore
                var path = replaceTab(document.getElementById("addImg_path_")?.value.replace(" ", "")) || "";
                //@ts-ignore
                var width = document.getElementById("addImg_width_")?.value.replace(" ", "") || "";
    
                /**@param {string} msg  */
                function notifyMSG(msg){
                    clearTimeout(_t.a);
                    $("#others---meg").text(msg).css("color", "red");
                    _t.a = setTimeout(() => {
                        $("#others---meg").text("");
                    }, 3000);
                }
    
                if (path.length < 1 || width.length < 1){
                    $("#__caut_imad").text("埋めていない箇所があります").css("color", "red");
                    return;
                }
    
                width = Number(width);
                
                if (isNaN(width) || width > 100 || width < 0){
                    notifyMSG("幅に誤りがあります( 0 < 幅 < 100 )");
                    return;
                }
    
                $("#__caut_imad").text("");
                const imgFormat = `∫:IMG-S=${path}-W=${width};∫`;
                
                Popup.disPop();
    
                insertText(imgFormat);
            });
        }, {
            height: 375
        });
    });
    
    
    document.getElementById("addVideob")?.addEventListener("click", e => {
        Popup.popupContent(`
        <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
            <h2 style="padding-top: 30px;">動画を挿入</h2>
            <h4 id="__caut_imad"></h4>
            <hr class="dhr-ppo">
            <h4>ファイル名</h4>
            <input id="addImg_path_" type="text" style="margin-bottom: 20px;" placeholder="ファイル名"></input>
            <h4>動画の幅(画面の横幅に対する %)</h4>
            <input id="addImg_width_" type="text" placeholder="0 ~ 100" value="100"></input>
            <hr class="dhr-ppo">
            <button id="insertImgb" class="ppu-decb"><h4>追加</h4></button>
            <h4 id="others---meg"></h4>
        </div>
        `, function(){
            /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
            var _t = { a: 0, };
            document.getElementById("insertImgb")?.addEventListener("click", function(){
                //@ts-ignore
                var path = replaceTab(document.getElementById("addImg_path_")?.value.replace(" ", "")) || "";
                //@ts-ignore
                var width = document.getElementById("addImg_width_")?.value.replace(" ", "") || "";
    
                /**@param {string} msg  */
                function notifyMSG(msg){
                    clearTimeout(_t.a);
                    $("#others---meg").text(msg).css("color", "red");
                    _t.a = setTimeout(() => {
                        $("#others---meg").text("");
                    }, 3000);
                }
    
                if (path.length < 1 || width.length < 1){
                    $("#__caut_imad").text("埋めていない箇所があります").css("color", "red");
                    return;
                }
    
                width = Number(width);
                if (isNaN(width) || width > 100 || width < 0){
                    notifyMSG("幅に誤りがあります( 0 < 幅 < 100 )");
                    return;
                }
    
                $("#__caut_imad").text("");
                const videoFormat = `∫:VIDEO-S=${path}-W=${width};∫`;
                
                Popup.disPop();
    
                insertText(videoFormat);
            });
        }, {
            height: 375
        });
    });
    
    
    document.getElementById("addLinkb")?.addEventListener("click", e => {
        Popup.popupContent(`
        <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
            <h2 style="padding-top: 30px;">リンクを挿入</h2>
            <h4 id="__caut_imad"></h4>
            <hr class="dhr-ppo">
            <h4>URL</h4>
            <input id="addLink_url_" type="text" style="margin-bottom: 20px;" placeholder="https?://"></input>
            <h4>テキスト</h4>
            <input id="addLink_text_" type="text" style="margin-bottom: 20px;" placeholder="任意"></input>
            <hr class="dhr-ppo">
            <button id="insertLinkb" class="ppu-decb"><h4>追加</h4></button>
            <h4 id="others---meg"></h4>
        </div>
        `, function(){
            /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
            var _g = { a: 0, };
            const up = /^https?:\/\/(?:(?!-T=).)+$/;
            document.getElementById("insertLinkb")?.addEventListener("click", function(){
                //@ts-ignore
                var url = replaceTab(document.getElementById("addLink_url_")?.value.replace(/ /g, "").replace(/θ/g, "%CE%B8")) || "";
                //@ts-ignore
                var text = replaceTab(document.getElementById("addLink_text_")?.value) || "";
    
                /**@param {string} msg  */
                function notifyMSG(msg){
                    clearTimeout(_g.a);
                    $("#others---meg").text(msg).css("color", "red");
                    _g.a = setTimeout(() => {
                        $("#others---meg").text("");
                    }, 3000);
                }
    
                if (url.length < 1){
                    $("#__caut_imad").text("URLを入力してください").css("color", "red");
                    return;
                }
    
                if (!up.test(url)){
                    $("#__caut_imad").text("無効なURLです").css("color", "red");
                    return;
                }
    
                $("#__caut_imad").text("");
                const linkFormat = `#:LINK-H=${url}-T=${text};#`;
                
                Popup.disPop();
    
                insertText(linkFormat);
            });
        }, {
            height: 400
        });
    });
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    /**
     * 
     * @param {{files: string[], totalsize: number, sizemap: {[key: string]: number}, mxcs: number}} responsedata 
     */
    function writeCloudonPopup(responsedata){
        /**@type {string[]} */
        const files = responsedata.files;
        /**@type {number} */
        const totalsize = responsedata.totalsize;
        const sizemap = responsedata.sizemap;
        const displaysize = Math.ceil(totalsize*100)/100;
    
    
        orgCloudfi.maxsize = responsedata.mxcs;
    
        files.map((e) => { return toOrgFilepath(username, e); });
        $("#orgcloud-filelist").empty();
        
        var color = "lightgreen";
    
        if (totalsize >= orgCloudfi.maxsize){
            color = "red";
        } else if (totalsize >= orgCloudfi.maxsize*3/4){
            color = "orange";
        } else if (totalsize >= orgCloudfi.maxsize/2){
            color = "yellow";
        }
    
        $("#--cloud-desc").html(`<span style="color: lightgreen;">${orgCloudfi.maxsize.toLocaleString()}MB</span> まで使用できます&nbsp;(<span style="color: ${color};">${displaysize.toLocaleString()}</span>/${orgCloudfi.maxsize.toLocaleString()})`);
    
    
        var _html = "";
        for (const file of files){
            const mediatype = getMediaType(file);
            const src = toOrgFilepath(username, file);
            const t = "?"+(new Date()).getTime();
    
            switch (mediatype){
                case "image":
                    _html += `
                    <div class="cloud-file-el">
                        <div class="cloudfileele" uname="${file}">
                            <img class="cloudfileel cloudsh" src="${src+t}" uname="${file}">
                            <h4 class="cloudfileel">${file}</h4>
                            <p class="cloudfileel" style="font-size: 75%;">${Math.ceil(sizemap[file]*1000)/1000}MB</p>
                        </div>
                    </div>`;
                    break;
                case "video":
                    _html += `
                    <div class="cloud-file-el">
                        <div class="cloudfileele" uname="${file}">
                            <video class="cloudfileel cloudsh" uname="${file}" src="${src+t}#t=0.001" controls preload="metadata" playsinline></video>
                            <h4 class="cloudfileel">${file}</h4>
                            <p class="cloudfileel" style="font-size: 75%;">${Math.ceil(sizemap[file]*1000)/1000}MB</p>
                        </div>
                    </div>`;
                    break;
            }
        }
        if (!_html){
            _html = "<div class=\"flxxt\" style=\"width:100%;height:100%;\"><div><h2>クラウドが空っぽです！</h2><h4>右下のボタンからアップロードしましょう</h4></div></div>";
        }
        $("#orgcloud-filelist")
        .append(_html)
        .scrollTop(0);
    
        $(".cloudfileele").on("click", () => {});
    }
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    function _cloudok(data){
        /**@type {string[]} */
        const files = data.files;
        var givestr = "30万集めてアプリ内広告をなくしたいので、募金をしてくれた団体には5000円で2000MB増量いたします。5年E組までお越しください。";
    
        if (
            ARTICLEDATA.article.title.includes("ちぎり絵")
            || ARTICLEDATA.article.title.includes("3年")
        ) givestr = "アプリ内広告邪魔だよね！！ほんとむかつく！！";
    
        if (files && Popup.isPoppingup){
            Popup.popupContent(`
            <div class="protected --posa" id="ppupds">
                <h4 style="padding-top: 20px;">あなたの団体(${username})のクラウド</h4>
                <p id="--cloud-desc"></p>
                <p style="font-size: 15%;">${givestr}</p>
                <hr class="dhr-ppo" style="margin: 5px 0 10px 0;">
                <p style="margin-bottom: 5px; color: #b7b7b7;">クリックしてファイル名をコピー</p>
                <div id="orgcloud-filelist">
    
                </div>
                <div class="flxxt">
                    <div class="ertxs">
                        <button id="uploadfb" class="ppu-decb" style="margin-top: 5px; color: black;"><h4 id="uploadfbh">アップロード</h4></button>
                        <input type="file" id="uploadfi" style="margin: 10px; margin-top: 5px;" accept="${accepted_cloudfileExtensions.join(",")}">
                    </div>
                    <div class="ertxs">
                        <button id="deletefb" class="ppu-decb" style="margin-top: 5px; color: black;"><h4 id="deletefbh">削除</h4></button>
                        <input type="text" id="deletefi" style="margin: 10px; margin-top: 5px;" placeholder="削除するファイル名">
                    </div>
                </div>
            </div>`,
            function(){
                writeCloudonPopup(data);
    
                /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
                const _h = { a: 0, b: 0, };
                document.getElementById("uploadfb")?.addEventListener("click", e => {
                    /**@ts-ignore @type {File} */
                    var file = document.getElementById("uploadfi").files[0];
    
                    if ($("#uploadfbh").text() != "アップロード"){
                        return;
                    }
    
                    clearTimeout(_h.a);
    
                    if (file){
                        clearTimeout(_h.a);
    
                        if (getMediaType(file.name) == "unknown"){
                            $("#uploadfbh").text("ファイル形式が無効です").css("color", "red");
                            _h.a = setTimeout(() => {
                                $("#uploadfbh").text("アップロード").css("color", "black");
                            }, 3000);
                            return;
                        }
    
                        $("#uploadfbh").text("アップロード中...").css("color", "orange");
    
                        setTimeout(() => {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("session", session || "");
    
                            $.when(
                                $.post("/org/manage/file/overflow", { session: session, size: file.size })
                            ).done(function(overflowData){
                                const acceptable = overflowData.acceptable,
                                    overflow = overflowData.overflow;
                                    
                                if (acceptable){
                                    $.when(
                                        $.ajax({
                                            url: "/org/manage/file/upload",
                                            type: "POST",
                                            data: formData,
                                            processData: false,
                                            contentType: false,
                                        })
                                    ).done(function(uploadData){
                                        const scr = $("#shishiji-overview").scrollTop();
    
                                        writeCloudonPopup(uploadData);
    
                                        rewrite(true, true, true);
                            
                                        PictoNotifier.notify(
                                            "success",
                                            `${uploadData.uploaded} をアップロードしました`,
                                            {
                                                duration: 5000,
                                                discriminator: "file uploaded",
                                                do_not_keep_previous: true
                                            }
                                        );
                                
                                        $("#uploadfbh").text("アップロードに成功").css("color", "green");
                                        _h.a = setTimeout(() => {
                                            $("#uploadfbh").text("アップロード").css("color", "black");
                                        }, 2500);
                                        //@ts-ignore
                                        document.getElementById("uploadfi").value = "";
                                    }).fail(function(err){
                                        const errjson = err.responseJSON;
            
                                        if (err.status == 413 && errjson.overflow !== void 0){
                                            sayOverflowing.call(null, errjson.overflow);
                                        } else {
                                            $("#uploadfbh").text("エラー").css("color", "red");
                                            _h.a = setTimeout(() => {
                                                $("#uploadfbh").text("アップロード").css("color", "black");
                                            }, 5000);
                                        }
                                    });
                                } else {
                                    sayOverflowing.call(null, overflow);
                                }
                            }).catch(function(){
                                $("#uploadfbh").text("エラー").css("color", "red");
                                _h.a = setTimeout(() => {
                                    $("#uploadfbh").text("アップロード").css("color", "black");
                                }, 5000);
                            });
                            /**
                             * 
                             * @param {number} howmuch 
                             */
                            function sayOverflowing(howmuch){
                                howmuch = Math.ceil(howmuch * 10000) / 10000;
                            
                                PictoNotifier.notify(
                                    "error",
                                    `クラウドに ${howmuch}MB 容量が足りません`,
                                    {
                                        duration: 5000,
                                        discriminator: "Cloud is overflowing!",
                                        do_not_keep_previous: true,
                                        deny_userclose: true
                                    }
                                );
                        
                                $("#uploadfbh").text(`${howmuch}MB 容量が足りません`).css("color", "red");
                                _h.a = setTimeout(() => {
                                    $("#uploadfbh").text("アップロード").css("color", "black");
                                }, 5000);
                            }
                        }, 500);
                    } else{
                        $("#uploadfbh").text("ファイルが選択されていません").css("color", "red");
                        _h.a = setTimeout(() => {
                            $("#uploadfbh").text("アップロード").css("color", "black");
                        }, 1500);
                    }
                });
    
                document.getElementById("deletefb")?.addEventListener("click", e => {
                    /**@ts-ignore @type {Array<string>} */
                    var filenames = (document.getElementById("deletefi").value || "").split(" "), _fl = filenames;
    
                    if ($("#deletefbh").text() == "削除しています"){
                        return;
                    }
    
                    clearTimeout(_h.b);
                    
                    if (filenames.length == 0){
                        $("#deletefbh").text("ファイル名を入力してください").css("color", "red");
                        _h.b = setTimeout(() => {
                            $("#deletefbh").text("削除").css("color", "black");
                        }, 1500);
                        return;
                    }
    
                    const af = [];
                    var really = false;
                    Array.from(document.getElementsByClassName("cloudsh")).forEach(e => {
                        af.push(e.getAttribute("uname"));
                    });
    
                    filenames = filenames.filter(T => T.length > 0);
                    filenames.forEach(fn => {
                        if (!af.includes(fn)){
                            const disc = "file: "+fn+" not found",
                                opt = { duration: 1000 };
                            if (!really){
                                Notifier.clearPengings();
                                Notifier.notifyHTML(disc, opt);
                                really = true;
                            } else {
                                Notifier.appendPending({
                                    html: disc,
                                    options: opt
                                });
                            }
                            filenames = filenames.filter(S => S !== fn);
                        }
                    });
                    
    
                    if (filenames.length == 0){
                        var msg = "削除できるファイルがありません";
                        if (_fl.every(W => W.length == 0))
                            msg = "ファイル名を入力してください";
                        clearTimeout(_h.b);
                        $("#deletefbh").text(msg).css("color", "red");
                        _h.b = setTimeout(() => {
                            $("#deletefbh").text("削除").css("color", "black");
                        }, 1500);
                        return;
                    }
    
                    $("#deletefbh").text("削除しています").css("color", "orange");
    
                    setTimeout(() => {
                        $.post("/org/manage/file/delete", { session: session, files: JSON.stringify(filenames) })
                        .done(data => {
                            writeCloudonPopup(data);
    
                            rewrite(true, true, true);
                            
                            /**@type {Array<string>} */
                            const deleted = data.deleted;
                            
                            for (const deld of deleted){
                                if (deld === deleted[0]){
                                    var e = 1000;
                                    if (deleted.length == 1)
                                        e = 3000;
                                    Notifier.clearPengings();
                                    PictoNotifier.notify(
                                        "success",
                                        `${deld} を削除しました`,
                                        {
                                            duration: e,
                                            discriminator: "file deleted",
                                            do_not_keep_previous: true
                                        }
                                    );
                                } else {
                                    PictoNotifier.notify(
                                        "success",
                                        `${deld} を削除しました`,
                                        {
                                            duration: 1000,
                                            discriminator: "file deleted",
                                            addToPending: true
                                        }
                                    );
                                }
                            }
    
                            $("#deletefbh").text("削除に成功").css("color", "green");
                            _h.b = setTimeout(() => {
                                $("#deletefbh").text("削除").css("color", "black");
                            }, 5000);
                            //@ts-ignore
                            document.getElementById("deletefi").value = "";
                        })
                        .catch(err => {
                            $("#deletefbh").text("エラー").css("color", "red");
                            _h.b = setTimeout(() => {
                                $("#deletefbh").text("削除").css("color", "black");
                            }, 3000);
                        });
                    }, 500);
                });
            }, { width: 1200, height: 1200 });
        }
    }
    
    
    
    function _cloudfail(e){
        const ctx = TEXTS[LANGUAGE].ERROR_ANY;
        
        if (e.statusText != "abort")
            PictoNotifier.notify(
                "error",
                TEXTS[LANGUAGE].NOTIFICATION_ERROR_ANY,
                {
                    duration: 2500,
                    discriminator: "sharePopup connection error",
                    do_not_keep_previous: true, deny_userclose: true
                }
            );
    
        if (Popup.isPoppingup)
            Popup.showasError(ctx);
    }
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    document.getElementById("manageFileb")?.addEventListener("click", function(){
        Popup.startLoad({ width: 1200, height: 1200 });
        
        var cloudAjax;
        const cloudwait_tm = setTimeout(() => {
            cloudAjax = $.post("/org/manage/file/list", { session: session });
            cloudAjax
            .done(_cloudok)
            .catch(_cloudfail);
        }, 500);
    
        function onClose(){
            if (cloudAjax)
                cloudAjax.abort();
            clearTimeout(cloudwait_tm);
            Popup.removeCloseListener(onClose);
        }
        
        Popup.addCloseListener(onClose);
    });
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    window.addEventListener("click", function(e){
        /**@ts-ignore @type {HTMLElement} */
        const target = e.target;
        const $target = $(target);
        
        if ($target.hasClass("cloudfileel")){
            const uname = $target.parent().attr("uname");
    
            if (uname){
                window.navigator.clipboard.writeText(uname);
                PictoNotifier.notify(
                    "link",
                    `${uname} をコピーしました`,
                    {
                        duration: 2500,
                        discriminator: uname
                    }
                );
            }
        } else if ($(target).hasClass("article-image")){
            const src = target.getAttribute("src");
    
            if (src){
                const _html = `${GPATH.X}<img class="suhDWAgd" src="${src}">`;
                /**@ts-ignore @type {HTMLElement} */
                const clone = target.cloneNode();
    
                function popupping(){
                    const me = document.getElementById("shishiji-popup-container-cn");
                    return ( me?.clientHeight != 0 ) ? true : false;
                }
                function _dispose(){
                    if (popupping())
                        disPop();
                }
                function disPop(){
                    window.removeEventListener("keydown", noMish);
                    $("#ppcls").off("click", disPop);
                    $("shishiji-mx-overlay-n")
                    .removeClass("popen")
                    .addClass("pipe")
                    .off("click", _dispose);
                    $("#shishiji-popup-container-cn")
                    .hide()
                    .empty();
                }
                function noMish(e){
                    const key = e.key.toUpperCase();
                    if (Popup.closeKeys.includes(key)){
                        _dispose();
                    }
                }
                
                
                $(clone).attr("id", "").attr("class", "suhDWAgd").attr("style", "");
                
                new Promise((resolve, reject) => {
                    this.window.addEventListener("keydown", noMish);
                    $("shishiji-mx-overlay-n")
                    .removeClass("pipe")
                    .addClass("popen")
                    .on("click", _dispose);
                    $("#shishiji-popup-container-cn")
                    .addClass("flxxt")
                    .css("height", "fit-content")
                    .css("overflow", "visible")
                    .html(GPATH.X)
                    .append(clone)
                    .show();
                    resolve("");
                }).then(() => {
                    $("#ppcls")
                    .css("top", "-40px")
                    .css("right", "0")
                    .on("click", disPop);
                    /**<path fill="#ffffff"></path> */
                    $($($("#ppcls").children()[0]).children()[0])
                    .attr("fill", "blue");
                });
            }
        }
    });
    
    
    window.addEventListener("dblclick", function(e){
        e.preventDefault();
    }, { passive: false });
    
    
    window.addEventListener("beforeunload", e => {
        if (change_not_saved_remaining || (Popup.isPoppingup && $("#ppupds").hasClass("aioshud"))){
            e.preventDefault();
            const message = "このページを離れてもよろしいですか？\n編集データは自動では保存されません。";
        
            e.returnValue = message;
            return message;
        }
    }, { passive: false });
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    /**
     * 
     * @param {SETTINGS} data 
     */
    function editorConfigStorage(data){
        data.solidObject = data.colorEditor || data.solidObject;
        return {
            [AUTOSAVEKEY]: data.autosave,
            [AUTOSAVENOTIFICATIONKEY]: data.autosaveNotification,
            [COLOREDITORKEY]: data.colorEditor,
            [INSTAPREVIEWKEY]: data.instapreview,
            [QUICKINPUTNOTIFICATIONKEY]: data.quickInputNotification,
            [VISIBLESPACEKEY]: data.visibleSpace,
            [VISIBLEONLYENDSPACEKEY]: data.visibleOnlyEndSpace,
            [SOLIDOBJECTKEY]: data.solidObject,
            [_SOLIDOBJECTKEY]: data._solidObject,
        };
    }
    
    
    function saveEditorConfig(){
        setLocalStorage(EDITORCONFIGKEY, JSON.stringify(editorConfigStorage(SETTINGS)));
    }
    
    
    document.getElementById("editorSettings")?.addEventListener("click", function(){
        const spacePreview = {
            half: {
                none: `<span class="sheart0">I&nbsp;love&nbsp;tomatos&nbsp;&nbsp;&nbsp;</span>`,
                visibleAllSpace: `<span class="sheart0">I·love·tomatos···</span>`.replace(/·/g, `<span class="sheart35">·</span>`),
                visibleOnlyEndSpace: `<span class="sheart0">I love tomatos···</span>`.replace(/·/g, `<span class="sheart35">·</span>`),
            },
            full: {
                none: `<span class="sheart0">あなた　好き　　</span>`,
                visibleAllSpace: `<span class="sheart0">あなた・好き・・</span>`.replace(/・/g, `<span class="sheart35">・</span>`),
                visibleOnlyEndSpace: `<span class="sheart0">あなた　好き・・</span>`.replace(/・/g, `<span class="sheart35">・</span>`),
            },
        };
        const createToggle = (id, checked) => {
            const input = document.createElement("input");
            input.id = id;
            input.className = "toggle_input";
            input.type = "checkbox";
            if (checked) input.checked = true;
            const label = document.createElement("label");
            label.htmlFor = id;
            label.className = "toggle_label";
            const div = document.createElement("div");
            div.className = "toggle_button";
            div.appendChild(input);
            div.appendChild(label);
            return div;
        };
        
        const container = document.createElement("div");
        container.className = "protected";
        container.id = "ppupds";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.flexFlow = "column";
        const title = document.createElement("h2");
        title.textContent = "エディターの設定";
        container.appendChild(title);
        const placeholder = document.createElement("p");
        placeholder.textContent = "****";
        container.appendChild(placeholder);
        const hr1 = document.createElement("hr");
        hr1.className = "dhr-ppo rsgafwad";
        container.appendChild(hr1);
        const flexContainer = document.createElement("div");
        flexContainer.className = "flxxt";
        const colorEditorDiv = document.createElement("div");
        colorEditorDiv.className = "okjoipjiok konogt";
        const colorEditorLabel = document.createElement("h4");
        colorEditorLabel.textContent = "配色";
        colorEditorDiv.appendChild(colorEditorLabel);
        colorEditorDiv.appendChild(createToggle("editorcolor_tg", SETTINGS.colorEditor));
        flexContainer.appendChild(colorEditorDiv);
        const autosaveDiv = document.createElement("div");
        autosaveDiv.className = "okjoipjiok konogt";
        const autosaveLabel = document.createElement("h4");
        autosaveLabel.textContent = "オートセーブ";
        autosaveDiv.appendChild(autosaveLabel);
        autosaveDiv.appendChild(createToggle("autosave_tg", SETTINGS.autosave));
        flexContainer.appendChild(autosaveDiv);
        const instapreviewDiv = document.createElement("div");
        instapreviewDiv.className = "okjoipjiok konogt";
        const instapreviewLabel = document.createElement("h4");
        instapreviewLabel.textContent = "即時プレビュー";
        instapreviewDiv.appendChild(instapreviewLabel);
        const note = document.createElement("t");
        note.style.fontSize = "8px";
        note.textContent = "This may take more battery!!";
        instapreviewDiv.appendChild(note);
        instapreviewDiv.appendChild(createToggle("instapreview_tg", SETTINGS.instapreview));
        flexContainer.appendChild(instapreviewDiv);
        
        container.appendChild(flexContainer);
        container.appendChild(hr1.cloneNode(true));
        
        // 通知セクション
        const notificationTitle = document.createElement("h4");
        notificationTitle.textContent = "通知";
        container.appendChild(notificationTitle);
        
        const notificationContainer = document.createElement("div");
        notificationContainer.className = "flxxt";
        
        // 自動入力
        const quickInputDiv = document.createElement("div");
        quickInputDiv.className = "okjoipjiok";
        const quickInputLabel = document.createElement("h4");
        quickInputLabel.id = "autoinput_hh";
        quickInputLabel.className = "prehh";
        quickInputLabel.textContent = "自動入力";
        quickInputDiv.appendChild(quickInputLabel);
        quickInputDiv.appendChild(createToggle("quickinputnotification_tg", SETTINGS.quickInputNotification));
        notificationContainer.appendChild(quickInputDiv);
        
        // オートセーブ通知
        const autosaveNotificationDiv = document.createElement("div");
        autosaveNotificationDiv.className = "okjoipjiok";
        const autosaveNotificationLabel = document.createElement("h4");
        autosaveNotificationLabel.id = "autosave_hh";
        autosaveNotificationLabel.className = "prehh";
        autosaveNotificationLabel.textContent = "オートセーブ";
        autosaveNotificationDiv.appendChild(autosaveNotificationLabel);
        autosaveNotificationDiv.appendChild(createToggle("autosavenotification_tg", SETTINGS.autosaveNotification));
        notificationContainer.appendChild(autosaveNotificationDiv);
        container.appendChild(notificationContainer);
        container.appendChild(hr1.cloneNode(true));
        const visibleSpaceTitle = document.createElement("h4");
        visibleSpaceTitle.textContent = "空白を視覚化";
        container.appendChild(visibleSpaceTitle);
        container.appendChild(createToggle("visiblespace_tg", SETTINGS.visibleSpace));
        const spaceDetails = document.createElement("div");
        spaceDetails.id = "jjjadios";
        spaceDetails.className = "paOojiA";
        const halfWidthSpaceDiv = document.createElement("div");
        halfWidthSpaceDiv.className = "pprajisda";
        const halfWidthSpaceLabel = document.createElement("p");
        halfWidthSpaceLabel.style.fontSize = "12px";
        halfWidthSpaceLabel.textContent = "半角スペース";
        halfWidthSpaceDiv.appendChild(halfWidthSpaceLabel);
        halfWidthSpaceDiv.appendChild(document.createElement("div")).id = "half-width-space-pre";
        halfWidthSpaceDiv.className = "code-pre";
        const endSpaceDiv = document.createElement("div");
        endSpaceDiv.className = "pprajisda";
        const endSpaceLabel = document.createElement("p");
        endSpaceLabel.style.fontSize = "12px";
        endSpaceLabel.textContent = "各行末のみ";
        endSpaceDiv.appendChild(endSpaceLabel);
        const endSpaceToggle = createToggle("visibleonlyendspace_tg", SETTINGS.visibleOnlyEndSpace);
        endSpaceToggle.style.transform = "scale(0.75)";
        endSpaceDiv.appendChild(endSpaceToggle);
        const fullWidthSpaceDiv = document.createElement("div");
        fullWidthSpaceDiv.className = "pprajisda";
        const fullWidthSpaceLabel = document.createElement("p");
        fullWidthSpaceLabel.style.fontSize = "12px";
        fullWidthSpaceLabel.textContent = "全角スペース";
        fullWidthSpaceDiv.appendChild(fullWidthSpaceLabel);
        fullWidthSpaceDiv.appendChild(document.createElement("div")).id = "full-width-space-pre";
        fullWidthSpaceDiv.className = "code-pre";
        spaceDetails.appendChild(halfWidthSpaceDiv);
        spaceDetails.appendChild(endSpaceDiv);
        spaceDetails.appendChild(fullWidthSpaceDiv);
        container.appendChild(spaceDetails);
        container.appendChild(hr1.cloneNode(true));
        const finalText = document.createElement("p");
        finalText.id = "dspp";
        finalText.style.fontSize = "12px";
        container.appendChild(finalText);
        const objectContainer = document.createElement("div");
        objectContainer.style.width = "95%";
        objectContainer.style.marginTop = "8px";
        const objectTitle = document.createElement("div");
        objectTitle.id = "ADSmdaaa";
        objectTitle.textContent = "オブジェクト";
        objectContainer.appendChild(objectTitle);
        const oodAOIj = document.createElement("div");
        oodAOIj.className = "oodAOIj";
        const createObjectDiv = (labelText, codeText) => {
            const oodaji = document.createElement("div");
            oodaji.className = "oodaji";
            const p = document.createElement("p");
            p.style.fontSize = "12px";
            p.textContent = labelText;
            const codeDiv = document.createElement("div");
            codeDiv.className = "code-pre ASOKJjmm";
            const span = document.createElement("span");
            span.className = `sheart22 ${labelText === "リンク" ? "sheart24" : ""}`;
            span.innerHTML = codeText;
            codeDiv.appendChild(span);
            oodaji.appendChild(p);
            oodaji.appendChild(codeDiv);
            return oodaji;
        };
        oodAOIj.appendChild(createObjectDiv("写真", `%:IMG-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%`));
        oodAOIj.appendChild(createObjectDiv("動画", `%:VIDEO-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%`));
        oodAOIj.appendChild(createObjectDiv("リンク", `θ:LINK-H=<span class="sheart25">{URL}</span>-T=<span class="sheart25">{text}</span>;θ`));
        objectContainer.appendChild(oodAOIj);
        container.appendChild(objectContainer);
        
        Popup.popupContent(
        `<div class="protected" id="ppupds" style="display:flex;align-items:center;justify-content:center;flex-flow:column;">
            <h2>エディターの設定</h2><p>****</p>
            <hr class="dhr-ppo rsgafwad">
            <div class="flxxt">
                <div class="okjoipjiok konogt">
                    <h4>配色</h4>
                    <div class="toggle_button">
                        <input id="editorcolor_tg" class="toggle_input" type="checkbox" ${SETTINGS.colorEditor ? "checked" : ""}>
                        <label for="toggle" class="toggle_label"></label>
                    </div>
                </div>
                <div class="okjoipjiok konogt">
                    <h4>オートセーブ</h4>
                    <div class="toggle_button">
                        <input id="autosave_tg" class="toggle_input" type="checkbox" ${SETTINGS.autosave ? "checked" : ""}>
                        <label for="toggle" class="toggle_label"></label>
                    </div>
                </div>
                <div class="okjoipjiok konogt">
                    <h4>即時プレビュー</h4>
                    <t style="font-size:8px;">This may take more battery!!</t>
                    <div class="toggle_button">
                        <input id="instapreview_tg" class="toggle_input" type="checkbox" ${SETTINGS.instapreview ? "checked" : ""}>
                        <label for="toggle" class="toggle_label"></label>
                    </div>
                </div>
            </div>
            <hr class="dhr-ppo rsgafwad">
            <h4>通知</h4>
            <div class="flxxt">
                <div class="okjoipjiok">
                    <h4 id="autoinput_hh" class="prehh">自動入力</h4>
                    <div class="toggle_button">
                        <input id="quickinputnotification_tg" class="toggle_input" type="checkbox" ${SETTINGS.quickInputNotification ? "checked" : ""}>
                        <label for="toggle" class="toggle_label"></label>
                    </div>
                </div>
                <div class="okjoipjiok">
                    <h4 id="autosave_hh" class="prehh">オートセーブ</h4>
                    <div class="toggle_button">
                        <input id="autosavenotification_tg" class="toggle_input" type="checkbox" ${SETTINGS.autosaveNotification ? "checked" : ""}>
                        <label for="toggle" class="toggle_label"></label>
                    </div>
                </div>
            </div>
            <hr class="dhr-ppo rsgafwad">
            <h4>空白を視覚化</h4>
            <div class="toggle_button">
                <input id="visiblespace_tg" class="toggle_input" type="checkbox" ${SETTINGS.visibleSpace ? "checked" : ""}>
                <label for="toggle" class="toggle_label"></label>
            </div>
            <div id="jjjadios" class="paOojiA">
                <div class="pprajisda">
                    <p style="font-size:12px;">半角スペース</p>
                    <div id="half-width-space-pre" class="code-pre"></div>
                </div>
                <div class="pprajisda">
                    <p style="font-size:12px;">各行末のみ</p>
                    <div id="dAWsdang" class="toggle_button" style="transform:scale(0.75);">
                        <input id="visibleonlyendspace_tg" class="toggle_input" type="checkbox" ${SETTINGS.visibleOnlyEndSpace ? "checked" : ""}>
                        <label for="toggle" class="toggle_label"></label>
                    </div>
                </div>
                <div class="pprajisda">
                    <p style="font-size:12px;">全角スペース</p>
                    <div id="full-width-space-pre" class="code-pre"></div>
                </div>
            </div>
            <hr class="dhr-ppo rsgafwad">
            <!--h4>オブジェクトをブロック化</h4>
            <div class="toggle_button ${SETTINGS.colorEditor ? "brunotoggl" : ""}" id="ASDpadSS">
                <input id="solidobject_tg" class="toggle_input" type="checkbox" ${(SETTINGS.colorEditor || SETTINGS.solidObject) ? "checked" : ""}>
                <label for="toggle" class="toggle_label"></label>
            </div-->
            <p id="dspp" style="font-size:12px;"></p>
            <div style="width: 95%;margin-top:8px;">
                <div id="ADSmdaaa">
                    オブジェクト
                </div>
                <div class="oodAOIj">
                    <div class="oodaji">
                        <p style="font-size:12px;">写真</p>
                        <div class="code-pre ASOKJjmm">
                            <span class="sheart22">%:IMG-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%</span>
                        </div>
                    </div>
                    <div class="oodaji">
                        <p style="font-size:12px;">動画</p>
                        <div class="code-pre ASOKJjmm">
                            <span class="sheart22">%:VIDEO-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%</span>
                        </div>
                    </div>
                    <div class="oodaji">
                        <p style="font-size:12px;">リンク</p>
                        <div class="code-pre ASOKJjmm">
                            <span class="sheart24">θ:LINK-H=<span class="sheart25">{URL}</span>-T=<span class="sheart25">{text}</span>;θ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        function(){
            function save(){
                saveEditorConfig();
                setEditorcdColor();
            }
    
            function ospacepre(){
                const y = document.getElementById("dAWsdang");
                const z = document.getElementById("jjjadios");
                if (SETTINGS.visibleSpace){
                    y?.classList.remove("brunotoggl_");
                    z?.classList.remove("brunotoggl");
                } else {
                    y?.classList.add("brunotoggl_");
                    z?.classList.add("brunotoggl");
                }
            }
    
            function sspacepre(){
                const a = $("#half-width-space-pre"),
                    b = $("#full-width-space-pre");
                if (SETTINGS.visibleOnlyEndSpace){
                    a.html(spacePreview.half.visibleOnlyEndSpace);
                    b.html(spacePreview.full.visibleOnlyEndSpace);
                } else {
                    a.html(spacePreview.half.visibleAllSpace);
                    b.html(spacePreview.full.visibleAllSpace);
                }
            }
    
            function stext(){
                const g = $("#dspp");
                if (SETTINGS.colorEditor){
                    g
                    .text("配色が有効の場合は常に有効になります")
                    .css("color", "orange")
                    .css("visibility", "visible");
                } else {
                    g
                    .text("ブロック内では改行が無効になります")
                    .css("color", "lightgreen")
                    .css("visibility", "visible");
                }
            }
    
            function cobjblock(){
                const r = document.getElementById("ASDpadSS");
                if (SETTINGS.colorEditor){
                    r?.classList.add("brunotoggl");
                } else {
                    r?.classList.remove("brunotoggl");
                }
            }
    
            document.getElementById("editorcolor_tg")?.addEventListener("input", function(){
                //@ts-ignore
                SETTINGS.colorEditor = (this.checked) ? true : false;
                const slo = document.getElementById("solidobject_tg");
    
                if (SETTINGS.colorEditor){
                    //@ts-ignore
                    SETTINGS.solidObject = slo.checked = true;
                    slo?.dispatchEvent(new Event("input"));
                } else {
                    //@ts-ignore
                    slo.checked = SETTINGS.solidObject = SETTINGS._solidObject;
                }
                stext();
                cobjblock();
                save();
            });
    
            document.getElementById("autosave_tg")?.addEventListener("click", function(){
                //@ts-ignore
                SETTINGS.autosave = (this.checked) ? true : false;
                nextAutoSave();
                save();
            });
    
            document.getElementById("instapreview_tg")?.addEventListener("click", function(){
                //@ts-ignore
                SETTINGS.instapreview = (this.checked) ? true : false;
                nextAutoSave();
                save();
            });
    
            document.getElementById("quickinputnotification_tg")?.addEventListener("click", function(){
                //@ts-ignore
                SETTINGS.quickInputNotification = (this.checked) ? true : false;
                save();
            });
    
            document.getElementById("autosavenotification_tg")?.addEventListener("click", function(){
                //@ts-ignore
                SETTINGS.autosaveNotification = (this.checked) ? true : false;
                save();
            });
    
            document.getElementById("visiblespace_tg")?.addEventListener("input", function(){
                //@ts-ignore
                SETTINGS.visibleSpace = (this.checked) ? true : false;
                ospacepre();
                sspacepre();
                save();
            });
    
            document.getElementById("visibleonlyendspace_tg")?.addEventListener("click", function(){
                if (!SETTINGS.visibleSpace){
                    //@ts-ignore
                    this.checked = SETTINGS.visibleOnlyEndSpace;
                    return;
                }
                //@ts-ignore
                SETTINGS.visibleOnlyEndSpace = (this.checked) ? true : false;
                sspacepre();
                save();
            });
    
            document.getElementById("solidobject_tg")?.addEventListener("input", function(e){
                if (SETTINGS.colorEditor){
                    //@ts-ignore
                    this.checked = SETTINGS.solidObject = true;
                    return;
                }
                //@ts-ignore
                SETTINGS.solidObject = SETTINGS._solidObject = (this.checked) ? true : false;
                stext();
                save();
            });
    
            ospacepre();
            sspacepre();
            cobjblock();
            stext();
        }, {
            width: 600,
            height: 650
        });
    });
    
    
    saveEditorConfig();
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    
    
    
    /**
     * 
     * @param {boolean} notify 
     */
    function showZoom(notify){
        $("#promax-container").css("transform", `scale(${PVSTATUS.zooms.ratio})`);
        if (notify){
            var notifyArrow = PVSTATUS.zooms.ratio > 1 ? gglSymbols.zoom_in : gglSymbols.zoom_out;
            PVSTATUS.zooms.ratio === 1 ? notifyArrow = gglSymbols.search : void 0;
            Notifier.notifyHTML(
            `<div class="flxxt aosdosd">${notifyArrow} x${Math.floor(PVSTATUS.zooms.ratio*100)}% <button id="zoom_resetter" class="notifier-btn">リセット</button></div>`,
            {
                duration: 2000,
                discriminator: "pvtransition",
                do_not_keep_previous: true
            });
        }
    }
    
    
    /**
     * 
     * @param {"in" | "out"} how 
     */
    function zoomPV(how){
        const index = PVSTATUS.zooms.ratios.indexOf(PVSTATUS.zooms.ratio);
        PVSTATUS.zooms.ratio = how === "in" ? 
        typeof PVSTATUS.zooms.ratios[index+1] === "undefined" ? PVSTATUS.zooms.ratios[PVSTATUS.zooms.ratios.length-1] : PVSTATUS.zooms.ratios[index+1]
         : 
        typeof PVSTATUS.zooms.ratios[index-1] === "undefined" ? PVSTATUS.zooms.ratios[0] : PVSTATUS.zooms.ratios[index-1];
        showZoom(true);
    }
    
    
    window.addEventListener("wheel", function(e){
        if (e.ctrlKey || e.metaKey){
            e.preventDefault();
            zoomPV(e.deltaY < 0 ? "in" : "out");
        }
    }, { passive: false });
    
    
    "touchstart mousedown".split(" ").forEach(a => {
        addEventListener(a, function(e){
            //@ts-ignore
            const targetID = e.target.id;
            if (targetID === "zoom_resetter"){
                PVSTATUS.zooms.ratio = 1;
                showZoom(false);
            } else if (targetID === "move_resetter"){
                PVSTATUS.moves.top = 0;
                showUpDown(false);
            }
        });
    });
    
    
    /**
     * 
     * @param {boolean} notify 
     */
    function showUpDown(notify){
        $("#promax-container").css("top", PVSTATUS.moves.top+"px");
        if (notify){
            var notifyArrow = PVSTATUS.moves.top > 0 ? gglSymbols.arrow_downward : gglSymbols.arrow_upward;
            PVSTATUS.moves.top === 0 ? notifyArrow = gglSymbols.height : void 0;
            Notifier.notifyHTML(
            `<div class="flxxt aosdosd">${notifyArrow} ${Math.abs(PVSTATUS.moves.top)}px (resized?) <button id="move_resetter" class="notifier-btn">リセット</button></div>`,
            {
                duration: 2000,
                discriminator: "pvtransition",
                do_not_keep_previous: true
            });
        }
    }
    
    
    /**
     * 
     * @param {"up" | "down"} how 
     */
    function updownPV(how){
        PVSTATUS.moves.top += how === "up" ? PVSTATUS.moves.delta : -PVSTATUS.moves.delta;
        showUpDown(true);
    }
    
    
    function savepv(){
        setLocalStorage(ZOOMRATIOKEY, String(PVSTATUS.zooms.ratio));
        setLocalStorage(TOPKEY, String(PVSTATUS.moves.top));
    }
    
    
    /**@type {[Element | null, Element | null]} */
    const pcativeElements = [ document.activeElement, document.activeElement ];
    setInterval(() => {
        pcativeElements.shift();
        pcativeElements.push(document.activeElement);
    }, 250);
    
    
    function _ye(){
        if (pcativeElements.some(e => { if (e?.id === "main-editor") return true; })){
            $("#main-editor").trigger("focus");
        }
        savepv();
    }
    
    
    document.getElementById("pvzoom_in")?.addEventListener("click", function(){
        zoomPV("in");
        _ye();
    });
    
    
    document.getElementById("pvzoom_out")?.addEventListener("click", function(){
        zoomPV("out");
        _ye();
    });
    
    
    document.getElementById("pvarrow_upward")?.addEventListener("click", function(){
        updownPV("down");
        _ye();
    });
    
    
    document.getElementById("pvarrow_downward")?.addEventListener("click", function(){
        updownPV("up");
        _ye();
    });
    
    
    document.getElementById("pvarrow_power_settings_new")?.addEventListener("click", function(){
        PVSTATUS.zooms.ratio = 1;
        PVSTATUS.moves.top = 0;
        showZoom(false);
        showUpDown(false);
        savepv();
        if (Notifier.current === "pvtransition"){
            Notifier.closeNotifier();
        }
    });
    
    
    const whatsnow = {
        up: {
            active: false,
            func: function(){
                updownPV("up");
                _ye();
            }
        },
        down: {
            active: false,
            func: function(){
                updownPV("down");
                _ye();
            }
        },
        ctrl: false,
    };
    
    
    window.addEventListener("keydown", function(e){
        const KEY = e.key.toUpperCase();
        const g = e.ctrlKey || e.metaKey;
    
        function a(){
            e.preventDefault();
        }
        if (KEY == "ARROWUP"){
            if (g) a();
            whatsnow.up.active = true;
        } else if (KEY == "ARROWDOWN"){
            if (g) a();
            whatsnow.down.active = true;
        } else if (KEY == "CONTROL"){
            whatsnow.ctrl = true;
        }
    }, { passive: false });
    
    
    window.addEventListener("keyup", function(e){
        const KEY = e.key.toUpperCase();
    
        if (KEY == "ARROWUP"){
            whatsnow.up.active = false;
        } else if (KEY == "ARROWDOWN"){
            whatsnow.down.active = false;
        } else if (KEY == "CONTROL"){
            whatsnow.ctrl = false;
        }
    }, { passive: false });
    
    
    setInterval(() => {
        if (whatsnow.ctrl){
            if (whatsnow.up.active)
                whatsnow.up.func();
            if (whatsnow.down.active)
                whatsnow.down.func();
        }
    }, 100);
    
    
    showZoom(false);
    showUpDown(false);
    
    
    LOADW++;
    updatestartupProgress(LOADW*100/scriptlen);
    
    endLoad(void 0, 1500);
    setTimeout(()=>PictoNotifier.notifyInfo(`詳細に新しいテーブルを追加したい場合は<span style="color:#D32F2F">5年E組伊藤舜</span>にお願いしてくださ～い！`, {
        duration: 10000
    }), 2000);
    
    window.addEventListener("load", function(e){
        
    });
    
    return 0;
})();
