//@ts-check
"use strict";


/**
 * 
 * @param {Event} e 
 */
function preventDefault(e){
    e.preventDefault();
}


window.addEventListener("gesturestart", preventDefault, { passive: false });

window.addEventListener("dblclick", preventDefault, { passive: false });

window.addEventListener("wheel", function(e){
    // Revoke chrome zoom
    if (e.ctrlKey || e.metaKey)
        e.preventDefault();
}, { passive: false });
