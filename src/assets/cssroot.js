//@ts-check
"use strict";


const cssName = {
    app: "#app-mount",
    fselector: "#place-selector",
    fopt: "#place-options",
    foptw: "#place-options-w",
    lospare: "#load_spare",
    losparemsg: "#spare_message",
    usrstricter: "#user-stricter",
    mcvs: "shishiji-canvas",
    sharettl: "#ppc-title",
    sharesbttl: "#ppc-subtitle",
    sharenav: "#share-nav",
    resharenav: "#nav-share",
    sharecopy: "#share-copy",
    btnsharee: "share_ebtn",
    btnincludescr: "#includeScr",
    btnincludescrch: "#includeScrCh",
    translsh: "#--share-bru",
    translma: "#--trans-MAIL",
    translme: "#--trans-MESSAGE",
    translcp: "#--trans-COPYLINK",
    translot: "#--trans-OTHERS",
    ovv: "shishiji-overview",
    ovvshare: "#overview-share",
    ovvsharec: "#overview-share-c",
    ovvclose: "#overview-close",
    ovvclosec: "#overview-close-c",
    ovvctx: "#overview-context",
    ovvctxload: "#ovv-ctx-loading",
    ovvctxart: "ctx-article",
    view: "shishiji-view"
};


!function(_do){
    const root = document.documentElement;

    if (!_do) return;

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
    }, 500);
    
    return 0;
}(false);
