//@ts-check
"use strict";


/**
 * Draw tiles
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} xrange 
 * @param {number} yrange 
 * @param {number} tile_width 
 * @param {number} tile_height 
 * @param {string} src_formatter 
 * @param {Function} [callback]
 * @returns {Promise<any>}
 *   callbacked promise
 */
async function drawMap(canvas, ctx, xrange, yrange, tile_width, tile_height, src_formatter, callback){
    /**@type {HTMLImageElement[]} */
    var al = [];
    return new Promise((resolve, reject) => {
        for (var y = 0; y <= yrange; y++){
            for (var x=0; x <= xrange; x++){
                var dh = tile_width,
                    dw = tile_height,
                    dx = dw*x,
                    dy = dh*y;

                !function(x, y, dx, dy, dw, dh){
                    var img = new Image();

                    img.onload = function(){
                        //@ts-ignore
                        this.loaded = true;
                        bctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                        ctx.drawImage(backcanvas, ...[ backcanvas.canvas.coords.x ,backcanvas.canvas.coords.y ]);
                        al.push(img);
                        if (al.length >= (xrange+1)*(yrange+1))
                            resolve("canvas loaded");
                    }

                    img.src = formatString(src_formatter, y, x);

                    return 0;
                }(x, y, dx, dy, dw, dh);
            }
        }
    }).then(() => {
        window.scroll({ top: 0, behavior: "instant" });
        
        if (typeof callback === "function")
            callback(al);
    });
}


