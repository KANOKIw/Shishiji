//@ts-check
"use strict";


/**
 * 
 * @this {JQuery<HTMLElement>}
 * @param {boolean} openned 
 * @param {boolean} sudden 
 */
function toggleFeslOn(openned, sudden){
    if (!openned){
        this
        .removeClass("toSel undoSel")
        .addClass("toSel popped");
        $("#place-options-w")
        .show()
        .removeClass("toSel undoSel")
        .addClass("toSel");
        $("#where_am_i").hide();
        $("#psdummy").addClass("greatfulmanbruh");
    } else {
        this
        .removeClass("popped")
        .addClass("undoSel");
        if (sudden)
            $("#place-options-w").hide();
        else
            $("#place-options-w").show();
        $("#place-options-w")
        .removeClass("toSel")
        .addClass("undoSel");
        $("#where_am_i").show();
        $("#psdummy").removeClass("greatfulmanbruh");
    }
}


/**
 * 
 * @param {string} [fn] FloorLike
 */
function setPlaceSelColor(fn){
    if (fn === void 0) fn = CURRENT_FLOOR;
    
    $(".fselc-cell").removeClass("currentflr");
    $("#floor-"+fn).addClass("currentflr");
}


function legalRatioCap(){
    if (CURRENT_FLOOR == "B1") MOVEPROPERTY.caps.ratio.min = 0.4;
    else MOVEPROPERTY.caps.ratio.min = 0.15;
}


/**
 * 
 * @param {string} floor 
 * @param {string} so_called_floor 
 * @param {DrawMapData} data 
 * @param {boolean} [interaction] 
 * @returns {Promise<void>}
 */
async function changeFloor(floor, so_called_floor, data, interaction){
    /**@ts-ignore @type {HTMLElement} */
    const fselector = document.getElementById("#place-selector".slice(1));
    /**@ts-ignore @type {HTMLCanvasElement} */
    const loadingf = await startLoad(TEXTS[LANGUAGE].LOADING_MAP, void 0, interaction);


    overlay_modes.fselector.opened = false;
    CURRENT_FLOOR = floor;

    legalRatioCap();

    const data_size = {
        width: data.tile_width*(data.xrange+1),
        height: data.tile_height*(data.yrange+1)
    };
    

    MAPDATA[CURRENT_FLOOR] = setSpareImage(data);

    setParam(ParamName.FLOOR, CURRENT_FLOOR);
    setPlaceSelColor();

    return new Promise(async (resolve, reject) => {
        readyMap(data, { over: "", under: so_called_floor }, function(){
            const mapd = {
                width: (data.xrange+1)*data.tile_width,
                height: (data.yrange+1)*data.tile_height
            };
            const zr_cands = [document.body.clientWidth/mapd.width, document.body.clientHeight/mapd.height];
            
            backcanvas.canvas.coords = { x: 0, y: 0 };
            
            zoomRatio = Math.min(...zr_cands);
            moveMapAssistingNegative({ left: 0, top: 0 });
            clearMapObjects();
            showDigitsOnFloor(floor, mapObjectComponent);
            showGoodOrgs();
            setBehavParam();
            setCoordsOnMiddle({x: ((data.xrange+1)*data.tile_width)/2, y: ((data.yrange+1)*data.tile_height)/2 }, void 0, true);
            
            endLoad(TEXTS[LANGUAGE].MAP_LOADED, 0).then(resolve);
        });
    });
}
