//@ts-check
"use strict";


/**
 * 
 * @param {{ title: string, subtitle?: string }} ovvOptions 
 * @param {string} share_url 
 * @param {ShareData} share_data 
 *      share_data.text?.replace("{__SHARE_URL__}", finalShareURL<decoded>);
 * @param {string} from_where 
 * @param {string} message 
 * @param {{labelkey: string, url: string}} [change_option] 
 * @param {boolean} [ERROR] 
 */
function openSharePopup(ovvOptions, share_url, share_data, from_where, message, change_option, ERROR){
    Popup.startLoad();
    share_url = decodeURIComponent(share_url);
    /**@param {string} [ctx]  */
    function onerr(ctx){
        if (ctx === void 0) ctx = TEXT[LANGUAGE].ERROR_ANY;
        Notifier.notifyHTML(
            `<div id="shr-notf" class="flxxt" style="font-size: 12px;">${GPATH.ERROR}${TEXT[LANGUAGE].NOTIFICATION_ERROR_ANY}</div>`,
            2500,
            "sharePopup connection error",
            !0,
        );
        if (Popup.popupping)
            Popup.showasError(ctx);
    }

    /**
     * 
     * @param {string} url 
     * @param {string} pn 
     * @param {string} pv 
     */
    function adp(url, pn, pv){
        return url.includes("?") ? `${url}&${pn}=${pv}` : `${url}?${pn}=${pv}`;
    }
    
    $.ajax({
        url: "/resources/html-ctx/share.html",
        method: "GET",
        timeout: 30000,
        dataType: "html",
    }).done(t => {
        if (Popup.popupping){
            Popup.popupContent(t, function(){
                const shareURL = adp(share_url, ParamNames.URL_FROM, from_where);
                var fch = [];
                var _fchp = {share: () => {}, copy: () => {}};

                if (ERROR){
                    onerr();
                    return;
                }

                $("#ppc-title").text(ovvOptions.title);
                if (ovvOptions.subtitle)
                    $("#ppc-subtitle").text(ovvOptions.subtitle);

                /**
                 * 
                 * @param {string} [url] 
                 */
                function shareShare(url){
                    if (window.navigator.share){
                        share_data.text = share_data.text?.replace("{__SHARE_URL__}", url || shareURL);
                        !function(sd){
                            async function T(){
                                await window.navigator.share(sd);
                            }
                            $("#share-nav").off("click", _fchp.share).on("click", T);
                            _fchp.share = T;
                            return 0;
                        }(share_data);
                    } else {
                        $("#nav-share").remove();
                    }
                }

                shareShare();


                /**
                 * 
                 * @param {string} [url] 
                 */
                function copyShare(url){

                    function T(){
                        window.navigator.clipboard.writeText(url || shareURL);
                        Notifier.notifyHTML(
                            `<div id="cpy-lin-not" class="flxxt">${GPATH.LINK}${TEXT[LANGUAGE].NOTIFICATION_COPIED_LINK}</div>`,
                            2500,
                            "copy artshare",
                        );
                    }
                    $("#share-copy").off("click", _fchp.copy).on("click", T);

                    _fchp.copy = T;
                }

                copyShare();


                if (change_option){
                    $("#includeScr").text(TEXT[LANGUAGE][change_option.labelkey]);
                    $("#includeScrCh").on("change", function(e){
                        //@ts-ignore
                        if (this.checked){
                            for (var i = 0; i < document.getElementsByClassName("share_ebtn").length; i++){
                                $(document.getElementsByClassName("share_ebtn")[i]).off("click", fch[i]);
                            }
                            const upp = adp(change_option.url, ParamNames.URL_FROM, from_where);
                            setShareLink(upp);
                            shareShare(upp);
                            copyShare(upp);
                        } else {
                            setShareLink();
                            shareShare();
                            copyShare();
                        }
                    });
                } else {
                    $("#includeScrCh").remove();
                }
                
                message = encodeURIComponent(message);


                /**
                 * @param {string} [share_url] 
                 */
                function setShareLink(share_url){
                    const here = encodeURIComponent(share_url || shareURL);
                    const baseText = `${message}%0A${here}`;
                    fch = [];
                    for (const ch of document.getElementsByClassName("share_ebtn")){
                        const appname = ch.id.replace("share-", "");
                        const $ch = $(ch);
                        var href = "";
                        
                        switch (appname){
                            case "line":
                                href = `http://line.me/R/msg/text/?${baseText}`;
                                break;
                            case "twitter":
                                href = `https://x.com/intent/tweet?url=${here}&text=%0A%0A${message}%0A${encodeURIComponent("#獅子児祭 @shishijifes")}%0A&related=shishiji`;
                                break;
                            case "facebook":
                                href = `http://www.facebook.com/share.php?u=${here}`;
                                break;
                            case "gmail":
                                $("#share-gmail").parent().parent().remove();
                                href = `https://mail.google.com/mail/?view=cm&body=%0A%0A${baseText}`;
                                break;
                            case "mail":
                                href = `mailto:?body=%0A%0A${baseText}`;
                                break;
                            case "sms":
                                href = `sms:?body=%0A%0A${baseText}`;
                                break;
                            case "whatsapp":
                                href = `https://api.whatsapp.com/send?text=${baseText}`;
                                break;
                            default:
                                continue;
                        }
        
                        !function(_href){
                            function lopp(){
                                window.open(_href, "_blank");
                            }
                            $ch.on("click", lopp);
                            fch.push(lopp);
                            return 0;
                        }(href);
                    }
    
                    /**except japanese */
                    function translate(){
                        $("#--share-bru").text("Share");
                        $("#--trans-MAIL").text("Email");
                        $("#--trans-MESSAGE").text("Messages");
                        $("#--trans-COPYLINK").text("Copy Link");
                        $("#--trans-OTHERS").text("Others");
                    }
                    if (LANGUAGE != "JA")
                        translate();
                }

                setShareLink();
            });
        }
    })
    .catch(() => { onerr(); });
}
