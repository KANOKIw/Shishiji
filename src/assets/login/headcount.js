//@ts-check
"use strict";


function letSetHeadcount(){
    var doin = false;

    return new Promise(resolve => {
        openPkGoScreen("headcount_screen");

        function hisDone(){
            const headcount = Number($("#headcount_select").val());
            const generation = Number($("#generation_select").val()) || null;
            const gender = Number($("#gender_select").val()) || null;
            const pdata = structuredClone(LOGIN_DATA.data.custom_data);

            pdata["headcount"] = headcount;
            generation ? pdata["generation"] = generation : 0;
            gender ? pdata["gender"] = gender : 0;
    
            if (doin) return;

            doin = true;

            intoLoad("ehadcount", "middle");
            
            $.post(ajaxpath.setcustom, { customs: JSON.stringify(pdata) })
            .then(function(){
                LOGIN_DATA.data.custom_data = structuredClone(pdata);
                PictoNotifier.notifySuccess(TEXTS[LANGUAGE].THANKS_FOR_COOPERATING);
                document.getElementById("setupheadcount")?.removeEventListener("click", hisDone);
                closePkGoScreen("headcount_screen");
                resolve(void 0);
            })
            .catch(() => {
                PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
                doin = false;
            })
            .always(() => outofLoad("ehadcount", "middle"));
        }
    
    
        document.getElementById("setupheadcount")?.addEventListener("click", hisDone);
    });
}
