//@ts-check
"use strict";


/**@type {NodeJS.Timeout} FAKE*/
var lst;
/**
 * 
 * @param {boolean} openned 
 */
function toggleFeslOn(openned){
    if (!openned){
        clearTimeout(lst);
        this.addClass("toSel popped");
        $("#place-options-w")
        .show()
        .addClass("toSel");
    } else {
        this.addClass("undoSel").removeClass("popped");
        $("#place-options-w").addClass("undoSel");
        lst = setTimeout(() => {
            this.removeClass("toSel undoSel")
            $("#place-options-w")
            .hide()
            .removeClass("toSel undoSel");
        }, 190);
    }
}


/**
 * 
 * @param {string} floor 
 * @param {{[key: string]: number}} data 
 * @param {() => void} [callback] 
 */
function changeFloor(floor, data, callback){
    /**@ts-ignore @type {HTMLElement} */
    const fselector = document.getElementById("place-selector");
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");


    startLoad(TEXT[LANGUAGE].LOADING_MAP);
    toggleFeslOn.apply($(fselector), [!0]);
    overlay_modes.fselector.opened = !!0;

    const data_size = {
        width: data.tile_width*(data.xrange+1),
        height: data.tile_height*(data.yrange+1)
    };
    backcanvas.width = data_size.width;
    backcanvas.height = data_size.height;
    drawMap(canvas, ctx, data, function(){
        backcanvas.canvas.coords = {
            x: 0,
            y: 0
        };
        zoomRatio = 1;
        moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
        clearObj();
        showDigitsOnFloor(floor, mapObjectComponent);
        endLoad(TEXT[LANGUAGE].MAP_LOADED);
        if (callback !== void 0)
            callback();
    });
    CURRENT_FLOOR = floor;
    setParam(ParamNames.FLOOR, CURRENT_FLOOR);
    setPlaceSelColor();
}
