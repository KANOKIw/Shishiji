/**
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {TouchEvent} event 
 * @returns {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian}}
 */
function touchZoom(canvas, ctx, event){
    /**@type {NonnullPosition} */
    var crossPos = [ -1, -1 ];
    const abs = Math.abs;
    const touches = event.touches;

    zoomCD++;

    /**@graph */
    const Fx = {
        previous: {
            slope: (prevTouchINFO.real[0].clientY - prevTouchINFO.real[1].clientY) / (prevTouchINFO.real[0].clientX - prevTouchINFO.real[1].clientX),
        },
        this: {
            slope: (touches[0].clientY - touches[1].clientY) / (touches[0].clientX - touches[1].clientX),
        }
    };

    const distance = get_midestOfTouches(touches);
    var diffRatio = distance / previousTouchDistance.distance;

    if (previousTouchDistance.x == -1 && previousTouchDistance.y == -1 && previousTouchDistance.distance == -1){
        diffRatio = 1;
    }

    previousTouchDistance.distance = distance;

    //#region 
    if (Fx.previous.slope == Fx.this.slope){
        var D1 = touches[0].clientX - prevTouchINFO.touches[0].x;
        var D2 = touches[1].clientX - prevTouchINFO.touches[1].x;

        (D1 === 0 && D2 === 0 || D1 + D2 == 0) ? D1 = D2 = 1 : 0;

        const R = D1 / (abs(D1) + abs(D2));

        const addD1x = abs(touches[0].clientX - touches[1].clientX) * R;
        const addD1y = abs(touches[0].clientY - touches[1].clientY) * R;

        /**@type {NonnullPosition} */
        const middle = [
            touches[0].clientX + addD1x,
            touches[0].clientY + addD1y,
        ];
        
        prevTouchINFO.middle = middle;
    } else {
        const crossX = (
                prevTouchINFO.real[0].clientX * Fx.previous.slope - touches[0].clientX * Fx.this.slope
                - prevTouchINFO.real[0].clientY + touches[0].clientY
            )
                /
            (Fx.previous.slope - Fx.this.slope);
        const crossY = (
            Fx.this.slope * (crossX - touches[0].clientX) + touches[0].clientY
        );
        
        crossPos = [ Math.ceil(crossX), Math.ceil(crossY) ];

        if (!crossPos.some(t => { return isNaN(t) })) 0;
    }
    //#endregion


    //#region 
    const x1d = prevTouchINFO.real[0].clientX * diffRatio;
    const y1d = prevTouchINFO.real[0].clientY * diffRatio;

    const diffx = touches[0].clientX - x1d;
    const diffy = touches[0].clientY - y1d;


    if (zoomCD > MOVEPROPERTY.touch.zoomCD){
        zoomMapAssistingNegative(canvas, ctx, diffRatio, [0, 0]);
        moveMapAssistingNegative(canvas, ctx, {
            top: diffy,
            left: diffx
        });
    }
    //#endregion


    //#region 
    const PI = Math.PI;
    const theta = getThouchesTheta(touches);
    
    /**@type {Radian} */
    var rotation;

    if (prevTheta === -1)
        rotation = 0;
    else if (
        0 <= prevTheta && prevTheta <= PI
            &&
        PI*(3/2) <= theta && theta <= 2*PI
        )
        rotation = -(2*PI - theta + prevTheta);
    else if (
        0 <= theta && theta <= PI
            &&
        PI*(3/2) <= prevTheta && prevTheta <= 2*PI
        )
        rotation = 2*PI - prevTheta + theta;
    else 
        rotation = theta - prevTheta;

    prevTheta = theta;


    totalRotateThisTime += Math.abs(rotation);
    rotatedThisTime += rotation;


    if (Math.abs(rotatedThisTime) > toRadians(MOVEPROPERTY.touch.rotate.min) || pastRotateMin){
        if (!pastRotateMin){
            rotatedThisTime -= toRadians(MOVEPROPERTY.touch.rotate.min);
        }
        pastRotateMin = !0;
        if (zoomCD > MOVEPROPERTY.touch.zoomCD)
            rotateCanvas(canvas, ctx, crossPos, rotation);
    }
    

    rotatedThisTime += rotation;
    //#endregion

    return { diffRatio: diffRatio, crossPos: crossPos, rotation: rotation };
}


/**
 * Draw tiles
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Function} [callback]
 * @returns {Promise<any>} 
 */
async function drawMap(canvas, ctx, data, callback){
    const xrange = data.xrange;
    const yrange = data.yrange;
    const tile_width = data.tile_width;
    const tile_height = data.tile_height;
    const src_formatter = data.format;
    /**@type {HTMLImageElement[]} */
    var al = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    backcanvas.width = tile_width*(xrange+1);
    backcanvas.height = tile_height*(yrange+1);

    return new Promise((resolve) => {
        for (var y = 0; y <= yrange; y++){
            for (var x = 0; x <= xrange; x++){
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
                            resolve("map loaded");
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


/**
 * 
 * @param {boolean} [accurated] 
 */
function setBehavParam(accurated){
    const abstraction = 10**paramAbstractDeg;
    const K = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
    const zr = accurated ? zoomRatio : Math.round(zoomRatio*abstraction)/abstraction;
    const at = accurated ? K[0]+"*"+K[1] : Math.round(K[0]*abstraction)/abstraction+"*"+Math.round(K[1]*abstraction)/abstraction;
    
    setParam("zr", zr);
    setParam("at", at);
}
