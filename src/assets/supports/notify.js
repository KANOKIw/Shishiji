//@ts-check
"use strict";


/**
 * @typedef {import("../shishiji-dts/objects").NoticeComponent} NoticeComponent
 */


class Notifier{
    /**@type {NoticeComponent[]} */
    static pending_notices = [];
    /**
     * 
     * @param {string} html 
     * @param {number} term 
     *      millisecond
     * @param {string} discriminator
     * @param {boolean} [do_not_keep] 
     *      default: false
     * @param {boolean} [user_uncloseable]
     *      default: false 
     * @param {boolean} [_ispendingf] 
     */
    static notifyHTML(html, term, discriminator, do_not_keep, user_uncloseable, _ispendingf){
        const $notifier = $("#--yd-notifier");
        
        
        if (Notifier_prop.notifying && Notifier_prop.current == discriminator && !do_not_keep)
            return;

        if (html.endsWith(".</div>") || html.endsWith("!</div>"))
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
                doOpen.apply(this, [user_uncloseable]);
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
            }
        
            Notifier_prop.notifying = !0;
        
            Notifier_prop.Timeout = setTimeout(() => {
                this.closeNotifier(true);
            }, term);
        }

        doOpen.apply(this, [user_uncloseable]);
    }


    /**
     * 
     * @param {boolean} [keep_discriminator] 
     */
    static closeNotifier(keep_discriminator){
        clearTimeout(Notifier_prop.__Timeout);
        $("#--yd-notifier")
        .removeClass("vpopen")
        .addClass("hpipe");
        
        this._remove_closeOnInter();

        Notifier_prop.notifying = !!0;
        Notifier_prop.__Timeout = setTimeout(() => {
            $("#--ott-us").empty();
            $("#--yd-notifier").hide();
            if (!keep_discriminator)
                Notifier_prop.current = "";
            if (this.pending_notices.length > 0){
                const arg = this.pending_notices[0];
                this.notifyHTML(arg.html, arg.term, arg.discriminator, arg.do_not_keep, arg.user_uncloseable, true);
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
        
        $notifier.on("touchstart mousedown", this._interClose);
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
