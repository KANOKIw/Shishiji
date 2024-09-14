//@ts-check
"use strict";


/**@type {string[]} */
var _famevote_selecteds = [];


function openVoteScreen(){
    openPkGoScreen("vote_screen");
}


/**
 * 
 * @param {string[]} [appendies] 
 */
function openFameVoteScreen(appendies){
    const toggler = document.getElementById("aiUHGG");

    openPkGoScreen("fame_vote_screen");
    toggler?.classList.remove("faui");
    //@ts-ignore THAT'S OK
    $(toggler?.children[0]?.children[0]).show();$(toggler?.children[0].children[1]).hide();
    toggler?.removeAttribute("stricted");
    setFameVote(appendies);
}


/**
 * 
 * @param {string[]} [appendies] 
 */
function setFameVote(appendies){
    const havewent = LOGIN_DATA.data.completed_orgs;
    const real_includes = [...LOGIN_DATA.data.fame_votes];
    var scrinto = null;

    _famevote_selecteds = [...LOGIN_DATA.data.fame_votes];
    _famevote_selecteds = appendies ? appendies : _famevote_selecteds;
    //_famevote_selecteds.push(...(appndies || []));

    const goto_ = appendies?.[0] || _famevote_selecteds[0] || "";

    $("#dumn_heres_new_way > .CDId, .iuhagW").remove();
    $("#dumn_heres_new_way").scrollTop(0);
    for (const orgid of havewent){
        const orgdata = getMapObjectData(orgid);

        if (orgdata && orgdata.article){
            const div_ = createFameVoteElement(orgdata,
                _famevote_selecteds.includes(orgid), real_includes.includes(orgid));
            if (orgdata.discriminator == goto_) scrinto = div_;
            $("#dumn_heres_new_way").append(div_);
        }
    }
    $("#vote_right_now").hide();
    setFameVoteButton(true);

    const top = (scrinto?.offsetTop || 0) - window.innerHeight/2 + 100 + 40.5;
    $("#dumn_heres_new_way").scrollTop(top);

    if (havewent.length == 0){
        const ticketcaution = document.createElement("span");
        ticketcaution.classList.add("iuhagW");
        ticketcaution.textContent = TEXTS[LANGUAGE].HOW_TO_FAME_VOTE;
        $("#dumn_heres_new_way").append(ticketcaution);
    }
}


/**
 * 
 * @param {mapObject} objdata 
 * @param {boolean} selected 
 * @param {boolean} leader 
 */
function createFameVoteElement(objdata, selected, leader){
    const descdiv = document.createElement("div");
    const div1 = document.createElement("div");
    div1.classList.add("CDId");
    const GGID = document.createElement("div");
    GGID.classList.add("GGId");
    GGID.setAttribute("duty", objdata.discriminator);
    const div3 = document.createElement("div");
    div3.classList.add("BIfff");
    const divY = document.createElement("div");
    divY.classList.add("AUYHs");
    const div4 = document.createElement("div");
    div4.classList.add("IcoNium");
    const img = document.createElement("img");
    img.src = toOrgFilepath(objdata.discriminator, objdata.object.images.icon);
    const h2 = document.createElement("h2");
    h2.textContent = objdata.article.title;
    div4.appendChild(img);
    div3.appendChild(div4);
    div3.appendChild(h2);
    GGID.appendChild(div3);
    GGID.appendChild(divY);
    div1.appendChild(GGID);
    descdiv.classList.add("asujwaGTGg", "manyyearshaspassed");
    div1.appendChild(descdiv);

    descdiv.addEventListener("click", function(){
        setParam(ParamName.ARTICLE_ID, objdata.discriminator);
        raiseOverview();
        writeArticleOverview(objdata, true, void 0, void 0, void 0, true);
    });
    GGID.addEventListener("click", function(){
        const disc = this.getAttribute("duty") || "";
        const _self = this;

        _famevote_selecteds.includes(disc) ?
            +function(){
                _famevote_selecteds = _famevote_selecteds.filter(f => f !== disc);
                _famevote_selecteds = [];
                $(".GGId").removeClass("imselected");
                _self.classList.remove("imselected");
            }()
             : 
            +function(){
                _famevote_selecteds.push(disc);
                _famevote_selecteds = [ disc ];
                $(".GGId").removeClass("imselected");
                _self.classList.add("imselected");
            }();
        setFameVoteButton();
    });


    if (selected)
        GGID.classList.add("imselected");
    if (leader)
        GGID.classList.add("imcurrentleader");

    return div1;
}


/**
 * 
 * @param {boolean} [_noeditdisplayleast] 
 */
function setFameVoteButton(_noeditdisplayleast){
    _noeditdisplayleast ? void 0 : $("#vote_right_now").show();
    
    arrayEqual(_famevote_selecteds, LOGIN_DATA.data.fame_votes) ?
    $("#vote_right_now").removeClass("imhere").addClass("imbye")
     : +function(){
        $("#vote_right_now").removeClass("imbye").addClass("imhere");
        $("#vote_right_now").show();
    }();
}


/**
 * @this {HTMLElement}
 */
function toggleFameVoteFavorte(){
    const stricted = this.getAttribute("stricted");
    
    if (stricted){
        this.classList.remove("faui");
        $(this.children[0].children[0]).show();
        $(this.children[0].children[1]).hide();
        this.removeAttribute("stricted");
    } else {
        this.classList.add("faui");
        $(this.children[0].children[0]).hide();
        $(this.children[0].children[1]).show();
        this.setAttribute("stricted", "true");
    }

    const showonly = !stricted;

    if (showonly)
        $(".CDId").each(function(){
            if (!LOGIN_DATA.data.favorited_orgs.includes(this.children[0].getAttribute("duty") || "")){
                this.style.display = "none";
            }
        });
    else
        $(".CDId").show();
}
