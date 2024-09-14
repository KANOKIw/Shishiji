//@ts-check
"use strict";


window.addEventListener("click", function(e){
    /**@ts-ignore @type {HTMLElement} */
    const target = e.target;
    const $target = $(target);
    
    if ($target.hasClass("cloudfileel")){
        const uname = $target.parent().attr("uname");

        if (uname){
            window.navigator.clipboard.writeText(uname);
            PictoNotifier.notify(
                "link",
                `${uname} をコピーしました`,
                {
                    duration: 2500,
                    discriminator: uname
                }
            );
        }
    } else if ($(target).hasClass("article-image")){
        const src = target.getAttribute("src");

        if (src){
            const _html = `${GPATH.X}<img class="suhDWAgd" src="${src}">`;
            /**@ts-ignore @type {HTMLElement} */
            const clone = target.cloneNode();

            function popupping(){
                const me = document.getElementById("shishiji-popup-container-cn");
                return ( me?.clientHeight != 0 ) ? true : false;
            }
            function _dispose(){
                if (popupping())
                    disPop();
            }
            function disPop(){
                window.removeEventListener("keydown", noMish);
                $("#ppcls").off("click", disPop);
                $("shishiji-mx-overlay-n")
                .removeClass("popen")
                .addClass("pipe")
                .off("click", _dispose);
                $("#shishiji-popup-container-cn")
                .hide()
                .empty();
            }
            function noMish(e){
                const key = e.key.toUpperCase();
                if (Popup.closeKeys.includes(key)){
                    _dispose();
                }
            }
            
            
            $(clone).attr("id", "").attr("class", "suhDWAgd").attr("style", "");
            
            new Promise((resolve, reject) => {
                this.window.addEventListener("keydown", noMish);
                $("shishiji-mx-overlay-n")
                .removeClass("pipe")
                .addClass("popen")
                .on("click", _dispose);
                $("#shishiji-popup-container-cn")
                .addClass("flxxt")
                .css("height", "fit-content")
                .css("overflow", "visible")
                .html(GPATH.X)
                .append(clone)
                .show();
                resolve("");
            }).then(() => {
                $("#ppcls")
                .css("top", "-40px")
                .css("right", "0")
                .on("click", disPop);
                /**<path fill="#ffffff"></path> */
                $($($("#ppcls").children()[0]).children()[0])
                .attr("fill", "blue");
            });
        }
    }
});


window.addEventListener("dblclick", function(e){
    e.preventDefault();
}, { passive: false });


window.addEventListener("beforeunload", e => {
    if (change_not_saved_remaining || (Popup.isPoppingup && $("#ppupds").hasClass("aioshud"))){
        e.preventDefault();
        const message = "このページを離れてもよろしいですか？\n編集データは自動では保存されません。";
    
        e.returnValue = message;
        return message;
    }
}, { passive: false });


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
