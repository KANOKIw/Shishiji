//@ts-check
"use strict";


/**
 * @typedef {import("./shishiji-dts/objects").mapObjElement} mapObjectElement
 * @typedef {import("./shishiji-dts/objects").mapObject} mapObject
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

    const objectCoords_fromCanvas = {
        x: (objectData.object.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
        y: (objectData.object.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
    };
    var styles = "";
    var attrs = "";


    switch (behavior){
        case "dynamic":

            break;
        default:
        case "static":
            if (!objectData.object.type.border)
                styles += "border: none; border-radius: 0; background-color: transparent;"
            if (!objectData.article)
                styles += "cursor: default;"
            break;
    }



    const element_outerHTML = `
        <div class="mapObj mapObj_centerAlign" style="top: ${objectCoords_fromCanvas.y}px; left: ${objectCoords_fromCanvas.x}px;"
            coords="${objectData.object.coordinate.x} ${objectData.object.coordinate.y}"
            behavior="${objectData.object.type.behavior}"
            dfsize="${objectData.object.size.width} ${objectData.object.size.height}">
            <div class="canvas_interactive mapObj_mainctx" style="background-image: url('${objectData.object.images.icon}');
                min-width: ${objectData.object.size.width}px;
                min-height: ${objectData.object.size.height}px;
                max-width: ${objectData.object.size.width}px;
                max-height: ${objectData.object.size.height}px; ${styles}">

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
                    writeOverview(eventDetails);
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


function raiseOverview(){
    clearInterval(Intervals.raise);
    clearInterval(Intervals.reduce);
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    $(overview).show();
    var he = 100;
    //@ts-ignore
    Intervals.raise = setInterval(function(){
        overview.style.top = he+"vh";
        if (he < 0){
            overview.style.top = "0vh";
            clearInterval(Intervals.raise);
        }
        he -= 1.5;
    }, 5);
    $("#overview-close").on("click", reduceOverview);
}


function reduceOverview(){
    clearInterval(Intervals.raise);
    clearInterval(Intervals.reduce);
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    var he = 0;
    //@ts-ignore
    Intervals.reduce = setInterval(function(){
        overview.style.top = he+"vh";
        if (he > 100){
            /**@ts-ignore @type {HTMLElement} */
            const ctx = document.getElementById("overview-context");
            overview.style.top = "100vh";
            $(overview).hide();
            $(ctx).html(`
                <div style="position: absolute; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
                    <h3>読み込んでいます...</h3>
                </div>
            `);
            clearInterval(Intervals.reduce);
        }
        he += 4;
    }, 5);
    $("#overview-close").off("click", reduceOverview);
}


/**
 * 
 * @param {mapObject} details 
 */
function writeOverview(details){
    /**@ts-ignore @type {HTMLElement} */
    const ctx = document.getElementById("overview-context");
    /**@ts-ignore @type {HTMLElement} */
    const overview  = document.getElementById("shishiji-overview");
    const color = (details.article.theme_color) ? details.article.theme_color : "black";
    const font = (details.article.font_family) ? details.article.font_family : "";

    var article_mainctx = minecraft_formattingSystem(details.article.content.replace(/\n/g, "<br>"));

    if (article_mainctx.length < 1){
        article_mainctx = '<h4 style="width: 100%; text-align: center;">このイベントに関する記載はありません</h4>';
    }

    var custom_tr = "";

    for (var tr of details.article.custom_tr){
        if (tr.title && tr.content)
            custom_tr += `
                <tr class="ev_property">
                    <th class="ev_property_cell" aria-label="${tr.title}">
                        ${tr.title}
                    </th>
                    <th class="ev_property_cell" aria-label="${tr.content}">
                        ${tr.content}
                    </th>
                </tr>
            `;
    }

    
    overview.style.borderTop = "solid 10px "+color;
    $(overview).css("font-family", font);


    $(ctx).html(`
        <img class="article header" src="${details.article.images.header}" aria-label="ヘッダー画像">
        <div class="article titleC">
            <img src="${details.object.images.icon}" style="width: 48px" alt="アイコン">
            <h1 id="ctx-title" style="margin: 5px">${details.article.title}</h1>
        </div>
        <div id="ctx-article" style="margin: 10px;">
            <div class="ev_property" style="color: green; font-weight: bold; margin: 20px;">
                <p>▷中心学年: ${details.article.core_grade}</p>
            </div>
            ${article_mainctx}
            <hr style="margin-top: 20px;">
            <div class="ev_property">
                <table style="width: 100%;">
                    <tbody>
                        <tr class="ev_property">
                            <th class="ev_property_cell" aria-label="開催場所">
                                開催場所
                            </th>
                            <th class="ev_property_cell" aria-label="${details.article.venue}">
                                ${details.article.venue}
                            </th>
                        </tr>
                        <tr class="ev_property">
                            <th class="ev_property_cell">
                                時間
                            </th>
                            <th class="ev_property_cell">
                                ${details.article.schedule}
                            </th>
                        </tr>
                        ${custom_tr}
                        <tr class="ev_property">
                            <th class="ev_property_cell">
                                予想待ち時間
                            </th>
                            <th class="ev_property_cell" aria-label="${details.article.crowd_status.estimated}分">
                                ${details.article.crowd_status.estimated}分
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div class="crowded_lim">
                    <p style="font-weight: bold; margin: 10px; margin-top: 0; margin-bottom: 5px;" aria-label="混み具合">
                        混み具合
                    </p>
                    <div class="crowded_deg_bar"></div>
                    <div id="crowed_pointer">
                        <span class="material-symbols-outlined"
                            style="position: absolute; left: ${details.article.crowd_status.level}%; margin-top: 5px;">
                            north
                        </span>
                    </div>
                </div>
            </div>
            <hr style="margin-bottom: 20px;">
        </div>
    `);
}


function updatePositions(){
    for (var _mapObj of document.getElementsByClassName("mapObj")){
        /**@ts-ignore @type {mapObjectElement} */
        const mapObj = _mapObj;
        const coords = getCoords(mapObj);

        const objectCoords_fromCanvas = {
            x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
        };

        const behavior = getBehavior(mapObj);
        const dfsize = getDefaultSize(mapObj);

        var size = dfsize;

        switch (behavior){
            case "static":
                size.width = dfsize.width*zoomRatio;
                size.height = dfsize.height*zoomRatio;
                break;
            case "dynamic":
            default:

                break;
        }

        mapObj.style.top = objectCoords_fromCanvas.y+"px";
        mapObj.style.left = objectCoords_fromCanvas.x+"px";
        
        $($(mapObj).children()[0])
            .css("min-width", size.width+"px")
            .css("min-height", size.height+"px")
            .css("max-width", size.width+"px")
            .css("max-height", size.height+"px");
    }
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
