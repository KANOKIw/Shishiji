//@ts-check

/**
 * Draw tiles
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx
 *   jh
 * @param {number} xrange 
 * @param {number} yrange 
 * @param {number} tile_width 
 * @param {number} tile_height 
 * @param {string} src_formatter 
 */
function drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height, src_formatter){
    for (var y=0; y <= yrange; y++){
        for (var x=0; x <= xrange; x++){
            var dh = tile_width,
                dw = tile_height,
                dx = dw*x,
                dy = dh*y;
            //@ts-ignore
            !function(x, y, dx, dy, dw, dh){
                var img = new Image();
                img.onload = function(){
                    //@ts-ignore
                    this.loaded = true;
                    /*
                    use this instead if it lags
                    ctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                    */
                    //@ts-ignore
                    bctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                    //@ts-ignore
                    ctx.drawImage(backcanvas, ...backcanvas.canvas.coords);
                }
                img.src = formatString(src_formatter, y, x);
            }(x, y, dx, dy, dw, dh);
        }
    }
    window.scroll({ top: 0, behavior: "instant" });
}


