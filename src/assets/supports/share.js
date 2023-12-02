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
 * @param {boolean} [ERROR] 
 */
function openSharePopup(ovvOptions, share_url, share_data, from_where, message, ERROR){
    Popup.popupContent(`<div class="realshadow protected" id="ppupds"><div class="mx-text-center flxxt">${Symbol_Span.loadgingsymbol}</div></div>`);
    share_url = decodeURIComponent(share_url);
    /**@param {string} [ctx]  */
    function onerr(ctx){
        if (ctx === void 0) ctx = ERROR_HTML.CONNECTION_ERROR;
        const _html = `<div class="realshadow protected" id="ppupds"><div class="mx-text-center flxxt"><h4>${ctx}</h4></div></div>`
        Popup.popupContent(_html);
    }
    
    $.ajax({
        url: "/resources/html-ctx/share.html",
        method: "GET",
        timeout: 30000,
        dataType: "html",
    }).done(t => {
        if (Popup.popupping){
            Popup.popupContent(t, function(){
                const shareURL = share_url.includes("?") ? `${share_url}&${ParamNames.URL_FROM}=${from_where}` : `${share_url}?${ParamNames.URL_FROM}=${from_where}`;

                if (ERROR){
                    onerr();
                    return;
                }

                $("#ppc-title").text(ovvOptions.title);
                if (ovvOptions.subtitle)
                    $("#ppc-subtitle").text(ovvOptions.subtitle);

                if (window.navigator.share){
                    share_data.text = share_data.text?.replace("{__SHARE_URL__}", shareURL);
                    !function(sd){
                        $("#share-nav").on("click", async function(){
                            await window.navigator.share(sd);
                        });
                        return 0;
                    }(share_data);
                } else {
                    $("#nav-share").remove();
                }
                $("#share-copy").on("click", function(){
                    window.navigator.clipboard.writeText(shareURL);
                    notifyHTML(
                        `<div id="cpy-lin-not" class="flxxt">${GPATH.LINK}${TEXT[LANGUAGE].NOTIFICATION_COPIED_LINK}</div>`,
                        2500,
                        "copy artshare",
                    );
                });
                
                message = encodeURIComponent(message);
                const here = encodeURIComponent(shareURL);
                const baseText = `%0A%0A${message}%0A${here}`;

            
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
                            href = `https://mail.google.com/mail/?view=cm&body=${baseText}`;
                            break;
                        case "mail":
                            href = `mailto:?body=${baseText}`;
                            break;
                        case "sms":
                            href = `sms:?body=${baseText}`;
                            break;
                        case "whatsapp":
                            href = `https://api.whatsapp.com/send?text=${baseText}`;
                            break;
                        default:
                            continue;
                    }
    
                    !function(_href){
                        $ch.on("click", function(){
                            window.open(_href, "_blank");
                        });
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
            });
        }
    })
    .catch(() => { onerr(); });
}
