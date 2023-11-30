//@ts-check
"use strict";


!function(){
    const $cp = $("#shishiji-popup-container-c");

    /**@param {string} str  */
    function delpxToNum(str){
        return Number(str.replace("px", ""));
    }

    const base = {
        width: delpxToNum($cp.css("width")),
        height: delpxToNum($cp.css("height")),
        margin: delpxToNum($cp.css("margin"))
    };
    
    $(window).on("resize", function(e){
        var width = delpxToNum($cp.css("width"));
        var height = delpxToNum($cp.css("height"));
        var margin = delpxToNum($cp.css("margin"));
        
        
        if (window.innerWidth < width+margin*2){
            $cp.css("width", window.innerWidth-margin*2+"px");
            width = window.innerWidth-margin*2;
        } else {
            $cp.css("width", base.width+"px");
        }

        $cp
        .css("top", (window.innerHeight-(margin*2+height))/2+"px")
        .css("left", (window.innerWidth-(margin*2+width))/2+"px");
    });

    window.dispatchEvent(new Event("resize"));

    return 0;
}();



class Popup{
    static me = document.getElementById("shishiji-popup-container-c");
    static ppcls = `<div id="ppcls"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z" fill="#ffffff"></path></svg></div>`;

    static popupContent(_innerHTML, callback){
        new Promise((resolve, reject) => {
            $("shishiji-mx-overlay")
            .removeClass("pipe")
            .addClass("popen")
            .on("click", this._dispose);
            $("#shishiji-popup-container-c")
            .html(this.ppcls+_innerHTML)
            .show();
            resolve("");
        }).then(() => {
            $("#ppcls").on("click", this.disPop);
            if (callback !== void 0)
                callback();
        });
    }
    
    static disPop(){
        $("#ppcls").off("click", this.disPop);
        $("shishiji-mx-overlay")
        .removeClass("popen")
        .addClass("pipe")
        .off("click", this._dispose);
        $("#shishiji-popup-container-c")
        .hide()
        .empty();
    }

    static get popupping(){
        return (this.me?.style.display != "none") ? true : false;
    }

    static _dispose(){
        if (Popup.popupping)
            Popup.disPop();
    }
}
