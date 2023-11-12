//@ts-check
"use strict";



function set_canvassize(){
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
    backcanvas.canvas.width = canvas.width;
    backcanvas.canvas.height = canvas.height;
}


!function(){
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    const tile_width = 500;
    const tile_height = 500;
    const xrange = 3;
    const yrange = 1;


    set_canvassize();

    drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
        "/resources/map_divided/dokoka/tile_{0}_{1}.png", callback);

    function callback(){
        $("#load_spare").hide();
        $("#app-mount").show();
        backcanvas.canvas.coords = {
            x: (backcanvas.width - backcanvas.canvas.width) / 2,
            y: (backcanvas.height - backcanvas.canvas.height) / 2
        };
        moveMapAssistingNegative(canvas, ctx, {left: 0, top: 0});
        putObjOnMap();
    }
    return 0;
}();


window.addEventListener("resize", function(e){
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    set_canvassize();
    //@ts-ignore
    moveMapAssistingNegative(canvas, canvas.getContext("2d"), {top: 0, left: 0});
    window.scroll({ top: 0, behavior: "instant" });
}, { passive: false });


window.addEventListener("gesturestart", function(e){
    e.preventDefault();
});


window.addEventListener("load", function(e){
    window.scroll({ top: 0, behavior: "instant" });
});
