var pointerPosition = [ null, null ];
var canvasCoordinate = [0, 0];
var zoomRatio = 1;
var cursorPosition = [];
const backcanvas = document.createElement("canvas");
const bctx = backcanvas.getContext("2d");

var zoomPropaties = {
    scroll: 1.1,
};
