//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/supports").PopupOptions} PopupOptions
 * @typedef {import("../shishiji-dts/supports").PopupCloseMethod} PopupCloseMethod
 * @typedef {import("../shishiji-dts/supports").PopupCloseListener} PopupCloseListener
 */


const Popup = class Popup{
    /**
     * @see {@link _keydisposal}
     */
    static closeKeys = [ "ESCAPE" ];
    /**
     * @type {PopupCloseListener[]} 
     */
    static closeListeners = [];


    /**
     * 
     * @param {string} _innerHTML 
     * @param {() => void} [callback] 
     * @param {PopupOptions} [options]
     */
    static async popupContent(_innerHTML, callback, options){
        const ppcls = GPATH.X;

        if (options === void 0){
            options = {
                width: 500,
                height: 450,
            };
        } else {
            if (!options.width)
                options.width = 500;
            if (!options.height)
                options.height = 450;
        }

        if (options.hideclosebutton && options.forceclosebutton)
            console.warn("hideclosebutton and forceclosebutton shouldn't be true at same time!!");

        if (!options.hideclosebutton)
            _innerHTML = ppcls + _innerHTML;

        window.removeEventListener("keydown", this._keydisposal);
        $("shishiji-mx-overlay").off("click", this._dispose);
        return new Promise((resolve, reject) => {
            if (!options?.forceclosebutton){
                window.addEventListener("keydown", this._keydisposal);
                $("shishiji-mx-overlay").on("click", this._dispose);
            }
            $("shishiji-mx-overlay")
            .removeClass("pipe")
            .addClass("popen");
            $("#shishiji-popup-container-c")
            .removeClass("flxxt")
            .css({
                "overflow": "",
                "height": "",
                "width": "",
                "max-width": options.width+"px",
                "max-height": options.height+"px",
                "left": `calc((var(--window-width) - 48px - min(${options.width}px, var(--window-width) - 48px))/2)`
            })
            .html(_innerHTML)
            .show();
            resolve("");
        }).then(() => {
            $("#ppcls").on("click", this._disposition);
            if (callback !== void 0)
                callback();
        });
    }


    /**
     * 
     * @param {string} src 
     * @param {"img" | "video"} mediatype 
     * @param {HTMLElement} [sourceelem] 
     * @param {() => void} [callback] 
     */
    static async popupMedia(src, mediatype, sourceelem, callback){
        const ppcls = GPATH.X;
        /**@ts-ignore @type {HTMLElement} */
        const clone = sourceelem ? sourceelem.cloneNode(true) : document.createElement("span");
        var _html = ppcls;
        
        if (clone){
            $(clone).attr("id", "").attr("class", "").attr("style", "").attr("draggable", "true");
            switch (mediatype){
                case "video":
                    $(clone).attr("controls", "")
                    .attr("preload", "metadata")
                    .attr("playsinline", "")
                    .attr("autoplay", "")
                    .removeAttr("muted");
                default:
                    clone.classList.add("suhDWAgd");
            }
        } else {
            switch (mediatype){
                case "img":
                    _html += `<img class="suhDWAgd" src="${src}" draggable="true">`;
                    break;
                case "video":
                    _html += `<video class="suhDWAgd" src="${src}" controls preload="metadata" playsinline="" draggable="true"></video>`;
                    break;
            }
        }

        // Why
        return new Promise((resolve, reject) => {
            window.addEventListener("keydown", this._keydisposal);
            $("shishiji-mx-overlay")
            .removeClass("pipe")
            .addClass("popen")
            .on("click", this._dispose);
            $("#shishiji-popup-container-c")
            .addClass("flxxt")
            .css({
                "max-height": "fit-content",
                "height": "fit-content",
                "overflow": "visible",
            })
            .html(_html)
            .append(clone)
            .show();
            resolve("");
        }).then(() => {
            $("#ppcls")
            .css({
                "top": "-40px",
                "right": "0",
            })
            .on("click", this._disposition);
            /**<path fill="#ffffff"></path> */
            $($($("#ppcls").children()[0]).children()[0])
            .attr("fill", "blue");

            if (callback !== void 0)
                callback();
        });
    }


    /**
     * 
     * @param {PopupOptions} [options] 
     */
    static startLoad(options){
        this.popupContent(`<div class="protected" id="ppupds"><div class="mx-text-center flxxt">${gglSymbols.loadging}</div></div>`, ()=>{},options);
    }


    /**
     * 
     * @param {string} message 
     */
    static showasError(message){
        this.popupContent(`<div class="protected" id="ppupds"><div class="mx-text-center flxxt" style="flex-direction:column;"><div style="width:125px;margin-bottom:4px;">${GPATH.ERROR_ZAHUMARU}</div><h4>${message}</h4></div></div>`);
    }
    

    /**
     * 
     * @param {PopupCloseMethod | Event | JQuery.Event} [closeMethod] 
     */
    static disPop(closeMethod){
        if (typeof closeMethod !== "string")
            closeMethod = "JAVASCRIPT";
        window.removeEventListener("keydown", Popup._keydisposal);
        $("#ppcls").off("click", Popup._disposition);
        $("shishiji-mx-overlay")
        .removeClass("popen")
        .addClass("pipe")
        .off("click", Popup._dispose);
        $("#shishiji-popup-container-c")
        .hide()
        .empty();
        Popup._callCloseListeners(closeMethod);
    }


    static get isPoppingup(){
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


    /**
     * 
     * @param {PopupCloseListener} callback 
     */
    static addCloseListener(callback){
        this.closeListeners.push(callback);
    }


    /**
     * 
     * @param {PopupCloseListener} callback 
     */
    static removeCloseListener(callback){
        const l = this.closeListeners.length;

        this.closeListeners = this.closeListeners.filter(func => func !== callback);

        if (this.closeListeners.length < l)
            return true;
        else
            return false;
    }


    /**
     * 
     * @param {PopupCloseMethod} method 
     */
    static _difficult(method){
        if (Popup.isPoppingup)
            Popup.disPop(method);
    }

    
    static _dispose(){
        Popup._difficult("OVERLAY");
    }


    static _disposition(){
        Popup.disPop("X BUTTON");
    }


    /**
     * 
     * @param {KeyboardEvent} e 
     */
    static _keydisposal(e){
        const key = e.key.toUpperCase();
        if (Popup.closeKeys.includes(key)){
            Popup._difficult("KEYBOARD");
        }
    }


    /**
     * 
     * @param {PopupCloseMethod} method 
     */
    static _callCloseListeners(method){
        this.closeListeners.forEach(func => {
            func(method);
        });
    }
}


//@ts-ignore
window.Popup = Popup;
