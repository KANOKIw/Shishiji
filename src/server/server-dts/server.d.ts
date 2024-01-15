import { mapObj } from "../../assets/shishiji-dts/objects";


interface mapObjComponent {
    [key: string]: mapObj
}

interface tr {
    title: string
    content: string
}

export {
    mapObj as mapObject,
    mapObjComponent
}
