//@ts-check
"use strict";


/**
 * when #oive_a is clicked
 */
function openSearchScreen(){
    openPkGoScreen("search_screen");
    $("#ovie_search_boxw").removeClass("closeL").addClass("openH");

    if (!$("#search_result").hasClass("searchen")){
        $("#search_result")
        .empty().off("scroll", showArticleOnScroll).addClass("searchen");
        displayDefaultSearchResult(true);
    } else {
        showLittleArticle();
    }
}


function closeSearchArea(){
    $("#ovie_search_boxw").removeClass("openH").addClass("closeL");
    //$("#search_result").empty();
    $("#oive_a").removeClass("hello").addClass("bye_cry").show();
}


async function showArticleOnScroll(){
    return;
    $(".ABId.wwwnotwith").each(function(){
        var position = this.offsetTop;
        var scroll = $("#search_result").scrollTop() || 0;
        var windowHeight = window.innerHeight;
        
        if (position - scroll < windowHeight){
            const _self = $(this).find(".notwithdetails");
            const disc = _self.attr("disc") || "";

            this.classList.remove("wwwnotwith");
            _self.removeClass("notwithdetails");

            (function _deprecated(){
                function __ajax(){
                    $.post(ajaxpath.getart+"?discriminator="+disc, { })
                    .then(data => {
                        _self.html(getHTMLtextContent(
                            getHTMLtextContent(mcFormat(data.article, ()=>""))
                        ) || "詳細を確認できませんでした。");
                    }).fail(__ajax);
                }
                __ajax();
            })();
        }
    });
}


/**@ts-ignore @type {JQuery.jqXHR} */
var _ALL_ART = new Promise(r => r(null));

async function showLittleArticle(){
    var allart = await _ALL_ART;

    if (allart == null){
        allart = _ALL_ART = $.post(ajaxpath.getallart);
        allart = await allart;
        //@ts-ignore
        setTimeout(() => _ALL_ART = new Promise(r => r(null)), 5000);
    }
    
    function myload(){
        var t = {}
        for (const disc in allart.article){
            t[disc] = getHTMLtextContent(mcFormat(allart.article[disc] || "", ()=>""))
        }
        window.navigator.clipboard.writeText(JSON.stringify(t, null, 4));
    }
    
    $(".ABId.wwwnotwith").each(function(){
        const _self = $(this).find(".notwithdetails");
        const disc = _self.attr("disc") || "";
        
        _self.html(getHTMLtextContent(
            getHTMLtextContent(mcFormat(allart.article[disc] || "", ()=>""))
        ) || "詳細を確認できませんでした。");

        var crowd = Number(allart.crowd[disc]);
        crowd = crowd == 0 ? 1 : crowd;
        $("#sstatus-disc-"+disc).removeClass("n1 n2 n3 n0").addClass(`n${crowd}`);
    });
}


function filterSearchMen(){
    const is_only_fav = $("#fav_search").attr("fav_search");

    if (is_only_fav){
        $(".holdmeLikeThat").each(function(el){
            if (!LOGIN_DATA.data.favorited_orgs.includes(this.getAttribute("disc") || ""))
                this.style.display = "none";
        });
    } else {
        $(".holdmeLikeThat").show();
    }
    
    $(".LXId").remove();
    insertAdvertisement();
}


/**
 * 
 * @param {string[]} sort 
 */
function resortSearches(sort){
    /**@type {{[key: string]: HTMLElement}} */
    const objectElements = {};
    
    displayDefaultSearchResult(false);

    $("#search_result").children().each(function(){
        const disc = this.getAttribute("disc");
        if (!disc) return;
        //@ts-ignore
        objectElements[disc] = this;
    });

    $("#search_result").empty();

    for (const disc of sort){
        $("#search_result").append(objectElements[disc]);
    }
    $("#search_result").trigger("scroll");

    filterSearchMen();
}


/**
 * 
 * @param {boolean} addListener 
 */
