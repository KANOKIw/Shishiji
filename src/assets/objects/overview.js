//@ts-check
"use strict";

class OverView {
    static fullyopened = false;
    /**
     * @type {"closed" | "opening" | "opened" | "closing"}
     */
    static status = "closed";
    
    static get isfullyopened(){
        return this.fullyopened;
    }

    static get currentstatus(){
        return this.status;
    }
}


function raiseOverview(){
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById(cssName.ovv);
    const kk = $(overview);

    strictMap();
    OverView.status = "opening";
    overview.style.top = "0vh";
    kk
    .show()
    .removeClass("reducedown")
    .addClass("raiseup")
    .scrollTop(0);
    setTimeout(() => {
        OverView.fullyopened = true;
        OverView.status = "opened";
        kk.removeClass("raiseup");
    }, 500);

    $(cssName.ovvshare).show();
    $(cssName.ovvclosec).on("click", (e) => {
        e.preventDefault();
        reduceOverview();
    });
    $(cssName.ovvsharec).on("click", (e) => {
        e.preventDefault();
        shareContent();
    });

    function shareContent(){
        const discriminator = getParam(ParamName.ARTICLE_ID);
        const data = searchObject(discriminator);
        const _url = new URL(window.location.href);
        var shareURL = `${_url.origin}${_url.pathname.replace(/@.*/, "")}?${ParamName.FLOOR}=${CURRENT_FLOOR}&${ParamName.ARTICLE_ID}=${discriminator}`;

        if (data == null || discriminator == null){
            console.log(data, discriminator)
            openSharePopup({ title: "" }, "", {}, "", "", {labelkey: "", url: ""}, true);
            return;
        }

        const message = `${TEXT[LANGUAGE].SHARE_EVENT_MESSAGE} ${data.article.title}`;
        
        openSharePopup(
            {
                title: TEXT[LANGUAGE].SHARE_EVENT_POPUP_TITLE,
                subtitle: TEXT[LANGUAGE].SHARE_EVENT_POPUP_SUBTITLE,
            },
            shareURL,
            {
                title: TEXT[LANGUAGE].SHARE_EVENT_DATA_TITLE,
                text: `${message}\n{__SHARE_URL__}`,
            },
            /**
             * jump to the object screened on middle of window
             */
            ParamValues.FROM_ARTICLE_SHARE,
            message,
            {
                labelkey: "SHARE_EVENT_INCLUDE_EVTH",
                // activve element id match
                url: `${shareURL}&${ParamName.SCROLL_POS}=${$("#shishiji-overview").scrollTop()}&${ParamName.ART_TARGET}=${$(".tg-active")[0].id.match(/ovv-t-(.*?)-sd/)?.[1]}`,
            }
        );
    }
}


function strictMap(){
    clearInterval(Intervals.reduceOverview);
    $(cssName.usrstricter)
    .removeClass("deactive")
    .addClass("active");
}


function restrictMap(){
    clearTimeout(Intervals.restrict);
    $(cssName.usrstricter)
    .removeClass("active")
    .addClass("deactive");
}


function reduceOverview(){
    restrictMap();
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById(cssName.ovv);
    const kk = $(overview);

    OverView.fullyopened = false;
    OverView.status = "closing";
    overview.style.top = "100vh";
    kk
    .removeClass("raiseup")
    .addClass("reducedown");
    $(cssName.ovvclose).off("click", reduceOverview);
    $(cssName.ovvctx).removeClass("fadein");

    $(".tg-active").removeClass("tg-active");
    
    Intervals.reduceOverview = setTimeout(() => {
        OverView.status = "closed";
        writeOverviewContent(`<div id="ovv-ctx-loading-w" class="protected"><h4 id="ovv-ctx-loading">${TEXT[LANGUAGE].LOADING}</h4></div>`, );
        kk
        .css("border-top", "20px solid white")
        .removeClass("reducedown")
        .scrollTop(0);
    }, 195);

    delParam(ParamName.ARTICLE_ID);
}


/**
 * 
 * @param {mapObject} details 
 * @param {boolean} fadein 
 * @param {number} [scroll_top]
 * @param {string} [target] 
 * @param {boolean} [FORCE] 
 */
