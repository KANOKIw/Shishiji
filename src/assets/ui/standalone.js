//@ts-check
"use strict";


(function(g, v){
    if (
        //@ts-ignore
        g.navigator.standalone
        ||
        g.matchMedia("(display-mode: standalone)").matches){
        const c = document.createElement("link");
        c.rel = "stylesheet";
        c.href = "/src/assets/css/standalone.css";
        v.head.appendChild(c);
    }

    g.addEventListener("click", function(d){
        /**@ts-ignore @type {HTMLElement} */
        const k = d.target;
        const c = k.closest("a");
        
        if (k?.tagName.toLowerCase() == "a" || c){
            d.preventDefault();
            const j = c?.getAttribute("href");
            j ? this.window.open(j, "_blank", "noopener,noreferrer") : void 0;
        }
    }, { passive: false });
})(window, document);
