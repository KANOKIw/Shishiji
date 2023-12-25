//@ts-check
"use strict";


class Popup{
    /**@see {@link _keydisposal} */
    static closeKeys = [ "ESCAPE", ];
    /**
     * 
     * @param {string} _innerHTML 
     * @param {() => void} [callback] 
     * @param {boolean} [hideclosebutton] 
     * @param {{width: number, height: number}} [sizes]
     */
    static async popupContent(_innerHTML, callback, hideclosebutton, sizes){
        const ppcls = GPATH.X;

        if (sizes === void 0){
            sizes = {
                width: 500,
                height: 450,
            };
        } else {
            if (sizes.width === -1)
                sizes.width = 500;
            if (sizes.height === -1)
                sizes.height = 450;
        }

        if (!hideclosebutton)
            _innerHTML = ppcls + _innerHTML;
        
        return new Promise((resolve, reject) => {
            window.addEventListener("keydown", this._keydisposal);
            $("shishiji-mx-overlay")
            .removeClass("pipe")
            .addClass("popen")
            .on("click", this._dispose);
            $("#shishiji-popup-container-c")
            .removeClass("flxxt")
            .css("overflow", "")
            .css("height", "")
            .css("width", "")
            //@ts-ignore
            .css("max-width", sizes.width).css("max-height", sizes.height).css("left", `calc((var(--window-width) - 48px - min(${sizes.width}px, var(--window-width) - 48px))/2)`)
            .html(_innerHTML)
            .show();
            resolve("");
        }).then(() => {
            $("#ppcls").on("click", this.disPop);
            if (callback !== void 0)
                callback();
        });
    }


    /**
     * 
     * @param {string} src 
     * @param {"img" | "video"} mediatype 
     * @param {() => void} [callback] 
     */
    static async popupMedia(src, mediatype, callback){
        const ppcls = GPATH.X;
        var _html = ppcls;
        
        switch (mediatype){
            case "img":
                _html += `<img class="suhDWAgd" src="${src}">`;
                break;
            case "video":
                _html += `<video class="suhDWAgd" src="${src}" controls preload="metadata" playsinline=""></video>`;
                break;
        }

        return new Promise((resolve, reject) => {
            window.addEventListener("keydown", this._keydisposal);
            $("shishiji-mx-overlay")
            .removeClass("pipe")
            .addClass("popen")
            .on("click", this._dispose);
            $("#shishiji-popup-container-c")
            .addClass("flxxt")
            .css("max-height", "fit-content")
            .css("height", "fit-content")
            .css("overflow", "visible")
            .html(_html)
            .show();
            resolve("");
        }).then(() => {
            $("#ppcls")
            .css("top", "-40px")
            .css("right", "0")
            .on("click", this.disPop);
            /**<path fill="#ffffff"></path> */
            $($($("#ppcls").children()[0]).children()[0])
            .attr("fill", "blue");

            if (callback !== void 0)
                callback();
        });
    }


    static startLoad(){
        this.popupContent(`<div class="protected" id="ppupds"><div class="mx-text-center flxxt">${Symbol_Span.loadgingsymbol}</div></div>`);
    }


    /**
     * 
     * @param {string} message 
     */
    static showasError(message){
        this.popupContent(`<div class="protected" id="ppupds"><div class="mx-text-center flxxt" style="flex-direction:column;"><div style="width:125px;margin-bottom:4px;">${GPATH.ERROR_ZAHUMARU}</div><h4>${message}</h4></div></div>`);
    }
    

    static disPop(){
        window.removeEventListener("keydown", this._keydisposal);
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
        const me = document.getElementById("shishiji-popup-container-c");
        return ( me?.clientHeight != 0 ) ? true : false;
    }


    static setsize(){
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
        
        var width = delpxToNum($cp.css("width"));
        var height = delpxToNum($cp.css("height"));
        var margin = delpxToNum($cp.css("margin"));
        
        if (window.innerWidth <= width+margin*2){
            $cp.css("width", window.innerWidth-margin*2+"px");
            width = window.innerWidth-margin*2;
        } else {
            $cp.css("width", base.width+"px");
        }

        $cp
        .css("top", (window.innerHeight-(margin*2+height))/2+"px")
        .css("left", (window.innerWidth-(margin*2+width))/2+"px");
    }

    
    static _dispose(){
        if (Popup.popupping)
            Popup.disPop();
    }


    /**
     * 
     * @param {KeyboardEvent} e 
     */
    static _keydisposal(e){
        const key = e.key.toUpperCase();
        if (Popup.closeKeys.includes(key)){
            Popup._dispose();
        }
    }
}


//@ts-ignore
window.Popup = Popup;
