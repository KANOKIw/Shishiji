//@ts-check
"use strict";



function setCanvasSizes(){
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
    const yrange = 2;


    startLoad();
    setCanvasSizes();

    $.get("/data/map-data/conf")
    .done(function(data){
        MAPDATA = data;

        const initial_data = data[data.initial_floor];

        backcanvas.width = initial_data.tile_width*(initial_data.xrange+1);
        backcanvas.height = initial_data.tile_height*(initial_data.yrange+1);

        drawMap(canvas, ctx, initial_data, callback);
        
        var loaded = 0;
        
        function callback(){
            loaded++;
            backcanvas.canvas.coords = {
                x: 0,
                y: 0
            };
            zoomRatio = 0.5;
            moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
            if (loaded == 2)
                _loaded();
        }
    
        !function(){
            $.get("/data/map-data/objects")
            .done((objdata) => {
                loaded++;
                mapObjectComponent = objdata;
    
                showDigitsOnFloor(data.initial_floor, mapObjectComponent);
    
                CURRENT_FLOOR = data.initial_floor;

                setPlaceSelColor();

                if (loaded == 2)
                    _loaded();
            })
            .fail((err) => {
                
            });
            return 0;
        }();
    
        function _loaded(){
            endLoad();
            $("#app-mount").show();
            setInterval(() => {
                window.dispatchEvent(new Event("resize"));
            }, 50);
        }
        return 0;
    })
    .fail(function(e){

    });
    return 0;
}();



window.addEventListener("resize", function(e){
    e.preventDefault();
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    setCanvasSizes();
    //@ts-ignore
    moveMapAssistingNegative(canvas, canvas.getContext("2d"), { top: 0, left: 0 });
    window.scroll({ top: 0, behavior: "instant" });
}, { passive: false });


window.addEventListener("gesturestart", function(e){
    e.preventDefault();
}, { passive: false });


window.addEventListener("dblclick", function(e){
    e.preventDefault();
}, { passive: false });


window.addEventListener("load", function(e){
    window.scroll({ top: 0, behavior: "instant" });
});

document.oncontextmenu = () => { return false; }
