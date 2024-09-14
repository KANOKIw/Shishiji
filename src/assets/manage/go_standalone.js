//@ts-check
"use strict";


(function(r){
    if (
        //@ts-ignore
        !r.navigator.standalone
        &&
        !r.matchMedia("(display-mode: standalone)").matches
    ){
        // avoid duplicating with login notify
        setTimeout(() => {
            PictoNotifier.notify("warn", "このサイトをホーム画面に追加して大画面で行ってください！！", {
                addToPending: true
            });
        }, 2000);
    }
})(window);
