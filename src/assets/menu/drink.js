//@ts-check
"use strict";


/**
 * 
 * @param {string} [only_disc] 
 */
function openDrinkScreen(only_disc){
    openPkGoScreen("drink_screen");
    $(".drinking").removeClass("uihsadW");
    $(".drinkings").scrollTop(0);
    if (only_disc){
        const g = document.getElementById(`drank-${only_disc}`);
        const top = (g?.offsetTop || 0) - window.innerHeight/2 + 100 + (g?.clientHeight || 0)/2;
        $(".drinkings").scrollTop(top);
        g?.classList.add("uihsadW");
    }
}


+function(){
    Array.from(document.querySelectorAll(".drink-real > img"))
    .forEach(function(me){
        me.addEventListener("click", function(){
            //@ts-ignore
            Popup.popupMedia(me.getAttribute("src") || "", "img", me.cloneNode());
        });
    });
}();
