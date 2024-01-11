//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").DrawMapData} DrawMapData
 */


/**
 * Draw tiles
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx
 * @param {DrawMapData} data 
 * @param {(all: HTMLElement[]) => any} [donecallback]
 * @param {(loaded: number, all: number) => any} [eachdonecallback] 
 * @returns {Promise<void>} 
 */
async function drawMap(canvas, ctx, data, donecallback, eachdonecallback){
    const xrange = data.xrange;
    const yrange = data.yrange;
    const tile_width = data.tile_width;
    const tile_height = data.tile_height;
    const src_formatter = data.format;
    /**@type {HTMLImageElement[]} */
    var all = [];
    var wait = 0;
    var processed = 0;
    /**@type {{ x: number, y: number, dx: number, dy: number, dw: number, dh: number, src: string }[]} */
    var erroredArray = [];
    const tileAmount = (xrange+1)*(yrange+1);

    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    backcanvas.width = tile_width*(xrange+1);
    backcanvas.height = tile_height*(yrange+1);
    const eacharg = {
        all: (xrange+1)*(yrange+1),
        loaded: 0,
    }

    return new Promise((resolve) => {
        for (var y = 0; y <= yrange; y++){
            for (var x = 0; x <= xrange; x++){
                var dh = tile_width,
                    dw = tile_height,
                    dx = dw*x,
                    dy = dh*y;

                !function(x, y, dx, dy, dw, dh){
                    const img = new Image();
                    const src = formatString(src_formatter, y, x);

                    img.onload = function(){
                        bctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                        ctx.drawImage(backcanvas, ...[ backcanvas.canvas.coords.x ,backcanvas.canvas.coords.y ]);
                        
                        processed++;
                        eacharg.loaded++;
                        all.push(img);

                        if (eachdonecallback)
                            eachdonecallback(eacharg.loaded, eacharg.all);
                        if (all.length >= tileAmount)
                            resolve("map loaded");
                    }

                    function reloaderrimg(){
                        var t = Map_retry_cooldown;

                        const g = setInterval(() => {
                            setLoadMessage(formatString(TEXT[LANGUAGE].MAP_LOAD_RETRYING, t));
                            $(`#load_spare:not([style*="display: none"]) #spare_logo`).css("animation", "load_rotator .75s infinite linear");

                            PictoNotifier.notify(
                                "no-wifi",
                                TEXT[LANGUAGE].NOTIFICATION_CHECK_YOUR_CONNECTION,
                                {
                                    duration: 5000,
                                    discriminator: "check ur WiFi",
                                    deny_userclose: true
                                }
                            );

                            t--;

                            if (t <= -1){
                                $(`#load_spare:not([style*="display: none"]) #spare_logo`).css("animation", "load_rotator 0.25s infinite linear");
                                retry();
                                clearInterval(g);
                            }
                        }, 1000);
                    }

                    function handleError(){
                        var t = Map_retry_cooldown;

                        processed++;

                        if (processed >= tileAmount)
                            reloaderrimg();
                    }

                    function retry(){
                        for (const cvsidata of erroredArray){
                            const img = new Image();
                            const src = cvsidata.src;

                            if (eachdonecallback)
                                eachdonecallback(eacharg.loaded, eacharg.all);
                            else
                                setLoadMessage(TEXT[LANGUAGE].LOADING_MAP);
                            processed--;

                            img.onload = function(){
                                bctx.drawImage(img, 0, 0, tile_width, tile_height, cvsidata.dx, cvsidata.dy, cvsidata.dw, cvsidata.dh);
                                ctx.drawImage(backcanvas, ...[ backcanvas.canvas.coords.x ,backcanvas.canvas.coords.y ]);

                                erroredArray = erroredArray.filter(p => { if (p.src != src) return true; });
                                processed++;
                                eacharg.loaded++;

                                all.push(img);

                                if (eachdonecallback)
                                    eachdonecallback(eacharg.loaded, eacharg.all);
                                if (all.length >= tileAmount)
                                    resolve("map loaded");
                                else if (processed >= tileAmount)
                                    reloaderrimg();
                            }

                            img.onerror = handleError;

                            img.src = src;
                        }
                    }

                    img.onerror = () => {
                        erroredArray.push({ x: x, y: y, dx: dx, dy: dy, dw: dw, dh: dh, src: src });
                        handleError();
                    };
                    
                    setTimeout(() => {
                        img.src = src;
                    }, wait);

                    wait += WAIT_BETWEEN_EACH_MAP_IMAGE;

                    return 0;
                }(x, y, dx, dy, dw, dh);
            }
        }
    }).then(() => {
        window.scroll({ top: 0, behavior: "instant" });
        
        if (typeof donecallback === "function")
            donecallback(all);
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
    const at = accurated ? K[0]+","+K[1] : Math.round(K[0]*abstraction)/abstraction+","+Math.round(K[1]*abstraction)/abstraction;
    
    setParam(ParamName.ZOOM_RATIO, zr);
    setParam(ParamName.COORDS, at);
}


/**
 * 
 * @param {Coords} coords 
 * @param {number} [abs_zoomRatio] 
 */
function setCoordsOnMiddle(coords, abs_zoomRatio){
    if (abs_zoomRatio === void 0){
        abs_zoomRatio = zoomRatio;
    }
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    const style = {
        top: window.innerHeight/2,
        left: window.innerWidth/2,
    };
    /**@type {Coords} */
    const bcoords = {
        x: (abs_zoomRatio*coords.x - style.left)/abs_zoomRatio,
        y: (abs_zoomRatio*coords.y - style.top)/abs_zoomRatio,
    };

    zoomRatio = abs_zoomRatio;
    backcanvas.canvas.coords = bcoords;
    moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
    setBehavParam();
}


/**
 * 
 * @param {DrawMapData} data 
 * @param {{over?: string; under?: string;}} [messages] 
 * @param {(all: HTMLElement[]) => any} [donecallback]
 */
function drawMapWithProgressBar(data, messages, donecallback){
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById(cssName.mcvs);
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    const loadmsg = `<h4>${messages?.over || ""}</h4><div id="map_load_progress"><div id="ml_progress"></div></div><h4>${messages?.under || ""}</h4>`;

    startLoad(loadmsg);
    drawMap(canvas, ctx, data, donecallback, function(loaded, all){
        const progress = loaded/all;
        const bar = document.getElementById("ml_progress");
        
        if (!bar) {
            setLoadMessage(loadmsg);
        }

        //@ts-ignore
        document.getElementById("ml_progress").style.width = progress*100 + "%";
    });

    return function(progress){
        //@ts-ignore
        document.getElementById("ml_progress").style.width = progress*100 + "%";
    }
}
