import { onTouchDown, onTouchMove, onTouchLeave } from "./touch";
import { zoomByWheel } from "./mouse";


export class ShishijiMap{
    private map_id = this._uuid();
    private map_parent: HTMLElement;
    private map_large: HTMLElement;
    private src: string;
    public resizable: boolean;


    public constructor(map_element: HTMLElement, map_src: string, user_resizable?: boolean){
        user_resizable ??= true;
        this.map_parent = map_element;
        this.src = map_src;
        this.resizable = user_resizable;
    }


    public setup(){
        this.map_parent.innerHTML = `<div class="shishijimap-large" id="${this.map_id}" style="width: 100%; height: 100%;">
            <img src="${this.src}" id="${this.map_id}_img">
        </div>`;
        this.map_large = document.getElementById(this.map_id)!;

        this.map_parent.addEventListener("touchstart", e => {
            onTouchDown(e, this.map_large);
        });

        this.map_parent.addEventListener("touchmove", e => {
            onTouchMove(e, this.map_large);
        });

        this.map_parent.addEventListener("touchend", e => {
            onTouchLeave(e, this.map_large);
        });

        this.map_parent.addEventListener("wheel", e => {
            zoomByWheel(e, document.getElementById(`${this.map_id}_img`)!, this.map_large);
        });
    }
    

    private _uuid(): string{
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            var v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
