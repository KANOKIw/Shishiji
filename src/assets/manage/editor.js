//@ts-check
"use strict";


(function(){
    const secReg = /(§[a-zA-Z0-9]){1}/g;
    const session = getCookie("__ogauthk");
    var username = "";
    /**@ts-ignore @type {import("../shishiji-dts/objects").mapObject} */
    var ARTICLEDATA = {};
    var change_not_saved_remains = false;
    const orgCloudfi = {
        maxsize: 0,
    };
    const SETTINGS = {
        autosave: false,
    };

    $.ajaxSetup({async: false});
    $.post("/org/manage/auth/editor", { session: session })
    .done(data => {
        const error = data.error;

        username = data.usn;
        
        if (error)
            leaveherep();

        ARTICLEDATA = data.artdata;
        orgCloudfi.maxsize = data.mxcs;
    })
    .catch(leaveherep);
    $.ajaxSetup({async: true});

    function leaveherep(){
        delCookie("__ogauthk");
        window.history.replaceState("", "", "/org/manage/login");
        window.location.reload();
    }

    const acceptedfileextensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".avi", ".mov", ".flv"];


    if (!ARTICLEDATA || Object.keys(ARTICLEDATA).length < 1){
        ARTICLEDATA = {
            article: {
                title: "",
                core_grade: "",
                theme_color: "#000000",
                content: "",
                crowd_status: {
                    level: 0,
                    estimated: 0,
                },
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
                    event: "",
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
                floor: "",
            },
            discriminator: ""
        }
    }

    var lastsaved = ARTICLEDATA;

    /**@type {{[key: string]: string}} */
    const DOCORATION_TEXT = {
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
    };


    const DOCOLS = {
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
    };
    const DOSTS = {
        "§l": "sheart17",
        "§n": "sheart18", 
        "§o": "sheart19",
        "§m": "sheart26",
        "§L": "sheart27",
    };
    const DODEFS = {
        "§x": "sheart28",
        "§y": "sheart29",
        "§z": "sheart30",

        defaultcls: "sheart31",
    };
    
    

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
     */
    function writeArticleOverview(details, fadein, scroll_top, target, FORCE, _fadein){
        /**@ts-ignore @type {HTMLElement} */
        const ctx = document.getElementById("overview-context");
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const color = (details.article.theme_color) ? details.article.theme_color : "black";
        const font = (details.article.font_family) ? details.article.font_family : "";

        var article_mainctx = mcFormat(details.article.content, fn => { return toOrgFilepath(username, fn); });


        if (!window.navigator.onLine){
            Notifier.notifyHTML(
                `<div id="shr-notf" class="flxxt" style="font-size: 12px;">${GPATH.ERROR}${TEXT[LANGUAGE].NOTIFICATION_CONNECTION_ERROR}</div>`,
                2500,
                "article connection error",
                !0,
            );
            $("#ovv-ctx-loading").html(`<div class="flxxt"><div style="width:40%;">${GPATH.ERROR_ZAHUMARU}</div></div>${TEXT[LANGUAGE].ARTICLE_CONNECTION_ERROR}`);
            $("#overview-share").hide();
            return;
        }
        
        if (article_mainctx === "<span></span>"){
            article_mainctx = `<h4 style="width: 100%; margin-top: 50px; margin-bottom: 50px; text-align: center;">${TEXT[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
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

        const EVENT_HEADER = `<img id="--art-header" class="article-image article header" alt="" aria-label="${TEXT[LANGUAGE].ARIA_ARTICLE_HEADER}"><div class="article titleC"><img id="--art-icon" class="article-image" style="width: 48px" alt="" aria-label="${TEXT[LANGUAGE].ARIA_ARTICLE_ICON}"><h1 id="ctx-title" style="margin: 5px; font-family: var(--font-view);">${escapeHTML(details.article.title)}</h1></div>`;


        function __onload(){
            setTimeout(() => {
                $("#overview-context").addClass("_fadein");
                if (scroll_top !== void 0)
                    $("#shishiji-overview").scrollTop(scroll_top);
                scroll_top = 0;
            }, 25);
        }

        /**@this {HTMLElement} */
        function showDescription(){
            if ($(this).hasClass("tg-active") && !FORCE)
                return;

            $("#overview-context").addClass("_wait_f");
            $("#oop").show();

            writeOverviewContent(article_mainctx, __onload);
            if (!$("#ovv-t-description-sd").hasClass("tg-active"))
            $("#overview-context").removeClass("fadein").removeClass("_fadein");
            $(".tg-active").removeClass("tg-active");
            $(this).addClass("tg-active");
        }

        /**@this {HTMLElement} */
        function showDetails(){
            if ($(this).hasClass("tg-active"))
                return;

            $("#overview-context").addClass("_wait_f");
            $("#oop").hide();

            writeOverviewContent(`
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
                            <tr class="ev_property">
                                <th class="ev_property_cell">
                                    開催時間
                                </th>
                                <th class="ev_property_cell">
                                    ${details.article.schedule}
                                </th>
                            </tr>
                            ${custom_tr}
                            <tr class="ev_property">
                                <th class="ev_property_cell">
                                    予想待ち時間
                                </th>
                                <th class="ev_property_cell" aria-label="${details.article.crowd_status.estimated}分">
                                    ${details.article.crowd_status.estimated}分
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <div class="crowded_lim">
                        <p style="font-weight: bold; margin: 10px; margin-top: 0; margin-bottom: 5px;" aria-label="混み具合">
                            混み具合
                        </p>
                        <div class="crowded_deg_bar"></div>
                        <div id="crowed_pointer" style="position: relative;">
                            <div class="ccENTER_B" style="position: absolute; left: ${details.article.crowd_status.level}%;">
                                <span class="material-symbols-outlined"
                                    style="position: absolute; margin-top: 5px;">
                                    north
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style="margin: 20px;">
            `, __onload);

            $("#overview-context").removeClass("fadein").removeClass("_fadein");
            $(".tg-active").removeClass("tg-active");
            $(this).addClass("tg-active");
        }

        $("#ovv-t-description-sd").off("click", Ovv_tg_listener.description).on("click", showDescription);
        $("#ovv-t-details-sd").off("click", Ovv_tg_listener.details).on("click", showDetails);

        Ovv_tg_listener.description = showDescription;
        Ovv_tg_listener.details = showDetails;

        if (!target || !["description", "details", "else"].includes(target))
            target = "description";
        
        document.getElementById(`ovv-t-${target}-sd`)?.dispatchEvent(new Event("click"));
    }


    /**
     * 
     * @param {boolean} [do_image] 
     */
    function rewrite(do_image){
        /**@ts-ignore @type {HTMLElement} */
        var editor = document.getElementById("main-editor");

        var scr = $("#shishiji-overview").scrollTop();
            

        setEditorcdColor();
        ARTICLEDATA.article.content = editor.innerText;
        writeArticleOverview(ARTICLEDATA, false, scr, void 0, true, true);

        if (do_image){
            /**
             * 
             * @param {"h" | "i"} a 
             */
            function imageRel(a){
                if (a == "h")
                    this.outerHTML = `<img id="--art-header" class="article-image article header" alt="" aria-label="${TEXT[LANGUAGE].ARIA_ARTICLE_HEADER}">`;
                else if (a == "i")
                    this.outerHTML = `<img id="--art-icon" class="article-image" style="width: 48px" alt="" aria-label="${TEXT[LANGUAGE].ARIA_ARTICLE_ICON}">`;
            };

            const dummy = { outerHTML: "" };
            
            imageRel.apply(document.getElementById("no-del-image-h") || dummy, ["h"]);
            imageRel.apply(document.getElementById("no-del-image-i") || dummy, ["i"]);

            $("#--art-header").on("error", function(){ imageError.apply(this, ["h"]); }).attr("src", toOrgFilepath(username, ARTICLEDATA.article.images.header));
            $("#--art-icon").on("error", function(){ imageError.apply(this, ["i"]); }).attr("src", toOrgFilepath(username, ARTICLEDATA.object.images.icon));
        }
    }


    /**
     * 
     * @param {string} ctx
     * @param {() => void} [callback] 
     */
    async function writeOverviewContent(ctx, callback){
        new Promise((resolve, reject) => {
            $("#ctx-article").html(ctx);
            resolve("");
        }).then(() => {
            if (callback !== void 0)
                callback();
        });
    }


    function setEditorcdColor(){
        $("#main-editor-cd").html(colorXtext(document.getElementById("main-editor")?.innerText));
    }


    /**
     * 
     * @param {string | null | undefined} text 
     */
    function colorXtext(text){
        if (text === null || text === undefined)
            return "";

        text = escapeHTML(text);
        text = text.replace(/\n/g, "<br>");

        for (const sectionkey in DOCOLS){
            text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DOCOLS[sectionkey]}">${sectionkey}</span>`);
        }

        for (const sectionkey in DOSTS){
            text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DOSTS[sectionkey]}">${sectionkey}</span>`);
        }
        
        for (const sectionkey in DODEFS){
            text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DODEFS.defaultcls}">${sectionkey}</span>`);
        }

        text = text.replace(/§v/g, `<span class="sheart32">§v</span>`);
        text = text.replace(/§r/g, `<span class="sheart33">§r</span>`);
        text = text.replace(/§k/g, `<span class="sheart34">§<span class="MCOBF">r</span></span>`);

        // TODO: allow <br> any where & deny :#-H= on url
        text = text.replace(/(%:IMG)-S=([^\-]+)-W=(\d+)(;%)|(%:VIDEO)-S=([^\-]+)-W=(\d+)(;%)/g, `<span class="sheart22">$1-S=<span class="sheart23">$2</span>-W=<span class="sheart23">$3</span>$4</span>`);
        text = text.replace(/(#:LINK)-H=(https?:\/\/[^#:]+\.\w+\/?\S*)-T=(.*?)(;#)/g, `<span class="sheart24">$1-H=<span class="sheart25">$2</span>-T=<span class="sheart25">$3</span>$4</span>`);

        return text;
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
        $("#save_data_norm")
        .css("background-color", "rgb(247, 255, 142)")
        .css("cursor", "pointer");
    }


    /**@type {Range | undefined} */
    var last_pos;
    window.addEventListener("load", function(e){
        const EDITORSR = {
            range: Range.prototype,
            selection: Selection.prototype,
        };


        this.setInterval(() => {
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


        /**
         * mischief
         */
        startLoad("読み込み中");

        this.setTimeout(() => {
            endLoad("ようこそ");
        }, 500);


        $("#app-mount").show();
        $("#username-d").text(username);

        $("#main-editor").html(tranparentedXtext(escapeHTML(ARTICLEDATA.article.content)));
        $("#main-editor-cd").html(colorXtext(ARTICLEDATA.article.content));
        $("#ctx-title").text(ARTICLEDATA.article.title || "NAME");


        /**
         * 
         * @param {string} text 
         * @param {boolean} [notify] 
         * @param {() => void} [errcb] 
         */
        function insertText(text, notify, errcb){
            /**@ts-ignore @type {HTMLElement} */
            var editor = document.getElementById("main-editor");

            editor.focus();

            var sel = EDITORSR.selection;
            var range = EDITORSR.range;
            
            var textNode = document.createTextNode(text);

            try{
                range.deleteContents();
                range.insertNode(textNode);
            } catch (e){
                if (errcb)
                    errcb();
                return;
            }

            range.setStartAfter(textNode);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            change_not_saved_remains = true;
            $("#sv_msg").text("");
            $("#save_data_norm")
            .css("background-color", "rgb(247, 255, 142)")
            .css("cursor", "pointer");

            if (notify)
                Notifier.notifyHTML(text, 1000, text, true);

            editor.focus();
            rewrite();
        }


        document.getElementById("logout__")?.addEventListener("click", () => {
            Popup.popupContent(`
            <div class="protected" id="ppupds" style="display: flex; align-items: center; justify-content: center;">
                <span style="display: flex; align-items: center; flex-direction: column;">
                    <h2>ログアウトしますか？</h2>
                    <p id="--logout-adjustmsg"></p>
                    <span style="height: 20px;"></span>
                    <button id="--yesilogout"><h2>ログアウト</h2></button>
                </span>
            </div>`,
            function(){
                if (change_not_saved_remains){
                    $("#--logout-adjustmsg")
                    .text("保存していない変更があります")
                    .css("margin-top", "10px")
                    .css("color", "red");
                }
                document.getElementById("--yesilogout")?.addEventListener("click", leaveherep);
            });
        });


        Array.from(document.getElementsByClassName("motd-dec-b")).forEach((l) => {
            l.addEventListener("click", function(e){
                e.preventDefault();
                const color = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
                if (color == void 0)
                    return;
                const decorator = DOCORATION_TEXT[color] || "§k";

                insertText(decorator, true);
            }, { passive: false });
        });


        /**
         * @this {HTMLElement}
         * @param {boolean} [do_not_showmessage] 
         * @param {() => void} [donecallback] 
         */
        function saveMainEditorctx(do_not_showmessage, donecallback){
            if ($(this).css("background-color") != "rgb(247, 255, 142)")
                return;

            $("#sv_msg").text("保存しています...").css("color", "orange");
            $("#save_data_norm")
            .css("background-color", "rgb(144 149 81)")
            .css("background-color", "rgb(144 149 81)");

            setTimeout(() => {
                $.post("/org/manage/edit/savemain", { session: session, nmap: JSON.stringify(ARTICLEDATA) })
                .done(d => {
                    change_not_saved_remains = false;
                    lastsaved = ARTICLEDATA;

                    clearTimeout(_t.a);

                    if (!do_not_showmessage){
                        $("#sv_msg").text("保存しました").css("color", "green");
                        _t.a = setTimeout(() => {
                            $("#sv_msg").text("");
                        }, 3000);
                    }
                    $("#save_data_norm")
                    .css("background-color", "rgb(144 149 81)")
                    .css("cursor", "not-allowed");

                    rewrite();
                    if (donecallback)
                        donecallback();
                })  
                .catch(err => {
                    clearTimeout(_t.a);
                    $("#sv_msg").text("失敗しました").css("color", "red");
                    _t.a = setTimeout(() => {
                        $("#sv_msg").text("");
                    }, 3000);
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


        /**@ts-ignore @type {NodeJS.Timeout} */
        var kes = 0;
        this.document.getElementById("main-editor")?.addEventListener("input", function(ev){
            var scr = $("#shishiji-overview").scrollTop();
            
            change_not_saved_remains = true;
            $("#sv_msg").text("");
            
            allowNsave();
            
            setEditorcdColor();
            
            ARTICLEDATA.article.content = parseXtext(this.innerHTML);
            writeArticleOverview(ARTICLEDATA, false, scr, void 0, true, true);

            clearTimeout(kes);
            if (SETTINGS.autosave){
                kes = setTimeout(() => {
                    saveMainEditorctx.apply(document.getElementById("save_data_norm"), [true, () => {
                        $("#sv_msg").text("自動で保存しました").css("color", "green");
                    }]);
                }, 2500);
            }
        });


        /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
        var _t = { a: 0, };
        this.document.getElementById("save_data_norm")?.addEventListener("click", function(){
            saveMainEditorctx.apply(this);
        });


        this.document.getElementById("autosaveswitcheri")?.addEventListener("input", function(e){
            //@ts-ignore
            SETTINGS.autosave = (this.checked) ? true : false;
            clearTimeout(kes);
            if (SETTINGS.autosave){
                kes = setTimeout(() => {
                    saveMainEditorctx.apply(document.getElementById("save_data_norm"), [true, () => {
                        $("#sv_msg").text("自動で保存しました").css("color", "green");
                    }]);
                }, 2500);
            }
        });


        this.document.getElementById("smthElse")?.addEventListener("click", function(e){
            Popup.popupContent(`
            <div class="protected aioshud" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
                <h4 style="padding-top: 30px;">テーマカラー</h4>
                <input type="color" id="theme_color_picker" value="${ARTICLEDATA.article.theme_color}">
                <hr class="dhr-ppo">
                <h4>ヘッダー画像</h4>
                <input type="text" id="header_path_input" value="${ARTICLEDATA.article.images.header}" placeholder="ファイル名">
                <hr class="dhr-ppo">
                <h4>アイコン画像</h4>
                <input type="text" id="icon_path_input" value="${ARTICLEDATA.object.images.icon}" placeholder="ファイル名">
                <hr class="dhr-ppo">
                <button id="save_data_else" class="ppu-decb"><h4>保存</h4></button>
                <h4 id="others---meg"></h4>
            </div>
            `, () => {
                /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
                var _t = { a: 0, };
                document.getElementById("save_data_else")?.addEventListener("click", (e) => {
                    //@ts-ignore
                    const color = document.getElementById("theme_color_picker")?.value || "#ffffff";
                    //@ts-ignore
                    var header_path = document.getElementById("header_path_input")?.value.replace(" ", "") || "";
                    //@ts-ignore
                    var icon_path = document.getElementById("icon_path_input")?.value.replace(" ", "") || "";

                    if ($("#others---meg").text() == "保存しています")
                        return;
                    
                    if (header_path.includes("/") || icon_path.includes("/") || !icon_path.includes(".")){
                        clearTimeout(_t.a);
                        $("#others---meg").text("画像に誤りがあります").css("color", "red");
                        _t.a = setTimeout(() => {
                            $("#others---meg").text("");
                        }, 3000);
                        return;
                    }

                    ARTICLEDATA.article.theme_color = color;
                    ARTICLEDATA.article.images.header = header_path;
                    ARTICLEDATA.object.images.icon = icon_path;
                    
                    $("#others---meg").text("保存しています").css("color", "orange");

                    setTimeout(() => {
                        $.post("/org/manage/edit/saveothers", { session: session, nmap: JSON.stringify(ARTICLEDATA) })
                        .done(d => {
                            lastsaved = ARTICLEDATA;
                            clearTimeout(_t.a);
                            $("#others---meg").text("保存しました").css("color", "lightgreen");
                            rewrite(true);
                            _t.a = setTimeout(() => {
                                $("#others---meg").text("");
                            }, 3000);
                        })  
                        .catch(err => {
                            clearTimeout(_t.a);
                            $("#others---meg").text("失敗しました").css("color", "red");
                            _t.a = setTimeout(() => {
                                $("#others---meg").text("");
                            }, 3000);
                        });
                    }, 250);
                });
            });
        });


        this.document.getElementById("addImageb")?.addEventListener("click", e => {
            Popup.popupContent(`
            <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
                <h2 style="padding-top: 30px;">写真を挿入</h2>
                <h4 id="__caut_imad"></h4>
                <hr class="dhr-ppo">
                <h4>写真の名前</h4>
                <input id="addImg_path_" type="text" style="margin-bottom: 20px;" placeholder="ファイル名"></input>
                <h4>写真の幅(画面の横幅に対する %)</h4>
                <input id="addImg_width_" type="text" placeholder="0 ~ 100"></input>
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
                    var path = document.getElementById("addImg_path_")?.value.replace(" ", "") || "";
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
                    const imgFormat = `%:IMG-S=${path}-W=${width};%`;
                    
                    Popup.disPop();

                    insertText(imgFormat, true);
                });
            });
        });
        
        
        this.document.getElementById("addVideob")?.addEventListener("click", e => {
            Popup.popupContent(`
            <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
                <h2 style="padding-top: 30px;">動画を挿入</h2>
                <h4 id="__caut_imad"></h4>
                <hr class="dhr-ppo">
                <h4>動画の名前</h4>
                <input id="addImg_path_" type="text" style="margin-bottom: 20px;" placeholder="ファイル名"></input>
                <h4>動画の幅(画面の横幅に対する %)</h4>
                <input id="addImg_width_" type="text" placeholder="0 ~ 100"></input>
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
                    var path = document.getElementById("addImg_path_")?.value.replace(" ", "") || "";
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
                    const videoFormat = `%:VIDEO-S=${path}-W=${width};%`;
                    
                    Popup.disPop();

                    insertText(videoFormat, true);
                });
            });
        });


        this.document.getElementById("addLinkb")?.addEventListener("click", e => {
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
                var _t = { a: 0, };
                var tm = 0;
                const up = /^https?:\/\/?[\w.]+\.\w+\/?\S*$/;
                document.getElementById("insertLinkb")?.addEventListener("click", function(){
                    //@ts-ignore
                    var url = document.getElementById("addLink_url_")?.value.replace(" ", "") || "";
                    //@ts-ignore
                    var text = document.getElementById("addLink_text_")?.value.replace(" ", "") || "";

                    /**@param {string} msg  */
                    function notifyMSG(msg){
                        clearTimeout(_t.a);
                        $("#others---meg").text(msg).css("color", "red");
                        _t.a = setTimeout(() => {
                            $("#others---meg").text("");
                        }, 3000);
                    }

                    if (url.length < 1){
                        $("#__caut_imad").text("URLが埋まっていません").css("color", "red");
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
            });
        });


        this.document.getElementById("manageFileb")?.addEventListener("click", function(){
            Popup.popupContent(`<div class="protected" id="ppupds"><div class="mx-text-center flxxt">${Symbol_Span.loadgingsymbol}</div></div>`);

            $.post("/org/manage/file/list", { session: session })
            .done(function(data){
                /**@type {string[]} */
                const files = data.files;
                
                /**
                 * 
                 * @param {{files: string[], totalsize: number, sizemap: {[key: string]: number}}} responsedata 
                 */
                function writeCloudonPopup(responsedata){
                    /**@type {string[]} */
                    const files = responsedata.files;
                    /**@type {number} */
                    const totalsize = responsedata.totalsize;
                    const sizemap = responsedata.sizemap;
                    const displaysize = Math.ceil(totalsize*100)/100;

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

                    for (const file of files){
                        const mediatype = getMediaType(file);
                        const src = toOrgFilepath(username, file);
                        var _html = "";

                        switch (mediatype){
                            case "image":
                                _html += `
                                <div class="cloud-file-el">
                                    <div class="cloudfileele" uname="${file}">
                                        <img class="cloudfileel cloudsh" src="${src}" uname="${file}">
                                        <h4 class="cloudfileel">${file}</h4>
                                        <p class="cloudfileel" style="font-size: 75%;">${Math.ceil(sizemap[file]*1000)/1000}MB</p>
                                    </div>
                                </div>`;
                                break;
                            case "video":
                                _html += `
                                <div class="cloud-file-el">
                                    <div class="cloudfileele" uname="${file}">
                                        <video class="cloudfileel cloudsh" uname="${file}" src="${src}#t=0.001" controls preload="metadata" playsinline></video>
                                        <h4 class="cloudfileel">${file}</h4>
                                        <p class="cloudfileel" style="font-size: 75%;">${Math.ceil(sizemap[file]*1000)/1000}MB</p>
                                    </div>
                                </div>`;
                                break;
                        }
                        $("#orgcloud-filelist")
                        .append(_html)
                        .scrollTop(0);
                    }

                    $(".cloudfileele").on("click", () => {});
                }

                if (files){
                    Popup.popupContent(`
                    <div class="protected --posa" id="ppupds">
                        <h4 style="padding-top: 20px;">あなたの団体(${username})のクラウド</h4>
                        <p id="--cloud-desc"></p>
                        <p style="font-size: 50%;">お金をくれたら増やしてあげる！</p>
                        <hr class="dhr-ppo" style="margin: 5px 0 10px 0;">
                        <p style="margin-bottom: 5px; color: #b7b7b7;">クリックしてファイル名をコピー</p>
                        <div id="orgcloud-filelist">

                        </div>
                        <div class="flxxt">
                            <div class="ertxs">
                                <button id="uploadfb" class="ppu-decb" style="margin-top: 5px; color: black;"><h4 id="uploadfbh">アップロード</h4></button>
                                <input type="file" id="uploadfi" style="margin: 10px; margin-top: 5px;" accept="${acceptedfileextensions.join(",")}">
                            </div>
                            <div class="ertxs">
                                <button id="deletefb" class="ppu-decb" style="margin-top: 5px; color: black;"><h4 id="deletefbh">削除</h4></button>
                                <input type="text" id="deletefi" style="margin: 10px; margin-top: 5px;" placeholder="ファイル名">
                            </div>
                        </div>
                    </div>`,
                    function(){
                        writeCloudonPopup(data);

                        /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
                        var _t = { a: 0, b: 0, };
                        document.getElementById("uploadfb")?.addEventListener("click", e => {
                            /**@ts-ignore @type {File} */
                            var file = document.getElementById("uploadfi").files[0];

                            if ($("#uploadfbh").text() != "アップロード"){
                                return;
                            }

                            clearTimeout(_t.a);

                            if (file){
                                clearTimeout(_t.a);

                                if (getMediaType(file.name) == "unknown"){
                                    $("#uploadfbh").text("ファイル形式が無効です").css("color", "red");
                                    _t.a = setTimeout(() => {
                                        $("#uploadfbh").text("アップロード").css("color", "black");
                                    }, 3000);
                                    return;
                                }

                                $("#uploadfbh").text("アップロード中...").css("color", "orange");

                                setTimeout(() => {
                                    var formData = new FormData();
                                    formData.append("file", file);
                                    formData.append("session", session || "");

                                    $.post("/org/manage/file/overflow", { session: session, size: file.size })
                                    .done(data => {
                                        const overflow = data.overflow;
                                        var mbytesoverflow = data.bytesoverflow;

                                        if (!overflow){
                                            $.ajax({
                                                url: "/org/manage/file/upload",
                                                type: "POST",
                                                data: formData,
                                                processData: false,
                                                contentType: false,
                                                success: function(data){
                                                    writeCloudonPopup(data);
        
                                                    Notifier.notifyHTML(
                                                        `<div id="shr-f" class="flxxt" style="font-size: 12px;">${GPATH.SUCCESS}${data.uploaded} をアップロードしました</div>`,
                                                        5000,
                                                        "file uploaded", 
                                                        true,
                                                    );
        
                                                    $("#uploadfbh").text("アップロードに成功").css("color", "green");
                                                    _t.a = setTimeout(() => {
                                                        $("#uploadfbh").text("アップロード").css("color", "black");
                                                    }, 5000)
                                                    //@ts-ignore
                                                    document.getElementById("uploadfi").value = "";;
                                                },
                                                error: onerr,
                                            });
                                        } else{
                                            mbytesoverflow = Math.ceil(mbytesoverflow*10000)/10000;

                                            Notifier.notifyHTML(
                                                `<div id="shr-notf" class="flxxt" style="font-size: 12px;">${GPATH.ERROR}クラウドに ${mbytesoverflow}MB 容量が足りません</div>`,
                                                5000,
                                                "Cloud is overflowing!",
                                                true,
                                            );

                                            $("#uploadfbh").text(`${mbytesoverflow}MB 容量が足りません`).css("color", "red");
                                            _t.a = setTimeout(() => {
                                                $("#uploadfbh").text("アップロード").css("color", "black");
                                            }, 5000);
                                        }
                                    })
                                    .catch(onerr);
                                    function onerr(err){
                                        $("#uploadfbh").text("エラー").css("color", "red");
                                        _t.a = setTimeout(() => {
                                            $("#uploadfbh").text("アップロード").css("color", "black");
                                        }, 5000);
                                    }
                                }, 500);
                            } else{
                                $("#uploadfbh").text("ファイルが選択されていません").css("color", "red");
                                _t.a = setTimeout(() => {
                                    $("#uploadfbh").text("アップロード").css("color", "black");
                                }, 3000);
                            }
                        });

                        document.getElementById("deletefb")?.addEventListener("click", e => {
                            /**@ts-ignore @type {string | null} */
                            const filename = document.getElementById("deletefi").value.replace(/ /g, "");

                            if ($("#deletefbh").text() == "削除しています"){
                                return;
                            }

                            clearTimeout(_t.b);

                            if (!filename){
                                $("#deletefbh").text("ファイル名を入力してください").css("color", "red");
                                _t.b = setTimeout(() => {
                                    $("#deletefbh").text("削除").css("color", "black");
                                }, 3000);
                                return;
                            }

                            var exists = false;
                            Array.from(document.getElementsByClassName("cloudsh")).forEach(e => {
                                if (e.getAttribute("uname") == filename)
                                    exists = true;
                            });

                            if (!exists){
                                clearTimeout(_t.b);
                                $("#deletefbh").text("ファイルが見つかりません").css("color", "red");
                                _t.b = setTimeout(() => {
                                    $("#deletefbh").text("削除").css("color", "black");
                                }, 3000);
                                return;
                            }

                            $("#deletefbh").text("削除しています").css("color", "orange");

                            setTimeout(() => {
                                $.post("/org/manage/file/delete", { session: session, filename: filename })
                                .done(data => {
                                    writeCloudonPopup(data);
                                    
                                    Notifier.notifyHTML(
                                        `<div id="shr-f" class="flxxt" style="font-size: 12px;">${GPATH.SUCCESS}${data.deleted} を削除しました</div>`,
                                        5000,
                                        "file deleted", 
                                        true,
                                    );

                                    $("#deletefbh").text("削除に成功").css("color", "green");
                                    _t.b = setTimeout(() => {
                                        $("#deletefbh").text("削除").css("color", "black");
                                    }, 5000);
                                    //@ts-ignore
                                    document.getElementById("deletefi").value = "";
                                })
                                .catch(err => {
                                    $("#deletefbh").text("エラー").css("color", "red");
                                    _t.b = setTimeout(() => {
                                        $("#deletefbh").text("削除").css("color", "black");
                                    }, 3000);
                                });
                            }, 500);
                        });
                    });
                }
            })
            .catch(function(){
                const ctx = TEXT[LANGUAGE].ERROR_ANY;
                const _html = `<div class="protected" id="ppupds"><div class="mx-text-center flxxt" style="flex-direction:column;"><div style="width:125px;margin-bottom:4px;">${GPATH.ERROR_ZAHUMARU}</div><h4>${ctx}</h4></div></div>`;
                
                Notifier.notifyHTML(
                    `<div id="shr-notf" class="flxxt" style="font-size: 12px;">${GPATH.ERROR}${TEXT[LANGUAGE].NOTIFICATION_ERROR_ANY}</div>`,
                    2500,
                    "sharePopup connection error",
                    !0,
                );

                Popup.popupContent(_html);
            });
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
            if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "S") {
                e.preventDefault();
                saveMainEditorctx.apply(document.getElementById("save_data_norm"));
            }
        }, { passive: false });


        $("#--art-header").on("error", function(){ imageError.apply(this, ["h"]); }).attr("src", "");
        $("#--art-icon").on("error", function(){ imageError.apply(this, ["i"]); }).attr("src", "");

        rewrite(true);
    });


    window.addEventListener("click", function(e){
        /**@ts-ignore @type {HTMLElement} */
        const target = e.target;
        const $target = $(target);
        
        if ($target.hasClass("cloudfileel")){
            const uname = $target.parent().attr("uname");

            if (uname){
                window.navigator.clipboard.writeText(uname);
                Notifier.notifyHTML(
                    `<div id="cpy-lin-not" class="flxxt">${GPATH.LINK}${uname}&nbsp;をコピーしました</div>`,
                    2500,
                    uname,
                );
            }
        }
    });


    window.addEventListener("dblclick", function(e){
        e.preventDefault();
    }, { passive: false });


    window.addEventListener("beforeunload", e => {
        if (change_not_saved_remains || (Popup.popupping && $("#ppupds").hasClass("aioshud"))){
            e.preventDefault();
            var message = "このページを離れてもよろしいですか？\n編集データは自動では保存されません。";
        
            e.returnValue = message;
            return message;
        }
    }, { passive: false });
}());
