import { mapObject } from "../../assets/shishiji-dts/objects";


interface mapObjComponent {
    [key: string]: mapObject
}

interface tr {
    title: string
    content: string
}

export {
    mapObject,
    mapObjComponent
}
