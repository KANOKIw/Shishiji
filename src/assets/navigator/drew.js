//@ts-check
"use strict";


/**
 * 
 * @param {Coords} from 
 * @param {Coords} to 
 */
function drawLine(from, to){
    const relpos_from = toCanvasPos(from),
        relpos_to = toCanvasPos(to);

    shishiji_ctx.beginPath();
    shishiji_ctx.lineWidth = (20)*zoomRatio;
    shishiji_ctx.strokeStyle = "#009dff";
    shishiji_ctx.moveTo(relpos_from[0], relpos_from[1]);
    shishiji_ctx.lineTo(relpos_to[0], relpos_to[1]);
    shishiji_ctx.stroke();
    shishiji_ctx.closePath();
}


/**
 * 
 * @param {Coords} coords 
 * @param {string} text 
 */
function drawText(coords, text){
    const pos = toCanvasPos(coords);
    const width = shishiji_ctx.measureText(text).width;
    
    pos[0] -= width/2;
    pos[1] += 8;

    shishiji_ctx.textBaseline = "alphabetic";
    shishiji_ctx.font = "16px Calligraphed";
    shishiji_ctx.fillStyle = "#ffffff";
    shishiji_ctx.fillText(text, pos[0], pos[1]);
}
