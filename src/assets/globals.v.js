//@ts-check
"use strict";


/**
 * @typedef {import("./shishiji-dts/motion").Position} Position
 * @typedef {import("./shishiji-dts/motion").BackCanvas} BackCanvas
 * @typedef {import("./shishiji-dts/motion").Distance} Distance
 * @typedef {import("./shishiji-dts/motion").Coords} Coords
 * @typedef {import("./shishiji-dts/motion").SourcePlace} SourcePlace
 * @typedef {import("./shishiji-dts/motion").touchInfo} touchINFO
 * @typedef {import("./shishiji-dts/objects").mapObjComponent} mapObjComponent
 * @typedef {import("./shishiji-dts/objects").Intervals} Intervals
 * @typedef {import("./shishiji-dts/objects").LoginInfo} LoginInfo
 * @typedef {import("./shishiji-dts/objects").advertisementData} advertisementData
 * @typedef {import("./shishiji-dts/objects").RotationHistory} RotationHistory
 * @typedef {import("./shishiji-dts/objects").mapPointComponent} mapPointComponent_
 * @typedef {import("./shishiji-dts/supports").EventDataComponent} EventDataComponent
 * @typedef {import("./shishiji-dts/supports").SpecialMission} SpecialMission
 */


/**@type {"JA" | "EN"} */
var LANGUAGE = "JA";

/**
 * assign on interaction
 * pointerPosition: temp variable to get previous controler pos (get diff)
 * cursorPosition: current mouse cursor position (zoom origin)
 * @type {Position} */
var pointerPosition = [ null, null ];
/**@type {Position} */
var cursorPosition = [ null, null ];

/**@ts-ignore @type {HTMLCanvasElement} */
const shishiji_canvas = document.getElementById("shishiji-canvas");
/**@ts-ignore @type {CanvasRenderingContext2D} */
const shishiji_ctx = shishiji_canvas?.getContext("2d");

var DRAGGING = false;
var zoomRatio = 1;
const initial_zoomRatio = 0.65;

const FIRST_LOAD_PROPERTY = {
    login: false,
    load: false
}

const href_replaceCD = 400;

/**@type {LoginInfo} */
const LOGIN_DATA = {
    logined: false,
    sid: null,
    discriminator: null,
    /**
     * We are going down
     * @ts-ignore */
    data: {
        completed_orgs: [],
        profile: {}
    },
    pending_collects: []
};


/**@type {RotationHistory} */
const rotationHistory = [
    
];

const DPR = window.devicePixelRatio;

/**@ts-ignore @type {Promise<EventDataComponent>} */
const event_data_promise = $.post(ajaxpath.eventd);
const delay_promise = $.post(ajaxpath.alldel);
const prog_pt_promise = $.post(ajaxpath.progpt);
/**@ts-ignore @type {Promise<SpecialMission[]>} */
const special_missions_promise = $.post(ajaxpath.specmsi);
const search_adv_promise = new Promise((r) => r([1,2,3,4,5,6])) ?? $.post(ajaxpath.adv);


var firstInter = true;
"touchstart mousedown".split(" ").forEach(e => window.addEventListener(e, () => firstInter=true, {passive: true}));


const prevListener = {
    share: (...a)=>{},
    close: (...a)=>{},
    favorite: (...a)=>{},
    vote: (...a)=>{},
    evote: (...a)=>{},
    jetupdater: (...e)=>{}
};


const tour_status = {
    pkgo: false,
    article: false,
    main_screen: false
};


/**@type {Function[]} */
const LoadHandlers = [];
/**@param {Function} f */
const addLoadHandler = f => LoadHandlers.push(f);

const SCHEDULE_DELAY = {
    BAND_SCHEDULE_DELAY: NaN,
    DANCE_SCHEDULE_DELAY: NaN,
};

/**
 * @type {BackCanvas} 
 * @readonly
 *@ts-ignore*/
const backcanvas = document.createElement("canvas");
/**@ts-ignore @type {CanvasRenderingContext2D} */
const bctx = backcanvas.getContext("2d");


var completable = 26;
var searchMonument = false;


/**
 * [0] -> horizontal
 * [1] -> vertical
 * @type {HTMLCanvasElement[][]}
 */
const _map_children = [];

/**
 * @overload
 * @returns {HTMLCanvasElement[][] | void}
 */
/**
 * @overload
 * @param {number} horizontal 
 * @param {number} vertical 
 * @returns {HTMLCanvasElement | void}
 */
/**
 * @param {number} [horizontal] x?
 * @param {number} [vertical] y?
 */
const map_children = function(horizontal, vertical){
    if (typeof horizontal !== "number" || typeof vertical !== "number")
        return _map_children;
    else
        return _map_children[horizontal] ? _map_children[horizontal][vertical] : null;
}



//@ts-ignore
backcanvas.canvas = {
    coords: { 
        x: 0,
        y: 0,
    },
    rotation: 0,
};


/**
 * Restrict user map interaction and set magnification of any
 * @readonly
 */
const MOVEPROPERTY = {
    deny: false,
    scroll: 1.05,
    object: {
        /**{@link MOVEPROPERTY.caps.ratio.max} < over & {@link MOVEPROPERTY.caps.ratio.min} > under & over > under*/
        dynamic_to_static: {
            over: 1.5,
            under: 0.3,
        },
    },
    caps: {
        ratio: {
            max: 6.5,
            min: 0.15,
        },
    },
    touch: {
        /**
         * how many events to wait before start moving 
         * !high value prevents insta scrolling! (makes more likely to iPhone map tho)
         * @fix
         *   do by velocity
         */
        downCD: 1,
        zoomCD: -1,
        rotate: {
            // degree
            min: 5,
        }
    },
    arrowkeys: {
        interval: 5,
        move: 3,
        ratio: 1.005,
        nosprint: 1.5,
        nosprintratio: 1.0025,
    },
};

