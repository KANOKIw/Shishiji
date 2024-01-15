//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").Sizes} Sizes
 */


class MapObject{
    coords;
    /**@type {Coords} */
    cvsrelCoords;
    behavior;
    sizes;
    data;
    /**@type {{x: [number, number]; y: [number, number]}} */
    interacRange;
    iconImage;


    /**
     * 
     * @param {mapObject} data 
     */
    constructor(data){
        const convert = getPathConverter(data);

        this.coords = data.object.coordinate;
        this.behavior = data.object.type.behavior;
        this.sizes = data.object.size;
        this.data = data;
        this.iconImage = new Image();

        this.iconImage.src = convert(data.discriminator, data.object.images.icon);
        this.updateCvsrelPos();
    }


    updateCvsrelPos(){
        this.cvsrelCoords = {
            x: (this.coords.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (this.coords.y - backcanvas.canvas.coords.y) * zoomRatio,
        };
        const hw = this.sizes.width/2,
            hh = this.sizes.height/2;
        this.interacRange = {
            x: [this.cvsrelCoords.x - hw, this.cvsrelCoords.x + hw],
            y: [this.cvsrelCoords.y - hh, this.cvsrelCoords.y + hh],
        };
    }


    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    drawSelf(canvas){
        const context = canvas.getContext("2d");
        const dx = this.interacRange.x[0],
            dy = this.interacRange.y[0],
            dw = this.sizes.width,
            dh = this.sizes.height;
            
        /**
         * @this MapObject
         */
        function draw(){
            context?.drawImage(this.iconImage, dx, dy, dw, dh);
        }
        if (this.iconImage.complete){
            draw.call(this);
        } else {
            this.iconImage.onload = () => draw.call(this);
        }
    }
}
