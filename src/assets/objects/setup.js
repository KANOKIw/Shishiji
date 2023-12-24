//@ts-check
"use strict";


!function(){
    // overview
    writeOverviewContent(`<div id="ovv-ctx-loading-w" class="protected"><h4 id="ovv-ctx-loading">${TEXT[LANGUAGE].PROCESSING}</h4></div>`, );


    window.addEventListener("click", function(e){
        /**@ts-ignore @type {HTMLElement} */
        const target = e.target;
        
        if ($(target).hasClass("article-image")){
            const src = target.getAttribute("src");

            if (src)
                Popup.popupMedia(src, "img");
        } else if ($(target).hasClass("article-video")){
            const src = target.getAttribute("src");

            /*if (src)
                Popup.popupMedia(src, "video");*/
        }
    });

    window.addEventListener("dblclick", function(e){
        /**@ts-ignore @type {HTMLElement} */
        const target = e.target;

        if ($(target).hasClass("article-video")){
            const src = target.getAttribute("src");

            /*if (src)
                Popup.popupMedia(src, "video");*/
        }
    });

    return 0;
}();
