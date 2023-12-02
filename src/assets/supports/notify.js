//@ts-check
"use strict";


/**
 * 
 * @param {string} html 
 * @param {number} term 
 *      millisecond
 * @param {string} discriminator
 * @param {boolean} [do_not_keep] 
 */
function notifyHTML(html, term, discriminator, do_not_keep){
    const $notifier = $("#--yd-notifier");
    
    
    if (Notifier.notifying && Notifier.current == discriminator && !do_not_keep)
        return;

    Notifier.current = discriminator;

    clearTimeout(Notifier.Timeout);
    clearTimeout(Notifier._Timeout);
    clearTimeout(Notifier.__Timeout);
    
    if (Notifier.notifying){
        closeNotifier(!!0);
        Notifier._Timeout = setTimeout(() => {
            doOpen();
        }, 75);
        return;
    }

    function doOpen(){
        $("#--ott-us")
        .html(html);
        $notifier
        .show()
        .removeClass("hpipe")
        .addClass("vpopen");
    
        Notifier.notifying = !0;
    
        Notifier.Timeout = setTimeout(() => {
            closeNotifier(!0);
        }, term);
    }
    doOpen();
}


/**
 * 
 * @param {boolean} setclosed 
 */
function closeNotifier(setclosed){
    clearTimeout(Notifier.__Timeout);
    $("#--yd-notifier")
    .removeClass("vpopen")
    .addClass("hpipe");
    if (setclosed)
        Notifier.notifying = !!0;
    Notifier.__Timeout = setTimeout(() => {
        $("#--ott-us").empty();
        $("#--yd-notifier").hide();
        Notifier.current = "";
    }, 70);
}
