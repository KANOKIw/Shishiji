//@ts-check
"use strict";


!function(){
    /**@ts-ignore @type {HTMLElement} */
    const fselector = document.getElementById("place-selector");
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    $("#place-options").children().each(function(index, elm){
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

                startLoad(TEXT[LANGUAGE].LOADING_MAP);
                toggleFeslOn.apply($(fselector), [!0]);
                overlay_modes.fselector.opened = !!0;

                const data_size = {
                    width: data.tile_width*(data.xrange+1),
                    height: data.tile_height*(data.yrange+1)
                };
                backcanvas.width = data_size.width;
                backcanvas.height = data_size.height;
                drawMap(canvas, ctx, data, function(){
                    backcanvas.canvas.coords = {
                        x: 0,
                        y: 0
                    };
                    zoomRatio = 1;
                    moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
                    clearObj();
                    showDigitsOnFloor(name, mapObjectComponent);
                    endLoad(TEXT[LANGUAGE].MAP_LOADED);
                });
                CURRENT_FLOOR = name;
                setParam(ParamNames.FLOOR, CURRENT_FLOOR);
                setPlaceSelColor();
            }, { passive: false });
            return 0;
        };

        addListener.apply(this, [text])
    });
    $(fselector)
    .on("click", function(e){
        if (e.target.classList.contains("fselector-btn") || e.target.id == "psdummy"){
            toggleFeslOn.apply($(fselector), [overlay_modes.fselector.opened]);
            overlay_modes.fselector.opened = !overlay_modes.fselector.opened;
        }
    });
    return 0;
}();
