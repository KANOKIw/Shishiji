!function(){
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("./shishiji-dts/objects").LanguageComponent} LanguageComponent
     */
    
    
    /**@type {LanguageComponent} */
    const TEXT = {
        JA: {
            LOADING_MAP: "マップを読み込んでいます...",
            MAP_LOADED: "ようこそ",
            PROCESSING: "処理中...",
            NOTIFICATION_COPIED_LINK: "リンクをコピーしました！",
            NOTIFICATION_SHARED_EVENT_FOUND: "シェアされたイベントを開きました",
            NOTIFICATION_SHARED_EVENT_NOT_FOUND: "シェアされたイベントが見つかりませんでした",
            SHARE_EVENT_MESSAGE: "世田谷学園 獅子児祭のイベント:",
            SHARE_EVENT_POPUP_TITLE: "イベントをシェア",
            SHARE_EVENT_POPUP_SUBTITLE: "共有されたリンクを開くと、マップがこのイベントを中心に移動しこの記事が開かれます",
            SHARE_EVENT_DATA_TITLE: "獅子児祭",
            ARTICLE_NO_ARTICLE: "このイベントに関する記載はありません",
            ARTICLE_CORE_GRADE: "中心学年",
            ERROR_CONNECTION: "通信エラー<br>ネットワーク状況をご確認の上、再度お試しください。",
            ARIA_ARTICLE_HEADER: "ヘッダー画像",
            ARIA_ARTICLE_ICON: "アイコン画像",
        },
        EN: {
            LOADING_MAP: "Loading map...",
            MAP_LOADED: "Welcome",
            PROCESSING: "Processing...",
            NOTIFICATION_COPIED_LINK: "Link Copied!",
            NOTIFICATION_SHARED_EVENT_FOUND: "Opened the shared event.",
            NOTIFICATION_SHARED_EVENT_NOT_FOUND: "Sorry, we couldn't find the shared event.",
            SHARE_EVENT_MESSAGE: "Shishiji festival event, Setagayagakuen; ",
            SHARE_EVENT_POPUP_TITLE: "Share Event",
            SHARE_EVENT_POPUP_SUBTITLE: "The map moves to middle focusing on this event and opens this article, when openning a shared link",
            SHARE_EVENT_DATA_TITLE: "Shishiji festival",
            ARTICLE_NO_ARTICLE: "There is no article for this event.",
            ARTICLE_CORE_GRADE: "Core Grade",
            ERROR_CONNECTION: "Connection Error<br>Please check your network status and try again.",
            ARIA_ARTICLE_HEADER: "header image",
            ARIA_ARTICLE_ICON: "icon image",
        },
    };
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("./shishiji-dts/motion").Position} Position
     * @typedef {import("./shishiji-dts/motion").BackCanvas} BackCanvas
     * @typedef {import("./shishiji-dts/motion").Distance} Distance
     * @typedef {import("./shishiji-dts/motion").Coords} Coords
     * @typedef {import("./shishiji-dts/motion").touchINFO} touchINFO
     * @typedef {import("./shishiji-dts/objects").mapObjComponent} mapObjComponent
     * @typedef {import("./shishiji-dts/objects").intervals} intervals
     * 
     * @typedef {import("socket.io").Socket} Socket
     */
    
    
    var LANGUAGE = "EN";
    
    /**
     * assign on interaction
     * pointerPosition: temp variable to get previous controler pos (get diff)
     * cursorPosition: current mouse cursor position (zoom origin)
     * @type {Position} */
    var pointerPosition = [ null, null ];
    /**@type {Position} */
    var cursorPosition = [ null, null ];
    
    
    /**@ts-ignore @type {Socket} */
    const ws = io();
    
    var DRAGGING = false;
    var zoomRatio = 1;
    
    
    /**
     * @type {BackCanvas} 
     * @readonly
     *@ts-ignore*/
    const backcanvas = document.createElement("canvas");
    /**@ts-ignore @type {CanvasRenderingContext2D} */
    const bctx = backcanvas.getContext("2d");
    
    
    //@ts-ignore
    backcanvas.canvas = {
        coords: { 
            x: 0,
            y: 0,
        },
        rotation: 0,
    };
    
    
    /**
     * limit map motion and set magnification of any
     * @readonly
     */
    const MOVEPROPERTY = {
        scroll: 1.05,
        caps: {
            ratio: {
                max: Infinity, // dev
                min: NaN, // dev
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
                min: 15,
            }
        }
    };
    
    
    /**
     * velocities are assigned with (px/sec)
     * @type {{ x: number, y: number, v: number, a: number, method: "MOUSE" | "TOUCH" | null }}
     */
    var pointerVelocity = { 
        x: 0, y: 0, v: 0, a: -100,
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
    
    /**@type {number | null} */
    var frictInterval = null;
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
     * use to make smooth map interaction.
     * not map moved, swiping instantly cause proble.
     * init on touch down
     */
    var touchCD = 0;
    var zoomCD = 0;
    
    
    /**@type {intervals} */
    var Intervals = {
        
    };
    
    
    /**@type {mapObjComponent} */
    var mapObjectComponent = {};
    
    
    var MAPDATA = {
    
    };
    
    var CURRENT_FLOOR = "";
    
    const overlay_modes = {
        fselector: {
            opened: !!0,
            colors: {
                current: "rgba(0, 100, 0, 0.699)",
                else: "rgba(188, 255, 255, 0.699)",
            }
        },
    };
    
    
    /**@enum {string} */
    const Symbol_Span = {
        loadgingsymbol: `<span class="material-symbols-outlined loading-symbol">progress_activity</span>`,
        refreshsymbol: `<span class="material-symbols-outlined">refresh</span>`,
    };
    /**@enum {string} */
    const ERROR_HTML = {
        CONNECTION_ERROR: TEXT[LANGUAGE].ERROR_CONNECTION,
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
    
    
    // digit
    const paramAbstractDeg = 4;
    /**@enum {string} */
    const ParamNames = {
        ZOOM_RATIO: "zr",
        COORDS: "at",
        ARTICLE_ID: "art",
        FLOOR: "fl",
        URL_FROM: "storm",
        LANGUAGE: "lang"
    };
    /**@enum {string} */
    const ParamValues = {
        FROM_ARTICLE_SHARE: "attsrh",
    }
    const objectIdFormat = "disc-{0}";
    
    const ZOOMRATIO_ON_SHARE = 2;
    
    
    var Notifier = {
        /**@ts-ignore @type {NodeJS.Timeout} FAKE */
        Timeout: 0,
        /**@ts-ignore @type {NodeJS.Timeout} FAKE */
        _Timeout: 0,
        /**@ts-ignore @type {NodeJS.Timeout} FAKE */
        __Timeout: 0,
        current: "",
        notifying: !!0,
    };
    
    const _mcColorList = {
        "0": "#000000",  // Black
        "1": "#0000AA",  // Dark Blue
        "2": "#00AA00",  // Dark Green
        "3": "#00AAAA",  // Dark Aqua
        "4": "#AA0000",  // Dark Red
        "5": "#AA00AA",  // Dark Purple
        "6": "#FFAA00",  // Gold
        "7": "#AAAAAA",  // Gray
        "8": "#555555",  // Dark Gray
        "9": "#5555FF",  // Blue
        "a": "#55FF55",  // Green
        "b": "#55FFFF",  // Aqua
        "c": "#FF5555",  // Red
        "d": "#FF55FF",  // Light Purple
        "e": "#FFFF55",  // Yellow
        "f": "#FFFFFF",  // White
    };
    const _mcDec = {
        "k": 'class="--mcf-obfuscated"',
        "l": 'style="font-weight: bolder;"',
        "m": 'style="text-decoration: line-through;"',
        "n": 'style="text-decoration: underline;"',
        "o": 'style="font-style: italic;"',
        "p": 'style=""',
    };
    const _mcColor = {
        BLACK: "§0",
        DARK_BLUE: "§1",
        DARK_GREEN: "§2",
        DARK_AQUA: "§3",
        DARK_RED: "§4",
        DARK_PURPLE: "§5",
        GOLD: "§6",
        GRAY: "§7",
        DARK_GRAY: "§8",
        BLUE: "§9",
        GREEN: "§a",
        AQUA: "§b",
        RED: "§c",
        LIGHT_PURPLE: "§d",
        YELLOW: "§e",
        WHITE: "§f",
        MAGIC: "§k",
        BOLD: "§l",
        STRIKETHROUGH: "§m",
        UNDERLINE: "§n",
        ITALIC: "§o",
        RESET: "§r",
    };
    
    const GPATH = {
        LINK: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="100%" viewBox="0 0 311 311" enable-background="new 0 0 311 311" xml:space="preserve">
        <path fill="rgba(0, 0, 0, 0)" opacity="1.000000" stroke="none" d=" M171.000000,312.000000   C115.333359,312.000000 60.166618,311.959625 5.000321,312.097198   C1.575440,312.105743 0.900468,311.424225 0.904463,307.999969   C1.022283,207.000168 1.022267,106.000160 0.904507,5.000339   C0.900515,1.576757 1.575329,0.900450 4.999880,0.904445   C105.999702,1.022284 206.999710,1.022256 307.999512,0.904528   C311.422791,0.900538 312.099579,1.574891 312.095581,4.999732   C311.977722,105.999550 311.977722,206.999557 312.095428,307.999359   C312.099426,311.422302 311.426880,312.109009 308.000214,312.097961   C262.500488,311.951172 217.000168,312.000000 171.000000,312.000000  z"/>
        <path fill="#4169e1" opacity="1.000000" stroke="none" d=" M212.588440,62.751225   C203.905151,61.807106 197.318359,64.825386 191.542114,70.667397   C173.146027,89.272934 154.611465,107.742149 136.053268,126.186432   C130.662643,131.543976 127.557449,137.786102 128.348419,145.417740   C128.770218,149.487381 125.725365,150.953064 123.608177,153.027985   C121.330856,155.259842 119.174591,159.867798 116.427277,158.862595   C113.518204,157.798218 113.486778,152.886185 112.890381,149.474075   C110.634079,136.565109 114.234146,125.198303 123.279854,115.974342   C142.766052,96.104149 162.411880,76.382927 182.324997,56.941437   C197.565002,42.062393 221.385269,42.463470 236.456772,57.271034   C251.419540,71.971771 252.308945,96.159264 237.592758,111.384216   C217.905685,131.751923 197.864868,151.796082 177.468582,171.452698   C166.175644,182.336105 152.354523,184.355377 137.501022,179.340317   C134.675583,178.386368 133.868240,177.296005 136.440430,175.062469   C138.072174,173.645538 139.615051,172.101028 141.037430,170.473572   C143.872650,167.229599 146.826492,165.301910 151.682220,165.693344   C157.522110,166.164124 162.672089,163.329041 166.853622,159.153671   C186.194168,139.841492 205.643143,120.635231 224.787735,101.130394   C237.990891,87.678795 231.749924,67.824394 212.588440,62.751225  z"/>
        <path fill="#4169e1" opacity="1.000000" stroke="none" d=" M125.359390,180.359985   C113.330795,192.396744 101.505661,204.137421 89.785324,215.981796   C79.940681,225.930618 79.530716,239.891037 88.669243,248.997726   C97.777161,258.073914 111.812653,257.593933 121.709610,247.737167   C140.482590,229.040421 159.169144,210.256866 177.947128,191.565155   C182.793091,186.741470 185.845337,181.129318 185.354355,174.229935   C185.114212,170.855316 186.130493,168.631439 188.465485,166.387619   C191.451920,163.517807 194.064056,160.258469 197.369263,156.574265   C202.845032,167.292648 203.189789,177.088394 199.851089,187.131454   C197.871994,193.084702 194.467590,198.173920 190.034927,202.601547   C170.818253,221.796356 151.686020,241.076416 132.376938,260.177734   C120.836800,271.593658 103.995110,274.511047 89.358406,268.032440   C74.855324,261.612915 65.525002,246.854904 66.195305,230.890778   C66.609032,221.037491 70.263245,212.376877 77.253769,205.349472   C96.761551,185.738739 116.196274,166.050919 135.974030,146.714890   C147.204605,135.735138 160.803604,133.218796 175.776215,137.693924   C179.222443,138.723923 181.039978,140.034164 177.200104,143.019241   C176.025284,143.932526 174.995834,145.060364 174.013992,146.189240   C170.686951,150.014450 167.343384,152.809952 161.436050,152.308777   C155.639404,151.817017 150.620224,155.047577 146.461792,159.252014   C139.548523,166.241776 132.563232,173.160309 125.359390,180.359985  z"/>
        </svg>`,
        X: `<div id="ppcls" class="protected"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
        <path d="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z" fill="#ffffff"></path>
        </svg></div>`,
        ERROR: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="100%" viewBox="0 0 150 150" enable-background="new 0 0 150 150" xml:space="preserve">
        <path fill="rgba(0, 0, 0, 0)" opacity="1.000000" stroke="none" d=" M91.000000,151.000000   C61.857235,151.000000 33.214314,150.958221 4.571959,151.066559   C1.799039,151.077042 0.890779,150.769745 0.900395,147.577240   C1.044349,99.784233 1.034018,51.990562 0.915765,4.197404   C0.908644,1.319584 1.631624,0.924331 4.297526,0.929724   C52.090782,1.026403 99.884331,1.024516 147.677612,0.933526   C150.291916,0.928548 151.094894,1.241225 151.087357,4.172537   C150.964233,52.132198 150.973221,100.092323 151.072662,148.052094   C151.078110,150.673111 150.330460,151.068909 147.952454,151.056152   C129.135422,150.955200 110.317589,151.000000 91.000000,151.000000  z"/>
        <path fill="#FE0510" opacity="1.000000" stroke="none" d=" M16.015171,127.594406   C15.389500,122.791283 17.365780,119.574692 20.453056,116.653770   C33.155266,104.636032 45.714687,92.466881 58.466724,80.502739   C60.807846,78.306259 61.034233,77.145973 58.545311,74.817696   C45.411064,62.531193 32.477421,50.030434 19.447935,37.631584   C17.110323,35.407112 15.048482,33.097363 14.779860,29.665586   C14.403472,24.857042 16.140718,21.108147 20.510757,18.976870   C25.255600,16.662802 29.536678,17.749695 33.302704,21.350452   C44.978779,32.514137 56.687225,43.643967 68.362610,54.808376   C76.802582,62.878979 76.785889,62.891991 85.404640,54.679249   C96.858330,43.765102 108.243118,32.777084 119.806976,21.980894   C124.489128,17.609571 130.914474,17.980312 134.985580,22.378096   C138.958405,26.669752 138.802704,32.653728 134.564240,37.221241   C133.659515,38.196201 132.649765,39.073826 131.686584,39.994411   C119.526939,51.616405 107.433807,63.309513 95.150948,74.799805   C92.679291,77.111969 92.804733,78.301476 95.195732,80.544357   C108.556068,93.077042 121.744354,105.793007 135.013336,118.423332   C138.602264,121.839523 140.081070,125.806725 138.278412,130.595840   C136.639862,134.948944 133.301636,137.184692 128.739456,137.434219   C125.197502,137.627945 122.423683,135.944504 119.899986,133.519150   C106.691513,120.825432 93.335205,108.284325 80.223328,95.492310   C77.629730,92.961967 76.252014,92.721878 73.532562,95.384254   C60.800266,107.849289 47.860424,120.103752 34.913631,132.347702   C27.748919,139.123489 19.840908,137.235489 16.015171,127.594406  z"/>
        </svg>`,
        SUCCESS: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="100%" viewBox="0 0 485 485" enable-background="new 0 0 485 485" xml:space="preserve">
        <path fill="rgba(0, 0, 0, 0)" opacity="1.000000" stroke="none" d=" M322.000000,486.000000   C214.666687,486.000000 107.833382,486.000000 1.000057,486.000000   C1.000038,324.333405 1.000038,162.666794 1.000019,1.000144   C162.666565,1.000096 324.333130,1.000096 485.999756,1.000048   C485.999847,162.666519 485.999847,324.333038 485.999939,485.999786   C431.500000,486.000000 377.000000,486.000000 322.000000,486.000000  M95.945183,221.436127   C81.252403,226.190308 66.539635,230.883881 51.873966,235.720291   C42.329674,238.867752 40.278519,248.283569 47.616798,255.143646   C54.536247,261.612152 61.663303,267.859497 68.551720,274.360229   C105.407341,309.141724 136.585922,348.139801 158.009033,394.451630   C162.943375,405.118561 174.245758,409.089966 185.479675,404.621857   C196.280319,400.326080 206.986893,395.794220 217.747314,391.396729   C231.462341,385.791809 240.598083,375.944824 245.933609,362.129852   C261.598907,321.568573 280.068604,282.364471 302.893616,245.272308   C332.278625,197.519760 368.051117,155.379913 412.188751,120.601639   C421.592957,113.191551 431.492065,106.411217 441.122345,99.285599   C445.900085,95.750450 446.072113,89.982552 441.241333,87.435913   C429.169312,81.071861 417.009583,79.324211 404.089020,85.881401   C377.042603,99.607414 351.193512,115.206116 326.722809,133.124619   C280.745331,166.791336 241.911728,207.319183 210.130966,254.580948   C202.945587,265.266479 196.375443,276.365692 189.487885,287.328949   C183.492004,276.937561 178.128113,266.378754 171.584320,256.610321   C162.801041,243.498840 153.290695,230.857452 143.724808,218.294220   C138.871735,211.920502 132.318100,209.632675 124.252151,212.409256   C115.142807,215.544983 105.889236,218.261734 95.945183,221.436127  z"/>
        <path fill="#02BD03" opacity="1.000000" stroke="none" d=" M96.321785,221.298401   C105.889236,218.261734 115.142807,215.544983 124.252151,212.409256   C132.318100,209.632675 138.871735,211.920502 143.724808,218.294220   C153.290695,230.857452 162.801041,243.498840 171.584320,256.610321   C178.128113,266.378754 183.492004,276.937561 189.487885,287.328949   C196.375443,276.365692 202.945587,265.266479 210.130966,254.580948   C241.911728,207.319183 280.745331,166.791336 326.722809,133.124619   C351.193512,115.206116 377.042603,99.607414 404.089020,85.881401   C417.009583,79.324211 429.169312,81.071861 441.241333,87.435913   C446.072113,89.982552 445.900085,95.750450 441.122345,99.285599   C431.492065,106.411217 421.592957,113.191551 412.188751,120.601639   C368.051117,155.379913 332.278625,197.519760 302.893616,245.272308   C280.068604,282.364471 261.598907,321.568573 245.933609,362.129852   C240.598083,375.944824 231.462341,385.791809 217.747314,391.396729   C206.986893,395.794220 196.280319,400.326080 185.479675,404.621857   C174.245758,409.089966 162.943375,405.118561 158.009033,394.451630   C136.585922,348.139801 105.407341,309.141724 68.551720,274.360229   C61.663303,267.859497 54.536247,261.612152 47.616798,255.143646   C40.278519,248.283569 42.329674,238.867752 51.873966,235.720291   C66.539635,230.883881 81.252403,226.190308 96.321785,221.298401  z"/>
        </svg>`,
    };
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("./shishiji-dts/motion").Degree} Degree
     */
    
    /**
     * 
     * @param {string} str 
     * @param  {any[]} args 
     * @returns {string}
     */
    function formatString(str, ...args){
        for (const [i, arg] of args.entries()){
            const regExp = new RegExp(`\\{${i}\\}`, "g");
            str = str.replace(regExp, arg);
        }
        return str;
    }
    
    
    /**
     * deg -> rad
     * @param {Degree} deg 
     * @returns {Radian}
     */
    function toRadians(deg){
        return deg*(Math.PI/180);
    }
    
    
    /**
     * rad -> deg
     * @param {Degree} rad 
     * @returns {Radian}
     */
    function toDegrees(rad){
        return rad*(180/Math.PI)
    }
    
    
    /**
     * 
     * @param  {...number} n 
     * @returns {number}
     */
    function avg(...n){
        var t = 0;
        n.forEach(i => {
            t += i;
        });
        return t/n.length;
    }
    
    
    /**
     * @param {NonnullPosition} backcanvasPos 
     */
    function toCanvasPos(backcanvasPos){
        var u = backcanvasPos.map(k => {
    
        });
    }
    
    
    /**
     * 
     * @param {mapObjectElement} elm 
     * @returns {Coords}
     */
    function getCoords(elm){
        /**@ts-ignore @type {number[]} */
        const r = elm.getAttribute("coords")?.split(" ").map(t => { return Number(t); });
        return { x: r[0], y: r[1] };
    }
    
    
    /**
     * 
     * @param {mapObjectElement} elm 
     * @returns {string}
     */
    function getBehavior(elm){
        /**@ts-ignore @type {number[]} */
        return elm.getAttribute("behavior");
    }
    
    
    /**
     * 
     * @param {mapObjectElement} elm 
     * @returns {{width: number, height: number}}
     */
    function getDefaultSize(elm){
        /**@ts-ignore @type {number[]} */
        const r = elm.getAttribute("dfsize")?.split(" ").map(t => { return Number(t); });
        return { width: r[0], height: r[1] };
    }
    
    
    /**
     * 
     * @param {string} message 
     */
    function startLoad(message){
        $("#place-selector").hide();
        $("#load_spare")
        .removeClass("loaddoneman")
        .show();
        $("#spare_message").text(message);
    }
    
    
    /**
     * 
     * @param {string} message 
     */
    function endLoad(message){
        setTimeout(() => {
            $("#spare_message").text(message);
        }, 200);
        setTimeout(() => {
            $("#load_spare").addClass("loaddoneman");
            setTimeout(() => {
                clearInterval(Intervals.load);
                $("#load_spare").hide();
                $("#place-selector").addClass("hello").show();
            }, 950);
        }, 1000);
    }
    
    
    function setPlaceSelColor(p){
        if (p === void 0) p = CURRENT_FLOOR;
        $(".placeOpt").each(function(index, elm){
            if (!this.textContent) return;
            const text = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
            if (text === p)
                $(this).css("background-color", overlay_modes.fselector.colors.current);
            else if (text.length > 1)
                $(this).css("background-color", overlay_modes.fselector.colors.else);
        });
    }
    
    
    /**
     * @deprecated use {@link mcFormat} instead
     * @param {string} str 
     * @returns {string}
     */
    function parseMCFormat(str){
        var cl_count = 0;
        var dec_count = 0;
    
        if (str.length < 1)
            return "";
        
        str = "<mcft-cl>§p" + str;
    
        for (var pat in _mcColorList){
            var str_splited = str.split("\u00A7".concat(pat));
            cl_count += str_splited.length - 1;
            str = str_splited.join("<mcft-cl style=\"color: ".concat(_mcColorList[pat], "\">"));
        }
    
        for (var decoration in _mcDec){
            var code = "\u00A7".concat(decoration);
            while (str.includes(code)) {
                var code = "\u00A7".concat(decoration);
                dec_count++;
                str = str.replace(code, "<mcft-dec ".concat(_mcDec[decoration], ">"));
                if (str.indexOf("§r") < str.indexOf(code) || str.indexOf(code) == -1) {
                    var esc = "";
                    for (var i = 0; i <= cl_count; i++) {
                        esc += "</mcft-cl>";
                    }
                    for (var i = -2; i < dec_count; i++) {
                        esc += "</mcft-dec>";
                    }
                    str = str.replace("§r", esc);
                    cl_count = 0;
                    dec_count = 0;
                }
            }
        }
    
        for (var i = 0; i <= cl_count; i++) {
            str += "</mcft-cl>";
        }
    
        for (var i = 0; i < dec_count; i++) {
            str += "</mcft-dec>";
        }
    
        return str;
    }
    
    
    /**
     * 
     * @param {JQuery.PlainObject<any>} element 
     * @param {(event: Event) => void} callback 
     * @param {{forceLeft?: boolean}} [options] 
     */
    function listenInterOnEnd(element, callback, options){
        if (typeof options === "undefined")
            options = {};
        $(element).on("touchstart mousedown", function(e){
            if (options){
                if (options.forceLeft && e.button && e.button != 0)
                    return;
            }
            
            var moved = !!0;
            $(this)
            .on("touchmove mousemove wheel mousewheel", onmove)
            .on("touchend mouseup mouseleave touchleave", onleave);
    
            function onmove(){
                moved = !0;
            }
            /**@this {HTMLElement}*/
            function onleave(e){
                if (!moved)
                    callback(e);
                $(this)
                .off("touchmove mousemove wheel mousewheel", onmove)
                .off("touchend mouseup mouseleave touchleave", onleave);
            }
        });
    }
    
    
    /**
     * 
     * @param {string} str 
     * @returns 
     */
    function escapeHTML(str){
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, "&#39;");
        str = str.replace(/ /g, "&nbsp;");
    
        return str;
    }
    
    
    /**
     * 
     * @param {string} key 
     * @param {string | number} value 
     */
    function setParam(key, value){
        const here = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
    
        urlParams.set(key, encodeURIComponent(String(value)));
    
        const yhere = here.split("?")[0] + "?" + urlParams.toString();
        window.history.replaceState("", "", yhere);
    }
    
    
    /**
     * 
     * @param {string} key 
     * @param {string} [value] 
     */
    function delParam(key, value){
        const here = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
    
        if (value) value = encodeURIComponent(value);
    
        urlParams.delete(key, value);
    
        const yhere = here.split("?")[0] + "?" + urlParams.toString();
        window.history.replaceState("", "", yhere);
    }
    
    
    /**
     * 
     * @param {string} key 
     * @param {string} [url] 
     * @returns {string | null}
     */
    function getParam(key, url){
        if (url === void 0)
            url = window.location.href;
    
        const urlParams = new URLSearchParams(window.location.search);
        const val = urlParams.get(key);
    
        return val ? decodeURIComponent(val) : null;
    }
    
    
    /**
     * 
     * @param {string | null} discriminator 
     * @returns {mapObject | null}
     */
    function searchObject(discriminator){
        for (const key in mapObjectComponent){
            const data = mapObjectComponent[key];
            if (data.discriminator == discriminator) return data;
        }
        return null;
    }
    
    
    /**
     * 
     * @param {Coords} coords 
     * @param {number} [abs_zoomRatio] 
     */
    function setCoordsOnMiddle(coords, abs_zoomRatio){
        if (abs_zoomRatio === void 0){
            abs_zoomRatio = zoomRatio;
        }
        /**@ts-ignore @type {HTMLCanvasElement} */
        const canvas = document.getElementById("shishiji-canvas");
        /**@ts-ignore @type {CanvasRenderingContext2D} */
        const ctx = canvas.getContext("2d");
        const style = {
            top: window.innerHeight/2,
            left: window.innerWidth/2,
        };
        /**@type {Coords} */
        const bcoords = {
            x: (abs_zoomRatio*coords.x - style.left)/abs_zoomRatio,
            y: (abs_zoomRatio*coords.y - style.top)/abs_zoomRatio,
        };
    
        zoomRatio = abs_zoomRatio;
        backcanvas.canvas.coords = bcoords;
        moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
        setBehavParam();
    }
    
    
    /**
     * 
     * @param {string | null} lang 
     */
    function isThereLang(lang){
        if (lang == null)
            return null;
        const langs = [ "JA", "EN" ];
        return langs.includes(lang) ? lang : null;
    }
    
    //@ts-check
    "use strict";
    
    
    
    var STYLES = {
        "§0": "color:#000000",
        "§1": "color:#0000AA",
        "§2": "color:#00AA00",
        "§3": "color:#00AAAA",
        "§4": "color:#AA0000",
        "§5": "color:#AA00AA",
        "§6": "color:#FFAA00",
        "§7": "color:#AAAAAA",
        "§8": "color:#555555",
        "§9": "color:#5555FF",
        "§a": "color:#55FF55",
        "§b": "color:#55FFFF",
        "§c": "color:#FF5555",
        "§d": "color:#FF55FF",
        "§e": "color:#FFFF55",
        "§f": "color:#FFFFFF",
        "§l": "font-weight:bold",
        "§n": "text-decoration:underline", 
        "§o": "font-style:italic",
        "§m": "text-decoration:line-through",
    
        "§L": "font-weight:bolder",
        "§x": "font-size:48px;line-height:1.5",
        "§y": "font-size:36px;line-height:1.333",
        "§z": "font-size:24px;line-height:1",
    };
    
    
    function MCobfuscate(elem){
        elem.classList.add("MCOBF");
        elem.style.fontFamily = "monospace";
    }
    
    
    /**
     * 
     * @param {string} string 
     * @param {Array} codes 
     * @returns {HTMLSpanElement}
     */
    function applyMCCode(string, codes){
        var len = codes.length;
        var elem = document.createElement("span"),
            obfuscated = false;
        for (var i = 0; i < len; i++){
            elem.style.cssText += STYLES[codes[i]] + ";";
            if(codes[i] === "§k") {
                MCobfuscate(elem);
                obfuscated = true;
            }
        }
    
        elem.innerHTML = string;
    
        return elem;
    }
    
    
    /**
     * 
     * @param {string} string 
     * @returns {DocumentFragment}
     */
    function _parseMCFormat(string){
        var codes = string.match(/§.{1}/g) || [],
            indexes = [],
            apply = [],
            tmpStr,
            indexDelta,
            noCode,
            final = document.createDocumentFragment(),
            len = codes.length,
            string = string.replace(/\n|\\n/g, "<br>");
        
        for(var i = 0; i < len; i++){
            indexes.push(string.indexOf(codes[i]));
            string = string.replace(codes[i], "\x00\x00");
        }
    
        if(indexes[0] !== 0){
            final.appendChild(applyMCCode(string.substring(0, indexes[0]), []));
        }
    
        for(var i = 0; i < len; i++){
        	indexDelta = indexes[i + 1] - indexes[i];
            if(indexDelta === 2){
                while(indexDelta === 2){
                    apply.push(codes[i]);
                    i++;
                    indexDelta = indexes[i + 1] - indexes[i];
                }
                apply.push (codes[i]);
            } else {
                apply.push(codes[i]);
            }
            if (apply.lastIndexOf("§r") > -1){
                apply = apply.slice(apply.lastIndexOf("§r") + 1);
            }
            tmpStr = string.substring(indexes[i], indexes[i + 1]);
            final.appendChild(applyMCCode(tmpStr, apply));
        }
        return final;
    }
    
    
    /**
     * @param {string} str 
     * @returns {string}
     */
    function mcFormat(str){
        //str = escapeHTML(str);
        var r = "";
        const el = _parseMCFormat(str);
        for (var e of Array.from(el.children)){
            r += e.outerHTML;
        }
        return r;
    }
    
    
    /**
     * Obfucated font
     */
    !function(){
        const abc = "123456789abcdefghijklmnopqrstuvwxyz";
        const obfuscaters = abc.split("").concat(abc.slice(9).toUpperCase().split(""));
    
        setInterval(function(){
            var obfs = document.getElementsByClassName("MCOBF");
            for (var obf of obfs){
                for (var ch of obf.childNodes){
                    var content = "";
                    if (ch.textContent == null)
                        continue;
                    for (var char of ch.textContent.split("")){
                        var c = Math.round(Math.random() * (obfuscaters.length -1));
                        content += obfuscaters[c];
                    }
                    ch.textContent = content;
                }
            }
        }, 10);
        return 0;
    }();
    
    //@ts-check
    "use strict";
    
    
    
    !function(){
        !function(){
            var prevEvent,
                currentEvent;
    
            document.documentElement.addEventListener("mousemove", function(event){
                pointerVelocity.method = "MOUSE";
                currentEvent = event;
            });
        
            setInterval(function(){
                var movementX = 0;
                var movementY = 0;
                var movement = 0;
    
                if (prevEvent && currentEvent){
                    var movementX = currentEvent.screenX - prevEvent.screenX;
                    var movementY = currentEvent.screenY - prevEvent.screenY;
                    var movement = Math.sqrt(movementX*movementX + movementY*movementY);
                }
                
                prevEvent = currentEvent;
    
                if (pointerVelocity.method == "MOUSE"){
                    pointerVelocity.x = 100*movementX;
                    pointerVelocity.y = 100*movementY;
                    pointerVelocity.v = 100*movement;
                }
            }, 20);
            return 0;
        }();
        
        !function(){
            var wait_o2 = 0;
            /**@type {NodeJS.Timeout} */
            var t;
    
            function g(t){
                var k = 0;
                var r = 0;
                for (var w  of t){
                    k += w.clientX;
                    r += w.clientY;
                }
                k /= t.length;
                r /= t.length;
                return { x: k, y: r };
            }
    
            var prevEvent,
                currentEvent;
    
            document.documentElement.addEventListener("touchmove", function(event){
                pointerVelocity.method = "TOUCH";
                currentEvent = event;
            });
        
            setInterval(function(){
                var movementX = 0;
                var movementY = 0;
                var movement = 0;
    
    
                if (currentEvent && currentEvent.touches.length >= 2){
                    wait_o2 = 1;
                    if (t)
                        clearTimeout(t);
                    t = setTimeout(()=>{
                        wait_o2 = 0;
                    }, 250);
                }
    
                if (prevEvent && currentEvent && currentEvent.touches.length == 1 && wait_o2 === 0){
                    var p = g(currentEvent.touches),
                        j = g(prevEvent.touches);
                    movementX = p.x - j.x;
                    movementY = p.y - j.y;
                    movement = Math.sqrt(movementX*movementX + movementY*movementY);
                }
                
                prevEvent = currentEvent;
    
                if (pointerVelocity.method == "TOUCH"){
                    pointerVelocity.x = 100*movementX;
                    pointerVelocity.y = 100*movementY;
                    pointerVelocity.v = 100*movement;
                }
            }, 20);
            return 0;
        }();
    
        !function(){
            /**@type {NodeJS.Timeout} */
            var t;
    
            function g(t){
                var k = 0;
                var r = 0;
                for (var w  of t){
                    k += w.clientX;
                    r += w.clientY;
                }
                k /= t.length;
                r /= t.length;
                return {x: k, y: r};
            }
    
            var prevEvent,
                currentEvent;
    
            document.documentElement.addEventListener("touchmove", function(event){
                pointerVelocity.method = "TOUCH";
                currentEvent = event;
            });
        
            setInterval(function(){
                var movements = {
                    0: {
                        x: 0,
                        y: 0,
                    },
                    1: {
                        x: 0,
                        y: 0,
                    },
                };
    
                if (!currentEvent && !prevEvent || currentEvent.touches.length == 1) 
                    return;
    
                if (prevEvent && currentEvent && currentEvent.touches.length == 1){
                    for (var i = 0; i < 2; i++){
                        var p = currentEvent.touches[i];
                        var j = prevEvent.touches[i];
                        movements[i].x = p.clientX - j.clientX;
                        movements[i].y = p.clientY - j.clientY;
                    }
                }
                
                prevEvent = currentEvent;
    
                if (pointerVelocity.method == "TOUCH"){
                    for (var i = 0; i < 2; i++){
                        touchZoomVelocity[i].x = 100*movements[i].x;
                        touchZoomVelocity[i].y = 100*movements[i].y;
                    }
                }
            }, 20);
            return 0;
        }();
        return 0;
    }();
    
    //@ts-check
    "use strict";
    
    
    !function(){
        const root = document.documentElement;
    
        window.addEventListener("resize", function(e){
            const width = window.innerWidth;
            const height = window.innerHeight;
    
            root.style.setProperty("--window-width", width+"px");
            root.style.setProperty("--window-height", height+"px");
            root.style.setProperty("--window-half-width", width/2+"px");
            root.style.setProperty("--window-half-height", height/2+"px");
        });
    
        window.dispatchEvent(new Event("resize"));
        setInterval(() => {
            window.dispatchEvent(new Event("resize"));
        }, 500);
        
        return 0;
    }();
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("../shishiji-dts/motion").NonnullPosition} NonnullPosition
     */
    
    
    /**
     * 
     * @param {TouchList} touches 
     * @returns {number}
     */
    function get_midestOfTouches(touches){
        if (touches.length == 1)
            return 0;
    
        var amx = 0;
        var amy = 0;
        var am = 0;
    
        for (var touch of Array.from(touches)){
            amx += touch.clientX;
            amy += touch.clientY;
        }
    
        const middle = {x: amx/touches.length, y: amy/touches.length};
    
        for (var touch of Array.from(touches)){
            const dis = Math.abs(Math.sqrt((touch.clientX - middle.x)**2 
                + (touch.clientY - middle.y)**2));
            am += dis;
        }
        return 2*am/touches.length;
    }
    
    
    /**
     * 
     * @param {TouchList} touches 
     * @returns {NonnullPosition}
     */
    function get_middlePos(touches){
        var av_x = 0;
        var av_y = 0;
        for (var t  of touches){
            av_x += t.clientX;
            av_y += t.clientY;
        }
        av_x /= touches.length;
        av_y /= touches.length;
        return [av_x, av_y];
    }
    
    
    /**
     * get vertical tilt from touches[0:2]
     * @param {TouchList} touches 
     * @returns {Radian}
     */
    function getThouchesTheta(touches){
        const abs = Math.abs,
              sqrt = Math.sqrt,
              pow = Math.pow;
        /**@type {NonnullPosition} */
        const t1 = [touches[0].clientX, window.innerHeight - touches[0].clientY],
              /**@type {NonnullPosition} */
              t2 = [touches[1].clientX, window.innerHeight - touches[1].clientY];
        const S = [t1, t2];
    
        const distance = abs(sqrt(pow(S[0][0] - S[1][0], 2) + pow(S[0][1] - S[1][1], 2)));
        const sinTheta = (1 / distance)*(S[1][1] - S[0][1]);
        const cosTheta = (1 / distance)*(S[1][0] - S[0][0]);
    
        /**@type {Radian} */
        var theta = Math.acos(cosTheta);
        
        if (sinTheta < 0){
            theta = 2*Math.PI - theta;
        }
        // about 1/2
        if (Math.abs(theta - prevTheta) > Math.PI/2){
    
        }
        return theta;
    }
    
    
    /**
     * 
     * @param {TouchList} touches 
     */
    function savePrevTouches(touches){
        prevTouchINFO.touches = [];
        for (var t of touches){
            prevTouchINFO.touches.push({
                x: t.clientX,
                y: t.clientY
            });
            prevTouchINFO.real = Array.from(touches);
        }
    }
    
    
    /**
     * get middle position between touches[0:2]
     * @param {TouchList} touches 
     * @returns {NonnullPosition}
     */
    function getMiddlePosForZoom(touches){
        const S = [[touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]];
        /**@type {NonnullPosition} */
        const middle = [S[0][0] + S[1][0] / 2, S[1][1] + S[0][1] / 2];
        return middle;
    }
    
    
    /**
     * @param {Touch} t1 
     * @param {Touch} t2 
     * @returns {number}
     */
    function touchDistance(t1, t2){
        return Math.abs(
            Math.sqrt(
                (t1.clientX - t2.clientX)**2 + (t1.clientY - t2.clientY)**2
            )
        );
    }
    
    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {TouchEvent} event 
     * @returns {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian}}
     */
    function touchZoom(canvas, ctx, event){
        /**@type {NonnullPosition} */
        var crossPos = [ -1, -1 ];
        const abs = Math.abs;
        const touches = event.touches;
    
        zoomCD++;
    
        /**@graph */
        const Fx = {
            previous: {
                slope: (prevTouchINFO.real[0].clientY - prevTouchINFO.real[1].clientY) / (prevTouchINFO.real[0].clientX - prevTouchINFO.real[1].clientX),
            },
            this: {
                slope: (touches[0].clientY - touches[1].clientY) / (touches[0].clientX - touches[1].clientX),
            }
        };
    
        const distance = get_midestOfTouches(touches);
        var diffRatio = distance / previousTouchDistance.distance;
    
        if (previousTouchDistance.x == -1 && previousTouchDistance.y == -1 && previousTouchDistance.distance == -1){
            diffRatio = 1;
        }
    
        previousTouchDistance.distance = distance;
    
        //#region 
        if (Fx.previous.slope == Fx.this.slope){
            var D1 = touches[0].clientX - prevTouchINFO.touches[0].x;
            var D2 = touches[1].clientX - prevTouchINFO.touches[1].x;
    
            (D1 === 0 && D2 === 0 || D1 + D2 == 0) ? D1 = D2 = 1 : 0;
    
            const R = D1 / (abs(D1) + abs(D2));
    
            const addD1x = abs(touches[0].clientX - touches[1].clientX) * R;
            const addD1y = abs(touches[0].clientY - touches[1].clientY) * R;
    
            /**@type {NonnullPosition} */
            const middle = [
                touches[0].clientX + addD1x,
                touches[0].clientY + addD1y,
            ];
            
            prevTouchINFO.middle = middle;
        } else {
            const crossX = (
                    prevTouchINFO.real[0].clientX * Fx.previous.slope - touches[0].clientX * Fx.this.slope
                    - prevTouchINFO.real[0].clientY + touches[0].clientY
                )
                    /
                (Fx.previous.slope - Fx.this.slope);
            const crossY = (
                Fx.this.slope * (crossX - touches[0].clientX) + touches[0].clientY
            );
            
            crossPos = [ Math.ceil(crossX), Math.ceil(crossY) ];
    
            if (!crossPos.some(t => { return isNaN(t) })) 0;
        }
        //#endregion
    
    
        //#region 
        const x1d = prevTouchINFO.real[0].clientX * diffRatio;
        const y1d = prevTouchINFO.real[0].clientY * diffRatio;
    
        const diffx = touches[0].clientX - x1d;
        const diffy = touches[0].clientY - y1d;
    
    
        if (zoomCD > MOVEPROPERTY.touch.zoomCD){
            zoomMapAssistingNegative(canvas, ctx, diffRatio, [0, 0]);
            moveMapAssistingNegative(canvas, ctx, {
                top: diffy,
                left: diffx
            });
        }
        //#endregion
    
    
        //#region 
        const PI = Math.PI;
        const theta = getThouchesTheta(touches);
        
        /**@type {Radian} */
        var rotation;
    
        if (prevTheta === -1)
            rotation = 0;
        else if (
            0 <= prevTheta && prevTheta <= PI
                &&
            PI*(3/2) <= theta && theta <= 2*PI
            )
            rotation = -(2*PI - theta + prevTheta);
        else if (
            0 <= theta && theta <= PI
                &&
            PI*(3/2) <= prevTheta && prevTheta <= 2*PI
            )
            rotation = 2*PI - prevTheta + theta;
        else 
            rotation = theta - prevTheta;
    
        prevTheta = theta;
    
    
        totalRotateThisTime += Math.abs(rotation);
        rotatedThisTime += rotation;
    
    
        if (Math.abs(rotatedThisTime) > toRadians(MOVEPROPERTY.touch.rotate.min) || pastRotateMin){
            if (!pastRotateMin){
                rotatedThisTime -= toRadians(MOVEPROPERTY.touch.rotate.min);
            }
            pastRotateMin = !0;
            if (zoomCD > MOVEPROPERTY.touch.zoomCD)
                rotateCanvas(canvas, ctx, crossPos, rotation);
        }
        
    
        rotatedThisTime += rotation;
        //#endregion
    
        return { diffRatio: diffRatio, crossPos: crossPos, rotation: rotation };
    }
    
    
    /**
     * Draw tiles
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Function} [callback]
     * @returns {Promise<any>} 
     */
    async function drawMap(canvas, ctx, data, callback){
        const xrange = data.xrange;
        const yrange = data.yrange;
        const tile_width = data.tile_width;
        const tile_height = data.tile_height;
        const src_formatter = data.format;
        /**@type {HTMLImageElement[]} */
        var al = [];
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        backcanvas.width = tile_width*(xrange+1);
        backcanvas.height = tile_height*(yrange+1);
    
        return new Promise((resolve) => {
            for (var y = 0; y <= yrange; y++){
                for (var x = 0; x <= xrange; x++){
                    var dh = tile_width,
                        dw = tile_height,
                        dx = dw*x,
                        dy = dh*y;
    
                    !function(x, y, dx, dy, dw, dh){
                        var img = new Image();
    
                        img.onload = function(){
                            //@ts-ignore
                            this.loaded = true;
    
                            bctx.drawImage(img, 0, 0, tile_width, tile_height, dx, dy, dw, dh);
                            ctx.drawImage(backcanvas, ...[ backcanvas.canvas.coords.x ,backcanvas.canvas.coords.y ]);
                            
                            al.push(img);
                            if (al.length >= (xrange+1)*(yrange+1))
                                resolve("map loaded");
                        }
    
                        img.src = formatString(src_formatter, y, x);
    
                        return 0;
                    }(x, y, dx, dy, dw, dh);
                }
            }
        }).then(() => {
            window.scroll({ top: 0, behavior: "instant" });
            
            if (typeof callback === "function")
                callback(al);
        });
    }
    
    
    /**
     * 
     * @param {boolean} [accurated] 
     */
    function setBehavParam(accurated){
        const abstraction = 10**paramAbstractDeg;
        const K = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
        const zr = accurated ? zoomRatio : Math.round(zoomRatio*abstraction)/abstraction;
        const at = accurated ? K[0]+"*"+K[1] : Math.round(K[0]*abstraction)/abstraction+"*"+Math.round(K[1]*abstraction)/abstraction;
        
        setParam(ParamNames.ZOOM_RATIO, zr);
        setParam(ParamNames.COORDS, at);
    }
    
    //@ts-check
    "use strict";
    
    
    
    /**
     * @typedef {import("../shishiji-dts/motion").Position} _Position
     * @typedef {import("../shishiji-dts/motion").Radian} Radian
     */
    
    
    
    /**
     * 
     * @param {TouchList | MouseEvent} y 
     */
    function set_cursorpos(y){
        if (y instanceof TouchList)
            pointerPosition = get_middlePos(y);
        else
            pointerPosition = [ y.clientX, y.clientY ];
    }
    
    
    /**
     * 
     * @param {TouchList} touches 
     */
    function setTheta(touches){
        prevTheta = getThouchesTheta(touches);
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{top: number, left: number}} moved
     */
    function moveMapAssistingNegative(canvas, ctx, moved){
        const x = backcanvas.canvas.coords.x - moved.left/zoomRatio;
        const y = backcanvas.canvas.coords.y - moved.top/zoomRatio;
    
        backcanvas.canvas.coords = { x: x, y: y };
        backcanvas.canvas.width = canvas.width/zoomRatio;
        backcanvas.canvas.height = canvas.height/zoomRatio;
    
        _redraw(canvas, ctx, backcanvas,
            ...[ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ],
            backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
        );
    }
    
    
    /**
     * @deprecated use moveMapAssistingNegative instead for safari support
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{top: number, left: number}} moved
     */
    function moveMap(canvas, ctx, moved){
        const x = backcanvas.canvas.coords.y-moved.left/zoomRatio;
        const y = backcanvas.canvas.coords.x-moved.top/zoomRatio;
    
        backcanvas.canvas.coords = { x: x, y: y }; 
        backcanvas.canvas.width = canvas.width/zoomRatio;
        backcanvas.canvas.height = canvas.height/zoomRatio;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backcanvas, backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
            backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height,
        );
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} ratio 
     * @param {[number, number]} origin
     *   (cursorPosition)
     * @param {[number, number]} [pos]
     * @param {boolean} [forceRatio] 
     */
    function zoomMapAssistingNegative(canvas, ctx, ratio, origin, pos, forceRatio){
        if (MOVEPROPERTY.caps.ratio.max < zoomRatio && ratio > 1
            || MOVEPROPERTY.caps.ratio.min > zoomRatio && ratio < 1
            ) return;
    
        if (pos === void 0)
            pos = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
    
        if (forceRatio)
            zoomRatio = ratio;
        else
            zoomRatio *= ratio;
    
        if (origin.length == 2 && ratio != 1){
            /**@type {number[]} */
            var transorigin = [];
            for (var i = 0; i < 2; i++){
                transorigin.push(
                    (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
                );
            }
            backcanvas.canvas.coords = {
                x: transorigin[0],
                y: transorigin[1]
            };
        }
        backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
    
        _redraw(canvas, ctx, backcanvas,
            backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
            backcanvas.canvas.width, backcanvas.canvas.height,
            0, 0, canvas.width, canvas.height,
        );
    }
    
    
    /**
     * @deprecated use zoomMapAssistingNegative instead for safari support
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} ratio 
     * @param {[number, number]} origin
     *   (cursorPosition)
     * @param {[number, number] | undefined} pos
     */
    function moveMap(canvas, ctx, ratio, origin, pos){
        if (MOVEPROPERTY.caps.ratio.max < zoomRatio && ratio > 1
            || MOVEPROPERTY.caps.ratio.min > zoomRatio && ratio < 1
            ) return;
    
        if (pos === void 0)
            pos = [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
    
        zoomRatio *= ratio;
    
        if (origin.length == 2 && ratio != 1){
            var transorigin = [];
            for (var i = 0; i < 2; i++){
                transorigin.push(
                    (origin[i]*(ratio - 1))/(zoomRatio) + pos[i]
                );
            }
            backcanvas.canvas.coords = {
                x: transorigin[0],
                y: transorigin[1]
            };
        }
        backcanvas.canvas.width = canvas.width/zoomRatio; backcanvas.canvas.height = canvas.height/zoomRatio;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backcanvas,
            backcanvas.canvas.coords.x, backcanvas.canvas.coords.y, backcanvas.canvas.width, backcanvas.canvas.height,
            0, 0, canvas.width, canvas.height,
        );
    }
    
    
    /**
     * iOS browser doesn't get empty of backcanvas.
     * Fill empty in main canvas when caught negative coords.
     * 
     * USE:: `_redraw(canvas, ctx, backcanvas,
     *      backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
     *      backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height);`
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {CanvasImageSource} image 
     * @param {number} sx 
     * @param {number} sy 
     * @param {number} sw 
     * @param {number} sh 
     * @param {number} dx 
     * @param {number} dy 
     * @param {number} dw 
     *   canvas width
     * @param {number} dh 
     *   canvas height
     */
    function _redraw(canvas, ctx, image, sx, sy, sw, sh, dx, dy, dw, dh){
        /**@type {_Position} */
        const canvasCoords = [sx, sy];
        /**@type {NonnullPosition} */
        var transCoords;
        /**@type {number[]} */
        var args;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        if (sx < 0 || sy < 0){
            transCoords = canvasCoords.map(
                n => { return -n; }
            );
            args = [
                0, 0,
                backcanvas.canvas.width - transCoords[0],
                backcanvas.canvas.height - transCoords[1],
                transCoords[0]*zoomRatio,
                transCoords[1]*zoomRatio,
                dw - transCoords[0]*zoomRatio,
                dh - transCoords[1]*zoomRatio
            ];
        } else {
            args = [ sx, sy, sw, sh, dx, dy, dw, dh ];
        }
    
        //@ts-ignore
        ctx.drawImage(image, ...args);
    
        updatePositions();
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {NonnullPosition} origin 
     * @param {number} [rotation] 
     */
    function rotateCanvas(canvas, ctx, origin, rotation){
        if (rotation === void 0){
            rotation = backcanvas.canvas.rotation;
        }
        
        /*var d = backcanvas.toDataURL();
        var _img = new Image();
        _img.src = d;
        bctx.clearRect(0, 0, backcanvas.width, backcanvas.height);
        bctx.translate(origin[0] * zoomRatio, origin[1] * zoomRatio);
        bctx.rotate(rotation);
        bctx.translate(-origin[0] * zoomRatio, -origin[1] * zoomRatio);
        
        _img.onload = function(e){
            bctx.drawImage(_img, 0, 0);
        }*/
    
        _redraw(canvas, ctx, backcanvas, backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
            backcanvas.canvas.width, backcanvas.canvas.height,
            0, 0, canvas.width, canvas.height
        );
    
        backcanvas.canvas.rotation += rotation;
    }
    
    
    
    /**
     * 
     * @param {TouchEvent} event 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     */
    function onTouchMove(event, canvas, ctx){
        const touches = event.touches;
        const pos = get_middlePos(touches);
        const prevp = pointerPosition;
    
        /**@type {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian}} */
        var adjust = { diffRatio: 1, crossPos: [-1, -1], rotation: 0 };
    
    
        pointerPosition = pos;
    
    
        if (touchCD < MOVEPROPERTY.touch.downCD){
            touchCD++;
            return;
        }
        
    
        if (touches.length >= 2 && prevTouchINFO.real !== void 0 && prevTouchINFO.real.length >= 2){
            /**@see {@link (./eventCalcu.js).touchZoom} */
            adjust = touchZoom(canvas, ctx, event);
            prevTouchINFO.zoom = !0;
        } else {
            pastRotateMin = false;
            rotatedThisTime = 0;
            totalRotateThisTime = 0;
            prevTheta = -1;
            zoomCD = 0;
            prevTouchINFO.cross = [ -1, -1 ];
    
            function frict(){
                var touch_0 = { clientX: prevTouchINFO.real[0].clientX, clientY: prevTouchINFO.real[0].clientY, velocity: touchZoomVelocity[0] };
                var touch_1 = { clientX: prevTouchINFO.real[1].clientX, clientY: prevTouchINFO.real[1].clientY, velocity: touchZoomVelocity[1] };
    
                !function(touch_0, touch_1){
                    const orig = [ touch_0, touch_1 ];
                    const a = touchZoomVelocity.a;
    
                    function i(n){
                        return n < 0 ? -1 : 1;
                    }
                    if (zoomFrictInterval !== null)
                        clearInterval(zoomFrictInterval);
            
                    if (isNaN(touch_0.velocity.x) || isNaN(touch_0.velocity.y)
                        || isNaN(touch_1.velocity.x) || isNaN(touch_1.velocity.y)
                        )
                        return 0;
            
                    //@ts-ignore
                    zoomFrictInterval = setInterval(() => {
                        touch_0.velocity.x += i(touch_0.velocity.x)*a;
                        touch_0.velocity.y += i(touch_0.velocity.y)*a;
                        touch_1.velocity.x += i(touch_1.velocity.x)*a;
                        touch_1.velocity.y += i(touch_1.velocity.y)*a;
    
                        touch_0.clientX += touch_0.velocity.x;
                        touch_0.clientY += touch_0.velocity.y;
                        touch_1.clientX += touch_1.velocity.x;
                        touch_1.clientY += touch_1.velocity.y;
    
                        touchZoom(canvas, ctx, {
                            touches: [
                                //@ts-ignore
                                touch_0, touch_1,
                            ],
                        });
                        if (touch_0.velocity.x*orig[0].velocity.x <= 0 &&
                            touch_0.velocity.y*orig[0].velocity.y <= 0 &&
                            touch_1.velocity.x*orig[1].velocity.x <= 0 &&
                            touch_1.velocity.y*orig[1].velocity.y <= 0
                            )
                            //@ts-ignore
                            clearInterval(zoomFrictInterval);
                    }, 1);
                    return 0;
                }(touch_0, touch_1);
            }
            if (false)
                frict();
    
            prevTouchINFO.zoom = !!0;
        }
    
    
        if (!prevp.some(t => t === null) && touches.length == 1){
            //@ts-ignore
            const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
            moveMapAssistingNegative(canvas, ctx, map_move);
        }
    
        prevTouchINFO.cross = adjust.crossPos;
        savePrevTouches(touches);
    }
    
    
    /**
     * zoom canvas by scrolling mouse wheel
     * @param {WheelEvent} e 
     * @param {HTMLCanvasElement} canvas 
     */
    function canvasonScroll(e, canvas){
        var delta = MOVEPROPERTY.scroll * 1;
        if (e.deltaY > 0)
            delta = 1/delta;
        //@ts-ignore
        zoomMapAssistingNegative(canvas, canvas.getContext("2d"), delta, cursorPosition);
    }
    
    
    /**
     * 
     * @param {MouseEvent} e 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     */
    function onMouseMove(e, canvas, ctx){
        /**@type {NonnullPosition} */
        const pos = [ e.clientX, e.clientY ];
        //@ts-ignore
        const moved = { left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1] };
    
        moveMapAssistingNegative(canvas, ctx, moved);
        pointerPosition = pos;
    }
    
    //@ts-check
    "use strict";
    
    
    /**
     * @typedef {import("../shishiji-dts/objects").mapObjElement} mapObjectElement
     * @typedef {import("../shishiji-dts/objects").mapObject} mapObject
     */
    
    
    /**
     * use /scripts/coords.py to find coordinate
     * @param {mapObject} objectData 
     */
    function putObjOnMap(objectData){
        /**@ts-ignore @type {HTMLElement} */
        const viewer = document.getElementById("shishiji-view");
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        const behavior = objectData.object.type.behavior;
        var zIndex = 1001;
    
        const objectCoords_fromCanvas = {
            x: (objectData.object.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (objectData.object.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
        };
        var styles = "";
        var attrs = "";
        var classes = "";
        var dfcursor = "pointer";
        const obj_id = formatString(objectIdFormat, objectData.discriminator);
    
        switch (behavior){
            case "dynamic":
                classes += "popups realshadow "
                break;
            default:
            case "static":
                zIndex = 999;
                classes += "mapObj_static"
                if (!objectData.object.type.border)
                    styles += "border: none; border-radius: 0; background-color: transparent;"
                if (!objectData.article){
                    styles += "cursor: default;";
                    dfcursor = "default";
                }
                break;
        }
    
    
    
        const element_outerHTML = `
            <div id="${obj_id}" class="mapObj mapObj_centerAlign" style="top: ${objectCoords_fromCanvas.y}px; left: ${objectCoords_fromCanvas.x}px; z-index: ${zIndex};"
                coords="${objectData.object.coordinate.x} ${objectData.object.coordinate.y}"
                behavior="${objectData.object.type.behavior}"
                dfsize="${objectData.object.size.width} ${objectData.object.size.height}">
                <div class="canvas_interactive mapObj_mainctx ${classes}" style="background-image: url('${objectData.object.images.icon}');
                    min-width: ${objectData.object.size.width}px;
                    min-height: ${objectData.object.size.height}px;
                    max-width: ${objectData.object.size.width}px;
                    max-height: ${objectData.object.size.height}px; ${styles}" dfcs="${dfcursor}">
    
                </div>
            </div>
        `;
    
        $(viewer).append(element_outerHTML)
        const el = $(viewer).children()[$(viewer).children().length - 1];
        if (objectData.article){
            listenInterOnEnd(el, function(e){
                const eventDetails = objectData;
                raiseOverview();
                writeArticleOverview(eventDetails, true);
    
                setParam(ParamNames.ARTICLE_ID, objectData.discriminator);
                setBehavParam();
            }, { forceLeft: true });
        }
    }
    
    
    function clearObj(){
        $(".mapObj").remove();
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    function grayScaledCanvas(canvas){
        /**@ts-ignore @type {CanvasRenderingContext2D}*/
        var ctx = canvas.getContext("2d");
            
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        
        /**@ts-ignore @type {ImageData}*/
        var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        var data = imageData.data;
        
        for (var i = 0; i < data.length; i += 4){
            data[i] *= 0.75;
            data[i + 1] *= 0.75;
            data[i + 2] *= 0.75;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    function normalCanvas(canvas){
        /**@ts-ignore @type {CanvasRenderingContext2D}*/
        var ctx = canvas.getContext("2d");
            
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        
        /**@ts-ignore @type {ImageData}*/
        var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        var data = imageData.data;
        
        for (var i = 0; i < data.length; i += 4){
            data[i] /= 0.75;
            data[i + 1] /= 0.75;
            data[i + 2] /= 0.75;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    
    /**
     * 
     * @param {string} currentfloor 
     * @param {mapObjComponent} objects 
     */
    function showDigitsOnFloor(currentfloor, objects){
        for (const y in objects){
            if (objects[y].object.floor == currentfloor){
                putObjOnMap(objects[y]);
            }
        }
    }
    
    //@ts-check
    "use strict";
    
    
    function updatePositions(){
        for (var _mapObj of document.getElementsByClassName("mapObj")){
            /**@ts-ignore @type {mapObjectElement} */
            const mapObj = _mapObj;
            const coords = getCoords(mapObj);
    
            const objectCoords_fromCanvas = {
                x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
                y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
            };
    
            const behavior = getBehavior(mapObj);
            const dfsize = getDefaultSize(mapObj);
    
            var size = dfsize;
    
            switch (behavior){
                case "static":
                    size.width = dfsize.width*zoomRatio;
                    size.height = dfsize.height*zoomRatio;
                    break;
                case "dynamic":
                default:
    
                    break;
            }
    
            mapObj.style.top = objectCoords_fromCanvas.y+"px";
            mapObj.style.left = objectCoords_fromCanvas.x+"px";
            
            $($(mapObj).children()[0])
                .css("min-width", size.width+"px")
                .css("min-height", size.height+"px")
                .css("max-width", size.width+"px")
                .css("max-height", size.height+"px");
        }
    }
    
    //@ts-check
    "use strict";
    
    
    function raiseOverview(){
        strictMap();
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        const $cp = $("#shishiji-popup-container-c");
    
        overview.style.top = "0vh";
        $(overview)
        .removeClass("reducedown")
        .addClass("raiseup")
        .scrollTop(0);
        $(overview).show();
        $("#overview-share").show();
        $("#overview-close").on("click", reduceOverview);
        $("#overview-share").on("click", shareContent);
    
        function shareContent(){
            const discriminator = getParam(ParamNames.ARTICLE_ID);
            const data = searchObject(discriminator);
            const _url = new URL(window.location.href);
            var shareURL = `${_url.origin}${_url.pathname}?${ParamNames.FLOOR}=${CURRENT_FLOOR}&${ParamNames.ARTICLE_ID}=${discriminator}`;
    
            if (data == null || discriminator == null){
                openSharePopup({ title: "" }, "", {}, "", "", true);
                return;
            }
    
            const message = `${TEXT[LANGUAGE].SHARE_EVENT_MESSAGE} ${data.article.title}`;
            
            openSharePopup(
                {
                    title: TEXT[LANGUAGE].SHARE_EVENT_POPUP_TITLE,
                    subtitle: TEXT[LANGUAGE].SHARE_EVENT_POPUP_SUBTITLE,
                },
                shareURL,
                {
                    title: TEXT[LANGUAGE].SHARE_EVENT_DATA_TITLE,
                    text: `${message}\n{__SHARE_URL__}`,
                },
                /**
                 * jump to the object screened on middle of window
                 */
                ParamValues.FROM_ARTICLE_SHARE,
                message,
            );
        }
    }
    
    
    function strictMap(){
        clearInterval(Intervals.reduceOverview);
        $("#user-stricter").addClass("active").show();
    }
    
    
    function restrictMap(){
        $("#user-stricter").removeClass("active").hide();
    }
    
    
    function reduceOverview(){
        restrictMap();
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        overview.style.top = "100vh";
        $(overview)
        .removeClass("raiseup")
        .addClass("reducedown");
        $("#overview-close").off("click", reduceOverview);
        $("#overview-context").removeClass("fadein");
        
        Intervals.reduceOverview = setTimeout(() => {
            writeOverviewContent(`<div id="ovv-ctx-loading-w" class="protected"><h4 id="ovv-ctx-loading">処理中...</h4></div>`, );
            $(overview)
            .css("border-top", "20px solid white")
            .scrollTop(0)
            .hide();
        }, 190);
    
        delParam(ParamNames.ARTICLE_ID);
    }
    
    
    /**
     * 
     * @param {mapObject} details 
     * @param {boolean} fadein 
     */
    function writeArticleOverview(details, fadein){
        /**@ts-ignore @type {HTMLElement} */
        const ctx = document.getElementById("overview-context");
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const color = (details.article.theme_color) ? details.article.theme_color : "black";
        const font = (details.article.font_family) ? details.article.font_family : "";
    
        function onerror(){
            this.setAttribute("src", "/resources/img/noimg.png");
        };
    
        var article_mainctx = mcFormat(details.article.content);
    
        if (!window.navigator.onLine){
            $("#ovv-ctx-loading").html(ERROR_HTML.CONNECTION_ERROR);
            $("#overview-share").hide();
            return;
        }
        
        if (article_mainctx === "<span></span>"){
            article_mainctx = `<h4 style="width: 100%; margin-top: 50px; margin-bottom: 50px; text-align: center;">${TEXT[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
        }
    
        var custom_tr = "";
    
        for (var tr of details.article.custom_tr){
            if (tr.title && tr.content)
                custom_tr += `
                    <tr class="ev_property">
                        <th class="ev_property_cell" aria-label="${tr.title}">
                            ${tr.title}
                        </th>
                        <th class="ev_property_cell" aria-label="${tr.content}">
                            ${tr.content}
                        </th>
                    </tr>
                `;
        }
    
        if (fadein)
            $(ctx).addClass("fadein");
        
        overview.style.borderTop = "solid 20px "+color;
        $(overview).css("font-family", font);
    
        writeOverviewContent(`
            <img id="--art-header" class="article-image article header" alt="${TEXT[LANGUAGE].ARIA_ARTICLE_HEADER}">
            <div class="article titleC">
                <img id="--art-icon" class="article-image" style="width: 48px" alt="${TEXT[LANGUAGE].ARIA_ARTICLE_ICON}">
                <h1 id="ctx-title" style="margin: 5px; font-family: var(--font-view);">${escapeHTML(details.article.title)}</h1>
            </div>
            <div id="ctx-article" style="margin: 10px;">
                <div class="ev_property" style="color: green; font-weight: bold; margin: 20px;">
                    <p style="font-family: var(--font-view);">▷${TEXT[LANGUAGE].ARTICLE_CORE_GRADE}: ${details.article.core_grade}</p>
                </div>
                ${article_mainctx}
                <hr style="margin-top: 20px;">
                <div class="ev_property">
                    <table style="width: 100%;">
                        <tbody>
                            <tr class="ev_property">
                                <th class="ev_property_cell" aria-label="開催場所">
                                    開催場所
                                </th>
                                <th class="ev_property_cell" aria-label="${details.article.venue}">
                                    ${details.article.venue}
                                </th>
                            </tr>
                            <tr class="ev_property">
                                <th class="ev_property_cell">
                                    開催時間
                                </th>
                                <th class="ev_property_cell">
                                    ${details.article.schedule}
                                </th>
                            </tr>
                            ${custom_tr}
                            <tr class="ev_property">
                                <th class="ev_property_cell">
                                    予想待ち時間
                                </th>
                                <th class="ev_property_cell" aria-label="${details.article.crowd_status.estimated}分">
                                    ${details.article.crowd_status.estimated}分
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <div class="crowded_lim">
                        <p style="font-weight: bold; margin: 10px; margin-top: 0; margin-bottom: 5px;" aria-label="混み具合">
                            混み具合
                        </p>
                        <div class="crowded_deg_bar"></div>
                        <div id="crowed_pointer" style="position: relative;">
                            <div class="ccENTER_B" style="position: absolute; left: ${details.article.crowd_status.level}%;">
                                <span class="material-symbols-outlined"
                                    style="position: absolute; margin-top: 5px;">
                                    north
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style="margin-bottom: 20px;">
            </div>
        `, );
        $("#--art-header").attr("src", details.article.images.header).on("error", function(){ onerror.apply(this);; });
        $("#--art-icon").attr("src", details.object.images.icon).on("error", function(){ onerror.apply(this); });
    }
    
    
    /**
     * 
     * @param {string} ctx
     * @param {() => void} [callback] 
     */
    function writeOverviewContent(ctx, callback){
        new Promise((resolve, reject) => {
            $("#overview-context").html(ctx);
            resolve("");
        }).then(() => {
            if (callback !== void 0)
                callback();
        });
    }
    
    function init(){
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const closebtn = document.getElementById("overview-close");
    }
    
    //@ts-check
    "use strict";
    
    
    /**@type {NodeJS.Timeout} FAKE*/
    var lst;
    /**
     * 
     * @param {boolean} openned 
     */
    function toggleFeslOn(openned){
        if (!openned){
            clearTimeout(lst);
            this.addClass("toSel popped");
            $("#place-options-w")
            .show()
            .addClass("toSel");
        } else {
            this.addClass("undoSel").removeClass("popped");
            $("#place-options-w").addClass("undoSel");
            lst = setTimeout(() => {
                this.removeClass("toSel undoSel")
                $("#place-options-w")
                .hide()
                .removeClass("toSel undoSel");
            }, 190);
        }
    }
    
    
    /**
     * 
     * @param {string} floor 
     * @param {{[key: string]: number}} data 
     * @param {() => void} [callback] 
     */
    function changeFloor(floor, data, callback){
        /**@ts-ignore @type {HTMLElement} */
        const fselector = document.getElementById("place-selector");
        /**@ts-ignore @type {HTMLCanvasElement} */
        const canvas = document.getElementById("shishiji-canvas");
        /**@ts-ignore @type {CanvasRenderingContext2D} */
        const ctx = canvas.getContext("2d");
    
    
        startLoad(TEXT[LANGUAGE].LOADING_MAP);
        toggleFeslOn.apply($(fselector), [!0]);
        overlay_modes.fselector.opened = !!0;
    
        const data_size = {
            width: data.tile_width*(data.xrange+1),
            height: data.tile_height*(data.yrange+1)
        };
        backcanvas.width = data_size.width;
        backcanvas.height = data_size.height;
        drawMap(canvas, ctx, data, function(){
            backcanvas.canvas.coords = {
                x: 0,
                y: 0
            };
            zoomRatio = 1;
            moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
            clearObj();
            showDigitsOnFloor(floor, mapObjectComponent);
            endLoad(TEXT[LANGUAGE].MAP_LOADED);
            if (callback !== void 0)
                callback();
        });
        CURRENT_FLOOR = floor;
        setParam(ParamNames.FLOOR, CURRENT_FLOOR);
        setPlaceSelColor();
    }
    
    //@ts-check
    "use strict";
    
    
    /**
     * 
     * @param {{ title: string, subtitle?: string }} ovvOptions 
     * @param {string} share_url 
     * @param {ShareData} share_data 
     *      share_data.text?.replace("{__SHARE_URL__}", finalShareURL<decoded>);
     * @param {string} from_where 
     * @param {string} message 
     * @param {boolean} [ERROR] 
     */
    function openSharePopup(ovvOptions, share_url, share_data, from_where, message, ERROR){
        Popup.popupContent(`<div class="realshadow protected" id="ppupds"><div class="mx-text-center flxxt">${Symbol_Span.loadgingsymbol}</div></div>`);
        share_url = decodeURIComponent(share_url);
        /**@param {string} [ctx]  */
        function onerr(ctx){
            if (ctx === void 0) ctx = ERROR_HTML.CONNECTION_ERROR;
            const _html = `<div class="realshadow protected" id="ppupds"><div class="mx-text-center flxxt"><h4>${ctx}</h4></div></div>`
            Popup.popupContent(_html);
        }
        
        $.ajax({
            url: "/resources/html-ctx/share.html",
            method: "GET",
            timeout: 30000,
            dataType: "html",
        }).done(t => {
            if (Popup.popupping){
                Popup.popupContent(t, function(){
                    const shareURL = share_url.includes("?") ? `${share_url}&${ParamNames.URL_FROM}=${from_where}` : `${share_url}?${ParamNames.URL_FROM}=${from_where}`;
    
                    if (ERROR){
                        onerr();
                        return;
                    }
    
                    $("#ppc-title").text(ovvOptions.title);
                    if (ovvOptions.subtitle)
                        $("#ppc-subtitle").text(ovvOptions.subtitle);
    
                    if (window.navigator.share){
                        share_data.text = share_data.text?.replace("{__SHARE_URL__}", shareURL);
                        !function(sd){
                            $("#share-nav").on("click", async function(){
                                await window.navigator.share(sd);
                            });
                            return 0;
                        }(share_data);
                    } else {
                        $("#nav-share").remove();
                    }
                    $("#share-copy").on("click", function(){
                        window.navigator.clipboard.writeText(shareURL);
                        notifyHTML(
                            `<div id="cpy-lin-not" class="flxxt">${GPATH.LINK}${TEXT[LANGUAGE].NOTIFICATION_COPIED_LINK}</div>`,
                            2500,
                            "copy artshare",
                        );
                    });
                    
                    message = encodeURIComponent(message);
                    const here = encodeURIComponent(shareURL);
                    const baseText = `%0A%0A${message}%0A${here}`;
    
                
                    for (const ch of document.getElementsByClassName("share_ebtn")){
                        const appname = ch.id.replace("share-", "");
                        const $ch = $(ch);
                        var href = "";
                        
                        switch (appname){
                            case "line":
                                href = `http://line.me/R/msg/text/?${baseText}`;
                                break;
                            case "twitter":
                                href = `https://x.com/intent/tweet?url=${here}&text=%0A%0A${message}%0A${encodeURIComponent("#獅子児祭 @shishijifes")}%0A&related=shishiji`;
                                break;
                            case "facebook":
                                href = `http://www.facebook.com/share.php?u=${here}`;
                                break;
                            case "gmail":
                                href = `https://mail.google.com/mail/?view=cm&body=${baseText}`;
                                break;
                            case "mail":
                                href = `mailto:?body=${baseText}`;
                                break;
                            case "sms":
                                href = `sms:?body=${baseText}`;
                                break;
                            case "whatsapp":
                                href = `https://api.whatsapp.com/send?text=${baseText}`;
                                break;
                            default:
                                continue;
                        }
        
                        !function(_href){
                            $ch.on("click", function(){
                                window.open(_href, "_blank");
                            });
                            return 0;
                        }(href);
                    }
    
                    /**except japanese */
                    function translate(){
                        $("#--share-bru").text("Share");
                        $("#--trans-MAIL").text("Email");
                        $("#--trans-MESSAGE").text("Messages");
                        $("#--trans-COPYLINK").text("Copy Link");
                        $("#--trans-OTHERS").text("Others");
                    }
                    if (LANGUAGE != "JA")
                        translate();
                });
            }
        })
        .catch(() => { onerr(); });
    }
    
    //@ts-check
    "use strict";
    
    
    /**
     * 
     * @param {string} html 
     * @param {number} term 
     *      millisecond
     * @param {string} discriminator
     * @param {boolean} [do_not_keep] 
     */
    function notifyHTML(html, term, discriminator, do_not_keep){
        const $notifier = $("#--yd-notifier");
        
        
        if (Notifier.notifying && Notifier.current == discriminator && !do_not_keep)
            return;
    
        Notifier.current = discriminator;
    
        clearTimeout(Notifier.Timeout);
        clearTimeout(Notifier._Timeout);
        clearTimeout(Notifier.__Timeout);
        
        if (Notifier.notifying){
            closeNotifier(!!0);
            Notifier._Timeout = setTimeout(() => {
                doOpen();
            }, 75);
            return;
        }
    
        function doOpen(){
            $("#--ott-us")
            .html(html);
            $notifier
            .show()
            .removeClass("hpipe")
            .addClass("vpopen");
        
            Notifier.notifying = !0;
        
            Notifier.Timeout = setTimeout(() => {
                closeNotifier(!0);
            }, term);
        }
        doOpen();
    }
    
    
    /**
     * 
     * @param {boolean} setclosed 
     */
    function closeNotifier(setclosed){
        clearTimeout(Notifier.__Timeout);
        $("#--yd-notifier")
        .removeClass("vpopen")
        .addClass("hpipe");
        if (setclosed)
            Notifier.notifying = !!0;
        Notifier.__Timeout = setTimeout(() => {
            $("#--ott-us").empty();
            $("#--yd-notifier").hide();
            Notifier.current = "";
        }, 70);
    }
    
    window.addEventListener("load", function(e){
        //@ts-check
        "use strict";
        
        
        
        
        !function(){
            /** @ts-ignore @type {HTMLCanvasElement}*/
            const map_wrapper = document.getElementById("shishiji-view");
            /** @ts-ignore @type {HTMLCanvasElement}*/
            const canvas = document.getElementById("shishiji-canvas");
            /** @ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = canvas.getContext("2d");
            /** @ts-ignore @type {HTMLElement}*/
            const fselector = document.getElementById("place-selector");
            /**window.location.href replace timeout */
            var tout = 0;
        
            /**
             * @param {Event} e  
             * @returns {boolean}
             */
            function illegal(e){
                const target = e.target;
                //@ts-ignore
                if (target?.classList.contains("canvas_interactive") || target?.tagName.toLowerCase() === "canvas"){
                    return !!0;
                }
                return !0;
            }
        
            window.addEventListener("touchstart", (e) => {
                if (illegal(e))
                    return;
        
                e.preventDefault();
        
                
                clearTimeout(tout);
        
        
                if (overlay_modes.fselector.opened){
                    toggleFeslOn.apply($(fselector), [!0]);
                    overlay_modes.fselector.opened = !!0;
                }
                
                init_friction();
                initTouch(e);
                set_cursorpos(e.touches);
        
                if (e.touches.length >= 2)
                    setTheta(e.touches);
            }, { passive: false });
            window.addEventListener("mousedown", (e) => {
                if (illegal(e))
                    return;
        
                e.preventDefault();
        
        
                clearTimeout(tout);
        
                
                if (overlay_modes.fselector.opened){
                    toggleFeslOn.apply($(fselector), [!0]);
                    overlay_modes.fselector.opened = !!0;
                }
        
                init_friction();
                set_cursorpos(e);
        
                window.addEventListener("mousemove", mm, { passive: false });
            }, { passive: false });
        
            
        
            window.addEventListener("touchmove", function(e){
                if (illegal(e))
                    return;
                e.preventDefault();
                onTouchMove(e, canvas, ctx);
            }, { passive: false });
        
        
        
            window.addEventListener("touchend", (e) => {
                if (illegal(e))
                    return;
                e.preventDefault();
                initTouch(e);
                DRAGGING = false;
                pointerPosition = [ null, null ];
                frict(pointerVelocity.x, pointerVelocity.y);
            }, { passive: false });
            window.addEventListener("mouseup", mouse_lost, { passive: false });
        
        
            window.addEventListener("wheel", wheel_move, { passive: true });
            window.addEventListener("mousewheel", wheel_move, { passive: true });
        
        
            function wheel_move(e){
                if (illegal(e))
                    return;
                clearInterval(tout);
                //@ts-ignore
                tout = setTimeout(() => {
                    setBehavParam();
                }, 500);
                map_wrapper.style.cursor = "move";
                Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
                    p => {
                        //@ts-ignore
                        p.style.cursor = "move";
                    }
                );
                canvasonScroll(e, canvas);
            }
        
            function mm(e){
                e.preventDefault();
                map_wrapper.style.cursor = "move";
                Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
                    p => {
                        //@ts-ignore
                        p.style.cursor = "move";
                    }
                );
                DRAGGING = !0;
                onMouseMove(e, canvas, ctx);
            }
        
            function mouse_lost(e){
                e.preventDefault();
                pointerPosition = [ null, null ];
                window.removeEventListener("mousemove", mm);
                map_wrapper.style.cursor = "default";
                Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
                    p => {
                        //@ts-ignore
                        p.style.cursor = p.getAttribute("dfcs");
                    }
                )
        
                const vx = pointerVelocity.x,
                      vy = pointerVelocity.y;
        
                if (DRAGGING){
                    DRAGGING = false;
                    return frict(vx, vy);
                }
            }
        
            
            function frict(vx0, vy0){
                function i(n){
                    return n < 0 ? -1 : 1;
                }
                if (frictInterval !== null)
                    clearInterval(frictInterval);
        
                var vx = vx0,
                    vy = vy0,
                    dxa = pointerVelocity.a*i(vx0),
                    dya = pointerVelocity.a*i(vy0);
        
                if (isNaN(vx) || isNaN(vy))
                    return 0;
        
                //@ts-ignore
                frictInterval = setInterval(() => {
                    var ag = { top: vy/1000, left: vx/1000 };
                    if (ag.top*vy0 <= 0) ag.top = 0;
                    if (ag.left*vx0 <= 0) ag.left = 0;
                    moveMapAssistingNegative(canvas, ctx, ag);
                    vx += dxa;
                    vy += dya;
                    if (vx*vx0 <= 0 && vy*vy0 <= 0 && frictInterval !== null){
                        //@ts-ignore
                        tout = setTimeout(function(){
                            setBehavParam();
                        }, 500)
                        clearInterval(frictInterval);
                    }
                }, 1);
                return 0;
            }
        
        
            document.body.addEventListener("mousemove", function(e){
                e.preventDefault();
                cursorPosition = [ e.clientX, e.clientY ];
            });
        
        
            function init_friction(){
                DRAGGING = false;
                if (frictInterval !== null)
                    clearInterval(frictInterval);
                if (zoomFrictInterval !== null)
                    clearInterval(zoomFrictInterval);
            }
            /**
             * 
             * @param {TouchEvent} e 
             */
            function initTouch(e){
                touchCD = 0;
                zoomCD = 0;
                totalRotateThisTime = 0;
                rotatedThisTime = 0;
                prevTheta = -1;
                previousTouchDistance = { x: -1, y: -1, distance: -1 };
                prevTouchINFO.real = [];
                if (e.touches.length < 2)
                    pastRotateMin = false;
            }
            return 0;
        }();
        
        
        //@ts-check
        "use strict";
        
        
        !function(){
            /**@ts-ignore @type {HTMLElement} */
            const fselector = document.getElementById("place-selector");
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = canvas.getContext("2d");
        
            $("#place-options").children().each(function(index, elm){
                if (!this.textContent)
                    return;
                const text = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
                if (text.length < 1)
                    return;
        
                /**@this {HTMLElement} @param {string} name */
                function addListener(name){
                    this.addEventListener("click", function(e){
                        e.preventDefault();
                        const data = MAPDATA[name];
                        if (CURRENT_FLOOR === name || data === undefined){
                            return;
                        }
        
                        changeFloor(name, data);
                    }, { passive: false });
                    return 0;
                };
        
                addListener.apply(this, [text])
            });
            $(fselector)
            .on("click", function(e){
                if (e.target.classList.contains("fselector-btn") || e.target.id == "psdummy"){
                    toggleFeslOn.apply($(fselector), [overlay_modes.fselector.opened]);
                    overlay_modes.fselector.opened = !overlay_modes.fselector.opened;
                }
            });
            return 0;
        }();
        
        
        //@ts-check
        "use strict";
        
        
        !function(){
            // overview
            writeOverviewContent(`<div id="ovv-ctx-loading-w" class="protected"><h4 id="ovv-ctx-loading">${TEXT[LANGUAGE].PROCESSING}</h4></div>`, );
        
            return 0;
        }();
        
        
        //@ts-check
        "use strict";
        
        
        class Popup{
            static me = document.getElementById("shishiji-popup-container-c");
            static ppcls = GPATH.X;
        
            
            /**
             * 
             * @param {string} _innerHTML 
             * @param {() => void} [callback] 
             */
            static popupContent(_innerHTML, callback){
                new Promise((resolve, reject) => {
                    $("shishiji-mx-overlay")
                    .removeClass("pipe")
                    .addClass("popen")
                    .on("click", this._dispose);
                    $("#shishiji-popup-container-c")
                    .html(this.ppcls+_innerHTML)
                    .show();
                    resolve("");
                }).then(() => {
                    $("#ppcls").on("click", this.disPop);
                    if (callback !== void 0)
                        callback();
                });
            }
            
            static disPop(){
                $("#ppcls").off("click", this.disPop);
                $("shishiji-mx-overlay")
                .removeClass("popen")
                .addClass("pipe")
                .off("click", this._dispose);
                $("#shishiji-popup-container-c")
                .hide()
                .empty();
            }
        
            static get popupping(){
                return (this.me?.style.display != "none") ? true : false;
            }
        
            static _dispose(){
                if (Popup.popupping)
                    Popup.disPop();
            }
        }
        
        
        //@ts-ignore
        window.Popup = Popup;
        
        
        //@ts-check
        "use strict";
        
        
        !function(){
            // popup
            !function(){
                const $cp = $("#shishiji-popup-container-c");
        
                /**@param {string} str  */
                function delpxToNum(str){
                    return Number(str.replace("px", ""));
                }
        
                const base = {
                    width: delpxToNum($cp.css("width")),
                    height: delpxToNum($cp.css("height")),
                    margin: delpxToNum($cp.css("margin"))
                };
                
                $(window).on("resize", function(e){
                    var width = delpxToNum($cp.css("width"));
                    var height = delpxToNum($cp.css("height"));
                    var margin = delpxToNum($cp.css("margin"));
                    
                    if (window.innerWidth <= width+margin*2){
                        $cp.css("width", window.innerWidth-margin*2+"px");
                        width = window.innerWidth-margin*2;
                    } else {
                        $cp.css("width", base.width+"px");
                    }
        
                    $cp
                    .css("top", (window.innerHeight-(margin*2+height))/2+"px")
                    .css("left", (window.innerWidth-(margin*2+width))/2+"px");
                });
        
                window.dispatchEvent(new Event("resize"));
                return 0;
            }();
        
        
            // notify
            !function(){
                const $notifier = $("#--yd-notifier");
                
                $notifier.on("touchstart mousedown", function(e){
                    e.preventDefault();
                    closeNotifier(!0);
                });
                return 0;
            }();
        
            return 0;
        }();
        
        
        //@ts-check
        "use strict";
        
        
        
        function setCanvasSizes(){
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
            backcanvas.canvas.width = canvas.width;
            backcanvas.canvas.height = canvas.height;
        }
        
        
        !function(){
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = canvas.getContext("2d");
            /**@ts-ignore @type {string} */
            const loadType = window.performance?.getEntriesByType("navigation")[0].type;
            const PARAMS = {
                article: getParam(ParamNames.ARTICLE_ID),
                zoomRatio: Number(getParam(ParamNames.ZOOM_RATIO)) || 1,
                floor: getParam(ParamNames.FLOOR),
                coords: getParam(ParamNames.COORDS)?.split("*").map(a => { return (a === String(void 0) || isNaN(Number(a))) ? null : Number(a); }) || [ 0, 0 ],
                from: getParam(ParamNames.URL_FROM),
                lang: isThereLang(getParam(ParamNames.LANGUAGE)) || "JA",
            };
            LANGUAGE = PARAMS.lang;
            if (PARAMS.coords == [null, null]) PARAMS.coords = [0, 0];
        
            if (loadType == "reload"){
                switch (reloadInitializeLevel){
                    case reloadInitializeLevels.DO_EVERYTHING:
                    case reloadInitializeLevels.INIT_FLOOR:
                        PARAMS.floor = null;
                        delParam(ParamNames.FLOOR);
                    case reloadInitializeLevels.INIT_COORDS:
                        PARAMS.coords = [ 0, 0 ];
                        delParam(ParamNames.COORDS);
                    case reloadInitializeLevels.INIT_ZOOMRADIO:
                        PARAMS.zoomRatio = 1;
                        delParam(ParamNames.ZOOM_RATIO);
                    case reloadInitializeLevels.CLOSE_ARTICLE:
                        PARAMS.article = null;
                        delParam(ParamNames.ARTICLE_ID);
                    case reloadInitializeLevels.DO_NOTHING:
                    default:
        
                }
            }
        
            delParam(ParamNames.URL_FROM);
        
            startLoad(TEXT[LANGUAGE].LOADING_MAP);
            setCanvasSizes();
        
            $.get("/data/map-data/conf")
            .done(function(data){
                MAPDATA = data;
                var initial_floor = data.initial_floor;
                var initial_data = data[data.initial_floor];
        
                if (PARAMS.floor && Object.keys(data).includes(PARAMS.floor)){
                    initial_floor = PARAMS.floor;
                    initial_data = data[PARAMS.floor];
                }
        
                backcanvas.width = initial_data.tile_width*(initial_data.xrange+1);
                backcanvas.height = initial_data.tile_height*(initial_data.yrange+1);
        
                drawMap(canvas, ctx, initial_data, callback);
                
                var loaded = 0;
                
                function callback(){
                    backcanvas.canvas.coords = {
                        //@ts-ignore
                        x: PARAMS.coords[0], y: PARAMS.coords[1]
                    };
                    zoomRatio = PARAMS.zoomRatio;
                    moveMapAssistingNegative(canvas, ctx, { left: 0, top: 0 });
                    setBehavParam();
        
                    loaded++;
                    if (loaded == 2)
                        _loaded();
                }
            
                !function(){
                    $.get("/data/map-data/objects")
                    .done((objdata) => {
                        mapObjectComponent = objdata;
            
                        showDigitsOnFloor(initial_floor, mapObjectComponent);
            
                        CURRENT_FLOOR = initial_floor;
        
                        /**
                         * handles if wrong floor with shared article
                         * for shorter share link
                         */
                        if (PARAMS.article){
                            const data = searchObject(PARAMS.article);
                            if (data && CURRENT_FLOOR != data.object.floor && MAPDATA[data.object.floor]){
                                changeFloor(data.object.floor, MAPDATA[data.object.floor], function(){
                                    loaded++;
                                    if (loaded == 2)
                                        _loaded();
                                });
                                return;
                            }
                        }
        
                        setParam(ParamNames.FLOOR, CURRENT_FLOOR);
        
                        setPlaceSelColor();
                        
                        loaded++;
                        if (loaded == 2)
                            _loaded();
                    })
                    .fail((err) => {
                        
                    });
                    return 0;
                }();
            
                function _loaded(){
                    endLoad(TEXT[LANGUAGE].MAP_LOADED);
                    $("#app-mount").show();
                    if (PARAMS.article){
                        const data = searchObject(PARAMS.article);
                        var fromARTshare = !!0;
                        
                        if (PARAMS.from){
                            fromARTshare = !0;
                        }
        
                        if (data == null || CURRENT_FLOOR != data.object.floor){
                            if (fromARTshare){
                                setTimeout(() => {
                                    notifyHTML(
                                        `<div id="shr-notf" class="flxxt" style="font-size: 12px;">${GPATH.ERROR}${TEXT[LANGUAGE].NOTIFICATION_SHARED_EVENT_NOT_FOUND}</div>`,
                                        7500,
                                        "share not found",
                                    );
                                }, 500);
                            }
                            delParam(ParamNames.ARTICLE_ID);
                            return;
                        }
        
                        if (fromARTshare){
                            const coords = data.object.coordinate;
                            setCoordsOnMiddle(coords, ZOOMRATIO_ON_SHARE);
                            setTimeout(() => {
                                notifyHTML(
                                    `<div id="shr-f" class="flxxt" style="font-size: 12px;">${GPATH.SUCCESS}${TEXT[LANGUAGE].NOTIFICATION_SHARED_EVENT_FOUND}</div>`,
                                    5000,
                                    "share found",
                                );
                            }, 1000);
                        }
        
                        setTimeout(() => {
                            raiseOverview();
                            writeArticleOverview(data, true);
                        }, 1000);
                    }
                }
                return 0;
            })
            .fail(function(e){
        
            });
            return 0;
        }();
        
        
        
        window.addEventListener("resize", function(e){
            e.preventDefault();
            /**@ts-ignore @type {HTMLCanvasElement} */
            const canvas = document.getElementById("shishiji-canvas");
            setCanvasSizes();
            //@ts-ignore
            moveMapAssistingNegative(canvas, canvas.getContext("2d"), { top: 0, left: 0 });
            window.scroll({ top: 0, behavior: "instant" });
        }, { passive: false });
        
        
        window.addEventListener("gesturestart", function(e){
            e.preventDefault();
        }, { passive: false });
        
        
        window.addEventListener("dblclick", function(e){
            e.preventDefault();
        }, { passive: false });
        
        
        window.addEventListener("load", function(e){
            window.scroll({ top: 0, behavior: "instant" });
        });
        
        document.oncontextmenu = () => { return false; }
        
        
        
    });
    
    return 0;
}();
