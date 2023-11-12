//@ts-check
"use strict";


/**
 * @typedef {import("./shishiji-dts/objects").mapObj} mapObject
 */


/**
 * use /scripts/coords.py to find coordinate
 */
function putObjOnMap(){
    /**@ts-ignore @type {HTMLElement} */
    const viewer = document.getElementById("shishiji-view");
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");

    /**@parameter */
    const obj = {
        "type": "volunteer",
        "coordinate": {
            x: 803,
            y: 564
        },
        "title": "甘城なつき",
        "core_grade": "4年生",
        "article": "【企画紹介】<br>私が死ぬ前にここにデーモシス国歴史史上最悪の出来事である「人魔大戦」についてここに記そうと思う。\n私は今、死の危機に瀕しているのだ。\nこれを受け取ってほしい...",
        "theme_color": "green",
        "schedule": {
            "10:00": "お客さん入場",
            "12:00": "営業停止"
        },
        "crowd_status": {
            "level": 40,
            "estimated": 12,
        },
        "imageURL": {
            "icon": "https://cdn.discordapp.com/attachments/1080464875869970463/1173159179716931614/zi---w.png",
            "header": "https://cdn.discordapp.com/attachments/1080464875869970463/1173248966528344074/daradara.png"
        },
        "font_family": "",
        "custom_tr": [
            {
                "title": "ただいまのスペシャル武器",
                "content": "弓"
            },
            {
                "title": "そうかのき",
                "content": "インフルエンザ"
            },
        ]
    };

    const objectCoords_fromCanvas = {
        x: (obj.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
        y: (obj.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
    };

    const element_outerHTML = `
        <div class="mapObj" style="top: ${objectCoords_fromCanvas.y}px; left: ${objectCoords_fromCanvas.x}px; display: flex; align-items: center;
            justify-content: center; width: 0; height: 0; position: absolute;"
            coords="${obj.coordinate.x} ${obj.coordinate.y}"
        >
            <div class="canvas_interactive" style="border: solid 2px white; border-radius: 5px; min-width: 60px; min-height: 60px; max-width: 60px; max-height: 60px;
                background-image: url('${obj.imageURL.icon}');
                background-size: 100%;
                background-repeat: no-repeat;"
            >

            </div>
        </div>
    `;

    $(viewer).prepend(element_outerHTML)
    const el = $(viewer).children()[0];
    $(el).on("touchend click", function(event){
        $("#overview-close").on("click", reduceOverview);
        const eventDetails = obj;
        /**@ts-ignore @type {HTMLCanvasElement} */
        const canvas = document.getElementById("shishiji-canvas");

        raiseOverview();
        writeOverview(eventDetails);
    });
}


function raiseOverview(){
    clearInterval(Intervals.raise);
    clearInterval(Intervals.reduce);
    /**@ts-ignore @type {HTMLElement} */
    const overview = document.getElementById("shishiji-overview");
    var he = 100;
    //@ts-ignore
    Intervals.raise = setInterval(function(){
        overview.style.top = he+"vh";
        he -= 1.25;
        if (he < 0)
            clearInterval(Intervals.raise);
    }, 5);
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
        if (he > 100)
            clearInterval(Intervals.reduce);
        he += 3;
    }, 5);
}


function writeOverview(details){
    /**@ts-ignore @type {HTMLElement} */
    const ctx = document.getElementById("overview-context");
    const color = (details.theme_color) ? details.theme_color : "black";
    const font = (details.font_family) ? details.font_family : "";

    var custom_tr = "";

    for (var tr of details.custom_tr){
        if (tr.title && tr.content)
            custom_tr += `
                <tr class="ev_property">
                    <th class="ev_property_cell">
                        ${tr.title}
                    </th>
                    <th class="ev_property_cell">
                        ${tr.content}
                    </th>
                </tr>
            `;
    }
    
    $("#shishiji-overview").css("border-top", "solid 10px "+color);
    $("#shishiji-overview").css("font-family", font);

    $(ctx).html(`
        <div style="position: absolute; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
            <h3>読み込んでいます...</h3>
        </div>
    `);

    $(ctx).html(`
        <img src="${details.imageURL.header}" style="width: 100vw">
        <div style="display: flex; align-items: center; margin: 15px;">
            <img src="${details.imageURL.icon}" style="width: 48px">
            <h1 id="ctx-title" style="margin: 5px">${details.title}</h1>
        </div>
        <div id="ctx-article" style="margin: 10px;">
            <h2>セタガクエスト</h2>
            <div class="ev_property" style="color: green; font-weight: bold; margin: 20px;">
                <p>▷中心学年: ${details.core_grade}</p>
            </div>
            ${minecraft_formattingSystem(details.article.replace("\n", "<br>"))}
            <hr style="margin-top: 20px;">
            <div class="ev_property">
                <table style="width: 100%;">
                    <tbody>
                        <tr class="ev_property">
                            <th class="ev_property_cell">
                                開催場所
                            </th>
                            <th class="ev_property_cell">
                                3年E組
                            </th>
                        </tr>
                        <tr class="ev_property">
                            <th class="ev_property_cell">
                                時間
                            </th>
                            <th class="ev_property_cell">
                                9:00 ~ 17:00
                            </th>
                        </tr>
                        ${custom_tr}
                        <tr class="ev_property">
                            <th class="ev_property_cell">
                                予想待ち時間
                            </th>
                            <th class="ev_property_cell">
                                ${details.crowd_status.estimated}分
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div class="crowded_lim">
                    <p style="font-weight: bold; margin: 10px; margin-top: 0; margin-bottom: 5px;">
                        混み具合
                    </p>
                    <div class="crowded_deg_bar"></div>
                    <div id="crowed_pointer">
                        <span class="material-symbols-outlined"
                            style="position: absolute; left: ${details.crowd_status.level}%; margin-top: 5px;"
                        >
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
        /**@ts-ignore @type {mapObject} */
        const mapObj = _mapObj;
        const coords = getCoords(mapObj);

        const objectCoords_fromCanvas = {
            x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
        };

        mapObj.style.top = objectCoords_fromCanvas.y+"px";
        mapObj.style.left = objectCoords_fromCanvas.x+"px";
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
