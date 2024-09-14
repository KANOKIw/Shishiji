//@ts-check
"use strict";


!function(){
    /**@ts-ignore @type {HTMLElement} */
    const fselector = document.getElementById("#place-selector".slice(1));

    
    $("#place-options").children().each(function(index, elm){
        if (!this.textContent)
            return;
        const text = this.getAttribute("floor") || "";
        const so_called = this.textContent.replace(/ /g, "");
        if (text.length < 1)
            return;
        

        /**@this {HTMLElement} @param {string} name */
        function addListener(name){
            this.addEventListener("click", function(e){
                e.preventDefault();
                const data = MAPDATA[name];
                
                if (CURRENT_FLOOR === name || data === undefined)
                    return;

                changeFloor(name, so_called, data);
            });
            return 0;
        };

        addListener.apply(this, [text])
    });

    $(fselector)
    .on("click", function(e){
        e.preventDefault();
        if (e.target?.classList.contains("fselector-btn") || e.target?.id == "psdummy"){
            toggleFeslOn.apply($(fselector), [overlay_modes.fselector.opened]);
            overlay_modes.fselector.opened = !overlay_modes.fselector.opened;
        }
    });
    
    return 0;
}();
