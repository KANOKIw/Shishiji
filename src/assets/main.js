function afterdraw(canvas){
    backcanvas.width = canvas.width;
    backcanvas.height = canvas.height;
}


!function(){
    var canvas = document.getElementById("shishiji-canvas");
    var ctx = canvas.getContext("2d");
    var tile_width = 100;
    var tile_height = 100;
    var xrange = 18;
    var yrange = 7;
    backcanvas.width = tile_width*(xrange+1);
    backcanvas.height = tile_height*(yrange+1);
    if (window.innerWidth/tile_width > window.innerHeight/tile_height){
        canvas.width = canvas.height = window.innerWidth;
        drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
            "/src/resources/map_divided/dokoka/tile_{0}_{1}.png");
    } else {
        canvas.width = canvas.height = window.innerHeight;
        drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height,
            "/src/resources/map_divided/dokoka/tile_{0}_{1}.png");
    }
}();
