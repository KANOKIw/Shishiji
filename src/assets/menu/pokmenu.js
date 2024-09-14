//@ts-check
"use strict";


class PokeGOMenu{
    /**
     * 
     * @param {boolean} [nose] 
     */
    static oepn(nose){
        $("#pkgo_menu_closeAWW").removeClass("oAIKSD");
        $("#pkgo_mainb").css({"pointer-events": "none", "visibility": "hidden"});
        $("#pkgo_menu_close")
        .removeClass("imdisplaynone iiasdIOJAGDjafjiofjoijaoijs")
        .addClass("iiasdIOJ");
        $(".pkgo_menu_insidew").removeClass("oafs");
        $(".pok_anom")
        .removeClass("imdisplaynone aUDGJHJSduijujaijuigsdjuio")
        .addClass("opening_yey");
        $("pokemon-gradient")
        .removeClass("aggjg")
        .addClass("uiagg");
        $("#pkgo_menu_OPEN_RETAINER")
        .removeClass("gauhi8yS");
        $("spreads").removeClass("AUHISGFjjj");
        $(".pkm__h").addClass("AIOSJ");
        $("#theme-meta").attr("content", "#4b4f52");
    }

    /**
     * 
     * @param {boolean} [nose] 
     */
    static close(nose){
        $("#pkgo_menu_closeAWW").addClass("oAIKSD");
        $("#pkgo_mainb").css({"pointer-events": "all", "visibility": "visible"});
        $("#pkgo_menu_close")
        .removeClass("iiasdIOJ")
        .addClass("iiasdIOJAGDjafjiofjoijaoijs");
        $(".pkgo_menu_insidew").addClass("oafs");
        $(".pok_anom")
        .removeClass("opening_yey")
        .addClass("aUDGJHJSduijujaijuigsdjuio");
        $("pokemon-gradient")
        .removeClass("uiagg")
        .addClass("aggjg");
        $("#pkgo_menu_OPEN_RETAINER")
        .addClass("gauhi8yS");
        $("#theme-meta").attr("content", "#15202b");
    }


    static get opened(){
        return !$("#pkgo_menu_closeAWW").hasClass("oAIKSD");
    }
}


function _endpkGof(e){
    e.preventDefault();
    PokeGOMenu.close();
}


/**@this {HTMLElement} */
function _pkGoPork_atm(){
    const g = $(this).find("spreads");

    setTimeout(()=>g.addClass("AUHISGFjjj"), 1)
    g.removeClass("AUHISGFjjj");
}
