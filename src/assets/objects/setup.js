//@ts-check
"use strict";


!function(){
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
            document.getElementById("shishiji-overview")?.scrollTo({
                behavior: "smooth",
                top: 0,
            })
        }
    });


    // something to do
    document.getElementById("dvd4")?.addEventListener("click", function(e){
        e.preventDefault();
        prevListener.share();
    });

    document.getElementById("dvd1")?.addEventListener("click", function(e){
        e.preventDefault();
        map_reveal_func();
    });

    document.getElementById("dvd2")?.addEventListener("click", function(e){
        e.preventDefault();
        prevListener.favorite();
    });

    document.getElementById("dvd3")?.addEventListener("click", function(e){
        e.preventDefault();
        prevListener.vote();
    });

    return 0;
}();
