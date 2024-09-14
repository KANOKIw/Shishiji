//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/motion").Position} _Position
 * @typedef {import("../shishiji-dts/motion").Radian} Radian
 * @typedef {import("../shishiji-dts/motion").MoveData} MoveData
 * 
 * @typedef {import("../shishiji-dts/motion").RotationInfo} RotationInfo
 */


/**
 * 
 * @param {TouchList | MouseEvent} y 
 */
function setCursorpos(y){
    if (y instanceof MouseEvent)
        pointerPosition = [ y.clientX, y.clientY ];
    else
        pointerPosition = getMiddlePos(y);
}


/**
 * 
 * @param {TouchList} touches 
 */
function setTheta(touches){
    prevTheta = getThouchesTheta(touches);
}


/**
 * 
 * @param {MoveData} moved
 * @param {RotationInfo} [rotationinfo] 
 */
function moveMapAssistingNegative(moved, rotationinfo){
    const [ sinx, cosx ] = [ Math.sin(-totalRotationRad), Math.cos(-totalRotationRad) ];
    const relmoved = { ...moved };

    moved = {
        top: relmoved.top*cosx - relmoved.left*sinx,
        left: relmoved.top*sinx + relmoved.left*cosx
    };

    var x = backcanvas.canvas.coords.x - moved.left/zoomRatio,
        y = backcanvas.canvas.coords.y - moved.top/zoomRatio;

    backcanvas.canvas.width = shishiji_canvas.width/zoomRatio;
    backcanvas.canvas.height = shishiji_canvas.height/zoomRatio;

    backcanvas.canvas.coords = { x: x, y: y };

    const yokoikeru = 5000;
    const tateikeru = 5000;
    if (backcanvas.canvas.coords.x + backcanvas.canvas.width > yokoikeru){
        backcanvas.canvas.coords.x = yokoikeru - backcanvas.canvas.width;
    }
    if (backcanvas.canvas.coords.y + backcanvas.canvas.height > tateikeru){
        backcanvas.canvas.coords.y = tateikeru - backcanvas.canvas.height;
    }
    if (backcanvas.canvas.coords.x < 2500 - yokoikeru){
        backcanvas.canvas.coords.x = 2500 - yokoikeru;
    }
    if (backcanvas.canvas.coords.y < 2500 - tateikeru){
        backcanvas.canvas.coords.y = 2500 - tateikeru;
    }

    reDraw(backcanvas,
        ...[ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ],
        backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, shishiji_canvas.width, shishiji_canvas.height, rotationinfo
    );
}


/**
 * @deprecated use {@linkcode moveMapAssistingNegative} instead for safari support
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {MoveData} moved
 */
function moveMap(canvas, ctx, moved){
    const x = backcanvas.canvas.coords.y-moved.left/zoomRatio;
    const y = backcanvas.canvas.coords.x-moved.top/zoomRatio;

    backcanvas.canvas.coords = { x: x, y: y }; 
    backcanvas.canvas.width = canvas.width/zoomRatio;
    backcanvas.canvas.height = canvas.height/zoomRatio;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas, Math.floor(backcanvas.canvas.coords.x), Math.floor(backcanvas.canvas.coords.y),
        Math.floor(backcanvas.canvas.width), Math.floor(backcanvas.canvas.height), 0, 0, canvas.width, canvas.height,
    );
}


/**
 * 
 * @param {number} ratio 
 * @param {NonnullPosition} origin
 *   (cursorPosition)
 * @param {NonnullPosition} [pos]
 * @param {boolean} [forceRatio] 
 * @param {boolean} [noredraw] 
 */
