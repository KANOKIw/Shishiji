//@ts-check
"use strict";


!function(){
    /**@ts-ignore @type {HTMLElement} */
    const fselector = document.getElementById("place-selector");
    /**@ts-ignore @type {HTMLCanvasElement} */
    const canvas = document.getElementById("shishiji-canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    var openned = !!0;

    $("#place-options").children().each(function(index, elm){
        if (!this.textContent)
            return;
        const text = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
        if (text.length < 1)
            return;

        function addListener(name){
            this.addEventListener("click", function(){
                const data = MAPDATA[name];
                if (CURRENT_FLOOR === name || data === undefined)
                    return;

                toggleFeslOn.apply($(fselector), [!0]);
                startLoad();

                backcanvas.width = data.tile_width*(data.xrange+1);
                backcanvas.height = data.tile_height*(data.yrange+1);
                drawMap(canvas, ctx, data, function(){
                    backcanvas.canvas.coords = {
                        x: 0,
                        y: 0
                    };
                    zoomRatio = 0.5;
                    moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
                    clearObj();
                    showDigitsOnFloor(name, mapObjectComponent);
                    endLoad();
                });
                CURRENT_FLOOR = name;
                setPlaceSelColor();
            });
            return 0;
        };

        addListener.apply(this, [text])
    });
    $(fselector)
    .on("click", function(e){
        toggleFeslOn.apply($(fselector), [openned]);
        openned = !openned;
    });
    return 0;
}();

