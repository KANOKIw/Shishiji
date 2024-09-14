export interface Position extends Array<number | null> {
    0: number | null;
    1: number | null;
    map: (a: (b: number | null) => void) => any;
    some: (c: (d: number | null) => boolean) => boolean;
}

export interface NonnullPosition extends Array<number> {
    0: number;
    1: number;
    map: (e: (f: number) => void) => any;
    some: (g: (h: number) => boolean) => boolean;
}

export interface Coords {
    x: number;
    y: number;
}

export interface Distance extends Coords {
    distance: number;
}

export interface touchInfo {
    touches: Coords[];
    middle: NonnullPosition;
    real: Touch[];
    cross: NonnullPosition;
    zoom: boolean;
    jorl? : TouchEvent[];
    pretend?: TouchType[];
    match?: TouchType[];
}

export interface SourcePlace extends Coords{
    floor: string;
}

export interface MoveData {
    top: number;
    left: number;
}

export interface ListenOnEndOptions {
    forceLeft?: boolean;
    arg1?: ()=>any;
    arg2?: ()=>any;
}

export interface RotationInfo {
    rotated: Radian;
    origin: NonnullPosition;
}


export type Radian = number;
export type Degree = number;



declare var pointerPosition: Position;
declare var cursorPosition: Position;


declare var previousTouchDistance: Distance;
declare var prevTouches: TouchList;


// any rotation (RADIAN) & info
declare var rotatedThisTime: Radian;
declare var totalRotateThisTime: Radian;
declare var pastRotateMin: boolean;



declare function formatString(str: string, ...args: any[]): string;
declare function map_children(): HTMLCanvasElement[][];
declare function map_children(horizontal, vertical): HTMLCanvasElement;


export interface CanvasAttrs {
    coords: Coords;
    width: number;
    height: number;
    rotation: Radian;
}
  

export interface BackCanvas extends HTMLCanvasElement {
    canvas: CanvasAttrs;
}


declare const backcanvas: BackCanvas;
declare const bctx: CanvasRenderingContext2D;


export { }
