//@ts-check
"use strict";


class Popup{
    /**
     * 
     * @param {string} _innerHTML 
     * @param {() => void} [callback] 
     */
    static popupContent(_innerHTML, callback){
        const ppcls = GPATH.X;
        
        new Promise((resolve, reject) => {
            $("shishiji-mx-overlay")
            .removeClass("pipe")
            .addClass("popen")
            .on("click", this._dispose);
            $("#shishiji-popup-container-c")
            .html(ppcls+_innerHTML)
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
        const me = document.getElementById("shishiji-popup-container-c");
        return ( me?.clientHeight != 0 ) ? true : false;
    }

    static _dispose(){
        if (Popup.popupping)
            Popup.disPop();
    }
}


//@ts-ignore
window.Popup = Popup;
