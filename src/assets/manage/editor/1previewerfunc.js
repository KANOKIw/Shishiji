//@ts-check
"use strict";


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
 */
function writePreviewerOverview(details, fadein, scroll_top, target, FORCE, _fadein, renewimg){
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
            TEXT[LANGUAGE].NOTIFICATION_CONNECTION_ERROR,
            {
                duration: 2500,
                discriminator: "article connection error",
                do_not_keep_previous: true
            }
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

        writePreviewerOverviewContent(article_mainctx, renewimg, __onload);
        $("#core_grade_vh").text(ARTICLEDATA.article.core_grade);
        if (!$("#ovv-t-description-sd").hasClass("tg-active"))
        $("#overview-context").removeClass("fadein").removeClass("_fadein");
        $(".tg-active").removeClass("tg-active");
        $(this).addClass("tg-active");
        $(".article-image").addClass("doaJSD");
    }

    /**@this {HTMLElement} */
    function showDetails(){
        if ($(this).hasClass("tg-active"))
            return;

        $("#overview-context").addClass("_wait_f");
        $("#oop").hide();

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
        `, renewimg, __onload);

        $("#overview-context").removeClass("fadein").removeClass("_fadein");
        $(".tg-active").removeClass("tg-active");
        $(this).addClass("tg-active");
        $(".article-image").addClass("doaJSD");
    }

    $("#ovv-t-description-sd").off("click", Ovv_tg_listener.description).on("click", showDescription);
    $("#ovv-t-details-sd").off("click", Ovv_tg_listener.details).on("click", showDetails);

    Ovv_tg_listener.description = showDescription;
    Ovv_tg_listener.details = showDetails;

    if (!target || !["description", "details", "else"].includes(target))
        target = "description";
    
    document.getElementById(`ovv-t-${target}-sd`)?.dispatchEvent(new Event("click"));
}


scriptDone();
