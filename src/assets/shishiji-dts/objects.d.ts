export interface DrawMapData {
    tile_width: number;
    tile_height: number;
    xrange: number;
    yrange: number;
    format: string;
}

export interface mapObjElement extends Element {
    coords: string;
    style: { [key: string]: any; };
}

type ArticleLike = {
    title: string;
    core_grade: string;
    theme_color: #ff00ff;
    content: string;
    crowd_status: {
        level: number;
        estimated: number;
    };
    font_family: string | null;
    custom_tr: tr[];
    images: {
        header: string;
    };
    venue: string;
    schedule: string;
};

export interface Sizes {
    width: number;
    height: number;
}

type ObjectLike = {
    type: {
        event: string;
        behavior: "dynamic" | "static";
        border?: string;
    };
    coordinate: {
        x: number;
        y: number;
    };
    images: {
        icon: string;
    };
    size: Sizes;
    floor: string;
};

export interface mapObj {
    article: ArticleLike;
    object: ObjectLike;
    discriminator: string;
}

export interface mapObjComponent {
    [key: string]: mapObj;
}

export interface Intervals {
    /**LIE */
    [key: string]: NodeJS.Timeout;
}

export interface LanguageComponent {
    [key: string]: { [key: string]: string };
}


export { }
