//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").NotifierArgs} NotifierArgs
 */


/**
 * Notify message with pictogram like
 * methods ends with "_" is using <img>
 * @requires {@linkcode GPATH}
 * @extends Notifier ???
 */
class PictoNotifier extends Notifier{
    static _images = { 
        "save": "/resources/svg/save.svg",
        "input": "/resources/svg/input.svg",
        "school": "/resources/svg/school.svg",
    };
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyInfo(...args){
        args[0] = `<div id="cpy-lin-not" class="protected flxxt">${GPATH.INFO}${args[0]}</div>`;
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifySuccess(...args){
        args[0] = `<div id="shr-f" class="flxxt" style="font-size: 12px;">${GPATH.SUCCESS}${args[0]}</div>`;
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyError(...args){
        args[0] = `<div id="shr-notf" class="flxxt" style="font-size:12px;">${GPATH.ERROR}${args[0]}</div>`;
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyLink(...args){
        args[0] = `<div id="cpy-lin-not" class="flxxt">${GPATH.LINK}${args[0]}</div>`;
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyNoWiFi(...args){
        args[0] = `<div id="cpy-lin-not" class="flxxt">${GPATH.NO_WiFi}${args[0]}</div>`;
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyWarn(...args){
        args[0] = `<div id="shr-f" class="flxxt" style="font-size: 12px;">${GPATH.CAUTION}${args[0]}</div>`;
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifySave_(...args){
        const img = this._getImg("save");
        const div = document.createElement("div");

        div.innerHTML = `<div id="shr-f" class="flxxt" style="font-size: 12px;"><span>${args[0]}</span></div>`;
        div.children[0].prepend(img);
        args[0] = div.innerHTML; 
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyInput_(...args){
        const img = this._getImg("input");
        const div = document.createElement("div");

        div.innerHTML = `<div id="shr-f" class="flxxt" style="font-size: 12px;"><span>${args[0]}</span></div>`;
        div.children[0].prepend(img);
        args[0] = div.innerHTML; 
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {string} name 
     */
    static _getImg(name){
        const pis = document.querySelector('picto-icon-svg[name="save"]') || this._appendPisElement(name, this._images[name]);
        const img = pis.children[0];

        return img.cloneNode(true);
    }
    /**
     * 
     * @param {string} name 
     * @param {string} src 
     */
    static _appendPisElement(name, src){
        const parent = document.createElement("picto-icon-svg");
        const elem = document.createElement("img");

        elem.src = src;
        parent.appendChild(elem);
        parent.style.display = "none";
        parent.setAttribute("name", name);
        document.body.appendChild(parent);
        return parent;
    }
}


window.addEventListener("DOMContentLoaded", function(){
    const images = PictoNotifier._images;
    for (const name in images){
        const src = images[name];
        PictoNotifier._appendPisElement(name, src);
    }
});
