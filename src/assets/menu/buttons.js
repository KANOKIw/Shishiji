//@ts-check
"use strict";


/**
 * 
 * @param {() => any} mfunc 
 */
function _openscreen(mfunc){
    if (tour_status.pkgo) return;
    //_initmemory();
    setTimeout(() => PokeGOMenu.close.call(window, true), 100);
    mfunc();
}


/**
 * 
 * @param {() => any} func 
 */
function _broken(func){
    return () => _openscreen(func);
}


document.getElementById("pkgo_menu5")?.children[0].addEventListener("click", _broken(openSearchScreen));
document.getElementById("pkgo_menu3")?.children[0].addEventListener("click", _broken(openEventScreen));
document.getElementById("pkgo_menu1")?.children[0].addEventListener("click", _broken(openStamprallyScreen));
document.getElementById("pkgo_menu2")?.children[0].addEventListener("click", _broken(openVoteScreen));
document.getElementById("pkgo_menu6")?.children[0].addEventListener("click", _broken(openTeaScreen));
document.getElementById("pkgo_menu7")?.children[0].addEventListener("click", _broken(openDrinkScreen));
document.getElementById("pkgo_menu4")?.children[0].addEventListener("click", _broken(openShoppingScreen));
document.getElementById("pkgo_menuXXL")?.children[0].addEventListener("click", _broken(openMyqrcodeScreen));
document.getElementById("pkgo_menuXXS")?.children[0].addEventListener("click", _broken(openTicketsScreen));
document.getElementById("user-profile-opner")?.addEventListener("click", _broken(openProfileScreen));
document.getElementById("bandeventopen")?.addEventListener("click", _broken(openEventVoteScreen("band")));
document.getElementById("danceeventopen")?.addEventListener("click", _broken(openEventVoteScreen("dance")));
document.getElementById("misceventopen")?.addEventListener("click", _broken(openEventVoteScreen("misc")));
document.getElementById("go_to_ranking")?.addEventListener("click", _broken(openRankingScreen));
document.getElementById("gt_mps")?.addEventListener("click", closeSearchArea);
document.getElementById("ag8FOKSpoa")?.addEventListener("click", revealMyself);
document.getElementById("famevotegogo")?.addEventListener("click", _broken(openFameVoteScreen));
document.getElementById("eventvotegogo")?.addEventListener("click", _broken(openEventVoteSelectorScreen));
document.getElementById("bandeventopen_")?.addEventListener("click", _broken(openEventShedulerScreen("band")));
document.getElementById("danceeventopen_")?.addEventListener("click", _broken(openEventShedulerScreen("dance")));
document.getElementById("misceventopen_")?.addEventListener("click", _broken(openMiscEventVenueScreen));
document.getElementById("gos_budozyo")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "武道場")));
document.getElementById("gos_houkou")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "放光館")));
document.getElementById("gos_syudou")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "修道館ホール")));
document.getElementById("gos_kousyamae")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "校舎前")));

["click"]
.forEach(o => {
    document.getElementById("pkgo_mainb")?.addEventListener(o, function(){
        if (tour_status.main_screen) return;
        PokeGOMenu.oepn();
        if (isUnvisitedTour("menu")){
            tour_status.pkgo = true;
            setTimeout(() => startTour("menu"), 500);
        }
    });
    document.getElementsByTagName("pokemon-gradient")[0].addEventListener(o, function(){
        !tour_status.pkgo ? PokeGOMenu.close() : void 0;
    });
    document.getElementById("pkgo_menu_closeAWW")?.addEventListener(o, function(){
        !tour_status.pkgo ? PokeGOMenu.close() : void 0;
    });
});


