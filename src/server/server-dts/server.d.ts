import { MapObject } from "../../assets/shishiji-dts/objects";


interface MapObjectComponent {
    [key: string]: MapObject;
}

interface MapObjectArticleComponent{
    [key: string]: string;
}

interface tr {
    title: string;
    content: string;
}

interface DBColumn {
    idx: number;
}

interface WSbranchResponseBase {
    processType: string;
    [key: string]: any;
}


export {
    DBColumn,
    MapObject,
    MapObjectComponent,
    WSbranchResponseBase,
    MapObjectArticleComponent
}
