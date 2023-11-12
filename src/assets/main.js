//@ts-nocheck
"use strict";



function set_canvassize(){
    const canvas = document.getElementById("shishiji-canvas");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
    backcanvas.canvas.width = canvas.width;
    backcanvas.canvas.height = canvas.height;
}


!function(){
    const canvas = document.getElementById("shishiji-canvas");
    const ctx = canvas.getContext("2d");
    const tile_width = 500;
    const tile_height = 500;
    const xrange = 3;
    const yrange = 1;


    set_canvassize();
    
    backcanvas.width = tile_width*(xrange+1);
    backcanvas.height = tile_height*(yrange+1);

    drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
        "/resources/map_divided/dokoka/tile_{0}_{1}.png", callback);

    function callback(){
        
    }
    return 0;
}();


window.addEventListener("resize", function(e){
    const canvas = document.getElementById("shishiji-canvas");
    set_canvassize();
    moveMapAssistingNegative(canvas, canvas.getContext("2d"), {top: 0, left: 0});
    window.scroll({ top: 0, behavior: "instant" });
}, { passive: false });


window.addEventListener("gesturestart", function(e){
    e.preventDefault();
});


window.addEventListener("load", function(e){
    window.scroll({ top: 0, behavior: "instant" });
});
