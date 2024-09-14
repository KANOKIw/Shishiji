//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").mapObjElement} mapObjectElement
 * @typedef {import("../shishiji-dts/objects").MapObject} mapObject
 */


/**
 * use /scripts/coords.py to find coordinate
 * @param {mapObject} objectData 
 */
async function putMobjonMap(objectData){
    /**@ts-ignore @type {HTMLElement} */
    const viewer = document.getElementById("shishiji-view");
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    const behavior = objectData.object.type.behavior;
    const orgname = objectData.discriminator;
    var zIndex = 1001;
    
    const objectCoords_fromCanvas = {
        x: (objectData.object.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
        y: (objectData.object.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
    };
    
    var styles = "";
    var classes = "";
    var dfcursor = "pointer";
    const obj_id = formatString(objectIdFormat, orgname);
    const pathConverter = getPathConverter(objectData);
    const iconsrc = pathConverter(orgname, objectData.object.images.icon);
    const date = new Date();
    const today = date.getDay();
    const DAY = today <= 15 ? 1 : 2;


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
            if (!objectData.article && !objectData.object.open_screen){
                styles += "cursor: default; pointer-events: none;";
                dfcursor = "default";
            }
            break;
    }


    if (objectData.object.open_screen){
        classes += "aiughW ";
    }


    const gt = { df: "", st: "" };
    
    gt.df = `dfsize="${objectData.object.size.width} ${objectData.object.size.height}"`;
    gt.st = `min-width:${objectData.object.size.width}px;min-height:${objectData.object.size.height}px;max-width:${objectData.object.size.width}px;max-height:${objectData.object.size.height}px;`

    const element_outerHTML = `
        <div id="${obj_id}" class="mpob centeral" style="transform: translate(${objectCoords_fromCanvas.x}px, ${objectCoords_fromCanvas.y}px); z-index: ${zIndex};${objectData.object.day && objectData.object.day != DAY ? "display:none" : ""}"
            coords="${objectData.object.coordinate.x} ${objectData.object.coordinate.y}"
            behavior="${objectData.object.type.behavior}"
            ${gt.df}>
            <div class="flxxt ${behavior == "dynamic" ? "interrealface" : ""} canvas_interactive mpobmctx ${classes}" style="${gt.st}${styles}" dfcs="${dfcursor}">
                <div class="ashuW" style="background-image:url('${iconsrc}')"></div>
            </div>
        </div>`;

    $(viewer).append(element_outerHTML);
    objectData.article ? setObjectCrowdStatus(objectData.discriminator, objectData.article.crowd_status) : void 0;
    //setObjectVenue(objectData.discriminator, objectData.article.venue);
    const el = $(viewer).children()[$(viewer).children().length - 1];
    
    if (objectData.article){
        listenInterOnEnd(el,
        /** @param {JQuery.jqXHR} articleajax */
        function(e, articleajax){
            const eventDetails = objectData;

            this.children[0].classList.add("ADSHIiuhbgnajsyu");

            OverView.reduceCoro.push(() => this.children[0].classList.remove("ADSHIiuhbgnajsyu"));
            raiseOverview();
            writeArticleOverview(eventDetails, true);

            setParam(ParamName.ARTICLE_ID, objectData.discriminator);
            setBehavParam();

            pointerVelocity.v =  pointerVelocity.x =  pointerVelocity.y = 0;
        }, {
            forceLeft: true,
            arg1: function(){
                return void 0;
            }
        });
    } else if(objectData.object.open_screen){
        listenInterOnEnd(el, function(){
            if (objectData.object.open_screen == "drink_screen"){
                openDrinkScreen(objectData.discriminator);
            } else {
                openPkGoScreen(objectData.object.open_screen || "");
            }
        });
    }
}


function clearMapObjects(){
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
    updatePositions();
    drawPoints();
}


function resetObjectsDecorations(){
    Object.keys(mapObjectComponent).forEach(t => setObjectNormal(t));
}


function showClearedOrgs(){
    resetObjectsDecorations();
    for (const orgname of LOGIN_DATA.data.completed_orgs){
        setObjectCleared(orgname);
    }
}


function showFavoritedOrgs(){
    resetObjectsDecorations();
    for (const orgname of LOGIN_DATA.data.favorited_orgs){
        setObjectFavorite(orgname);
    }
}


function showGoodOrgs(){
    resetObjectsDecorations();
    for (const orgname of LOGIN_DATA.data.completed_orgs){
        setObjectCleared(orgname);
    }
    for (const orgname of LOGIN_DATA.data.favorited_orgs){
        setObjectFavorite(orgname);
    }
}

