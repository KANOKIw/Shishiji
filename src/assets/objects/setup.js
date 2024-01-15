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
                Popup.popupMedia(src, "img", target);
        }
    });


    "touchstart mousedown".split(" ").forEach(m => {
        document.getElementById("user-stricter")?.addEventListener(m, function(){
            if (OverView.isfullyopened){
                reduceOverview();
            }
        });
    });


    document.getElementById("shishiji-overview")?.addEventListener("click", function(e){
        if (e.pageY < 20){
            document.getElementById(cssName.ovv)?.scrollTo({
                behavior: "smooth",
                top: 0,
            })
        }
    });

    return 0;
}();