function zoomMapAssistingNegative(ratio, origin, pos, forceRatio, noredraw){
    if (willOverflow(ratio, false)) return;

    pos ??= [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
    zoomRatio = forceRatio ? ratio : zoomRatio * ratio;

    if (origin.length == 2 && ratio != 1){
        /**@type {number[]} */
        var transorigin = [];
        for (var i = 0; i < 2; i++){
            transorigin.push(
                (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
            );
        }
        backcanvas.canvas.coords = {
            x: transorigin[0],
            y: transorigin[1]
        };
    }
    backcanvas.canvas.width = shishiji_canvas.width/zoomRatio; backcanvas.canvas.height = shishiji_canvas.height/zoomRatio;

    if (!noredraw)
        reDraw(backcanvas,
            Math.floor(backcanvas.canvas.coords.x), Math.floor(backcanvas.canvas.coords.y),
            Math.floor(backcanvas.canvas.width), Math.floor(backcanvas.canvas.height),
            0, 0, shishiji_canvas.width, shishiji_canvas.height
        );
}


/**
 * @deprecated use {@linkcode zoomMapAssistingNegative} instead for safari support
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} ratio 
 * @param {[number, number]} origin
 *   (cursorPosition)
 * @param {[number, number] | undefined} pos
 */
function zoomMap(canvas, ctx, ratio, origin, pos){
    if (MOVEPROPERTY.caps.ratio.max < zoomRatio && ratio > 1
        || MOVEPROPERTY.caps.ratio.min > zoomRatio && ratio < 1
        ) return;

    pos ??= [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];

    zoomRatio *= ratio;

    if (origin.length == 2 && ratio != 1){
        var transorigin = [];
        for (var i = 0; i < 2; i++){
            transorigin.push(
                (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
            );
        }
        backcanvas.canvas.coords = {
            x: transorigin[0],
            y: transorigin[1]
        };
    }
    backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backcanvas,
        Math.floor(backcanvas.canvas.coords.x), Math.floor(backcanvas.canvas.coords.y), Math.floor(backcanvas.canvas.width), Math.floor(backcanvas.canvas.height),
        0, 0, canvas.width, canvas.height,
    );
}


/**
 * 
 * @param {HTMLCanvasElement} target 
 * @param {HTMLImageElement | string} spare 
 */
function drawSpare(target, spare){
    /**@type {[number, number]} */
    const wd = [ 0, 0 ];
    const tctx = target.getContext("2d");


    function spareRatio(spare){
        return Math.max(target.width/spare.width, target.height/spare.height);
    }

    if (typeof spare == "string"){
        tctx?.beginPath();
        //@ts-ignore
        tctx.fillStyle = spare;
        tctx?.fillRect(0, 0, target.width, target.height);
        tctx?.stroke();
        tctx?.closePath();
    } else {
        const r = spareRatio();
        if (r < 1){
            tctx?.drawImage(spare, ...wd, spare.width*r, spare.height*r);
        } else if (spare.width != 0 && spare.height != 0){
            for (var h = 0; h < Math.ceil(target.height/spare.height); h++){
                for (var w = 0; w < Math.ceil(target.width/spare.width); w++){
                    tctx?.drawImage(spare, ...wd, spare.width, spare.height);
                    wd[0] += spare.width;
                }
                wd[0] = 0;
                wd[1] += spare.height;
            }
        }
    }
}


/**
 * As iOS browser doesn't support nagative argument of `CanvasRenderingContext2D.prototype.drawImage`.
 * 
 * USE:: `_redraw(canvas, ctx, backcanvas,
 *      backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
 *      backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height);`
 * @param {CanvasImageSource} image 
 * @param {number} sx @param {number} sy 
 * @param {number} sw @param {number} sh 
 * @param {number} dx @param {number} dy 
 * @param {number} dw @param {number} dh 
 * @param {RotationInfo} [rotationinfo] 
 */
function reDraw(image, sx, sy, sw, sh, dx, dy, dw, dh, rotationinfo){
    /**@type {NonnullPosition} */
    const canvasCoords = [sx, sy];
    /**@type {NonnullPosition} */
    var transCoords;
    /**@type {number[]} */
    var args = [ sx, sy, sw, sh, dx, dy, dw, dh ];

    rotationinfo ??= { rotated: 0, origin: [ shishiji_canvas.width/2, shishiji_canvas.height/2 ] };

    const floor = Math.floor;
    const children = map_children();
    const ratio = dw/sw;
    const bctx = backcanvas.getContext("2d");
    const spare = MAPDATA[CURRENT_FLOOR].spare;

    bctx?.clearRect(0, 0, backcanvas.width, backcanvas.height);
    shishiji_ctx.clearRect(0, 0, shishiji_canvas.width, shishiji_canvas.height);


    if (sx < 0 || sy < 0){
        transCoords = canvasCoords.map(
            n => { return -n; }
        );
        args = [
            0, 0,
            sw - transCoords[0],
            sh - transCoords[1],
            transCoords[0]*zoomRatio,
            transCoords[1]*zoomRatio,
            dw - transCoords[0]*zoomRatio,
            dh - transCoords[1]*zoomRatio,
        ];
    }
    

    if (children && children.length == 1 && children[0].length == 1){
        /**@param {RotationInfo} rotationinfo  */
        function exe(rotationinfo){
            const origin = rotationinfo.origin;
            const ct = toBackCanvasCoords(origin);

            totalRotationRad += rotationinfo.rotated;
            rotationHistory.push({
                canvasOrigin: new Complex(origin[0], origin[1]),
                BackOrigin: new Complex(ct.x, ct.y),
                arg: rotationinfo.rotated
            });
            
            /** @param {NonnullPosition} posT */
            function _dist(posT){
                return Math.pow((posT[0] - origin[0])**2 + (posT[1] - origin[1])**2, 0.5);
            }
            
            const mainclone = document.createElement("canvas");
            const circleRadius = Math.max(_dist([0,0]), _dist([0, shishiji_canvas.height]),
                _dist([shishiji_canvas.width, 0]), _dist([shishiji_canvas.width, shishiji_canvas.height]));
            const circleDiameter = circleRadius*2;
            const clctx = mainclone.getContext("2d");
            const CoordsdrawStarts = toBackCanvasCoords([
                origin[0] - circleRadius,
                origin[1] - circleRadius,
            ]);
            const CoordsdrawEnds = toBackCanvasCoords([
                origin[0] + circleRadius,
                origin[1] + circleRadius,
            ]);
            const CoordsdrawSizes = {
                width: CoordsdrawEnds.x - CoordsdrawStarts.x,
                height: CoordsdrawEnds.y - CoordsdrawStarts.y
            };
    
            mainclone.width = mainclone.height = circleDiameter;
    
            clctx?.translate(circleRadius, circleRadius);
            clctx?.rotate(-totalRotationRad);
            clctx?.translate(-circleRadius, -circleRadius);
    
            drawSpare(mainclone, spare);

            const gx = {
                sx: CoordsdrawStarts.x, sy: CoordsdrawStarts.y, sw: CoordsdrawSizes.width, sh: CoordsdrawSizes.height,
                dx: 0, dy: 0, dw: circleDiameter, dh: circleDiameter
            };

            if (gx.sx < 0 || gx.sy < 0){
                const rat = circleDiameter/CoordsdrawSizes.width;

                gx.sw = gx.sw + gx.sx;
                gx.sh = gx.sh + gx.sy;
                gx.sx = gx.sy = 0;
                gx.dx = gx.dw - (gx.sw * rat);
                gx.dy = gx.dh - (gx.sh * rat);
                gx.dw = (gx.sw * rat);
                gx.dh = (gx.sh * rat);
            }
    
            //@ts-ignore
            clctx?.drawImage(children[0][0], ...Object.values(gx));
    
            shishiji_ctx.drawImage(mainclone,
                circleRadius-origin[0], circleRadius-origin[1],
                circleRadius-origin[0]+shishiji_canvas.width-(circleRadius-origin[0]),
                circleRadius-origin[1]+shishiji_canvas.height-(circleRadius-origin[1]),
                0, 0, shishiji_canvas.width, shishiji_canvas.height,
            );
            
            updatePositions();
            drawPoints();
            mainclone.remove();
        }
        
        /**@param {RotationInfo} rotationinfo  */
        function rexe(rotationinfo){
            backcanvas.width = shishiji_canvas.width;
            backcanvas.height = shishiji_canvas.height;
            drawSpare(backcanvas, spare);
            //@ts-ignore
            bctx?.drawImage(children[0][0], ...args);
            shishiji_ctx.drawImage(backcanvas, Math.floor(dx), Math.floor(dy), Math.floor(dw), Math.floor(dh));

            updatePositions();
            drawPoints();
        }

        rexe(rotationinfo);
    } else {
        // Caution! rotation hasn't been implemented yet!!
        // Hmm... what a spare...
        backcanvas.width = dw - 2;
        backcanvas.height = dh - 2;

        drawSpare(backcanvas, spare);

        if (sx < 0){
            args[2] = sw;
            args[4] = floor(-sx*ratio);
        }
        if (sy < 0){
            args[3] = sh;
            args[5] = floor(-sy*ratio);
        }
        const SX = args[0],
            SY = args[1],
            SW = args[2],
            SH = args[3],
            DX = args[4],
            DY = args[5],
            DW = args[6],
            DH = args[7];


        /**@see {@link ./devm/illustration/renderMap.png} */
        const side = 2**12;
        const startCoords = [ SX, SY ];
        const endCoords = [ SX+SW, SY+SH ];
        const startChCoords = [ floor(startCoords[0] / side), floor(startCoords[1] / side) ];
        const endChCoords = [ floor(endCoords[0] / side), floor(endCoords[1] / side) ];
        const currentChCoords = [...startChCoords];
        var remaining_width = SW;
        var remaining_height = SH;


        var minDynamicSX = SX % side;
        var minDynamicSY = SY % side;

        const where_drawing = [ floor(DX), floor(DY) ];
        
        const remCache = [ remaining_width, remaining_height ];
        const wdCache = [...where_drawing];
        
        
        
        for (var vertical = startChCoords[1]; vertical <= endChCoords[1]; vertical++){
            var height = remaining_height;
            
            minDynamicSY = minDynamicSY % side;

            if (floor((minDynamicSY + remaining_height) / side) / floor(minDynamicSY / side) > 1){
                height = side - (minDynamicSY % side);
            }

            // initialize for every vertical draw
            remaining_width = remCache[0];
            minDynamicSX = SX % side;
            where_drawing[0] = wdCache[0];
            currentChCoords[0] = startChCoords[0];

            for (var horizontal = startChCoords[0]; horizontal <= endChCoords[0]; horizontal++){
                while (remaining_width > 0){
                    var width = remaining_width;

                    if (floor((minDynamicSX + remaining_width) / side) / floor(minDynamicSX / side) > 1){
                        width = side - (minDynamicSX % side);
                    }

                    if (minDynamicSX == side)
                        minDynamicSX = 0;
                    if (minDynamicSY == side)
                        minDynamicSY = 0;

                    const renderMap = map_children(currentChCoords[0], currentChCoords[1]);

                    const bc_width = floor(width*ratio),
                        bc_height = floor(height*ratio);

                    if (renderMap != null)
                        bctx?.drawImage(renderMap,
                            Math.floor(minDynamicSX), Math.floor(minDynamicSY), Math.floor(width), Math.floor(height),
                            Math.floor(where_drawing[0]), Math.floor(where_drawing[1]), Math.floor(bc_width), Math.floor(bc_height)
                        );

                    currentChCoords[0]++;
                    minDynamicSX += width;
                    remaining_width -= width;
                    where_drawing[0] += bc_width;
                }
            }

            minDynamicSY += height;
            remaining_height -= height;
            where_drawing[1] += floor(height*ratio);
            currentChCoords[1]++;
        }

        //@ts-ignore
        ctx.drawImage(backcanvas, dx, dy, dw, dh);

        function* another(){
            for (var vertical = startChCoords[1]; vertical <= endChCoords[1]; vertical++){
                for (var horizontal = startChCoords[0]; horizontal <= endChCoords[0]; horizontal++){
                    const source_child_cvs = map_children(horizontal, vertical);
                    const _sx = startCoords[0] - side*horizontal,
                        _sy = startChCoords[1] - side*vertical,
                        _sw = endChCoords[0]*side > endCoords[0] ? side : endCoords[0] - side*horizontal,
                        _sh = endChCoords[1]*side > endCoords[1] ? side : endCoords[1] - side*vertical;
    
                    if (source_child_cvs != null)
                        backcanvas.getContext("2d")?.drawImage(
                        source_child_cvs, Math.floor(_sx), Math.floor(_sy), Math.floor(_sw), Math.floor(_sh), 0, 0, backcanvas.width, backcanvas.height);
                }
            }
            reDraw(backcanvas,
                backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
                backcanvas.canvas.width, backcanvas.canvas.height,
                0, 0, shishiji_canvas.width, shishiji_canvas.height
            );
        }

        updatePositions();
        drawPoints();
    }
}


/**
 * @deprecated
 * @ignore
 * @param {NonnullPosition} origin 
 * @param {number} [rotation] 
 */
function rotateCanvas(origin, rotation){
    if (rotation === void 0){
        rotation = backcanvas.canvas.rotation;
    }


    /** @param {NonnullPosition} posT */
    function _dist(posT){
        return Math.pow((posT[0] - origin[0])**2 + (posT[1] - origin[1])**2, 0.5);
    }

    const bctx = backcanvas.getContext("2d");
    const mainclone = document.createElement("canvas");
    const circleRadius = Math.max(_dist([0,0]), _dist([0, shishiji_canvas.height]), _dist([shishiji_canvas.width, 0]), _dist([shishiji_canvas.width, shishiji_canvas.height]));
    const circleDiameter = circleRadius*2;
    const CoordsdrawStarts = toBackCanvasCoords([
        origin[0] - circleRadius,
        origin[1] - circleRadius,
    ]);
    const CoordsdrawEnds = toBackCanvasCoords([
        origin[0] + circleRadius,
        origin[1] + circleRadius,
    ]);
    const clctx = mainclone.getContext("2d");
    const spare = MAPDATA[CURRENT_FLOOR].spareImage || new Image();
    
    mainclone.width = mainclone.height = circleDiameter;

    bctx?.clearRect(0, 0, backcanvas.width, backcanvas.height);
    shishiji_ctx.clearRect(0, 0, shishiji_canvas.width, shishiji_canvas.height);

    backcanvas.width = shishiji_canvas.width;
    backcanvas.height = shishiji_canvas.height;

    drawSpare(backcanvas, spare);

    bctx?.drawImage(map_children()[0][0], backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
    backcanvas.canvas.width, backcanvas.canvas.height,
    0, 0, shishiji_canvas.width, shishiji_canvas.height);

    clctx?.translate(circleRadius, circleRadius);
    clctx?.rotate(-rotation);
    clctx?.drawImage(backcanvas, -circleRadius, -circleRadius, circleDiameter, circleDiameter,
        CoordsdrawStarts.x, CoordsdrawStarts.y, CoordsdrawEnds.x-CoordsdrawStarts.x, CoordsdrawEnds.y-CoordsdrawStarts.y
    );
    
    shishiji_ctx.drawImage(mainclone, 0, 0, shishiji_canvas.width, shishiji_canvas.height,
        circleRadius-origin[0], circleRadius-origin[1],
        circleRadius-origin[0]+shishiji_canvas.width-(circleRadius-origin[0]), circleRadius-origin[1]+shishiji_canvas.height-(circleRadius-origin[1])
    );
}
