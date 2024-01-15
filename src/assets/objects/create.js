//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").mapObjElement} mapObjectElement
 * @typedef {import("../shishiji-dts/objects").mapObj} mapObject
 */


/**
 * use /scripts/coords.py to find coordinate
 * @param {mapObject} objectData 
 */
function putMobjonMap(objectData){
    /**@ts-ignore @type {HTMLElement} */
    const viewer = document.getElementById(cssName.view);
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById(cssName.ovv);
    const behavior = objectData.object.type.behavior;
    const orgname = objectData.discriminator;
    var zIndex = 1001;
    
    const objectCoords_fromCanvas = {
        x: (objectData.object.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
        y: (objectData.object.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
    };
    var styles = "";
    var attrs = "";
    var classes = "";
    var dfcursor = "pointer";
    const obj_id = formatString(objectIdFormat, orgname);
    const pathConverter = getPathConverter(objectData);
    const iconsrc = pathConverter(orgname, objectData.object.images.icon);


    switch (behavior){
        case "dynamic":
            classes += "popups realshadow ";
            break;
        default:
        case "static":
            zIndex = 999;
            classes += "mapObj_static";
            if (!objectData.object.type.border)
                styles += "border: none; border-radius: 0; background-color: transparent;";
            if (!objectData.article){
                styles += "cursor: default; pointer-events: none;";
                dfcursor = "default";
            }
            break;
    }



    const element_outerHTML = `
        <div id="${obj_id}" class="mpob centeral" style="top: ${objectCoords_fromCanvas.y}px; left: ${objectCoords_fromCanvas.x}px; z-index: ${zIndex};"
            coords="${objectData.object.coordinate.x} ${objectData.object.coordinate.y}"
            behavior="${objectData.object.type.behavior}"
            dfsize="${objectData.object.size.width} ${objectData.object.size.height}">
            <div class="canvas_interactive mpobmctx ${classes}" style="background-image:url('${iconsrc}');
min-width:${objectData.object.size.width}px;min-height:${objectData.object.size.height}px;max-width:${objectData.object.size.width}px;max-height:${objectData.object.size.height}px;${styles}" dfcs="${dfcursor}">
            </div>
        </div>
    `;
    const mObject = new MapObject(objectData);
    mObject.drawSelf(backcanvas);
    $(viewer).append(element_outerHTML)
    const el = $(viewer).children()[$(viewer).children().length - 1];
    if (objectData.article){
        listenInterOnEnd(el, function(e){
            const eventDetails = objectData;
            
            raiseOverview();
            writeArticleOverview(eventDetails, true);

            setParam(ParamName.ARTICLE_ID, objectData.discriminator);
            setBehavParam();
        }, { forceLeft: true });
    }
}


function clearObj(){
    $(".mpob").remove();
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
            putMobjonMap(objects[y]);
        }
    }
}
