interface mapObjElement extends Element {
    coords: string,
    style: {[key: string]: any;}
}

interface mapObject {
    article: {
        title: string,
        core_grade: string,
        theme_color: #ff00ff,
        content: string,
        crowd_status: {
            level: number,
            estimated: number,
        },
        font_family: string | null,
        custom_tr: tr[],
        images: {
            header: string,
        },
        venue: string,
        schedule: string,
    },
    object: {
        type: {
            event: string,
            behavior: "dynamic" | "static",
            border?: string
        },
        coordinate: {
            x: number,
            y: number
        },
        images: {
            icon: string,
        },
        size: {
            width: number,
            height: number
        },
    }
}


interface mapObjComponent {
    [key: string]: mapObject
}


export {
    mapObj,
    mapObject,
    mapObjComponent,
    mapObjElement
}
