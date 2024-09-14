//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/supports").RaidNotifierEvent} RaidNotifierEvent
 * @typedef {import("../shishiji-dts/supports").RaidNotifierOptions} RaidNotifierOptions
 * @typedef {import("../shishiji-dts/supports").RaidNoticeComponent} RaidNoticeComponent
 * @typedef {import("../shishiji-dts/supports").PendingNoticeComponent} RaidPendingNoticeComponent
 * @typedef {import("../shishiji-dts/supports").RaidNotifierArgs} RaidNotifierArgs
 */


const RaidNotifier = class RaidNotifier{
    /**
     * @type {RaidNoticeComponent[]} 
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
    static _pray = false;
    static currentClickListener = () => {};


    /**
     * 
     * @param {RaidNotifierEvent} rev 
     *      some unique id
     * @param {RaidNotifierOptions} [options]
     */
    static notifyHTML(rev, options){
        this._invoke.call(RaidNotifier, [ rev, options ], false);
    }


    static get current(){
        return this._prop.current;
    }


    static get isNotifying(){
        return document.getElementById("raid--yd-notifier")?.classList.contains("vpopen");
    }


    /**
     * 
     * @param  {[RaidNotifierArgs, boolean?]} args 
     */
    static _invoke(...args){
        const nargs = args[0];
        var details = nargs[0].event_details, options = nargs[1], term = options?.duration,
            discriminator = options?.discriminator, _ispendingf = args[1];
        
        const $notifier = $("#raid--yd-notifier");
        var eventTarget = getMapObjectData(nargs[0].discriminator);

        term ??= 3000;
        discriminator ??= Random.string(10);
        
        this._prop.current = discriminator;
    
        clearTimeout(this._prop.Timeout);
        clearTimeout(this._prop._Timeout);
        clearTimeout(this._prop.__Timeout);
        
        if (this._prop.notifying){
            this.closeNotifier(true);
            this._prop._Timeout = setTimeout(() => {
                doOpen.apply(this, [options?.deny_userclose]);
            }, 105);
            return;
        }
    

        /**
         * @this {any}
         * @param {boolean} cant_close 
         */
        function doOpen(cant_close){
            if (eventTarget == null || nargs[0].no_relation){
                $("#aaGWUIJO").text(nargs[0].discriminator);
                $("#AuSAJIg").attr("src", nargs[0].image_src || "");
            } else {
                const _eventTarget = eventTarget;
                function _oks(){
                    setParam(ParamName.ARTICLE_ID, _eventTarget.discriminator);
                    raiseOverview();
                    writeArticleOverview(_eventTarget, true, void 0, void 0, void 0, true);
                };
                $("#aaGWUIJO").text(eventTarget?.article?.title || "");
                $("#AuSAJIg")
                .attr("src", toOrgFilepath(eventTarget.discriminator, eventTarget.object.images.icon));
                $("#raid--yd-notifier").off("click", this.currentClickListener);
                $("#raid--yd-notifier").on("click", _oks);
                this.currentClickListener = _oks;
            }
            $("#auijsmjmg").text(nargs[0].time);
            $("#asGUOt").html(details);
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
        $("#raid--yd-notifier")
        .removeClass("--path-through")
        .removeClass("vpopen")
        .addClass("hpipe");
        
        this._removeCloseonInter();
        this._prop.notifying = false;
        this._prop.__Timeout = setTimeout(() => {
            $("#raid--yd-notifier").hide();
            if (!keep_discriminator)
                this._prop.current = "";
            if (RaidNotifier._pending_notices.length > 0)
                this._invoke_pending();
        }, 101);
    }


    /**
     * 
     * @param {PendingNoticeComponent} arg 
     */
    static appendPending(arg){
        RaidNotifier._pending_notices.push(arg);
        if (!this.isNotifying)
            this._invoke_pending();
    }


    static clearPengings(){
        RaidNotifier._pending_notices = [];
    }


    static _invoke_pending(){
        const arg = RaidNotifier._pending_notices[0];
        this._invoke.call(RaidNotifier, [ arg.html, arg.options ], true);
        RaidNotifier._pending_notices.shift();
    }


    static _add_closeOnInter(){
        const yfr = $("#raid--yd-notifier");
        
        yfr
        .removeClass("--path-through");
        //.on("touchstart mousedown", this._interClose);
        if (!this._pray){
            listenUpSwipe(document.getElementById("raid--yd-notifier") || HTMLElement.prototype, this._interClose);
            this._pray = true;
        }
    }


    static _removeCloseonInter(){
        const yfr = $("#raid--yd-notifier");
        
        //yfr.off("touchstart mousedown", this._interClose);
    }


    /**
     * 
     * @param {Event | JQuery.Event} e 
     */
    static _interClose(e){
        RaidNotifier.closeNotifier();
    }
}


//@ts-ignore
window.RaidNotifier = RaidNotifier;
