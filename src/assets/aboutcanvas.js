/**
 * Draw tiles
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} divides 
 *   jh
 * @param {number} xrange 
 * @param {number} yrange 
 * @param {number} tile_width 
 * @param {number} tile_height 
 * @param {string} src_formatter 
 */
function drawMap(canvas, ctx, divides, xrange, yrange, tile_width, tile_height, src_formatter){
    for (var y=0; y <= yrange; y++){
        for (var x=0; x <= xrange; x++){
            var dh = Math.ceil(canvas.width/12),
                dw = dh,
                dx = dw*x,
                dy = dh*y;
            !function(x, y, dx, dy, dw, dh){
                var img = new Image();
                img.onload = function(){
                    this.loaded = true;
                    ctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                    bctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                }
                img.src = format(src_formatter, y, x);
            }(x, y, dx, dy, dw, dh);
        }
    }
}