/**Second */
const Map_retry_cooldown = 5;
/**window href change timeout */
var WH_CHANGE_TM = 0;

/**
 * velocities are assigned with (px/sec)
 * @type {{ x: number, y: number, v: number, a: number, method: "MOUSE" | "TOUCH" | null }}
 */
var pointerVelocity = {
    x: 0, y: 0, v: 0, a: -75,
    method: null 
};

var touchZoomVelocity = {
    0: {
        x: 0,
        y: 0,
    },
    1: {
        x: 0,
        y: 0,
    },
    a: -150,
};

/**@type {NodeJS.Timeout | null} */
var frictDiscount = null;
/**@type {number | null} */
var zoomFrictInterval = null;


/**@type {Distance} */
var previousTouchDistance = { 
    x: -1, y: -1,
    distance: -1 
};
/**@type {touchINFO} */
//@ts-ignore
var prevTouchINFO = {};


/**
 * relative radian
 * assign on touch move
 * @type {Radian} 
 */
var rotatedThisTime = 0;
/**
 * rotated amount of one pitch time use to limit start of rotation
 * init once when passed min
 * @see {MOVEPROPERTY.touch.rotate.min}
 * @type {Radian}
 */
var totalRotateThisTime = 0;
/**
 * mark rotatedThisTime has been bigger than min even once
 */
var pastRotateMin = false;
/**
 * @type {Radian} 
 */
var prevTheta = 0;
/**
 * Most reliable variable so far
 * @type {Radian} 
 */
var totalRotationRad = 0;

/**
 * useful for making smooth map interaction!
 * not map moved, swiping instantly cause proble.
 * init on touch down
 */
var touchCD = 0;
var zoomCD = 0;

const crowd_status = [
    "不明",
    "すいている",
    "やや混雑",
    "混雑"
];

/**@type {Intervals} */
var Intervals = { };
/**@type {{deled: boolean | null, feels: string[]}} */
var lastFavData = { deled: null, feels: [] };

/**@type {mapObjComponent} */
var mapObjectComponent = { };
/**@type {mapPointComponent_} */
var mapPointComponent = { };

/**@type {()=>any} */
var map_reveal_func = ()=>{};

var goScreen_index = 1;
/**@type {{middle: string[],top: string[]}} */
var loadProcesses = { middle: [], top: [] };
var loadTime = 0;
var killLoad = false;
/**@type {NodeJS.Timeout} */
var loadTimeProc;

/**@type {{[key: string]: DrawMapData}} */
var MAPDATA = { };

var CURRENT_FLOOR = "";

const overlay_modes = {
    fselector: {
        opened: false,
        colors: {
            current: "",
            else: "",
        }
    },
};


const _gglsymbol = '<span class="gglmats">X</span>'
/**@enum {string} */
const gglSymbols = {
    loadging: `<span class="gglmats loading-symbol">progress_activity</span>`,
    refresh: _gglsymbol.replace("X", "refresh"),
    height: _gglsymbol.replace("X", "height"),
    zoom_in: _gglsymbol.replace("X", "zoom_in"),
    zoom_out: _gglsymbol.replace("X", "zoom_out"),
    search: _gglsymbol.replace("X", "search"),
    arrow_upward: _gglsymbol.replace("X", "arrow_upward"),
    arrow_downward: _gglsymbol.replace("X", "arrow_downward"),
};

/**
 * :literal:
 * @enum {number} 
 */
const reloadInitializeLevels = {
    DO_NOTHING: 0,
    CLOSE_ARTICLE: 1,
    INIT_ZOOMRADIO: 2,
    INIT_COORDS: 3,
    INIT_FLOOR: 4,
    DO_EVERYTHING: 5,
}

/**
 * @see {@link reloadInitializeLevels}
 */
const reloadInitializeLevel = reloadInitializeLevels.DO_NOTHING;


var fSelector_Tom = "";
var approach_beings = [ ];


// digit
const paramAbstractDeg = 4;
/**@enum {string} */
const ParamName = {
    ZOOM_RATIO: "x",
    COORDS: "@",
    ARTICLE_ID: "art",
    FLOOR: "fr",
    URL_FROM: "storm",
    LANGUAGE: "lang",
    SCROLL_POS: "scrp",
    ART_TARGET: "atg",
    LOGIN_DISCRIMINATOR: "glog",
    LOGIN_CONFIDENCE: "kry",
    JUMPTO: "jumpto"
};
/**@enum {string} */
const ParamValues = {
    FROM_ARTICLE_SHARE: "attsrh",
    FROM_NAVIGATE: "navigate",
}
const objectIdFormat = "disc-{0}";

const ZOOMRATIO_ON_SHARE = 1.5;

/**milisecond */
const WAIT_BETWEEN_EACH_MAP_IMAGE = 5;

const Ovv_tg_listener = {
    description: () => {},
    details: () => {},
    commands: () => {},
};

const profileSaveingInfo = {
    situation: {
        nickname: false,
        icon_path: false,
    },
    saving: false,
};


window.addEventListener("load", () => LoadHandlers.forEach(f => f()));
