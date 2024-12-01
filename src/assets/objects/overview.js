//@ts-check
"use strict";


class OverView {
    static fullyopened = false;
    /**
     * @type {"closed" | "opening" | "opened" | "closing"}
     */
    static status = "closed";
    /**
     * @type {(() => void)[]}
     */
    static reduceCoro = [];
    
    static get isfullyopened(){
        return this.fullyopened;
    }

    static get currentstatus(){
        return this.status;
    }
}


function raiseOverview(){
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    const kk = $(overview);

    strictMap();
    OverView.status = "opening";
    overview.style.top = "0vh";
    kk
    .show()
    .removeClass("reducedown")
    .addClass("raiseup")
    .scrollTop(0);
    $("#overview-close-w").show();
    setTimeout(() => {
        OverView.fullyopened = true;
        OverView.status = "opened";
        kk.removeClass("raiseup");
    }, 500);

    prevListener.favorite = prevListener.vote = () => void 0;
    prevListener.close = reduceOverview;
    prevListener.share = function shareContent(){
        const discriminator = getParam(ParamName.ARTICLE_ID);
        const data = getMapObjectData(discriminator || "");
        const _url = new URL(window.location.href);
        var shareURL = `${_url.origin}${_url.pathname.replace(/@.*/, "")}?${ParamName.FLOOR}=${CURRENT_FLOOR}&${ParamName.ARTICLE_ID}=${discriminator}`;

        if (data == null || discriminator == null){
            console.log(data, discriminator)
            openSharePopup({ title: "" }, "", {}, "", "", {labelkey: "", url: ""}, true);
            return;
        }

        const message = `${TEXTS[LANGUAGE].SHARE_EVENT_MESSAGE} ${data.article.title}`;
        
        openSharePopup(
            {
                title: TEXTS[LANGUAGE].SHARE_EVENT_POPUP_TITLE,
                subtitle: TEXTS[LANGUAGE].SHARE_EVENT_POPUP_SUBTITLE,
            },
            shareURL,
            {
                title: TEXTS[LANGUAGE].SHARE_EVENT_DATA_TITLE,
                text: `${message}\n{__SHARE_URL__}`,
            },
            /**
             * jump to the object screened on middle of window
             */
            ParamValues.FROM_ARTICLE_SHARE,
            message,
            {
                labelkey: "SHARE_EVENT_INCLUDE_EVTH",
                // active element id match
                url: `${shareURL}&${ParamName.SCROLL_POS}=${$("#shishiji-overview").scrollTop()}&${ParamName.ART_TARGET}=${$(".tg-active")[0].id.match(/ovv-t-(.*?)-sd/)?.[1]}`,
            }
        );
    }
}


function strictMap(){
    clearInterval(Intervals.reduceOverview);
    $("#user-stricter")
    .removeClass("deactive")
    .addClass("active");
}


function restrictMap(){
    clearTimeout(Intervals.restrict);
    $("#user-stricter")
    .removeClass("active")
    .addClass("deactive");
}


function reduceOverview(){
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    const kk = $(overview);

    if (tour_status.article) return;

    restrictMap();
    OverView.fullyopened = false;
    OverView.status = "closing";
    overview.style.top = "100vh";
    kk
    .removeClass("raiseup")
    .addClass("reducedown");
    $("#overview-close-c").off("click", reduceOverview);
    $("#overview-context").removeClass("fadein");

    $(".tg-active").removeClass("tg-active");
    $("#theme-meta").attr("content", "#15202b");

    OverView.reduceCoro.forEach(e => e());
    OverView.reduceCoro.length = 0;
    
    Intervals.reduceOverview = setTimeout(() => {
        $("#dvd2").removeClass("ihateky");
        $("#ev_property").empty();
        $("#--art-header").attr("src", "");
        kk
        .css("border-top", "20px solid white")
        .removeClass("reducedown")
        .scrollTop(0)
        .hide();
        OverView.status = "closed";
    }, 150);

    delParam(ParamName.ARTICLE_ID);

    if ($("#shishiji-overview").attr("disc") == "jetcoaster"){
        ws.emit("update.jetcoaster.leave");
    }
}


