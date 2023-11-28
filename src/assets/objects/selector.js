//@ts-check
"use strict";


/**@type {NodeJS.Timeout} LIE*/
var lst;
function toggleFeslOn(openned){
    if (!openned){
        clearTimeout(lst);
        this.addClass("toSel popped");
        $("#place-options-w")
        .show()
        .addClass("toSel");
    } else {
        this.addClass("undoSel").removeClass("popped");
        $("#place-options-w").addClass("undoSel");
        lst = setTimeout(() => {
            this.removeClass("toSel undoSel")
            $("#place-options-w")
            .hide()
            .removeClass("toSel undoSel");
        }, 200);
    }
}
