//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").mapObjElement} mapObjectElement
 * @typedef {import("../shishiji-dts/objects").mapObject} mapObject
 */


/**
 * use /scripts/coords.py to find coordinate
 * @param {mapObject} objectData 
 */
function putObjOnMap(objectData){
    /**@ts-ignore @type {HTMLElement} */
    const viewer = document.getElementById("shishiji-view");
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    const behavior = objectData.object.type.behavior;
    var zIndex = 1001;

    const objectCoords_fromCanvas = {
        x: (objectData.object.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
        y: (objectData.object.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
    };
    var styles = "";
    var attrs = "";
    var classes = "";
    var dfcursor = "pointer";

    switch (behavior){
        case "dynamic":
            classes += "popups shadowedObj "
            break;
        default:
        case "static":
            zIndex = 999;
            classes += "mapObj_static"
            if (!objectData.object.type.border)
                styles += "border: none; border-radius: 0; background-color: transparent;"
            if (!objectData.article){
                styles += "cursor: default;";
                dfcursor = "default";
            }
            break;
    }



    const element_outerHTML = `
        <div class="mapObj mapObj_centerAlign" style="top: ${objectCoords_fromCanvas.y}px; left: ${objectCoords_fromCanvas.x}px; z-index: ${zIndex};"
            coords="${objectData.object.coordinate.x} ${objectData.object.coordinate.y}"
            behavior="${objectData.object.type.behavior}"
            dfsize="${objectData.object.size.width} ${objectData.object.size.height}">
            <div class="canvas_interactive mapObj_mainctx ${classes}" style="background-image: url('${objectData.object.images.icon}');
                min-width: ${objectData.object.size.width}px;
                min-height: ${objectData.object.size.height}px;
                max-width: ${objectData.object.size.width}px;
                max-height: ${objectData.object.size.height}px; ${styles}" dfcs="${dfcursor}">

            </div>
        </div>
    `;

    $(viewer).append(element_outerHTML)
    const el = $(viewer).children()[$(viewer).children().length - 1];
    if (objectData.article){
        $(el).on("touchstart mousedown", function(event){
            var moved = !!0;
            function ch(){
                moved = !0;
            }
            function rm(){
                if (!moved){
                    raiseOverview();
                    writeOverview(eventDetails, true);
                }
                $(this).off("touchmove mousemove", ch);
                $(this).off("touchend mouseup", rm);
            }
            $(el).on("touchmove mousemove", ch);
            $(el).on("touchend mouseup", rm);
            const eventDetails = objectData;
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
        });
    }
}


function clearObj(){
    $(".mapObj").remove();
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
function grayScaledCanvas(canvas){
    /**@ts-ignore @type {CanvasRenderingContext2D}*/
    var ctx = canvas.getContext("2d");
        
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
    /**@ts-ignore @type {ImageData}*/
    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    var data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4){
        data[i] *= 0.75;
        data[i + 1] *= 0.75;
        data[i + 2] *= 0.75;
    }
    
    ctx.putImageData(imageData, 0, 0);
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
function normalCanvas(canvas){
    /**@ts-ignore @type {CanvasRenderingContext2D}*/
    var ctx = canvas.getContext("2d");
        
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
    /**@ts-ignore @type {ImageData}*/
    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    var data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4){
        data[i] /= 0.75;
        data[i + 1] /= 0.75;
        data[i + 2] /= 0.75;
    }
    
    ctx.putImageData(imageData, 0, 0);
}


/**
 * 
 * @param {string} currentfloor 
 * @param {mapObjComponent} objects 
 */
function showDigitsOnFloor(currentfloor, objects){
    for (const y in objects){
        if (objects[y].object.floor == currentfloor){
            putObjOnMap(objects[y]);
        }
    }
}
