//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").DrawMapData} DrawMapData
 */


/**
 * Draw tiles
 * ⚠️This just draws on children⚠️
 * @param {DrawMapData} data 
 * @param {(all: HTMLElement[]) => any} [donecallback]
 * @param {(loaded: number, all: number) => any} [eachdonecallback] 
 * @returns {Promise<void>} 
 */
async function drawMap(data, donecallback, eachdonecallback){
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
    const map_sizes = {
        width: (xrange+1) * tile_width,
        height: (yrange+1) * tile_height
    };
    const side = 2**12; //=√2^24


    shishiji_ctx.clearRect(0, 0, shishiji_canvas.width, shishiji_canvas.height);
    _map_children.forEach(p => p.forEach(k => k.remove()));
    _map_children.splice(0);
    

    /**@param {number} width  @param {number} height  */
    function _createCvs(width, height){
        const c = document.createElement("canvas");
        c.width = width;
        c.height = height;
        return c;
    }

    if (map_sizes.width*map_sizes.height > 2**24){
        for (var horizontal = 0; horizontal < Math.ceil(map_sizes.width / side); horizontal++){
            for (var vertical = 0; vertical < Math.ceil(map_sizes.height / side); vertical++){
                const cvs = _createCvs(side, side);
                vertical > 0 ? _map_children[horizontal].push(cvs) : _map_children[horizontal] = [cvs];
            }
        }
    } else {
        const cvs = _createCvs(map_sizes.width, map_sizes.height);
        _map_children[0] = [cvs];
    }
    
    const eacharg = {
        all: (xrange+1)*(yrange+1),
        loaded: 0,
    }

    /**
     * 
     * @param {HTMLImageElement} img 
     * @param {number} dx @param {number} dy @param {number} dw @param {number} dh 
     */
    function drawIt(img, dx, dy, dw, dh){
        const floor = Math.floor;
        const startCoords = [ dx, dy ];
        const endCoords = [ (dx+dw), (dy+dh) ];
        const startChildCoords = [ floor(startCoords[0] / side), floor(startCoords[1] / side) ];
        const endChildCoords = [ floor(endCoords[0] / side), floor(endCoords[1] / side) ];
        const currentCoords = [...startCoords];
        const currentChildCoords = [...startChildCoords];
        var remaining_width = dw;
        var remaining_height = dh;
        var dynamicDX = dx % side;
        var dynamicDY = dy % side;
        
        const where_source_drawing = [ 0, 0 ];
        
        for (var vertical = startChildCoords[1]; vertical <= endChildCoords[1]; vertical++){
            var height = remaining_height;
            
            if (floor((dynamicDY + remaining_height) / side) / floor(dynamicDY / side) > 1){
                height = side - (dynamicDY % side);
            }

            // initialize for every vertical draw
            remaining_width = dw;
            dynamicDX = dx % side;
            where_source_drawing[0] = 0;
            currentChildCoords[0] = startChildCoords[0];

            for (var horizontal = startChildCoords[0]; horizontal <= endChildCoords[0]; horizontal++){
                while (remaining_width > 0){
                    var width = remaining_width;

                    if (floor((dynamicDX + remaining_width) / side) / floor(dynamicDX / side) > 1){
                        width = side - (dynamicDX % side);
                    }

                    if (dynamicDX == side)
                        dynamicDX = 0;
                    if (dynamicDY == side)
                        dynamicDY = 0;

                    const child = map_children(currentChildCoords[0], currentChildCoords[1]);
                    
                    child?.getContext("2d")?.drawImage(
                        img, where_source_drawing[0], where_source_drawing[1], width, height, dynamicDX, dynamicDY, width, height,
                    );

                    /*console.log(`Drawing image: ${img.src.slice(img.src.lastIndexOf("/")+1)};
        Image{ start: [${[where_source_drawing[0], where_source_drawing[1]]}], end: [${[where_source_drawing[0] + width, where_source_drawing[1] + height]}] };
        Child: (${currentChildCoords}), start: [${[dynamicDX, dynamicDY]}], end: [${[dynamicDX + width, dynamicDY + height]}];`);*/

                    currentChildCoords[0]++;
                    dynamicDX += width;
                    where_source_drawing[0] += width;
                    remaining_width -= width;
                }
            }

            dynamicDY += height;
            remaining_height -= height;
            where_source_drawing[1] += height;
            currentChildCoords[1]++;
        }
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
                        drawIt(img, dx, dy, dw, dh);
                        
                        processed++;
                        eacharg.loaded++;
                        all.push(img);

                        if (eachdonecallback)
                            eachdonecallback(eacharg.loaded, eacharg.all);
                        if (all.length >= tileAmount)
                            resolve("map loaded");
                    }

                    function reloaderrimg(){
                        var t_advent = Map_retry_cooldown;

                        const g = setInterval(() => {
                            setLoadMessage(formatString(TEXTS[LANGUAGE].MAP_LOAD_RETRYING, t_advent));
                            $(".loader__icon").removeClass("_gloads").addClass("_bgoods");

                            PictoNotifier.notify(
                                "no-wifi",
                                TEXTS[LANGUAGE].NOTIFICATION_CHECK_YOUR_CONNECTION,
                                {
                                    duration: 5000,
                                    discriminator: "check ur WiFi",
                                    deny_userclose: true
                                }
                            );
                            t_advent--;

                            if (t_advent <= -1){
                                $(".loader__icon").removeClass("_bgoods").addClass("_gloads");
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
                                setLoadMessage(TEXTS[LANGUAGE].LOADING_MAP);
                            processed--;

                            img.onload = function(){
                                drawIt(img, cvsidata.dx, cvsidata.dy, cvsidata.dw, cvsidata.dh);

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

        /**
         * Check map children whether they were decently drawn
         * @param {number} [sideratio]
         * @deprecated
         */
        function _debugChildren(sideratio){
            const canvas = document.createElement("canvas");
            const children = map_children() || [[]];
            var width = 0; var height = 0;

            sideratio = sideratio === void 0 ? 1 : sideratio;
            
            height = children.length*(2**12);
            width = children[0].length*(2**12);
            canvas.width = width; canvas.height = height;
            var o = 0;
            for (const horizontal of children){
                var h  = 0;
                for (const vertical of horizontal){
                    canvas.getContext("2d")?.drawImage(vertical, 0, 0, vertical.width, vertical.height, o*(2**12), h, vertical.width, vertical.height);
                    h += vertical.height;
                }
                o++;
            }
            const shown = document.createElement("canvas");
            var ratio = 1, rcandidates = [ 1 ];
            shown.width = window.innerWidth*sideratio;
            shown.height = window.innerHeight*sideratio;
            rcandidates = [ shown.width/canvas.width, shown.height/canvas.height ];
            ratio = Math.max(...rcandidates);
            shown.getContext("2d")?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width*ratio, canvas.height*ratio);
            shown.style.top = "0";
            shown.style.left = "0";
            shown.style.zIndex = "9999999";
            shown.style.position = "fixed";
            shown.style.pointerEvents = "none";
            shown.id = "canvas_children_debugger";
            document.body.prepend(shown);
        }

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
 * @param {boolean} [set_parm] 
 */
function setCoordsOnMiddle(coords, abs_zoomRatio, set_parm){
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
    moveMapAssistingNegative({ left: 0, top: 0 });
    set_parm ? setBehavParam() : void 0;
}


/**
 * 
 * @param {DrawMapData} data 
 * @param {{over?: string; under?: string;}} [messages] 
 * @param {(all: HTMLElement[]) => any} [donecallback]
 */
function readyMap(data, messages, donecallback){
    const loadmsg = `<h4>${messages?.over || ""}</h4><div id="map_load_progress"><div id="ml_progress"></div></div><h4>${messages?.under || ""}</h4>`;

    drawMap(data, donecallback, function(loaded, all){
        var progress = loaded/all;
        const bar = document.getElementById("ml_progress");
        
        if (!bar) {
            setLoadMessage(loadmsg);
        }

        //@ts-ignore
        //document.getElementById("ml_progress").style.width = progress*100 + "%";
    });

    /**
     * @param {number} progress
     */
    return function(progress){
        //@ts-ignore
        document.getElementById("ml_progress").style.width = progress*100 + "%";
    }
}


/**
 * 
 * @param {DrawMapData} mapdata 
 * @returns 
 */
function setSpareImage(mapdata){
    const spare = new Image();
    spare.src = mapdata.spare;
    mapdata.spareImage = spare;
    return mapdata;
}
