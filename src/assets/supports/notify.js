//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").NotifierOptions} NotifierOptions
 * @typedef {import("../shishiji-dts/objects").NoticeComponent} NoticeComponent
 */


class Notifier{
    /**
     * @type {NoticeComponent[]} 
     */
    static pending_notices = [];


    /**
     * 
     * @param {string} html 
     * @param {number} [term] 
     *      millisecond
     *      default: 3000 
     * @param {string} [discriminator]
     *      some unique id
     *      default: {html}
     * @param {NotifierOptions} [options]
     *      default: false 
     */
    static notifyHTML(html, term, discriminator, options){
        this._invoke([ html, term, discriminator, options ], false);
    }


    /**
     * 
     * @param  {[NotifierArgs, boolean?]} args 
     */
    static _invoke(...args){
        const nargs = args[0];
        var html = nargs[0], term = nargs[1], discriminator = nargs[2], options = nargs[3], _ispendingf = args[1];
        
        const $notifier = $("#--yd-notifier");
        const te = document.createTextNode(html).textContent;

        if (typeof term === "undefined")
            term = 3000;
        if (typeof discriminator === "undefined")
            discriminator = html;
        
        if (Notifier_prop.notifying && Notifier_prop.current == discriminator && !options?.do_not_keep)
            return;

        if (te?.endsWith(".") || te?.endsWith("!") || te?.endsWith("?"))
            html += "&nbsp;";
       
        if (!_ispendingf)
            this.clearPengings();
    
        Notifier_prop.current = discriminator;
    
        clearTimeout(Notifier_prop.Timeout);
        clearTimeout(Notifier_prop._Timeout);
        clearTimeout(Notifier_prop.__Timeout);
        
        if (Notifier_prop.notifying){
            this.closeNotifier(true);
            Notifier_prop._Timeout = setTimeout(() => {
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
        
            Notifier_prop.notifying = !0;
        
            Notifier_prop.Timeout = setTimeout(() => {
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
        clearTimeout(Notifier_prop.__Timeout);
        $("#--yd-notifier")
        .removeClass("--path-through")
        .removeClass("vpopen")
        .addClass("hpipe");
        
        this._remove_closeOnInter();

        Notifier_prop.notifying = false;
        Notifier_prop.__Timeout = setTimeout(() => {
            $("#--ott-us").empty();
            $("#--yd-notifier").hide();
            if (!keep_discriminator)
                Notifier_prop.current = "";
            if (this.pending_notices.length > 0){
                const arg = this.pending_notices[0];
                this._invoke([ arg.html, arg.term, arg.discriminator, arg.options ], true);
                this.pending_notices.shift();
            }
        }, 70);
    }


    /**
     * 
     * @param {NoticeComponent} arg 
     */
    static appendPending(arg){
        this.pending_notices.push(arg);
    }


    static clearPengings(){
        this.pending_notices = [];
    }


    static _add_closeOnInter(){
        const $notifier = $("#--yd-notifier");
        
        $notifier
        .removeClass("--path-through")
        .on("touchstart mousedown", this._interClose);
    }


    static _remove_closeOnInter(){
        const $notifier = $("#--yd-notifier");
        
        $notifier.off("touchstart mousedown", this._interClose);
    }


    /**
     * 
     * @param {Event | JQuery.Event} e 
     */
    static _interClose(e){
        e.preventDefault();
        Notifier.closeNotifier();
    }
}


//@ts-ignore
window.Notifier = Notifier;
