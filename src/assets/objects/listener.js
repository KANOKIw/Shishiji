//@ts-check
"use strict";


!function(){
    /**@ts-ignore @type {HTMLElement} */
    const fselector = document.getElementById(cssName.fselector.slice(1));
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById(cssName.mcvs);
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    
    $(cssName.fopt).children().each(function(index, elm){
        if (!this.textContent)
            return;
        const text = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
        if (text.length < 1)
            return;
        

        /**@this {HTMLElement} @param {string} name */
        function addListener(name){
            this.addEventListener("click", function(e){
                e.preventDefault();
                const data = MAPDATA[name];
                if (CURRENT_FLOOR === name || data === undefined){
                    return;
                }

                changeFloor(name, data);
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