function displayDefaultSearchResult(addListener){
    /**@ts-ignore @type {HTMLElement} */
    const result_box = document.getElementById("search_result");
    const is_only_fav = $("#fav_search").attr("fav_search");
    var no_content = true;
    
    $("#search_result").empty().scrollTop(0);

    for (const [evname, dat] of Object.entries(mapObjectComponent)){
        if (is_only_fav && !LOGIN_DATA.data.favorited_orgs.includes(evname))
            continue;
        if (dat.article){
            const nTypeC = document.createElement("div");
            nTypeC.appendChild(createSearchNode(dat));
            const meTc = nTypeC.children[0];
            meTc.addEventListener("click", function(){
                setParam(ParamName.ARTICLE_ID, dat.discriminator);
                raiseOverview();
                writeArticleOverview(dat, true, void 0, void 0, void 0, true);
            });
            result_box.appendChild(meTc);

            no_content = false;
        }
    }

    insertAdvertisement();
    
    /*if (addListener)
        $("#search_result").on("scroll", showArticleOnScroll);*/

    $("#search_result").trigger("scroll");
    showLittleArticle();

    if (is_only_fav && no_content){
        const ticketcaution = document.createElement("span");
        ticketcaution.classList.add("iuhagW", "UghaWW");
        ticketcaution.textContent = TEXTS[LANGUAGE].HOW_TO_FAV;
        $("#search_result").append(ticketcaution);
        return;
    }
}


function insertAdvertisement(){
    const artLength = $(".holdmeLikeThat:not([style*=\"display: none\"])").length;
    const addeds = [];

    search_adv_promise.then(
        /** @param {advertisementData[]} advData */
        advData => {
            advData = Random.shuffleArray(advData);

            const adlength = advData.length;
            const freqency = Math.floor(artLength/advData.length);

            if (freqency < 4){
                advData = advData.slice(0, Math.floor(artLength/4));
            }
            if (freqency == 0) return;
            for (var x = freqency; x < artLength; x = x + freqency){
                const f = Math.floor(x/freqency) - 1;
                $(".holdmeLikeThat").eq(x).after(
                    createAdvNode(advData[f])
                );
                addeds.push(f)
            }

            countAd("search-screen", addeds.join(" "));
        }
    );
}


/**
 * 
 * @param {mapObject} data 
 */
function createSearchNode(data){
    const pcvt = getPathConverter(data);
    const gcc = {
        "1F": "1階",
        "2F": "2階",
        "3F": "3階",
        "4F": "4階"
    };

    const abIdDiv = document.createElement("div");
    abIdDiv.classList.add("ABId", "wwwnotwith", "holdmeLikeThat");
    abIdDiv.setAttribute("disc", data.discriminator);
    const biFffDiv = document.createElement("div");
    biFffDiv.classList.add("BIfff");
    const iconDiv = document.createElement("div");
    iconDiv.classList.add("IcoNium");
    const statusDiv = document.createElement("div");
    statusDiv.classList.add("haVUn");
    statusDiv.id = "sstatus-disc-"+data.discriminator;
    const iconImg = document.createElement("img");
    iconImg.src = pcvt(data.discriminator, data.object.images.icon);
    iconDiv.appendChild(iconImg);
    iconDiv.appendChild(statusDiv);
    const titleH2 = document.createElement("h2");
    titleH2.textContent = data.article.title;
    biFffDiv.appendChild(iconDiv);
    biFffDiv.appendChild(titleH2);
    const venueH4 = document.createElement("h4");
    venueH4.classList.add("auygsWU");
    venueH4.textContent = `${gcc[data.object.floor]}${data.article.venue ? ", " + data.article.venue : ""}`;
    const ainbuDiv = document.createElement("div");
    ainbuDiv.classList.add("AINBU");
    const subtitleH3 = document.createElement("h3");
    subtitleH3.classList.add("smlTtl");
    subtitleH3.textContent = data.article.subtitle || "";
    const ezDesDiv = document.createElement("div");
    ezDesDiv.classList.add("EZdes");
    const contentSpan = document.createElement("span");
    contentSpan.classList.add("janS", "notwithdetails");
    contentSpan.setAttribute("disc", data.discriminator);
    ezDesDiv.appendChild(contentSpan);
    ainbuDiv.appendChild(subtitleH3);
    ainbuDiv.appendChild(ezDesDiv);
    abIdDiv.appendChild(biFffDiv);
    abIdDiv.appendChild(venueH4);
    abIdDiv.appendChild(ainbuDiv);
    
    return abIdDiv;
}


function searchMapObject(){
    const query = $("#org_search_input").val();
    if (loadProcesses.middle.includes("search mapobject") || !query) return;
        intoLoad("search mapobject", "middle");
        
    $.ajax({
        url: ajaxpath.search+`?q=${$("#org_search_input").val()}`,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({ query: query }),
        crossDomain: true
    })
        .then(result => {
            resortSearches(result);
            outofLoad("search mapobject", "middle");
        })
        .catch(() => PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY))
        .always(() => outofLoad("search mapobject", "middle"));
}
