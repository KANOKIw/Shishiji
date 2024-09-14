//@ts-check
"use strict";


/**
 * 
 * @param {boolean} notify 
 */
function showZoom(notify){
    $("#promax-container").css("transform", `scale(${PVSTATUS.zooms.ratio})`);
    if (notify){
        var notifyArrow = PVSTATUS.zooms.ratio > 1 ? gglSymbols.zoom_in : gglSymbols.zoom_out;
        PVSTATUS.zooms.ratio === 1 ? notifyArrow = gglSymbols.search : void 0;
        Notifier.notifyHTML(
        `<div class="flxxt aosdosd">${notifyArrow} x${Math.floor(PVSTATUS.zooms.ratio*100)}% <button id="zoom_resetter" class="notifier-btn">リセット</button></div>`,
        {
            duration: 2000,
            discriminator: "pvtransition",
            do_not_keep_previous: true
        });
    }
}


/**
 * 
 * @param {"in" | "out"} how 
 */
function zoomPV(how){
    const index = PVSTATUS.zooms.ratios.indexOf(PVSTATUS.zooms.ratio);
    PVSTATUS.zooms.ratio = how === "in" ? 
    typeof PVSTATUS.zooms.ratios[index+1] === "undefined" ? PVSTATUS.zooms.ratios[PVSTATUS.zooms.ratios.length-1] : PVSTATUS.zooms.ratios[index+1]
     : 
    typeof PVSTATUS.zooms.ratios[index-1] === "undefined" ? PVSTATUS.zooms.ratios[0] : PVSTATUS.zooms.ratios[index-1];
    showZoom(true);
}


window.addEventListener("wheel", function(e){
    if (e.ctrlKey || e.metaKey){
        e.preventDefault();
        zoomPV(e.deltaY < 0 ? "in" : "out");
    }
}, { passive: false });


"touchstart mousedown".split(" ").forEach(a => {
    addEventListener(a, function(e){
        //@ts-ignore
        const targetID = e.target.id;
        if (targetID === "zoom_resetter"){
            PVSTATUS.zooms.ratio = 1;
            showZoom(false);
        } else if (targetID === "move_resetter"){
            PVSTATUS.moves.top = 0;
            showUpDown(false);
        }
    });
});


/**
 * 
 * @param {boolean} notify 
 */
function showUpDown(notify){
    $("#promax-container").css("top", PVSTATUS.moves.top+"px");
    if (notify){
        var notifyArrow = PVSTATUS.moves.top > 0 ? gglSymbols.arrow_downward : gglSymbols.arrow_upward;
        PVSTATUS.moves.top === 0 ? notifyArrow = gglSymbols.height : void 0;
        Notifier.notifyHTML(
        `<div class="flxxt aosdosd">${notifyArrow} ${Math.abs(PVSTATUS.moves.top)}px (resized?) <button id="move_resetter" class="notifier-btn">リセット</button></div>`,
        {
            duration: 2000,
            discriminator: "pvtransition",
            do_not_keep_previous: true
        });
    }
}


/**
 * 
 * @param {"up" | "down"} how 
 */
function updownPV(how){
    PVSTATUS.moves.top += how === "up" ? PVSTATUS.moves.delta : -PVSTATUS.moves.delta;
    showUpDown(true);
}


function savepv(){
    setLocalStorage(ZOOMRATIOKEY, String(PVSTATUS.zooms.ratio));
    setLocalStorage(TOPKEY, String(PVSTATUS.moves.top));
}


/**@type {[Element | null, Element | null]} */
const pcativeElements = [ document.activeElement, document.activeElement ];
setInterval(() => {
    pcativeElements.shift();
    pcativeElements.push(document.activeElement);
}, 250);


function _ye(){
    if (pcativeElements.some(e => { if (e?.id === "main-editor") return true; })){
        $("#main-editor").trigger("focus");
    }
    savepv();
}


document.getElementById("pvzoom_in")?.addEventListener("click", function(){
    zoomPV("in");
    _ye();
});


document.getElementById("pvzoom_out")?.addEventListener("click", function(){
    zoomPV("out");
    _ye();
});


document.getElementById("pvarrow_upward")?.addEventListener("click", function(){
    updownPV("down");
    _ye();
});


document.getElementById("pvarrow_downward")?.addEventListener("click", function(){
    updownPV("up");
    _ye();
});


document.getElementById("pvarrow_power_settings_new")?.addEventListener("click", function(){
    PVSTATUS.zooms.ratio = 1;
    PVSTATUS.moves.top = 0;
    showZoom(false);
    showUpDown(false);
    savepv();
    if (Notifier.current === "pvtransition"){
        Notifier.closeNotifier();
    }
});


const whatsnow = {
    up: {
        active: false,
        func: function(){
            updownPV("up");
            _ye();
        }
    },
    down: {
        active: false,
        func: function(){
            updownPV("down");
            _ye();
        }
    },
    ctrl: false,
};


window.addEventListener("keydown", function(e){
    const KEY = e.key.toUpperCase();
    const g = e.ctrlKey || e.metaKey;

    function a(){
        e.preventDefault();
    }
    if (KEY == "ARROWUP"){
        if (g) a();
        whatsnow.up.active = true;
    } else if (KEY == "ARROWDOWN"){
        if (g) a();
        whatsnow.down.active = true;
    } else if (KEY == "CONTROL"){
        whatsnow.ctrl = true;
    }
}, { passive: false });


window.addEventListener("keyup", function(e){
    const KEY = e.key.toUpperCase();

    if (KEY == "ARROWUP"){
        whatsnow.up.active = false;
    } else if (KEY == "ARROWDOWN"){
        whatsnow.down.active = false;
    } else if (KEY == "CONTROL"){
        whatsnow.ctrl = false;
    }
}, { passive: false });


setInterval(() => {
    if (whatsnow.ctrl){
        if (whatsnow.up.active)
            whatsnow.up.func();
        if (whatsnow.down.active)
            whatsnow.down.func();
    }
}, 100);


showZoom(false);
showUpDown(false);


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);

endLoad(void 0, 1500);
setTimeout(()=>PictoNotifier.notifyInfo(`詳細に新しいテーブルを追加したい場合は<span style="color:#D32F2F">5年E組伊藤舜</span>にお願いしてくださ～い！`, {
    duration: 10000
}), 2000);
