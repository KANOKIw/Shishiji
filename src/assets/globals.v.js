window.DRAGGING = 0;
window.pointerPosition = [ null, null ];
window.zoomRatio = 1;
window.cursorPosition = [];
window.backcanvas = document.createElement("canvas");
window.bctx = backcanvas.getContext("2d");

window.backcanvas.canvas = {
    coords: [0, 0]
};

window.MOVEPROPATY = {
    scroll: 1.1,
    caps: {
        ratio: {
            max: Infinity,
            min: NaN,
        },
    },
};

window.pointerVelocity = {x: 0, y: 0, v: 0, a: -20, method: null};
window.frictInterval = null;
