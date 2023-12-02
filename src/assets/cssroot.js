//@ts-check
"use strict";


!function(){
    const root = document.documentElement;

    window.addEventListener("resize", function(e){
        const width = window.innerWidth;
        const height = window.innerHeight;

        root.style.setProperty("--window-width", width+"px");
        root.style.setProperty("--window-height", height+"px");
        root.style.setProperty("--window-half-width", width/2+"px");
        root.style.setProperty("--window-half-height", height/2+"px");
    });

    window.dispatchEvent(new Event("resize"));
    setInterval(() => {
        window.dispatchEvent(new Event("resize"));
    }, 150);
    
    return 0;
}();