+function(){
    const clbtn = document.createElement("shishiji-pkgo-close")
    , a = document.createElement("aoish-s");
    a.classList.add("flxxt");
    clbtn.classList.add("flxxt", "protected");
    clbtn.appendChild(a);
    const patic = document.createElement("div");
    patic.classList.add("particular_closebwrap", "manyyearshaspassed");
    const ignorescrs = ["vote_screen", "fame_vote_screen", "event_vote_screen", "event_vote_selector_screen"];

    /**@this {HTMLElement} */
    function closeBomb(){
        if (tour_status.pkgo || tour_status.article) return;
        const id_ = Random.string(6);
        const clid = (this.classList.contains("particular_closebwrap")) ? 
            this.parentElement?.parentElement?.id : this.parentElement?.id;
        closePkGoScreen(clid || "");
        if (this.classList.contains("particular_closebwrap")) return;
        $("#shpkgoanim").append(`<daoijh id="${id_}"><close-outside></close-outside><close-inside class="shishijineon"></close-inside></daoijh>`)
        setTimeout(()=>$("#"+id_).remove(), 501);
    }

    for (const clscreen of document.getElementsByTagName("shishiji-pks")){
        if (clscreen.id == "headcount_screen") continue;
        if (ignorescrs.includes(clscreen.id)){
            const _patic = patic.cloneNode(true);
            $(_patic).attr("id", "close_button_of_"+clscreen?.id);
            _patic.addEventListener("click", closeBomb);
            clscreen.querySelector(".AGDaewP")?.appendChild(_patic);
        } else {
            const _clbtn = clbtn.cloneNode(true);
            $(_clbtn).attr("id", "close_button_of_"+clscreen?.id);
            _clbtn.addEventListener("click", closeBomb);
            if (clscreen.id == "stamp_rally_screen") _clbtn.addEventListener("click", async function(){
                await haveAnyUnclaimeds() ? setMenuHasPending("1") : removeMenuHasPending("1");
            });
            clscreen?.appendChild(_clbtn);
        }
    }

    document.getElementById("overview-close-c")?.addEventListener("click", function(){
        closeBomb.call(this);
        prevListener.close();
    });
}();


document.getElementById("close_button_of_stamp_rally_scan_screen")?.addEventListener("click", function(){
    /**@ts-ignore @type {HTMLVideoElement} */
    const gh = document.getElementById("qrcode-video");
    gh.srcObject = null;
    pendingMediaStreams.forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
    });
    pendingMediaStreams.length = 0;
    outofLoad("opening camera", "middle");
});


document.getElementById("showshop")?.addEventListener("click", function(){
    closeAllPkGoScreen();
    setTimeout(() => {
        revealOnMap(mapObjectComponent["shop"]);
    }, 500);
});


document.getElementById("icon-chd")?.addEventListener("click",
()=>$("#chiconinputimgae").trigger("click"));


document.getElementById("chiconinputimgae")?.addEventListener("change", onChangeIconInputChange);


document.getElementById("iasyguf")?.addEventListener("click", saveProfileDetails);


+function(){
    /**@this {HTMLTextAreaElement} */
    function s(){
        if ($(this).val()?.toString().length == 0)
            displayDefaultSearchResult(false);
        else
            searchMapObject();
    }

    document.getElementById("del_search")?.addEventListener("click", function(){
        $("#org_search_input").val("");
        displayDefaultSearchResult(false);
    });

    document.getElementById("fav_search")?.addEventListener("click", function(){
        const fav_search = this.getAttribute("fav_search");

        if (fav_search){
            $(this.children[0]).show();
            $(this.children[1]).hide();
            this.removeAttribute("fav_search");
        } else {
            $(this.children[0]).hide();
            $(this.children[1]).show();
            this.setAttribute("fav_search", "true");
        }

        filterSearchMen();
    });

    document.getElementById("do_search")?.addEventListener("click", function(){s.call($("#org_search_input"))});


    document.getElementById("org_search_input")?.addEventListener("keydown", function(e){
        if (e.key.toUpperCase() == "ENTER"){
            e.preventDefault();
            s.call(this);
        }
    });
}();


document.getElementById("aiUHGG")?.addEventListener("click", toggleFameVoteFavorte)


async function __IGNORE_ME(){
    const r = {};
    for (const disc of Object.keys(mapObjectComponent)){
        await $.post(ajaxpath.getart+"?discriminator="+disc).then(data =>{
            const cont =  data.article;
            const txt = getHTMLtextContent(mcFormat(cont, ()=>""));
            r[disc] = txt;
        });
    }
    console.log(r);
}
