interface Position {
    0: number | null,
    1: number | null,
    map: Array.map<number>
}


// assign when interacted
declare var pointerPosition: Position;
declare var cursorPosition: Position;


interface CanvasDict {
    [key: string]: any;
}
  
interface BackCanvas {
    canvas: CanvasDict;
}


declare const backcanvas: BackCanvas;

export {
    BackCanvas,
    Position
}