/**
 * HTML を JS にしなさい
 * @param {mapObject} objectData 
 * @param {boolean} fadein 
 * @param {number} [scroll_top]
 * @param {string} [target] 
 * @param {boolean} [FORCE] 
 * @param {boolean} [jump_button] 
 */
function writeArticleOverview(objectData, fadein, scroll_top, target, FORCE, jump_button){
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById("shishiji-overview");
    const color = (objectData.article.theme_color) ? objectData.article.theme_color : "black";
    const font = (objectData.article.font_family) ? objectData.article.font_family : "";
    const orgname = objectData.discriminator;
    const pathConvertfunc = getPathConverter(objectData);
    /**@type {(HTMLImageElement | HTMLVideoElement)[]} */
    const imageNodes = [];
    const detailajax = $.post(ajaxpath.getart+"?discriminator="+objectData.discriminator, { discriminator: objectData.discriminator });
    const loadTimeout = setTimeout(() => intoLoad("loading-article-"+objectData.discriminator, "middle"), 500);
    var articleContext = "";
    var detail_tr = "";
    var art_sct = 0;


    detailajax.then(data => {
        const article = data.article;
        const crowd = data.crowd;
        const pt = data.pt;
        const tr1 = objectData.object.no_admission ? document.createElement("span") : createCustomTr("訪問pt", pt.toString()+"pt");
        const tr2 = createCustomTr("混雑状況", crowd_status[crowd]);

        $(".ev_property").prepend(tr1, tr2);
        detail_tr += tr1.outerHTML + tr2.outerHTML;

        articleContext = mcFormat(article, fn => pathConvertfunc(orgname, fn));
        if (articleContext === "<span></span>"){
            articleContext = `<h4 style="width:100%;margin-top:50px;margin-bottom:50px;text-align:center;">${TEXTS[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
        }
        $("#ARTICLE_UNKO").html(articleContext);
    })
    .catch(() => PictoNotifier.notifyError(TEXTS[LANGUAGE].FAILED_TO_LOAD_ARTICLE_CONTENT))
    .always(() => {outofLoad("loading-article-"+objectData.discriminator, "middle");clearTimeout(loadTimeout)});


    if (objectData.discriminator == "jetcoaster"){
        ws.emit("update.jetcoaster.join");
        ws.off("data.article", prevListener.jetupdater);
        prevListener.jetupdater = async function(data){
            const article = data.article;
            
            articleContext = mcFormat(article, fn => pathConvertfunc(orgname, fn));
            if (articleContext === "<span></span>"){
                articleContext = `<h4 style="width:100%;margin-top:50px;margin-bottom:50px;text-align:center;">${TEXTS[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
            }
            $("#ARTICLE_UNKO").html(articleContext);
        };
        ws.on("data.article", prevListener.jetupdater);
    }

    
    /*if (!window.navigator.onLine){
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
    }*/

    if (isUnvisitedTour("article")){
        tour_status.article = true;
        setTimeout(() => startTour("article"), 500);
    }

    for (const tr of objectData.article.custom_tr){
        if (tr.title && tr.content)
            detail_tr += createCustomTr(tr.title, tr.content).outerHTML;
    }
    detail_tr += createCustomTr("開催場所", objectData.article.venue).outerHTML;

    if (fadein)
        $("#ctx-article").addClass("fadein");
    
    overview.style.borderTop = "solid var(--shishiji-ovv-theme-height) "+color;
    $(overview).css("font-family", font);
    $("#dvd4 > span").text(TEXTS[LANGUAGE].SHARE);
    $("#dvd1 > span").text(TEXTS[LANGUAGE].REVEAL_ON_MAP);
    $("#dvd2 > span").text(TEXTS[LANGUAGE].FAVORITE);
    $("#dvd3 > span").text(TEXTS[LANGUAGE].VOTE);
    $("#ovv-ctx-loading-w").remove();
    $("#ctx-title").text(objectData.article.title);
    $("#shishiji-overview").attr("disc", objectData.discriminator);

    setTimeout(() => $("#theme-meta").attr("content", color), 500);

    LOGIN_DATA.data.favorited_orgs.includes(orgname) ? $("#dvd2").addClass("ihateky") : $("#dvd2").removeClass("ihateky");
    LOGIN_DATA.data.completed_orgs.includes(orgname) ? (() => {
        $("#dvd3").show().removeClass("uihGAV");
    })() : (() => {
            $("#dvd3").show().addClass("uihGAV");
            prevListener.vote = () => {
                PictoNotifier.notifyInfo(TEXTS[LANGUAGE].VOTE_AVAILABLE_AFTER_VISITING);
            }
        })();
    lastFavData = {
        deled: null,
        feels: [...LOGIN_DATA.data.favorited_orgs]
    };
    
    function favoriteM(){
        const disc = objectData.discriminator;
        const _prevman = [...LOGIN_DATA.data.favorited_orgs];
        var _deled = false;


        intoLoad("favud", "top");

        if (LOGIN_DATA.data.favorited_orgs.includes(disc)){
            $("#dvd2").removeClass("ihateky");
            LOGIN_DATA.data.favorited_orgs = LOGIN_DATA.data.favorited_orgs.filter(r => r !== disc);
            _deled = true;
        } else {
            $("#dvd2").addClass("ihateky");
            LOGIN_DATA.data.favorited_orgs.push(disc);
        }


        showGoodOrgs();
        clearTimeout(Intervals.ogfav);
        Intervals.ogfav = setTimeout(() => _exclusive(_deled, _prevman), 500);
    }

    /**@param {boolean} deled @param {string[]} prevman */
    function _exclusive(deled, prevman){
        $.post(ajaxpath.updfav, { favorites: JSON.stringify(LOGIN_DATA.data.favorited_orgs) })
        .then(() => {
            showGoodOrgs();
            lastFavData = {
                deled: deled,
                feels: [...LOGIN_DATA.data.favorited_orgs]
            };
        })
        .catch(() => {
            PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY, { do_not_keep_previous: true });
            LOGIN_DATA.data.favorited_orgs = [...lastFavData.feels];
            lastFavData !== null ? lastFavData.deled ? $("#dvd2").addClass("ihateky") : $("#dvd2").removeClass("ihateky") : void 0;
            showGoodOrgs();
        })
        .always(() => outofLoad("favud", "top"));
    }

    function voteM(){
        reduceOverview();
        openFameVoteScreen([ orgname ]);
    }

    function __onload(){
        setTimeout(
        () => {
            $("#ctx-article").addClass("_fadein");
            if (scroll_top !== void 0)
                $("#shishiji-overview").scrollTop(scroll_top);
            scroll_top = 0;
        }, 25);
    }

    /**@this {HTMLElement | JQuery.PlainObject} */
    function mkundraggable(){
        $(this).attr("draggable", "false");
    }

    class ctx_article_C{
        static get exists(){
            return true;
        }

        /**@param {string} _html @param {() => void} [cb] @param {(HTMLImageElement | HTMLVideoElement)[]} [imageNodeList] */
        static async write(_html, cb, imageNodeList){
            const r = document.getElementById("ctx-article");
            const textnode = document.createElement("span");

            textnode.innerHTML = _html;

            if (imageNodeList){
                const imgsrcMap = {};
                for (const extimg of imageNodeList){
                    const src = extimg.src || "";
                    if (imgsrcMap[src])
                        imgsrcMap[src].push(extimg);
                    else 
                        imgsrcMap[src] = [extimg];
                }
                for (const willbe of [...textnode.querySelectorAll("img"), ...textnode.querySelectorAll("video")]){
                    const src = willbe.src || "";
                    const becamables = imgsrcMap[src];
                    const becomes = becamables?.length > 0 ? becamables[0] : willbe.cloneNode(true);

                    willbe.parentNode?.replaceChild(becomes, willbe);
                    becomes.style.width = willbe.style.width;
                    imgsrcMap[src] = imgsrcMap[src]?.filter(E => {
                        return E !== becomes;
                    });
                }
            }
            if (r){
                r.innerHTML = "";
                r.appendChild(textnode);
            }
            if (cb)
                cb();
        }
    };

    function chOvv(){
        $(".tg-active").removeClass("tg-active");
        $(this).addClass("tg-active");
        $(".article-image").addClass("doaJSD");
        $("#--art-header").attr("src", pathConvertfunc(orgname, objectData.article.images.header));
        $("#--art-icon").attr("src", pathConvertfunc(orgname, objectData.object.images.icon));
        mkundraggable.call($("#--art-header"));
        mkundraggable.call($("#--art-icon"));
    }

    /**@this {HTMLElement} */
    function showDescription(){
        if ($(this).hasClass("tg-active") && !FORCE)
            return;

        $("#ctx-article").addClass("_wait_f");

        function then(){
            if (imageNodes.length == 0){
                document.getElementById("ctx-article")?.querySelectorAll("img").forEach(Y => imageNodes.push(Y));
                document.getElementById("ctx-article")?.querySelectorAll("video").forEach(Y => imageNodes.push(Y));
            }

            setTimeout(() => $("#shishiji-overview").scrollTop(art_sct), 25);
        }
        const ads = objectData.object.no_admission ? `<span class="saioguW">※この団体には入場記録がなく、訪問ptももらえません</span>` : "";
        ctx_article_C.write(`${ads}<div id="ARTICLE_UNKO">${articleContext}</div>`, __onload, imageNodes)
        .then(then);
        if (fadein)
            $("#ctx-article").removeClass("fadein").removeClass("_fadein");
        chOvv.call(this);
    }

    /**@this {HTMLElement} */
    function showDetails(){
        if ($(this).hasClass("tg-active") && !FORCE)
            return;

        art_sct = $("#shishiji-overview").scrollTop() || 0;
        $("#ctx-article").addClass("_wait_f");

        const __htmlw = `
        <hr style="margin: 40px 20px 20px 20px;">
        <div class="ev_property">
            <table style="width: 100%;">
                <tbody>
                    ${detail_tr}
                </tbody>
            </table>
        </div>
        <hr style="margin: 20px;">
        `;

        ctx_article_C.write(__htmlw, __onload);

        $("#ctx-article").removeClass("fadein").removeClass("_fadein");
        chOvv.call(this);
    }

    $("#ovv-t-description-sd").off("click", Ovv_tg_listener.description).on("click", showDescription);
    $("#ovv-t-details-sd").off("click", Ovv_tg_listener.details).on("click", showDetails);
    Ovv_tg_listener.description = showDescription;
    Ovv_tg_listener.details = showDetails;
    prevListener.favorite = favoriteM;
    LOGIN_DATA.data.completed_orgs.includes(orgname) ? (prevListener.vote = voteM) : void 0;

    if (!target || !["description", "details", "else"].includes(target))
        target = "description";
    
    document.getElementById(`ovv-t-${target}-sd`)?.dispatchEvent(new Event("click"));

    if (jump_button){
        $("#dvd1").show();
        function ooo(){
            if (PokeGOMenu.opened) PokeGOMenu.close();
            closeAllPkGoScreen();
            prevListener.close(new Event("Avada Kedavra"));
            $("#overview-gogow-w").off("click", ooo);
            setTimeout(() => {
                revealOnMap(objectData);
            }, 250);
        }
        map_reveal_func = ooo;
    } else {
        $("#dvd1").hide();
    }
}


/**
 * @deprecated
 * @param {string} ctx
 * @param {() => void} [callback] 
 */
async function writeOverviewContent(ctx, callback){
    new Promise((resolve, reject) => {
        $("#overview-context").html(ctx);
        resolve("");
    }).then(() => {
        if (callback !== void 0)
            callback();
    });
}
