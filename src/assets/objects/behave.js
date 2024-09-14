//@ts-check
"use strict";


/**
 * 
 * @param {mapObjectElement} mapobj 
 */
function isOutofBounds(mapobj){
    const hello = $($(mapobj).children()[0]);
    const transform = window.getComputedStyle(mapobj).transform;
    const values = transform.match(/matrix\((.+)\)/)?.[1]?.split(", ");
    const whereIs = {
        x: parseFloat(values?.[4] || "0"),
        y: parseFloat(values?.[5] || "0")
    };
    const size = {
        width: parseFloat(hello.css("min-width")?.replace("px", "")),
        height: parseFloat(hello.css("min-height")?.replace("px", ""))
    };
    if (
        whereIs.x + size.width/2 < 0 || whereIs.x - size.width/2 > window.innerWidth
        ||
        whereIs.y + size.height/2 < 0 || whereIs.y - size.height/2 > window.innerHeight
    ) return true;
}


function updatePositions(){
    for (const _mapObj of document.getElementsByClassName("mpob")){
        /**@ts-ignore @type {mapObjectElement} */
        const mapObj = _mapObj;
        const outOfBounds = { prev: mapObj.getAttribute("prout"), now: false };
        const coords = getCoords(mapObj);
        var transforms = "";
        const objPosition = {
            x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
        };

        var behavior = getBehavior(mapObj);
        const dfsize = getDefaultSize(mapObj);

        var size = Object.create(dfsize);

        if (behavior == "dynamic"){
            if (zoomRatio > MOVEPROPERTY.object.dynamic_to_static.over) behavior = "dynatic";
            if (zoomRatio < MOVEPROPERTY.object.dynamic_to_static.under) behavior = "_dynatic";
        }
        
        switch (behavior){
            case "static":
                size.width = dfsize.width*zoomRatio;
                size.height = dfsize.height*zoomRatio;
                break;
            /**
             * これ重いマジ
             */
            case "dynatic":
                size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                break;
            case "_dynatic":
                break;
                size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
                size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
                break;
            case "dynamic":
                size.width = dfsize.width;
                size.height = dfsize.height;
                break;
        }
        
        transforms += `translate(${objPosition.x}px, ${objPosition.y}px)`;

        if (
            (objPosition.x + size.width < 0 || objPosition.x - size.width > window.innerWidth
            ||
            objPosition.y + size.height < 0 || objPosition.y - size.height > window.innerHeight)
        ){
            if (outOfBounds.prev) continue;
            else mapObj.setAttribute("prout", "true");
        }  else if(outOfBounds.prev){
            mapObj.removeAttribute("prout");
        }
        
        mapObj.style.transform = transforms;
        
        $($(mapObj).children()[0])
            .css("min-width", size.width+"px")
            .css("min-height", size.height+"px");
            //.css("max-width", size.width+"px")
            //.css("max-height", size.height+"px");
    }
}


function drawPoints(){
    const curpoints = mapPointComponent[CURRENT_FLOOR] || [];

    for (const point of curpoints){
        drawText(point.coords, point.name);
    }
}


/**
 * 
 * @param {string} disc 
 * @returns {HTMLElement | null}
 */
function getObject(disc){
    const k = document.getElementById(formatString(objectIdFormat, disc));
    return k ? k : null;
}


/**
 * 
 * @param {string} discriminator 
 * @param {string} message 
 */
function setObjectMessageAbove(discriminator, message){
    const obje = getObject(discriminator);
}


/**
 * 
 * @param {string} discriminator 
 */
function setObjectCleared(discriminator){
    const obje = getObject(discriminator);
    
    if (obje){
        const ch = obje.children[0];
        ch.classList.add("mpob-clerdd");
        ch.classList.remove("_", "favoritE");
        ch.classList.add("cleareD");

        //ch.querySelectorAll(".Hjasgia").forEach(e => e.remove());
        //$(ch).prepend(`<div class="Hjasgia"><K></K><R></R></div>`);
    }
}


/**
 * @param {string} discriminator
 * @param {number} status 
 */
function setObjectCrowdStatus(discriminator, status){
    const obje = getObject(discriminator);

    if (status == 0) status = 1;

    if (obje){
        const ch = obje.children[0];

        if (ch.querySelectorAll(`.crowds-${status}`).length > 0) return;
        ch.querySelectorAll(".AUIHVP").forEach(t => t.remove());
        $(ch).prepend(`<div class="AUIHVP kpls"><span class="crowds-${status}"></span></div>`);
    }
}


