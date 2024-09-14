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
