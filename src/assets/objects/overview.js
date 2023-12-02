//@ts-check
"use strict";


function raiseOverview(){
    strictMap();
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    const $cp = $("#shishiji-popup-container-c");

    overview.style.top = "0vh";
    $(overview)
    .removeClass("reducedown")
    .addClass("raiseup")
    .scrollTop(0);
    $(overview).show();
    $("#overview-share").show();
    $("#overview-close").on("click", reduceOverview);
    $("#overview-share").on("click", shareContent);

    function shareContent(){
        const discriminator = getParam(ParamNames.ARTICLE_ID);
        const data = searchObject(discriminator);
        const _url = new URL(window.location.href);
        var shareURL = `${_url.origin}${_url.pathname}?${ParamNames.FLOOR}=${CURRENT_FLOOR}&${ParamNames.ARTICLE_ID}=${discriminator}`;

        if (data == null || discriminator == null){
            openSharePopup({ title: "" }, "", {}, "", "", true);
            return;
        }

        const message = `世田谷学園 獅子児祭のイベント: ${data.article.title}`;
        
        openSharePopup(
            {
                title: "イベントをシェア",
                subtitle: "共有されたリンクを開くと、マップがこのイベントを中心に移動しこの記事が開かれます",
            },
            shareURL,
            {
                title: "獅子児祭",
                text: `${message}\n{__SHARE_URL__}`,
            },
            /**
             * jump to the object screened on middle of window
             */
            ParamValues.FROM_ARTICLE_SHARE,
            message,
        );
    }
}


function strictMap(){
    clearInterval(Intervals.reduceOverview);
    $("#user-stricter").addClass("active").show();
}


function restrictMap(){
    $("#user-stricter").removeClass("active").hide();
}


function reduceOverview(){
    restrictMap();
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    overview.style.top = "100vh";
    $(overview)
    .removeClass("raiseup")
    .addClass("reducedown");
    $("#overview-close").off("click", reduceOverview);
    $("#overview-context").removeClass("fadein");
    
    Intervals.reduceOverview = setTimeout(() => {
        writeOverviewContent(`<div id="ovv-ctx-loading-w" class="protected"><h4 id="ovv-ctx-loading">処理中...</h4></div>`, );
        $(overview)
        .css("border-top", "20px solid white")
        .scrollTop(0)
        .hide();
    }, 190);

    delParam(ParamNames.ARTICLE_ID);
}


/**
 * 
 * @param {mapObject} details 
 * @param {boolean} fadein 
 */
function writeArticleOverview(details, fadein){
    /**@ts-ignore @type {HTMLElement} */
    const ctx = document.getElementById("overview-context");
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById("shishiji-overview");
    const color = (details.article.theme_color) ? details.article.theme_color : "black";
    const font = (details.article.font_family) ? details.article.font_family : "";
    const imgOnError = `onerror="this.src='/resources/img/noimg.png';"`

    var article_mainctx = mcFormat(details.article.content);

    if (!window.navigator.onLine){
        $("#ovv-ctx-loading").html(ERROR_HTML.CONNECTION_ERROR);
        $("#overview-share").hide();
        return;
    }
    
    if (article_mainctx === "<span></span>"){
        article_mainctx = '<h4 style="width: 100%; margin-top: 50px; margin-bottom: 50px; text-align: center;">このイベントに関する記載はありません</h4>';
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
    
    overview.style.borderTop = "solid 20px "+color;
    $(overview).css("font-family", font);

    writeOverviewContent(`
        <img class="article-image article header" src="${details.article.images.header}" aria-label="ヘッダー画像" ${imgOnError}>
        <div class="article titleC">
            <img class="article-image" src="${details.object.images.icon}" style="width: 48px" alt="アイコン" ${imgOnError}>
            <h1 id="ctx-title" style="margin: 5px">${details.article.title}</h1>
        </div>
        <div id="ctx-article" style="margin: 10px;">
            <div class="ev_property" style="color: green; font-weight: bold; margin: 20px;">
                <p>▷中心学年: ${details.article.core_grade}</p>
            </div>
            ${article_mainctx}
            <hr style="margin-top: 20px;">
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
            <hr style="margin-bottom: 20px;">
        </div>
    `, );
}


/**
 * 
 * @param {string} ctx
 * @param {() => void} [callback] 
 */
function writeOverviewContent(ctx, callback){
    new Promise((resolve, reject) => {
        $("#overview-context").html(ctx);
        resolve("");
    }).then(() => {
        if (callback !== void 0)
            callback();
    });
}

function init(){
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById("shishiji-overview");
    const closebtn = document.getElementById("overview-close");
}
