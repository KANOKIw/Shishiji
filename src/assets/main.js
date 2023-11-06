//@ts-nocheck

function set_canvassize(){
    var canvas = document.getElementById("shishiji-canvas");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
    backcanvas.canvas.width = canvas.width;
    backcanvas.canvas.height = canvas.height;
}


!function(){
    var canvas = document.getElementById("shishiji-canvas");
    var ctx = canvas.getContext("2d");
    var tile_width = 500;
    var tile_height = 500;
    var xrange = 3;
    var yrange = 1;

    set_canvassize();
    backcanvas.width = tile_width*(xrange+1);
    backcanvas.height = tile_height*(yrange+1);
    drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
        "/src/resources/map_divided/dokoka/tile_{0}_{1}.png");
    return !0;
}();


window.addEventListener("resize", function(e){
    var canvas = document.getElementById("shishiji-canvas");
    set_canvassize();
    moveMap(canvas, canvas.getContext("2d"), {top: 0, left: 0});
    window.scroll({ top: 0, behavior: "instant" });
}, { passive: false });


window.addEventListener("gesturestart", function(e){
    e.preventDefault();
});


window.addEventListener("load", function(e){
    window.scroll({ top: 0, behavior: "instant" });
});
