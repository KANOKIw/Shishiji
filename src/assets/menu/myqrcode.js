//@ts-check
"use strict";


function openMyqrcodeScreen(){
    openPkGoScreen("myqrcode_screen");
    $("#myqrcode").attr("src", "");

    $.post(ajaxpath.mqr)
    .then(dataurl => {
        const blob_ = dataURLtoBlob(dataurl);
        $("#myqrcode").attr("src", URL.createObjectURL(blob_));
    })
    .catch(err => {
        PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_LOADING_QRCODE);
    });
}
