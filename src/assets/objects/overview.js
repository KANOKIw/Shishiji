function raiseOverview(){
    clearInterval(Intervals.raise);
    clearInterval(Intervals.reduce);
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    $(overview).show();
    var he = 100;
    //@ts-ignore
    Intervals.raise = setInterval(function(){
        overview.style.top = he+"vh";
        if (he < 0){
            overview.style.top = "0vh";
            clearInterval(Intervals.raise);
        }
        he -= 1.5;
    }, 5);
    $("#overview-close").on("click", reduceOverview);
}


function reduceOverview(){
    clearInterval(Intervals.raise);
    clearInterval(Intervals.reduce);
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    var he = 0;
    //@ts-ignore
    Intervals.reduce = setInterval(function(){
        overview.style.top = he+"vh";
        if (he > 100){
            /**@ts-ignore @type {HTMLElement} */
            const ctx = document.getElementById("overview-context");
            overview.style.top = "100vh";
            $(overview).hide();
            $(ctx).html(`
                <div style="position: absolute; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
                    <h3>読み込んでいます...</h3>
                </div>
            `);
            clearInterval(Intervals.reduce);
        }
        he += 4;
    }, 5);
    $("#overview-close").off("click", reduceOverview);
}


/**
 * 
 * @param {mapObject} details 
 */
function writeOverview(details){
    /**@ts-ignore @type {HTMLElement} */
    const ctx = document.getElementById("overview-context");
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById("shishiji-overview");
    const color = (details.article.theme_color) ? details.article.theme_color : "black";
    const font = (details.article.font_family) ? details.article.font_family : "";
    const imgOnError = `onerror="this.src='/resources/img/noimg.png';"`

    var article_mainctx = mcFormat(details.article.content.replace(/\n/g, "<br>"));
    
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

    
    overview.style.borderTop = "solid 20px "+color;
    $(overview).css("font-family", font);


    $(ctx).html(`
        <img class="article header" src="${details.article.images.header}" aria-label="ヘッダー画像" ${imgOnError}>
        <div class="article titleC">
            <img src="${details.object.images.icon}" style="width: 48px" alt="アイコン" ${imgOnError}>
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
    `);
}



function init(){
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById("shishiji-overview");
    const closebtn = document.getElementById("overview-close");
}
