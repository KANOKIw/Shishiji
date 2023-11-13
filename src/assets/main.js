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
    const yrange = 3;


    set_canvassize();

    backcanvas.width = tile_width*(xrange+1);
    backcanvas.height = tile_height*(yrange+1);

    drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
        "/resources/map_divided/minecraft/tile_{0}_{1}.png", callback);
    var loaded = 0;
    function callback(){
        loaded++;
        backcanvas.canvas.coords = {
            x: (backcanvas.width - backcanvas.canvas.width) / 2,
            y: (backcanvas.height - backcanvas.canvas.height) / 2
        };
        moveMapAssistingNegative(canvas, ctx, {left: 0, top: 0});
        if (loaded == 2)
            _loaded();
    }

    !function(){
        $.get("/data/map-objects")
        .done((objdata) => {
            loaded++;
            mapObjectComponent = objdata;

            for (var key in mapObjectComponent){
                const data = mapObjectComponent[key];

                putObjOnMap(data);
            }

            if (loaded == 2)
                _loaded();
        })
        .fail((err) => {
            
        });
        return 0;
    }();

    function _loaded(){
        $("#load_spare").hide();
        $("#app-mount").show();
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
