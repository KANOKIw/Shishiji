//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/supports").NotifierOptions} NotifierOptions
 * @typedef {import("../shishiji-dts/supports").NoticeComponent} NoticeComponent
 * @typedef {import("../shishiji-dts/supports").PendingNoticeComponent} PendingNoticeComponent
 */


const Notifier = class Notifier{
    /**
     * @type {NoticeComponent[]} 
     */
    static _pending_notices = [];
    static _prop = {
        /**@ts-ignore @type {NodeJS.Timeout} FAKE */
        Timeout: 0,
        /**@ts-ignore @type {NodeJS.Timeout} FAKE */
        _Timeout: 0,
        /**@ts-ignore @type {NodeJS.Timeout} FAKE */
        __Timeout: 0,
        current: "",
        notifying: false,
    };


    /**
     * 
     * @param {string} html 
     *      some unique id
     * @param {NotifierOptions} [options]
     */
    static notifyHTML(html, options){
        this._invoke.call(Notifier, [ html, options ], false);
    }


    static get current(){
        return this._prop.current;
    }


    static get isNotifying(){
        return document.getElementById("--yd-notifier")?.classList.contains("vpopen");
    }


    /**
     * 
     * @param  {[NotifierArgs, boolean?]} args 
     */
    static _invoke(...args){
        const nargs = args[0];
        var html = nargs[0], options = nargs[1], term = options?.duration,
            discriminator = options?.discriminator, _ispendingf = args[1];
        
        const $notifier = $("#--yd-notifier");
        const te = document.createTextNode(html).textContent;

        
        term ??= 3000;
        discriminator ??= html;
        
        if (this._prop.notifying && this._prop.current == discriminator && !options?.do_not_keep_previous)
            return;

        if (te?.endsWith(".") || te?.endsWith("!") || te?.endsWith("?"))
            html += "&nbsp;";
       
        if (!_ispendingf)
            this.clearPengings();
    
        this._prop.current = discriminator;
    
        clearTimeout(this._prop.Timeout);
        clearTimeout(this._prop._Timeout);
        clearTimeout(this._prop.__Timeout);
        
        if (this._prop.notifying){
            this.closeNotifier(true);
            this._prop._Timeout = setTimeout(() => {
                doOpen.apply(this, [options?.deny_userclose]);
            }, 75);
            return;
        }
    

        /**
         * 
         * @param {boolean} cant_close 
         */
        function doOpen(cant_close){
            $("#--ott-us")
            .html(html);
            $notifier
            .show()
            .removeClass("hpipe")
            .addClass("vpopen");

            if (!cant_close){
                this._add_closeOnInter();
            } else {
                $notifier.addClass("--path-through");
            }
        
            this._prop.notifying = true;

            if (term !== Infinity)
                this._prop.Timeout = setTimeout(() => {
                    this.closeNotifier(true);
                }, term);
        }

        doOpen.apply(this, [options?.deny_userclose]);
    }


    /**
     * 
     * @param {boolean} [keep_discriminator] 
     */
    static closeNotifier(keep_discriminator){
        clearTimeout(this._prop.__Timeout);
        $("#--yd-notifier")
        .removeClass("--path-through")
        .removeClass("vpopen")
        .addClass("hpipe");
        
        this._removeCloseonInter();
        this._prop.notifying = false;
        this._prop.__Timeout = setTimeout(() => {
            $("#--ott-us").empty();
            $("#--yd-notifier").hide();
            if (!keep_discriminator)
                this._prop.current = "";
            if (Notifier._pending_notices.length > 0)
                this._invoke_pending();
        }, 70);
    }


    /**
     * 
     * @param {PendingNoticeComponent} arg 
     */
    static appendPending(arg){
        Notifier._pending_notices.push(arg);
        if (!this.isNotifying)
            this._invoke_pending();
    }


    static clearPengings(){
        Notifier._pending_notices = [];
    }


    static _invoke_pending(){
        const arg = Notifier._pending_notices[0];
        this._invoke.call(Notifier, [ arg.html, arg.options ], true);
        Notifier._pending_notices.shift();
    }


    static _add_closeOnInter(){
        const yfr = $("#--yd-notifier");
        
        yfr
        .removeClass("--path-through")
        .on("touchstart mousedown", this._interClose);
    }


    static _removeCloseonInter(){
        const yfr = $("#--yd-notifier");
        
        yfr.off("touchstart mousedown", this._interClose);
    }


    /**
     * 
     * @param {Event | JQuery.Event} e 
     */
    static _interClose(e){
        e.preventDefault();
        Notifier.closeNotifier();
    }
};
