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
        "smile",
        "new",
        "calculating",
        "copy",
        "thanks"
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
            case "no-wifi":
                !svg ? svg = GPATH.NO_WiFi : void 0;
            case "info":
            case "link":
            converter = this._cpylinnot;
            break;
            case "success":
            case "warn":
            converter = this._shrf;
            break;
            case "error":
                !svg ? svg = GPATH.ERROR : void 0;
            converter = this._shrnf;
            break;
            case "save":
            case "input":
            case "smile":
            case "thanks":
            converter = this._shrf;
            break;
            case "zoom":
            case "new":
            case "calculating":
            converter = this._shref;
            break;
            case "copy":
            converter = this._shreRf;
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
        args[0] = this._useImg("info", args[0], this._cpylinnot);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifySuccess(...args){
        args[0] = this._useImg("success", args[0], this._shrf);
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
        args[0] = this._useImg("link", args[0], this._cpylinnot);
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
        args[0] = this._useImg("warn", args[0], this._shrf);
        this.notifyHTML(...args);
    }
    /**
     * 
     * @param {NotifierArgs} args 
     */
    static notifySave(...args){
        args[0] = this._useImg("save", args[0], this._shrf);
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
        const img = document.createElement("img");

        img.src = PictoNotifier._imagepath.replace("{name}", name);
        return img;
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
        elem.loading = "lazy";
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
     * @param {string} svg 
     * @param {string} message 
     */
    static _shreRf(svg, message){
        return this._getComponent("shr-eRxf", svg, message);
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
