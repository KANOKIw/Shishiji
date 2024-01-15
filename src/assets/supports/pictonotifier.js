//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/supports").NotifierArgs} NotifierArgs
 * @typedef {import("../shishiji-dts/supports").Pictograms} Pictograms
 * @typedef {import("../shishiji-dts/supports").PictoNotifierOptions} PictoNotifierOptions
 */


/**
 * Notify message with pictogram like
 * @requires {@linkcode GPATH}
 * @extends Notifier
 */
const PictoNotifier = class PictoNotifier extends Notifier{
    static tagName = "shishiji-yd-notifier-cd";
    static baseComponent = `<${this.tagName} id="{id}" class="protected flxxt" style="font-size:12px;">{svg}<span>{message}</span></${this.tagName}>`
    static _tagName = "picton-icon-svg";
    static _images = [
        "info",
        "link",
        "no-wifi",
        "success",
        "warn",
        "error",
        "save",
        "input",
        "school",
        "zoom",
    ];
    static _imagepath = "/resources/svg/{name}.svg";


    /**
     * 
     * @param {keyof Pictograms} pictogram 
     * @param {string} html 
     * @param {PictoNotifierOptions} [options]
     */
    static notify(pictogram, html, options){
        var svg = "";
        var converter = (a, b) => { return ""; };
        
        switch (pictogram){
            default:
                break;
            case "info":
                !svg ? svg = GPATH.INFO : void 0;
            case "link":
                !svg ? svg = GPATH.LINK : void 0;
            case "no-wifi":
                !svg ? svg = GPATH.NO_WiFi : void 0;
            converter = this._cpylinnot;
            break;
            case "success":
                !svg ? svg = GPATH.SUCCESS : void 0;
            case "warn":
                !svg ? svg = GPATH.WARN : void 0;
            converter = this._shrf;
            break;
            case "error":
                !svg ? svg = GPATH.ERROR : void 0;
            converter = this._shrnf;
            break;
            case "save":
            case "input":
            converter = this._shrf;
            break;
            case "zoom":
            converter = this._shref;
            break;
        }

        if (svg)
            html = converter.call(this, svg, html);
        else 
            html = this._useImg(pictogram, html, converter);

        if (options?.addToPending)
            this.appendPending.call(Notifier, { html: html, options: options });
        else
            this.notifyHTML(html, options);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyInfo(...args){
        args[0] = this._cpylinnot(GPATH.INFO, args[0]);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifySuccess(...args){
        args[0] = this._shrf(GPATH.SUCCESS, args[0]);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyError(...args){
        args[0] = this._shrnf(GPATH.ERROR, args[0]);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyLink(...args){
        args[0] = this._cpylinnot(GPATH.LINK, args[0]);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyNoWiFi(...args){
        args[0] = this._cpylinnot(GPATH.NO_WiFi, args[0]);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyWarn(...args){
        args[0] = this._shrf(GPATH.WARN, args[0]);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifySave(...args){
        args[0] = args[0] = this._useImg("save", args[0], this._shrf);; 
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyInput(...args){
        args[0] = this._useImg("input", args[0], this._shrf);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifyZoom(...args){
        args[0] = this._useImg("zoom", args[0], this._shref);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {string} name 
     */
    static _getImg(name){
        const pis = document.querySelector(PictoNotifier._tagName.concat(`[name="${name}"]`)) || this._appendPisElement(name, this._imagepath.replace("{name}", name));
        const img = pis.children[0];

        return img.cloneNode(true);
    }
    /**
     * 
     * @param {string} name 
     * @param {string} src 
     */
    static _appendPisElement(name, src){
        const parent = document.createElement(PictoNotifier._tagName);
        const elem = document.createElement("img");

        elem.src = src;
        elem.loading = "eager";
        parent.appendChild(elem);
        parent.classList.add("shy");
        parent.setAttribute("name", name);
        document.body.appendChild(parent);
        return parent;
    }
    /**
     * 
     * @param {string} id 
     * @param {string} svg 
     * @param {string} message 
     */
    static _getComponent(id, svg, message){
        return this.baseComponent
            .replace("{id}", id)
            .replace("{svg}", svg)
            .replace("{message}", message);
    }
    /**
     * 
     * @param {string} svg 
     * @param {string} message 
     */
    static _cpylinnot(svg, message){
        return this._getComponent("cpy-lin-not", svg, message);
    }
    /**
     * 
     * @param {string} svg 
     * @param {string} message 
     */
    static _shrf(svg, message){
        return this._getComponent("shr-f", svg, message);
    }
    /**
     * 
     * @param {string} svg 
     * @param {string} message 
     */
    static _shrnf(svg, message){
        return this._getComponent("shr-notf", svg, message);
    }
    /**
     * 
     * @param {string} svg 
     * @param {string} message 
     */
    static _shref(svg, message){
        return this._getComponent("shr-exf", svg, message);
    }
    /**
     * 
     * @param {string} name 
     * @param {string} message 
     * @param {(a: string, b: string) => string} html_maker 
     */
    static _useImg(name, message, html_maker){
        const img = this._getImg(name);
        const div = document.createElement("div");

        div.innerHTML = html_maker.call(this, "", message);
        div.children[0].prepend(img);
        return div.innerHTML;
    }
}


window.addEventListener("DOMContentLoaded", function(){
    const images = PictoNotifier._images;

    for (const name of images){
        const src = PictoNotifier._imagepath.replace("{name}", name);
        PictoNotifier._appendPisElement(name, src);
    }
});
