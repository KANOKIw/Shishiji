//@ts-check
"use strict";


document.getElementById("manageFileb")?.addEventListener("click", function(){
    Popup.startLoad();
    
    var cloudAjax;
    const cloudwait_tm = setTimeout(() => {
        cloudAjax = $.post("/org/manage/file/list", { session: session });
        cloudAjax
        .done(_cloudok)
        .catch(_cloudfail);
    }, 500);

    function onClose(){
        if (cloudAjax)
            cloudAjax.abort();
        clearTimeout(cloudwait_tm);
        Popup.removeCloseListener(onClose);
    }
    
    Popup.addCloseListener(onClose);
});


scriptDone();
