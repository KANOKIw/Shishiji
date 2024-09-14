//@ts-check
"use strict";


function setCanvasSizes(){
    shishiji_canvas.width = window.innerWidth;
    shishiji_canvas.height = window.innerHeight;
    shishiji_canvas.style.width = shishiji_canvas.width+"px"; shishiji_canvas.style.height = shishiji_canvas.height+"px";
    backcanvas.canvas.width = shishiji_canvas.width;
    backcanvas.canvas.height = shishiji_canvas.height;
}


!function(){
    /**@ts-ignore @type {string} */
    const loadType = window.performance?.getEntriesByType("navigation")[0].type;
    const PARAMS = {
        article: getParam(ParamName.ARTICLE_ID),
        zoomRatio: Number(getParam(ParamName.ZOOM_RATIO)) || 1,
        floor: getParam(ParamName.FLOOR),
        coords: getParam(ParamName.COORDS)?.split(",").map(a => { return (typeof a === "undefined" || isNaN(Number(a))) ? 0 : Number(a); }) || [ 0, 0 ],
        from: getParam(ParamName.URL_FROM),
        lang: digitLang(getParam(ParamName.LANGUAGE)),
        jumpto: getParam(ParamName.JUMPTO),
        _poor_coords: getParam(ParamName.COORDS)?.split(",").map(a => { return (typeof a === "undefined" || isNaN(Number(a))) ? 0 : Number(a); }) || [ 0, 0 ],
    };


    //LANGUAGE = PARAMS.lang || getUserLang() || "JA";
    
    if (PARAMS.coords.length != 2 
        || PARAMS.coords.some(u => {
        if (!u || isNaN(u))
            return true;
        }
    )) PARAMS.coords = [ 0, 0 ];

    if (loadType == "reload"){
        switch (reloadInitializeLevel){
            case reloadInitializeLevels.DO_EVERYTHING:
            case reloadInitializeLevels.INIT_FLOOR:
                PARAMS.floor = null;
                delParam(ParamName.FLOOR);
            case reloadInitializeLevels.INIT_COORDS:
                PARAMS.coords = [ 0, 0 ];
                delParam(ParamName.COORDS);
            case reloadInitializeLevels.INIT_ZOOMRADIO:
                PARAMS.zoomRatio = 1;
                delParam(ParamName.ZOOM_RATIO);
            case reloadInitializeLevels.CLOSE_ARTICLE:
                PARAMS.article = null;
                delParam(ParamName.ARTICLE_ID);
            case reloadInitializeLevels.DO_NOTHING:
            default:

        }
    }

    const loaderf = startLoad(TEXTS[LANGUAGE].LOADING, "first", true);
    delParam(ParamName.URL_FROM);
    setCanvasSizes();
    setPlaceSelColor();

    function setFloors(fldata){
        const flelm = document.createElement("div");
        flelm.classList.add("fselc-cell", "flxxt", "realshadow");
        for (const [fn, fdat] of Object.entries(fldata)){
            if (fn == "initial_floor")  continue;
            const gx = flelm.cloneNode();
            gx.textContent = fdat["so-called"] || fn;
            //@ts-ignore
            gx.setAttribute("floor", fn); gx.id = "floor-"+fn;
            gx.addEventListener("click", function(){
                if (CURRENT_FLOOR != fn && !tour_status.main_screen){
                    approach_beings.length = 0;
                    changeFloor(fn, gx.textContent || "", MAPDATA[fn], true);
                    MOVEPROPERTY.deny = false;
                    $(".fselc-cell").removeClass("currentflr");
                    $(this).addClass("currentflr");
                }
            });
            //@ts-ignore
            $("#fsel-xxl").append(gx);
        }
    }

    const mapConfigAjax = $.when($.post(ajaxpath.mapdata), $.post(ajaxpath.mapobjs), $.post(ajaxpath.mappoints), LOGIN_AJAX);

    function whenWithComplicatedURL(ajaxmapdata, ajaxobjectdata, ajaxpointdata){
        const mapdata = ajaxmapdata[0],
            /**@type {mapObjComponent} */
            objectdata = ajaxobjectdata[0],
            points = ajaxpointdata[0],
            mapdrawncallbacks = [],
            loadendscallbacks = [],
            gcc = {
                "1F": "1階",
                "2F": "2階",
                "3F": "1階",
                "4F": "4階",
                "B1": "地下1階"
            };
        MAPDATA = mapdata;
        mapObjectComponent = objectdata;
        mapPointComponent = points;
        setFloors(ajaxmapdata[0]);

        var initial_floor = mapdata.initial_floor;
        var initial_data = mapdata[mapdata.initial_floor];

        var pure_zr = Boolean(PARAMS.zoomRatio === 1);

        if (PARAMS.floor && Object.keys(mapdata).includes(PARAMS.floor)){
            initial_floor = PARAMS.floor;
            initial_data = mapdata[PARAMS.floor];
        }
        if (PARAMS.from == ParamValues.FROM_NAVIGATE){
            const objdata = getMapObjectData(PARAMS.article || "");
            initial_floor = objdata?.object.floor;
            initial_data = mapdata[initial_floor];
            mapdrawncallbacks.push(() => {
                setCoordsOnMiddle(objdata?.object.coordinate || { x: ((initial_data.xrange+1)*initial_data.tile_width)/2, y: ((initial_data.yrange+1)*initial_data.tile_height)/2 }, zoomRatio, true);
            });
        }
        if (PARAMS.jumpto){
            var data = getMapObjectData(PARAMS.jumpto);
            initial_floor = data?.object.floor;
            initial_data = mapdata[initial_floor];
            PARAMS.article = "";
            delParam(ParamName.JUMPTO);
            delParam(ParamName.ARTICLE_ID);
            mapdrawncallbacks.push(() => {
                setCoordsOnMiddle(data?.object.coordinate || {
                    x: ((initial_data.xrange+1)*initial_data.tile_width)/2,
                    y: ((initial_data.yrange+1)*initial_data.tile_height)/2
                }, ZOOMRATIO_ON_SHARE, true);
                PictoNotifier.notify("info", formatString(TEXTS[LANGUAGE].JUMPED_TO_MAP, data?.article.title));
            });
        }
    
        CURRENT_FLOOR = initial_floor;
        // It's now just a color!!
        //initial_data = setSpareImage(initial_data);

        backcanvas.width = initial_data.tile_width*(initial_data.xrange+1);
        backcanvas.height = initial_data.tile_height*(initial_data.yrange+1);
    
        +function(){
            // cut a rational figure of our UI
            var __wait = 0//100//4750;

            loaderf.then(async () =>{
                if (!getLocalStorage("__reception")){
                    // do I have to show reception at first??
                    //setCoordsOnMiddle({x:504,y:1650}, 1);
                    setLocalStorage("__reception", "done-"+(new Date()).toString());
                }
                if (LOGIN_DATA.data.custom_data.headcount == 0){
                    letSetHeadcount()
                    .then(() => {
                        if (isUnvisitedTour("main_screen"))
                            tour_status.main_screen = MOVEPROPERTY.deny = true;
                            setTimeout(() => {
                                startTour("main_screen");
                            }, 250);
                    });
                }
                await endLoad(TEXTS[LANGUAGE].MAP_LOADED, __wait);
                
                isUnvisitedTour("main_screen") && LOGIN_DATA.data.custom_data.headcount != 0 ? 
                loadendscallbacks.push(() => {
                    tour_status.main_screen = MOVEPROPERTY.deny = true;
                    startTour("main_screen");
                }) : 0;
                loadendscallbacks.forEach(f => f());
            });

            $("#app-mount").show();
            if (PARAMS.article){
                if (PARAMS.from == ParamValues.FROM_NAVIGATE)
                    return;
                const data = getMapObjectData(PARAMS.article);
                var scr_position = 0;
                var article_tg = "description";

                if (data == null){
                    if (PARAMS.from == ParamValues.FROM_ARTICLE_SHARE){
                        setTimeout(() => {
                            PictoNotifier.notify(
                                "error",
                                TEXTS[LANGUAGE].NOTIFICATION_SHARED_EVENT_NOT_FOUND,
                                { duration: 7500, discriminator: "share not found" }
                            );
                        }, 500);
                    }
                    delParam(ParamName.ARTICLE_ID);
                    return;
                }

                if (PARAMS.from == ParamValues.FROM_ARTICLE_SHARE){
                    const coords = data.object.coordinate;

                    CURRENT_FLOOR = initial_floor = data.object.floor;
                    initial_data = MAPDATA[CURRENT_FLOOR];

                    mapdrawncallbacks.push(() => setCoordsOnMiddle(coords, ZOOMRATIO_ON_SHARE, true));
                    loadendscallbacks.push(() => {
                        PictoNotifier.notify(
                            "info",
                            TEXTS[LANGUAGE].NOTIFICATION_SHARED_EVENT_FOUND,
                            { duration: 5000, discriminator: "share found" }
                        );
                    });

                    const g = getParam(ParamName.SCROLL_POS),
                        y = getParam(ParamName.ART_TARGET);
                    delParam(ParamName.SCROLL_POS);
                    delParam(ParamName.ART_TARGET);
                    if (g != null || y){
                        scr_position = Number(g);
                        if (y)
                            article_tg = y;
                    }
                }

                loadendscallbacks.push(() => {
                    raiseOverview();
                    writeArticleOverview(data, true, scr_position, article_tg);
                });
            }
        }();
        
        function mapdrawncallback(){
            const mapd = {
                width: (initial_data.xrange+1)*initial_data.tile_width,
                height: (initial_data.yrange+1)*initial_data.tile_height
            };
            const zr_cands = [document.body.clientWidth/mapd.width, document.body.clientHeight/mapd.height];
            
            backcanvas.canvas.coords = {
                //@ts-ignore
                x: PARAMS.coords[0], y: PARAMS.coords[1]
            };
            
            if (PARAMS.zoomRatio > MOVEPROPERTY.caps.ratio.max) PARAMS.zoomRatio = MOVEPROPERTY.caps.ratio.max;
            if (PARAMS.zoomRatio < MOVEPROPERTY.caps.ratio.min) PARAMS.zoomRatio = MOVEPROPERTY.caps.ratio.min;

            zoomRatio = PARAMS.zoomRatio || Math.min(...zr_cands);
            
            moveMapAssistingNegative({ left: 0, top: 0 });
            showDigitsOnFloor(initial_floor, mapObjectComponent);
            showGoodOrgs();
            setBehavParam();
            legalRatioCap();
            if (pure_zr || PARAMS._poor_coords.some(u => u === 0)){
                zoomRatio = Math.min(...zr_cands);
                setCoordsOnMiddle({x: ((initial_data.xrange+1)*initial_data.tile_width)/2, y: ((initial_data.yrange+1)*initial_data.tile_height)/2 }, zoomRatio, true);
            }
            mapdrawncallbacks.forEach(f => f());
        }

        $("#floor-"+CURRENT_FLOOR).addClass("currentflr");
        readyMap(initial_data, { over: "", under: gcc[CURRENT_FLOOR] }, mapdrawncallback);
        setParam(ParamName.FLOOR, CURRENT_FLOOR);
        setPlaceSelColor();
    }


    mapConfigAjax.done(PARAMS.floor ? whenWithComplicatedURL : whenWithComplicatedURL/*whenWithPureURL*/);

    return 0;
}();


window.addEventListener("resize", function(e){
    e.preventDefault();
    setCanvasSizes();
    moveMapAssistingNegative({ top: 0, left: 0 });
    window.scroll({ top: 0, behavior: "instant" });
}, { passive: false });

window.addEventListener("touchstart", function(e){
    //@ts-ignore
    if (e.target.classList.contains("canvas_interactive")){ e.target.classList.add("interactive_trans"); }
}, {passive: true});

window.addEventListener("touchend", function(e){
    Array.from(document.getElementsByClassName("interactive_trans")).forEach(e => e.classList.remove("interactive_trans"));
}, {passive: true});

document.oncontextmenu = () => { return false; }


if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("/src/assets/service-worker/poverty.js")
    .then(function(registration){
        //console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch(function(error){
        //console.log("Service Worker registration failed:", error);
    });
}


setInterval(async function(){
    for (const cd of LOGIN_DATA.pending_collects){
        letCollect(cd.name, cd.count);
    }
    LOGIN_DATA.pending_collects.length = 0;
}, 10000);
