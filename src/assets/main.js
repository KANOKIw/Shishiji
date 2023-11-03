function afterdraw(canvas){
    backcanvas.width = canvas.width;
    backcanvas.height = canvas.height;
}

!function(){
    var canvas = document.getElementById("shishiji-canvas");
    var ctx = canvas.getContext("2d");
    var tile_width = 50;
    var tile_height = 50;
    var xrange = 12;
    var yrange = 9;
    if (window.innerWidth/tile_width > window.innerHeight/tile_height){
        canvas.width = canvas.height = window.innerWidth;
        var divides = yrange;
        drawMap(canvas, ctx, divides, xrange, yrange, tile_width, tile_height,
            "/src/resources/map_divided/machida/tile_{0}_{1}.png");
    } else {
        canvas.width = canvas.height = window.innerHeight;
        var divides = xrange;
        drawMap(canvas, ctx, divides, xrange, yrange, tile_width, tile_height,
            "/src/resources/map_divided/machida/tile_{0}_{1}.png");
    }
    afterdraw(canvas);
}();


window.addEventListener("mousemove", function(e){
    cursorPosition = [e.clientX, e.clientY];
});
