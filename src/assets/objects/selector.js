//@ts-check
"use strict";


function toggleFeslOn(openned){
    if (!openned){
        this.addClass("toSel");
        $("#place-options-w")
        .show()
        .addClass("toSel");
    } else {
        this.removeClass("toSel");
        $("#place-options-w")
        .hide()
        .removeClass("toSel");
    }
}