/**
 * @deprecated closed my Ito Koyo (who proposed this)
 * @param {string} discriminator
 * @param {string} venue 
 */
function setObjectVenue(discriminator, venue){
    const obje = getObject(discriminator);

    if (obje){
        const ch = obje.children[0];

        if (ch.querySelectorAll(".NJIvua").length > 0) return;
        $(ch).prepend(`<div class="NJIvua kpls"><span>${venue}</span></div>`);
    }
}


/**
 * 
 * @param {string} discriminator 
 */
function setObjectFavorite(discriminator){
    const obje = getObject(discriminator);
    
    if (obje){
        const ch = obje.children[0];

        if (ch.querySelectorAll(".AIGbbvwG").length > 0) return;
        $(ch).prepend(`<div class="AIGbbvwG kpls"><span></span></div>`);
    }
}


/**
 * 
 * @param {string} discriminator 
 */
function setObjectNormal(discriminator){
    const obje = getObject(discriminator);
    
    if (obje){
        const ch = obje.children[0];
        ch.classList.remove("favoritE", "cleareD");
        ch.classList.add("_");
    }
}


function setClearedRate(){
    const rat = Math.ceil((LOGIN_DATA.data.completed_orgs.length/completable)*100);
    var col = "";
    var good = false;

    if (rat == 100){
        col = "#4CAF50";
    } else if (rat >= 75){
        col = "#C0CA33";
    } else if (rat >= 50){
        col = "#FDD835";
    } else if (rat >= 25){
        col = "#F4511E";
    } else if (rat >= 0){
        col = "#E53935";
    }

    if (LOGIN_DATA.data.completed_orgs.length >= 13){
        good = true;
        col = "#4CAF50";
        $("#oive_r")
        .css("width", "340px")
        .css("height", "60px")
        .css("top", "calc(100dvh - 70px)");
        $("#oive_h")
        .css("padding", "0 10px");
        $("#auyGAWW")
        .text(`2階職員室前の面談室5 へおこしください！ペンを贈呈致します ${rat}% (${LOGIN_DATA.data.completed_orgs.length}/${completable})`);
    } else {
        $("#auyGAWW")
        .css("color", col)
        .text(`${rat}% (${LOGIN_DATA.data.completed_orgs.length}/${completable})`);
    }
}


/**
 * 
 * @param {mapObject | SourcePlace} place 
 */
function revealOnMap(place){console.log(place)
    const approach_id = Random.string(8);
    const floor = place["object"]?.["floor"] ?? place["floor"];

    approach_beings.length = 0;
    approach_beings.push(approach_id);
    MOVEPROPERTY.deny = true;

    
    function doApproach(){
        const ittanZR = 0.25;
        const destzr = ZOOMRATIO_ON_SHARE;
        const duration = 3000/5;
        const currentMiddle = toBackCanvasCoords([window.innerWidth/2, window.innerHeight/2]);
        const each = {
            zoom1: (ittanZR < zoomRatio) ? (ittanZR - zoomRatio)/(duration/3) : 0,
            zoom2: (destzr - ittanZR)/(duration/3),
            pos: {
                x: ((place["object"]?.["coordinate"]?.["x"] ?? place["x"]) - currentMiddle.x)/(duration*(2/3)),
                y: ((place["object"]?.["coordinate"]?.["y"] ?? place["y"]) - currentMiddle.y)/(duration*(2/3)),
            }
        }
        var s = 0;

        function approach(){
            s++;
            if (s > duration){
                setBehavParam();
                MOVEPROPERTY.deny = false;
                return;
            }
            if (s < duration/3)
                zoomRatio += each.zoom1;
            if (s > duration*(3-1)/3)
                zoomRatio += each.zoom2;
            if (s < duration*(2/3)){
                currentMiddle.x += each.pos.x;
                currentMiddle.y += each.pos.y;
            }
            setCoordsOnMiddle(currentMiddle, zoomRatio);
            approach_beings.includes(approach_id) ? setTimeout(approach, 5) : void 0;
        }

        approach();
    }

    if (CURRENT_FLOOR == (place["object"]?.["floor"] ?? place["floor"])){
        doApproach();
    } else {
        const data = MAPDATA[floor];
        changeFloor(floor, floor, data)
        .then(doApproach);
    }
}