function writeArticleOverview(details, fadein, scroll_top, target, FORCE){
    /**@ts-ignore @type {HTMLElement} */
    const ctx = document.getElementById("overview-context");
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById("shishiji-overview");
    const color = (details.article.theme_color) ? details.article.theme_color : "black";
    const font = (details.article.font_family) ? details.article.font_family : "";
    const orgname = details.discriminator;
    const pathConvertfunc = getPathConverter(details);


    /**
     * 
     * @param {"h" | "i"} a 
     */
    function onerror(a){
        if (a == "h")
            this.outerHTML = `<div class="flxxt nImg-a">${GPATH.ERROR_ZAHUMARU}<h4>No Image</h4></div>`;
        else if (a == "i")
            this.outerHTML = `<div class="flxxt" style="width:48px;height:48px;">${GPATH.ERROR_ZAHUMARU}</div>`;
    };

    var article_mainctx = mcFormat(details.article.content, fn => { return pathConvertfunc(orgname, fn); });

    if (!window.navigator.onLine){
        PictoNotifier.notifyError(
            TEXT[LANGUAGE].NOTIFICATION_CONNECTION_ERROR,
            2500,
            "article connection error",
            { do_not_keep: true },
        );
        $(cssName.ovvctxload).html(`<div class="flxxt"><div style="width:40%;">${GPATH.ERROR_ZAHUMARU}</div></div>${TEXT[LANGUAGE].ARTICLE_CONNECTION_ERROR}`);
        $(cssName.ovvshare).hide();
        return;
    }
    
    if (article_mainctx === "<span></span>"){
        article_mainctx = `<h4 style="width:100%;margin-top:50px;margin-bottom:50px;text-align:center;">${TEXT[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
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

    const EVENT_HEADER = `<img id="--art-header" class="article-image article header" alt="" aria-label="${TEXT[LANGUAGE].ARIA_ARTICLE_HEADER}">
    <div class="article titleC">
        <div class="titleW">
            <img id="--art-icon" class="article-image" style="width: 48px" alt="" aria-label="${TEXT[LANGUAGE].ARIA_ARTICLE_ICON}">
            <h1 id="ctx-title" style="margin: 5px; font-family: var(--font-view);">${escapeHTML(details.article.title)}</h1>
        </div>
        <div class="gradef evvnon">
            <p id="cg_visible">${TEXT[LANGUAGE].ARTICLE_CORE_GRADE}: ${details.article.core_grade}</p>
        </div>
    </div>`;

    function __onload(){
        setTimeout(
            (

        ) => {
            $(cssName.ovvctx).addClass("_fadein");
            if (scroll_top !== void 0)
                $("#"+cssName.ovv).scrollTop(scroll_top);
            scroll_top = 0;
        }, 25);
    }

    class ctx_article_C{
        static get exists(){
            return document.getElementById(cssName.ovvctxart) ? true : false;
        }

        /**@param {string} _html @param {() => void} [cb] */
        static async write(_html, cb){
            const r = document.getElementById(cssName.ovvctxart);
     
            if (r)
                r.innerHTML = _html;
            if (cb)
                cb();
        }
    };

    /**@this {HTMLElement} */
    function showDescription(){
        if ($(this).hasClass("tg-active") && !FORCE)
            return;

        $(cssName.ovvctx).addClass("_wait_f");

        if (ctx_article_C.exists)
            ctx_article_C.write(article_mainctx, __onload);
        else
            writeOverviewContent(
                `${EVENT_HEADER}<div id="ctx-article" class="article">${article_mainctx}</div>`, __onload);
        if (fadein)
        $(cssName.ovvctx).removeClass("fadein").removeClass("_fadein");
        $(".tg-active").removeClass("tg-active");
        $(this).addClass("tg-active");
        $(".article-image").addClass("doaJSD");
        $("#--art-header").on("error", function(){ onerror.apply(this, ["h"]); }).attr("src", pathConvertfunc(orgname, details.article.images.header));
        $("#--art-icon").on("error", function(){ onerror.apply(this, ["i"]); }).attr("src", pathConvertfunc(orgname, details.object.images.icon));
    }

    /**@this {HTMLElement} */
    function showDetails(){
        if ($(this).hasClass("tg-active") && !FORCE)
            return;

        $(cssName.ovvctx).addClass("_wait_f");

        const __htmlw = `
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
        `;
        if (ctx_article_C.exists)
            ctx_article_C.write(__htmlw, __onload);
        else
            writeOverviewContent(`${EVENT_HEADER}<div id="ctx-article" class="article">${__htmlw}</div>`, __onload);

        $(cssName.ovvctx).removeClass("fadein").removeClass("_fadein");
        $(".tg-active").removeClass("tg-active");
        $(this).addClass("tg-active");
        $(".article-image").addClass("doaJSD");
        $("#--art-header").on("error", function(){ onerror.apply(this, ["h"]); }).attr("src", pathConvertfunc(orgname, details.article.images.header));
        $("#--art-icon").on("error", function(){ onerror.apply(this, ["i"]); }).attr("src", pathConvertfunc(orgname, details.object.images.icon));
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
 * @param {string} ctx
 * @param {() => void} [callback] 
 */
async function writeOverviewContent(ctx, callback){
    new Promise((resolve, reject) => {
        $(cssName.ovvctx).html(ctx);
        resolve("");
    }).then(() => {
        if (callback !== void 0)
            callback();
    });
}


function init(){
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById(cssName.ovv);
    const closebtn = document.getElementById(cssName.ovvclose.slice(1));
}
