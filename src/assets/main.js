//@ts-check
"use strict";



function setCanvasSizes(){
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
    backcanvas.canvas.width = canvas.width;
    backcanvas.canvas.height = canvas.height;
}


!function(){
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    /**@ts-ignore @type {string} */
    const loadType = window.performance?.getEntriesByType("navigation")[0].type;
    const PARAMS = {
        article: getParam(ParamNames.ARTICLE_ID),
        zoomRatio: Number(getParam(ParamNames.ZOOM_RATIO)) || 1,
        floor: getParam(ParamNames.FLOOR),
        coords: getParam(ParamNames.COORDS)?.split("*").map(a => { return (a === String(void 0) || isNaN(Number(a))) ? null : Number(a); }) || [ 0, 0 ],
        from: getParam(ParamNames.URL_FROM),
        lang: isThereLang(getParam(ParamNames.LANGUAGE)) || "JA",
    };
    LANGUAGE = PARAMS.lang;
    if (PARAMS.coords == [null, null]) PARAMS.coords = [0, 0];

    if (loadType == "reload"){
        switch (reloadInitializeLevel){
            case reloadInitializeLevels.DO_EVERYTHING:
            case reloadInitializeLevels.INIT_FLOOR:
                PARAMS.floor = null;
                delParam(ParamNames.FLOOR);
            case reloadInitializeLevels.INIT_COORDS:
                PARAMS.coords = [ 0, 0 ];
                delParam(ParamNames.COORDS);
            case reloadInitializeLevels.INIT_ZOOMRADIO:
                PARAMS.zoomRatio = 1;
                delParam(ParamNames.ZOOM_RATIO);
            case reloadInitializeLevels.CLOSE_ARTICLE:
                PARAMS.article = null;
                delParam(ParamNames.ARTICLE_ID);
            case reloadInitializeLevels.DO_NOTHING:
            default:

        }
    }

    delParam(ParamNames.URL_FROM);

    startLoad(TEXT[LANGUAGE].LOADING_MAP);
    setCanvasSizes();

    $.get("/data/map-data/conf")
    .done(function(data){
        MAPDATA = data;
        var initial_floor = data.initial_floor;
        var initial_data = data[data.initial_floor];

        if (PARAMS.floor && Object.keys(data).includes(PARAMS.floor)){
            initial_floor = PARAMS.floor;
            initial_data = data[PARAMS.floor];
        }

        backcanvas.width = initial_data.tile_width*(initial_data.xrange+1);
        backcanvas.height = initial_data.tile_height*(initial_data.yrange+1);

        drawMap(canvas, ctx, initial_data, callback);
        
        var loaded = 0;
        
        function callback(){
            loaded++;
            backcanvas.canvas.coords = {
                //@ts-ignore
                x: PARAMS.coords[0], y: PARAMS.coords[1]
            };
            zoomRatio = PARAMS.zoomRatio;
            moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
            setBehavParam();
            if (loaded == 2)
                _loaded();
        }
    
        !function(){
            $.get("/data/map-data/objects")
            .done((objdata) => {
                loaded++;
                mapObjectComponent = objdata;
    
                showDigitsOnFloor(initial_floor, mapObjectComponent);
    
                CURRENT_FLOOR = initial_floor;

                setParam(ParamNames.FLOOR, CURRENT_FLOOR);

                setPlaceSelColor();

                if (loaded == 2)
                    _loaded();
            })
            .fail((err) => {
                
            });
            return 0;
        }();
    
        function _loaded(){
            endLoad(TEXT[LANGUAGE].MAP_LOADED);
            $("#app-mount").show();
            if (PARAMS.article){
                const data = searchObject(PARAMS.article);
                var fromARTshare = !!0;
                
                if (PARAMS.from == ParamValues.FROM_ARTICLE_SHARE){
                    fromARTshare = !0;
                }

                if (data == null || CURRENT_FLOOR != data.object.floor){
                    if (fromARTshare){
                        setTimeout(() => {
                            notifyHTML(
                                `<div id="shr-notf" class="flxxt" style="font-size: 12px;">${GPATH.ERROR}${TEXT[LANGUAGE].NOTIFICATION_EVENT_NOT_FOUND}</div>`,
                                7500,
                                "share not found",
                            );
                        }, 500);
                    }
                    delParam(ParamNames.ARTICLE_ID);
                    return;
                }

                if (fromARTshare){
                    const coords = data.object.coordinate;
                    
                    setCoordsOnMiddle(coords, ZOOMRATIO_ON_SHARE);
                }

                setTimeout(() => {
                    raiseOverview();
                    writeArticleOverview(data, true);
                }, 1000);
            }
        }
        return 0;
    })
    .fail(function(e){

    });
    return 0;
}();



window.addEventListener("resize", function(e){
    e.preventDefault();
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    setCanvasSizes();
    //@ts-ignore
    moveMapAssistingNegative(canvas, canvas.getContext("2d"), { top: 0, left: 0 });
    window.scroll({ top: 0, behavior: "instant" });
}, { passive: false });


window.addEventListener("gesturestart", function(e){
    e.preventDefault();
}, { passive: false });


window.addEventListener("dblclick", function(e){
    e.preventDefault();
}, { passive: false });


window.addEventListener("load", function(e){
    window.scroll({ top: 0, behavior: "instant" });
});

document.oncontextmenu = () => { return false; }
