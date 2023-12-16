//@ts-check
"use strict";


function updatePositions(){
    for (var _mapObj of document.getElementsByClassName("mpob")){
        /**@ts-ignore @type {mapObjectElement} */
        const mapObj = _mapObj;
        const coords = getCoords(mapObj);

        const objectCoords_fromCanvas = {
            x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
        };

        var behavior = getBehavior(mapObj);
        const dfsize = getDefaultSize(mapObj);

        var size = dfsize;

        if (behavior == "dynamic"){
            if (zoomRatio > MOVEPROPERTY.object.dynamic_to_static.over) behavior = "dynatic";
            if (zoomRatio < MOVEPROPERTY.object.dynamic_to_static.under) behavior = "_dynatic";
        }

        switch (behavior){
            case "static":
                size.width = dfsize.width*zoomRatio;
                size.height = dfsize.height*zoomRatio;
                break;
            case "dynatic":
                size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                break;
            case "_dynatic":
                size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
                size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
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
