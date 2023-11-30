interface Position extends Array {
    0: number | null,
    1: number | null,
    map: Function,
    some: Function,
}

interface NonnullPosition extends Array {
    0: number,
    1: number,
    map: Function,
    some: Function,
}

interface Coords {
    x: number,
    y: number
}

interface Distance { 
    x: number, 
    y: number, 
    distance: number 
}

interface touchINFO {
    touches: Coords[],
    middle: NonnullPosition,
    real: Touch[],
    cross: NonnullPosition,
    zoom: boolean,
    jorl? : TouchEvent[],
    pretend?: TouchType[],
    match?: TouchType[],
}


type Radian = number;
type Degree = number;



declare var pointerPosition: Position;
declare var cursorPosition: Position;


declare var previousTouchDistance: Distance;
declare var prevTouches: TouchList;


// any rotation (RADIAN) & info
declare var rotatedThisTime: Radian;
declare var totalRotateThisTime: Radian;
declare var pastRotateMin: boolean;



declare function formatString(str: string, ...args: any[]): string;


interface CanvasAttrs {
    coords: Coords,
    width: number,
    height: number,
    rotation: Radian
}
  

interface BackCanvas extends HTMLCanvasElement {
    canvas: CanvasAttrs;
}


declare const backcanvas: BackCanvas;
declare const bctx: CanvasRenderingContext2D;


export {
    BackCanvas,
    Position,
    Radian,
    Degree,
    NonnullPosition,
    Distance,
    Coords,
    touchINFO
}
