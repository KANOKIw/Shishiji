(() => {
    //@ts-check
    
    
    
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
    
    
    
    
    /**
     * @typedef {import("./shishiji-dts/motion").Degree} Degree
     * @typedef {import("./shishiji-dts/motion").ListenOnEndOptions} ListenOnEndOptions
     * @typedef {import("./shishiji-dts/objects").Sizes} Sizes
     * @typedef {import("./shishiji-dts/objects").ComplexClass} ComplexClass
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
     * 
     * @param {Degree} deg 
     * @returns {Radian}
     */
    function toRadians(deg){
        return deg*(Math.PI/180);
    }
    
    
    /**
     * 
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
     * @template T
     * @param {T} arg 
     * @param {(a: T) => T} processor 
     * @returns {T}
     */
    function doProcess(arg, processor){
        return processor(arg);
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
    
    
    const Random = {
        /**
         * Returns a pseudorandomly chosen int value between the specified origin (inclusive) and the specified bound (inclusive).
         * @param {number} origin the least value that can be returned
         * @param {number} bound the upper bound (inclusive) for the returned value
         *
         * @returns a pseudorandomly chosen int value between the origin (inclusive) and the bound (inclusive)
         * @throws IllegalArgumentException - if origin is greater than or equal to bound
         */
        nextInt: function(origin, bound){
            if (origin === undefined || bound === undefined){
                if (origin != undefined) {bound = origin; origin = 0;}
                else{
                    const num = Math.random();
                    return num > 0.5 ? 1 : 0;
                }
            }
            return Math.floor(Math.random() * (bound - origin + 1)) + origin;
        },
    
        string: function(length){
            var result = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
    
        /**
         * Random choices from given Array
         * @template T
         * @param {Array<T>} list
         * @returns {T}
         */
        randomChoice: function(list){
            return list[this.nextInt(0, list.length - 1)];
        },
    
        /**
         * Fisher-Yates
         * @template T
         * @param {Array<T>} array 
         * @returns {Array<T>}
         */
        shuffleArray(array){
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    };
    
    
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
     * @returns {Sizes}
     */
    function getDefaultSize(elm){
        /**@ts-ignore @type {number[]} */
        const r = elm.getAttribute("dfsize")?.split(" ").map(t => { return Number(t); });
        return { width: r[0], height: r[1] };
    }
    
    
    const top_advertisements = {
        advs: Random.shuffleArray([1, 2, 3, 4, 5, 6]),
        current: 1
    };
    /**
     * 
     * @param {string} message 
     * @param {"first"} [type] 
     * @param {boolean} [adad] 
     * @returns {Promise<void>}
     */
    async function startLoad(message, type, adad){
        const advfunc = () => {
            if (adad){
                const shows = top_advertisements.current++;
                countAd("map-top", shows.toString());
                displayTopAdvertisement.apply(self, [`/resources/img/advertisement/tfn-${top_advertisements.advs[shows]}.png`]);
                top_advertisements.current >= top_advertisements.advs.length ? top_advertisements.current = 1 : void 0;
            }
        }
        
        if ($("#load_spare").css("background-color") == "transparent")
            $("#load_spare").css("background-color", "#15202b");
        
        clearTimeout(Intervals.endloadtimeoutswhen);
        $("#theme-meta").attr("content", "#15202b");
        $("#app-mount").show();
        $("#user-profile-opner").css("display", "flex");
        $("#loaders").removeClass("bye");
        $("#load_spare")
        .removeClass("loaddoneman")
        .css("pointer-events", "all")
        .show();
        $("#greatblink").hide();
    
        if (type == "first")
        {
            $("#greatfrishmountain").addClass("Fdash");
            $("#greatblink").show().addClass("Ndash");
            $("#app-version").show();
    
            return new Promise((resolve, reject) => {
                setTimeout(() => {advfunc();resolve();}, 2090);
            });
        }
        else
        {
            $("#map__opnner").show().removeClass("Ldash").addClass("Hdash");
            $("#greatfrishmountain").removeClass("Gdash Fdash").addClass("Jdash");
            $("#app-version").hide();
            
            return new Promise((resolve, reject) => {
                setTimeout(() => {advfunc();resolve();}, 250);
            });
        }
    }
    
    
    /**
     * @template T
     * @param {T[]} li 
     * @returns {T}
     */
    function getRandomElement(li){
        const length = li.length;
        const randomIndex = Math.floor(Math.random()*length);
        return li[randomIndex];
    }
    
    
    function setLoadMessage(i){}
    
    
    /**
     * 
     * @param {string} [message]
     * @param {number} [delay] 
     */
    async function endLoad(message, delay){
        // BEST TIMING
        if (typeof haveAnyUnclaimeds !== "undefined" && await haveAnyUnclaimeds())
            setMenuHasPending("1");
        return new Promise((resolve, reject) => {
            function i(){
                $("#map__opnner").removeClass("Hdash").addClass("Ldash").show();
                $("#load_spare").css("background-color", "transparent");
                setTimeout(() => {$("#greatfrishmountain").addClass("Gdash");$("#greatblink").addClass("Bdash");}, 100);
                setTimeout(() => $("#loaders").addClass("bye"), 500);
                setTimeout(() => $("#load_spare").css("pointer-events", "none"), 750);
                Intervals.endloadtimeoutswhen = setTimeout(() => {
                    clearInterval(Intervals.load);
                    $("#load_spare").hide();
                    $("#theme-meta").attr("content", "#15202b");
                    $("#greatfrishmountain").removeClass("Gdash")
        
                    /*RaidNotifier.notifyHTML({time: `${( "00" + Random.nextInt(0, 23).toString() ).slice( -2 )}:${( "00" + Random.nextInt(0, 59).toString() ).slice( -2 )}`, discriminator: Random.randomChoice(Object.values(mapObjectComponent)).discriminator, event_details: "レイドバトルが始まりそうだ...!" },
                        {duration: 5000, deny_userclose: false});*/
    
                    resolve(void 0);
                }, 1500);
            }
            setTimeout.call(window, i, delay);
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
    
        for (var pat in MCColorList){
            var str_splited = str.split("\u00A7".concat(pat));
            cl_count += str_splited.length - 1;
            str = str_splited.join("<mcft-cl style=\"color: ".concat(MCColorList[pat], "\">"));
        }
    
        for (var decoration in MCDec){
            var code = "\u00A7".concat(decoration);
            while (str.includes(code)) {
                var code = "\u00A7".concat(decoration);
                dec_count++;
                str = str.replace(code, "<mcft-dec ".concat(MCDec[decoration], ">"));
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
     * @param {HTMLElement} element 
     * @param {(event: JQuery.TriggeredEvent<any, undefined, any, any>, ...args: any) => void} callback 
     * @param {ListenOnEndOptions} [options] 
     */
    function listenInterOnEnd(element, callback, options){
        options ??= {};
        const arg1 = options.arg1 ? options.arg1() : void 0;
        const arg2 = options.arg2 ? options.arg2() : void 0;
    
        +function(){
            var moved = 0;
            var start_detected = false;
            var more_than_two = false;
    
            /**
             * 
             * @param {string} fireSequence 
             * @param {(e: Event)=>any} cb 
             */
            function doEv(fireSequence, cb){
                fireSequence.split(" ").forEach(es => {
                    element.addEventListener(es, cb);
                });
            }
    
            function onstart(e){
                moved = 0;
                start_detected = true;
                e.preventDefault();
                if (options){
                    if (options.forceLeft && e.button && e.button != 0)
                        return;
                }
            }
    
            /**
             * 
             * @param {TouchEvent | MouseEvent} e 
             */
            function onmove(e){
                e.preventDefault();
                if (e instanceof TouchEvent && e.touches.length >= 2) more_than_two = true;
                moved++;
            }
    
            /**@this {HTMLElement}*/
            function onleave(e){
                e.preventDefault();
                // Tolerance!!
                if (moved <= 10 && start_detected && pointerVelocity.v <= 1500 && !more_than_two)
                    callback.call(this, e, arg1, arg2);
                moved = 0;
                start_detected = false;
                more_than_two = false;
            }
    
            doEv("touchstart mousedown", onstart);
            //@ts-ignore
            doEv("touchmove mousemove wheel mousewheel", onmove);
            doEv("touchend mouseup mouseleave touchleave", onleave);
        }();
    }
    
    
    /**
     * 
     * @param {string} str 
     * @returns 
     */
    function escapeHTML(str){
        str = str.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#39;")
                 .replace(/ /g, "&nbsp;");
    
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
        var yhere = "";
    
        if (key == ParamName.COORDS){
            if (urlParams.toString() != ""){
                const _h = getParam(ParamName.ZOOM_RATIO);
                yhere = here.includes("@") ? here.replace(/@.*/, "")+"@"+value+"x"+(_h === null ? 1 : _h)+"?"+urlParams.toString() : here.replace(/\?.*/, "")+"@"+value+"?"+urlParams.toString();
            } else {
                yhere = here+"@"+value;
            }
        } else if (key == ParamName.ZOOM_RATIO){
            if (urlParams.toString() != ""){
                const _c = getParam(ParamName.COORDS);
                yhere = here.includes("@") ? here.replace(/@.*/, "")+"@"+(_c === null ? "0,0" : _c)+"x"+value+"?"+urlParams.toString() : here.replace(/\?.*/, "")+"@"+value+"?"+urlParams.toString();
            } else {
                yhere = here+"@"+getParam(ParamName.COORDS)+value;
            }
        } else {
            urlParams.set(key, encodeURIComponent(String(value)));
        
            yhere = here.split("?")[0] + "?" + urlParams.toString();
        }
    
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
    
        if (key == ParamName.COORDS){
            const reg = /@([^?&]+)x([^?&]+)/;
            const _reg = /@([^?&]+)/;
            var res = url.match(reg);
    
            if (!res)
                res = url.match(_reg);
            
            return res ? res[1].replace(/x/g, "") : null;
        } else if (key == ParamName.ZOOM_RATIO){
            const reg = /@([^?&]+)x([^?&]+)/;
            const res = url.match(reg);
    
            return res ? res[2] : null;
        }
    
        const urlParams = new URLSearchParams(window.location.search);
        const val = urlParams.get(key);
    
        return val ? decodeURIComponent(val) : null;
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     * @returns {mapObject | null}
     */
    function getMapObjectData(discriminator){
        return mapObjectComponent[discriminator || ""];
    }
    
    
    /**
     * 
     * @param {number} diffratio 
     * @param {boolean} setzr
     *      set to the limit when this gets invoked
     */
    function willOverflow(diffratio, setzr){
        const _r = zoomRatio*diffratio;
        
        if (MOVEPROPERTY.caps.ratio.max < _r && diffratio > 1){
            if (setzr)
                zoomRatio = MOVEPROPERTY.caps.ratio.max;
            return true;
        }
        if (MOVEPROPERTY.caps.ratio.min > _r && diffratio < 1){
            if (setzr)
                zoomRatio = MOVEPROPERTY.caps.ratio.min;
            return true;
        }
    
        return false;
    }
    
    
    /**
     * 
     * @param {string} key 
     */
    function getCookie(key){
        const cookies = document.cookie.split("; ");
      
        for (const cookie of cookies) {
            const [ckey, cval] = cookie.split("=");
            if (ckey === key){
                return decodeURIComponent(cval);
            } 
        }
      
        return null;
    }
    
    
    /**
     * 
     * @param {string} key 
     */
    function delCookie(key){
        document.cookie = `${key}=; max-age=0;`;
    }
    
    
    /**
     * 
     * @param {string} key 
     * @param {string} value 
     */
    function setLocalStorage(key, value){
        window.localStorage.setItem(key,value);
    }
    
    
    /**
     * 
     * @param {string} key 
     */
    function getLocalStorage(key){
        return window.localStorage.getItem(key);
    }
    
    
    /**
     * 
     * @param {string} key 
     */
    function delLocalStorage(key){
        window.localStorage.removeItem(key);
    }
    
    
    /**
     * 
     * @param {string} orgname 
     * @param {string} filename 
     */
    function toOrgFilepath(orgname, filename){
        return "/resources/cloud/org/"+orgname+"/"+filename;
    }
    
    
    /**
     * 
     * @param {string} orgname 
     * @param {string} filename 
     */
    function toAdminFilepath(orgname, filename){
        return "/resources/cloud/static/"+orgname+"/"+filename;
    }
    
    
    /**
     * 
     * @param {mapObject} mapobject 
     */
    function getPathConverter(mapobject){
        return mapobject.object.type.event === "org" ? toOrgFilepath : toAdminFilepath;
    }
    
    
    /**
     * 
     * @returns {"JA" | "EN" | null}
     */
    function getUserLang(){
        const lang = navigator.language;
    
        return digitLang(lang);
    }
    
    
    /**
     * 
     * @param {string | null} lang 
     * @returns {"JA" | "EN" | null}
     */
    function digitLang(lang){
        if (lang)
            switch (lang.toUpperCase()){
                case "JA":
                    return "JA";
                default:
                    return "EN";
            }
        else 
            return null;
    }
    
    
    /**
     * 
     * @param {string} link 
     * @returns {"image" | "video" | "unknown"}
     */
    function getMediaType(link){
        var extension = link.split(".").slice(-1)[0].toLowerCase();
    
        if (["jpg", "jpeg", "png", "gif", "webp"].indexOf(extension) !== -1) {
            return "image";
        }
    
        if (["mp4", "webm", "avi", "mov", "flv"].indexOf(extension) !== -1) {
            return "video";
        }
    
        return "unknown";
    }
    
    
    /**@extends ComplexClass */
    class Complex{
        /**
         * 
         * @param {number} real 
         * @param {number} imag 
         */
        constructor(real, imag) {
            this.real = real;
            this.imag = imag;
        }
      
        /**
         * 
         * @param {Complex} other 
         * @returns {Complex}
         */
        add(other){
            return new Complex(this.real + other.real, this.imag + other.imag);
        }
        
        /**
         * 
         * @param {Complex} other 
         * @returns {Complex}
         */
        subtract(other){
            return new Complex(this.real - other.real, this.imag - other.imag);
        }
      
        /**
         * 
         * @param {Complex} other 
         * @returns {Complex}
         */
        multiply(other){
            return new Complex(
                this.real * other.real - this.imag * other.imag,
                this.real * other.imag + this.imag * other.real
            );
        }
      
        /**
         * 
         * @param {Complex} other 
         * @returns {Complex}
         */
        divide(other){
            const denominator = other.real * other.real + other.imag * other.imag;
            if (denominator === 0) {
                throw new Error("Division by zero");
            }
            return new Complex(
                (this.real * other.real + this.imag * other.imag) / denominator,
                (this.imag * other.real - this.real * other.imag) / denominator
            );
        }
    
        /**
         * 
         * @param {Radian} angle 
         * @param {Complex} [center] 
         * @returns {Complex}
         */
        rotate(angle, center){
            center ??= new Complex(0, 0);
            const translated = this.subtract(center);
        
            const cosTheta = Math.cos(angle);
            const sinTheta = Math.sin(angle);
            const rotated = new Complex(
              translated.real * cosTheta - translated.imag * sinTheta,
              translated.real * sinTheta + translated.imag * cosTheta
            );
        
            return rotated.add(center);
        }
      
        /**
         * 
         * @returns {number}
         */
        magnitude(){
            return Math.sqrt(this.real * this.real + this.imag * this.imag);
        }
      
        /**
         * 
         * @returns {string}
         */
        toString(){
            return `${this.real} + ${this.imag}i`;
        }
    }
    
    
    function getHTMLtextContent(htmltext){
        const g = document.createElement("span");
        g.innerHTML = htmltext;
        return g.textContent;
    }
    
    
    /**
     * 
     * @param {string} id 
     */
    function openPkGoScreen(id){
        $("#"+id).show().removeClass("calming recalming")
        .addClass("activated").css("z-index", (++goScreen_index).toString());
        collectJail(id);
    }
    
    
    /**
     * 
     * @param {string} id 
     */
    function closePkGoScreen(id){
        $("#"+id).removeClass("activated").addClass("recalming");
        setTimeout(() => $("#"+id).hide(), 100);
        goScreen_index--;
    }
    
    
    function closeAllPkGoScreen(){
        $("shishiji-pks").removeClass("activated").addClass("recalming");
        goScreen_index = 1;
    }
    
    
    /**
     * 
     * @param {HTMLElement} target 
     * @param {(...a) => any} whatif 
     */
    function listenUpSwipe(target, whatif){
        ["touchstart", "mousedown"]
        .forEach(e => 
            //@ts-ignore
            target.addEventListener(e, 
            /**@param {TouchEvent | MouseEvent} e  */    
            function(e){
                var startY = (e instanceof TouchEvent) ? e.touches[0].clientY : e.clientY;
                var deltaY = 0;
                var betrayed = false;
    
                /**@param {TouchEvent | MouseEvent} e  */   
                function elderberry(e){
                    deltaY = startY - ((e instanceof TouchEvent) ? e.touches[0].clientY : e.clientY);
                    if (deltaY > 35 && !betrayed){
                        betrayed = true;
                        whatif(e);
                        ["touchmove", "mousemove"]
                        .forEach(z => 
                            //@ts-ignore
                            target.removeEventListener(z, elderberry, {passive: true})
                        , {passive: true});
                    }
                }
    
                ["touchmove", "mousemove"]
                .forEach(e => 
                    //@ts-ignore
                    target.addEventListener(e, elderberry, {passive: true})
                );
                ["touchend", "mouseup"]
                .forEach(e => 
                    //@ts-ignore
                    target.addEventListener(e, (x) => {
                        if (betrayed){
                            //whatif(e);
                        }
                        ["touchmove", "mousemove"]
                        .forEach(z => 
                            //@ts-ignore
                            target.removeEventListener(z, elderberry, {passive: true})
                        , {passive: true});
                        ["touchmove", "mousemove"]
                        .forEach(z => 
                            //@ts-ignore
                            target.removeEventListener(z, elderberry)
                        , {passive: true});
                    })
                );
            }, {passive: true})
        );
    }
    
    
    /**
     * 
     * @param {string} process 
     * @param {"top" | "middle"} where
     */
    function intoLoad(process, where){
        switch(where){
            case "top":
                loadProcesses.top.length == 0 ? $("#topestLoadMan").removeClass("aOKSGD") : void 0;
                loadProcesses.top.push(process);
                break;
            case "middle":
                loadProcesses.top.length == 0 ? $("#midestLoadMan").removeClass("aOKSGD") : void 0;
                loadProcesses.middle.push(process);
                break;
        }
    }
    
    
    /**
     * 
     * @param {string} process 
     * @param {"top" | "middle"} where 
     */
    function outofLoad(process, where){
        switch(where){
            case "top":
                loadProcesses.top = loadProcesses.top.filter(r => r !== process);
                loadProcesses.top.length == 0 ? $("#topestLoadMan").addClass("aOKSGD") : void 0;
                break;
            case "middle":
                loadProcesses.middle = loadProcesses.middle.filter(r => r !== process);
                loadProcesses.middle.length == 0 ? $("#midestLoadMan").addClass("aOKSGD") : void 0;
                break;
        }
    }
    
    
    /**
     * 
     * @param {string} dataURL 
     * @returns 
     */
    function dataURLtoBlob(dataURL){
        if (!dataURL.startsWith("data:")){
            throw new Error("Invalid Data URL");
        }
      
        const [metadata, base64Data] = dataURL.split(',');
        const mimeType = metadata.match(/:(.*?);/)?.[1];
      
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const uint8Array = new Uint8Array(len);
    
        for (let i = 0; i < len; i++){
            uint8Array[i] = binaryString.charCodeAt(i);
        }
      
        return new Blob([uint8Array], { type: mimeType });
    }
    
    
    /**
     * 
     * @param {string} url 
     * @param {boolean} [renew] 
     */
    function cssURL(url, renew){
        var r = "url("+url;
        r += renew ? "?"+Random.string(8) : "";
        r += ")";
        return r;
    }
    
    
    /**
     * @template T
     * @param {T[]} arr1 
     * @param {T[]} arr2 
     * @returns {boolean}
     */
    function arrayEqual(arr1, arr2){
        if (arr1.length !== arr2.length) return false;
    
        var sortedArr1 = arr1.slice().sort();
        var sortedArr2 = arr2.slice().sort();
    
        for (let i = 0; i < sortedArr1.length; i++){
            if (sortedArr1[i] !== sortedArr2[i]){
                return false;
            }
        }
    
        return true;
    }
    
    
    /**
     * 
     * @param {string} floor 
     * @param {boolean} admittable 
     * @returns {string[]}
     */
    function getObjectsOfFloor(floor, admittable){
        const res = [];
    
        for (const [disc, data] of Object.entries(mapObjectComponent)){
            if (data.object.floor == floor && data.article){
                if (admittable){
                    if (data.object.no_admission) continue;
                }
                res.push(disc);
            }
        }
    
        return res;
    }
    
    
    /**
     * 
     * @param {string} disc 
     */
    function isCompletedOrg(disc){
        return LOGIN_DATA.data.completed_orgs.includes(disc);
    }
    
    
    /**
     * 
     * @param {string} title 
     * @param {string} content 
     */
    function createCustomTr(title, content){
        const trElement = document.createElement('tr');
        trElement.classList.add("ev_property");
        const thTitle = document.createElement('th');
        thTitle.textContent = title;
        thTitle.classList.add("ev_property_cell");
        const thContent = document.createElement('th');
        thContent.textContent = content;
        thContent.classList.add("ev_property_cell");
    
        trElement.appendChild(thTitle);
        trElement.appendChild(thContent);
    
        return trElement;
    }
    
    
    function displayUserPtExactly(){
        $("#mission_progress_bar").css("width", ((LOGIN_DATA.data.pt/50000)*100).toString()+"%");
        $("#user-total-points").text(LOGIN_DATA.data.pt+"pt");
        $("#smartestppl").text(LOGIN_DATA.data.pt+"pt");
        $("#profile-totalscore").text(LOGIN_DATA.data.pt+"pt");
    
        const r = [...ptmedal];
        for (const h of r.reverse()){
            if (LOGIN_DATA.data.pt >= h.pt){
                $("#dashub, #user-rank").css("background-image", `url(${getMedalPath(LOGIN_DATA.data.pt)})`);
                break;
            }
        }
    
        const nearmedals = getNearMedal(LOGIN_DATA.data.pt);
        
        if (!nearmedals){
            const nxt = ptmedal[0].pt;
    
            $("#rank-progress").css("width", `${(LOGIN_DATA.data.pt/nxt)*100}%`);
        } else if (!nearmedals[1]){
            $("#rank-progress").css("width", `100%`);
        } else {
            const gap = Math.abs(nearmedals[1].pt - nearmedals[0].pt);
            const prog = LOGIN_DATA.data.pt - nearmedals[0].pt;
            const pers = (prog/gap)*100;
    
            $("#rank-progress").css("width", `${pers}%`);
        }
    }
    
    
    /**
     * 
     * @param {number} pt 
     */
    function getMedalPath(pt){
        const r = [...ptmedal];
        for (const h of r.reverse()){
            if (pt >= h.pt){
                return h.src;
            }
        }
    }
    
    
    /**
     * @returns [ smaller, bigger ]
     * @param {number} pt 
     */
    function getNearMedal(pt){
        const r = [...ptmedal];
        for (var i = r.length - 1; i >= 0; i--){
            const h = r[i];
            
            if (pt >= h.pt){
                return [
                    h, r[i + 1]
                ];
            }
        }
    }
    
    
    /**
     * 
     * @param {string} _what 
     */
    function notifyAcquision(_what){
        const mn = document.createElement("div");
        const si = document.createElement("div");
        const ptp = document.createElement("p");
        ptp.textContent = `+${_what}`;
        si.classList.add("aOBvjw");
        mn.classList.add("uihagod");
        si.appendChild(ptp);
        mn.appendChild(si);
        $("shishiji-pt-claimer").append(mn);
        setTimeout(() => {
            mn.classList.add("haveaniceday");
            // Illegal invocation
            setTimeout(() => mn.remove(), 500);
        }, 5*1000 + 500);
    }
    
    
    /**
     * @param {string} menu_num 
     */
    function setMenuHasPending(menu_num){
        const nemu = document.getElementById("pkgo_menu"+menu_num)?.children[0];
    
        nemu?.querySelectorAll("menu-notifier").forEach(p => p.remove());
        nemu?.appendChild(document.createElement("menu-notifier"));
    }
    
    
    /**
     * @param {string} menu_num 
     */
    function removeMenuHasPending(menu_num){
        const nemu = document.getElementById("pkgo_menu"+menu_num)?.children[0];
    
        nemu?.querySelectorAll("menu-notifier").forEach(p => p.remove());
    }
    
    
    /**
     * 
     * @param {string} tour_name 
     */
    function isUnvisitedTour(tour_name){
        const t = getLocalStorage("__tour-"+tour_name);
        return !Boolean(t);
    }
    
    
    /**
     * @param {string} tour_name 
     */
    function startTour(tour_name){
        const tour = Shepherd_Tours[tour_name];
        
        if (tour){
            tour.start();
            setLocalStorage("__tour-"+tour_name, "done-"+(new Date()).toString());
        }
    }
    
    
    /**
     * 
     * @param {string} type 
     * @param {string} nums 
     */
    function countAd(type, nums){
        $.post(ajaxpath.collectad, {
            f: "adv",
            b: type,
            d: nums
        });
    }
    
    
    /**
     * 
     * @param {string} _what 
     * @param {number} time 
     */
    function letCollect(_what, time){
        $.post(ajaxpath.collectad, {
            f: _what,
            v: time
        });
    }
    
    
    /**
     * 
     * @param {string} _what 
     */
    function collectJail(_what){
        for (const j of LOGIN_DATA.pending_collects){
            if (j.name == _what)
                j.count++;
            return;
        }
        LOGIN_DATA.pending_collects.push({
            name: _what,
            count: 1
        });
    }
    
    
    
    
    /**
     * 
     * @param {HTMLElement} elem 
     * @param {string} ctx 
     */
    function _MCobfuscate(elem, ctx){
        const child = document.createElement("span");
        elem.appendChild(child);
        child.innerHTML = ctx;
        child.classList.add("MCOBF", "crucial");
    }
    
    
    /**
     * 
     * @param {string} string 
     * @param {Array} codes 
     * @returns {HTMLSpanElement}
     */
    function _applyMCCode(string, codes){
        const len = codes.length;
        const elem = document.createElement("span");
        var obfuscated = false;
    
        for (var i = 0; i < len; i++){
            const style = MCSTYLES[codes[i]];
            
            if (typeof style !== "string") continue;
            elem.style.cssText += style + ";";
            if(codes[i] === "§k"){
                _MCobfuscate(elem, string);
                obfuscated = true;
            }
        }
    
        if (!obfuscated)
            elem.innerHTML = string;
    
        return elem;
    }
    
    
    /**
     * 
     * @param {string} string 
     * @returns {DocumentFragment}
     */
    function _parseMCFormat(string){
        string = string.replace(/§h/g, '<hr class="article-dv">');
        var codes = string.match(/§.{1}/g) || [],
            indexes = [],
            apply = [],
            tmpStr,
            indexDelta,
            final = document.createDocumentFragment(),
            len = codes.length,
            string = string.replace(/\n|\\n/g, "<br>");
        
        for (var i = 0; i < len; i++){
            indexes.push(string.indexOf(codes[i]));
            string = string.replace(codes[i], "\x00\x00");
        }
    
        if (indexes[0] !== 0){
            final.appendChild(_applyMCCode(string.substring(0, indexes[0]), []));
        }
    
        for (var i = 0; i < len; i++){
        	indexDelta = indexes[i+1] - indexes[i];
            if (indexDelta === 2){
                while (indexDelta === 2){
                    apply.push(codes[i]);
                    i++;
                    indexDelta = indexes[i+1] - indexes[i];
                }
                apply.push(codes[i]);
            } else {
                apply.push(codes[i]);
            }
            if (apply.lastIndexOf("§r") > -1){
                apply = apply.slice(apply.lastIndexOf("§r")+1);
            }
            tmpStr = string.substring(indexes[i], indexes[i+1]);
            final.appendChild(_applyMCCode(tmpStr, apply));
        }
        return final;
    }
    
    
    /**
     * 
     * @param {string} videoUrl 
     * @returns 
     */
    async function fetchVideoAsBlob(videoUrl){
        try {
            const response = await fetch(videoUrl);
            return await response.blob();
        } catch(e){
            return null;
        }
    }
    
    
    /**
     * @param {string} str 
     * @param {(S: string) => string} srcConverter 
     * @returns {string}
     */
    function mcFormat(str, srcConverter){
        str = escapeHTML(str);
    
        str = str.replace(/\n/g, "").replace(/§v/g, "\n");
    
        var r = "";
        const el = _parseMCFormat(str);
    
        for (var e of Array.from(el.children)){
            r += e.outerHTML;
        }
    
        const imgreg = /∫\:IMG-S=([^-]+)-W=(\d+);∫/g;
        const vidreg = /∫\:VIDEO-S=([^-]+)-W=(\d+);∫/g;
        const linkreg = /#\:LINK-H=(https?:\/\/(?:(?!-T=).)+)-T=((?:(?!;#).)*);#/g;
        const imgmatches = r.matchAll(imgreg) || [];
        const vidmacthes = r.matchAll(vidreg) || [];
        const linkmacthes = r.matchAll(linkreg) || [];
    
        const revealreg = /@REVEAL-f=([^-]+)-x=(\d+)-y=(\d+);/g;
        const revealmacthes = r.matchAll(revealreg) || [];
    
    
        for (const imgmacth of imgmatches){
            const width = Number(imgmacth[2]);
            r = r.replace(imgmacth[0], `<img class="article-image doaJSD protected" loading="lazy" draggable="false" src="${srcConverter(imgmacth[1])}" style="width: ${(width > 100 || width < 0) ? 100 : width}%;">`);
        }
    
        for (const vidmacth of vidmacthes){
            const width = Number(vidmacth[2]);
    
            r = r.replace(vidmacth[0], `<video class="article-video protected" loading="lazy" draggable="false" src="${srcConverter(vidmacth[1])}" controls preload="metadata" playsinline style="width: ${(width > 100 || width < 0) ? 100 : width}%;"></video>`);
        }
    
        for (const linkmacth of linkmacthes){
            const href = linkmacth[1];
            r = r.replace(linkmacth[0], `<a class="article-outsidelink notprotected" draggable="true" href="${new URL(href)}" target="_blank">${(linkmacth[2].length > 0) ? linkmacth[2] : linkmacth[1]}</a>`);
        }
    
    
        for (const revealmacthe of revealmacthes){
            const f = revealmacthe[1];
            const x = Number(revealmacthe[2]);
            const y = Number(revealmacthe[3]);
            r = r.replace(revealmacthe[0], `<div class="shishijibtn KAuf" f="${f}" x="${x}" y="${y}"><span style="width:120px">マップで表示</span></div>`);
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
            const obfs = document.getElementsByClassName("MCOBF");
            for (const obf of obfs){
                for (const ch of obf.childNodes){
                    var content = "";
                    if (ch.textContent == null)
                        continue;
                    for (const char of ch.textContent.split("")){
                        const c = Math.round(Math.random() * (obfuscaters.length -1));
                        content += obfuscaters[c];
                    }
                    ch.textContent = content;
                }
            }
        }, 10);
        return 0;
    }();
    
    
    // 9/15 2:30 for Chemistry Club
    !function(){
        window.addEventListener("click", function(e){
            /**@ts-ignore @type {HTMLElement} */
            const b = e.target;
            /**@ts-ignore @type {HTMLElement} */
            const p = b.parentNode;
    
            if (b.classList.contains("KAuf") || p?.classList.contains("KAuf")){
                const f = b.getAttribute("f") || p?.getAttribute("f") || "";
                const x = b.getAttribute("x") || p?.getAttribute("x");
                const y = b.getAttribute("y") || p?.getAttribute("y");
    
                if (![f, x, y].every(i => i)) return;
    
                reduceOverview();
                revealOnMap({
                    floor: f,
                    x: Number(x),
                    y: Number(y)
                });
            }
        });
    
        return 0;
    }();
    
    
    
    
    var gdash = [];
    
    
    !function(){
        var prevEvent,
            currentEvent;
    
        document.documentElement.addEventListener("mousemove", function(event){
            pointerVelocity.method = "MOUSE";
            currentEvent = event;
        });
    
        gdash.push(function(){
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
        });
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
    
        gdash.push(function(){
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
        });
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
    
        gdash.push(function(){
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
        });
        return 0;
    }();
    
    
    setInterval(() => gdash.forEach(g=>g()), 20);
    
    
    
    
    /**
     * 
     * @param {Event} e 
     */
    function preventDefault(e){
        e.preventDefault();
    }
    
    
    window.addEventListener("gesturestart", preventDefault, { passive: false });
    
    window.addEventListener("dblclick", preventDefault, { passive: false });
    
    window.addEventListener("wheel", function(e){
        // Revoke chrome zoom
        if (e.ctrlKey || e.metaKey)
            e.preventDefault();
    }, { passive: false });
    
    
    
    
    /**
     * 
     *  @typedef {import("socket.io").Socket} Socket
     */
    
    
    /**@ts-ignore @type {Socket} */
    const ws = io.connect(void 0, {
        withCredentials: true
    });
    
    
    ws.on("user.admission.pending", oname => {
        intoLoad(oname.s+"-admission-pending", "middle");
    });
    
    ws.on("user.admission.register", async admdata => {
        const visited_org = getMapObjectData(admdata._new);
        /**@type {string} */
        const processType = visited_org ? admdata.processType : "unknown";
        
        switch (processType){
            case "duplicated":
                PictoNotifier.notifyWarn(TEXTS[LANGUAGE].ALREADY_VISITED, {
                    duration: 10000
                });
            break;
            case "included":
                const claimed = admdata._pt;
                LOGIN_DATA.data.completed_orgs = admdata._update;
                LOGIN_DATA.data.pt = admdata._apt;
                showGoodOrgs();
                PictoNotifier.notifySuccess(
                formatString(TEXTS[LANGUAGE].ADMISSION_RECORDED, visited_org?.article.title),{
                    duration: 10000
                });
                notifyAcquision(`${claimed}pt`);
    
                if (await haveAnyUnclaimeds()){
                    setMenuHasPending("1");
                }
            break;
            default:
                PictoNotifier.notifyError(TEXTS[LANGUAGE].UNKNOWN_ERROR, {
                    duration: 10000
                });
        }
    
        displayUserPtExactly();
        setTimeout(() => outofLoad(admdata._new+"-admission-pending", "middle"), 500);
        // just to make sure
    });
    
    
    ws.on("user.ticket.consumption", async tkdata => {
        /**@type {Ticket[]} */
        const _new_tickets = tkdata._newtickets;
        /**@type {Ticket} */
        const used = tkdata.used;
    
        PictoNotifier.notifySuccess(
            formatString(TEXTS[LANGUAGE].TICKET_USED, used.visual.description),
            {
                duration: 10*1000,
                deny_userclose: true,
                do_not_keep_previous: true
            }
        )
        closePkGoScreen("ticket_use_screen");
    
        LOGIN_DATA.data.tickets = _new_tickets;
    
        setTicketGUI();
    });
    
    
    ws.on("data.delay", async de => {
        SCHEDULE_DELAY.BAND_SCHEDULE_DELAY = Number(de.b);
        SCHEDULE_DELAY.DANCE_SCHEDULE_DELAY = Number(de.d);
    });
    
    
    
    
    const _whenLoginDone = [];
    var _loginDone = false;
    /**
     * 
     * @param {()=>any} f 
     */
    function addLoginListener(f){
        if (_loginDone) f();
        else _whenLoginDone.push(f);
    }
    
    
    /**@type {Promise<void>} */
    const LOGIN_AJAX = new Promise(async function(resolve){
        $.ajax({
            url: ajaxpath.integrity,
            type: "POST",
            /**
             * 
             * @param {import("../../server/handler/user/dts/user").UserLoginRecord} data 
             */
            success: function(data){
                _loginDone = true;
                LOGIN_DATA.logined = true;
                LOGIN_DATA.discriminator = data.discriminator;
                
                const completed_orgs = JSON.parse(data.completed_orgs);
                const profile = JSON.parse(data.profile);
                const fame_votes = JSON.parse(data.fame_votes);
                const band_votes = JSON.parse(data.band_votes);
                const dance_votes = JSON.parse(data.dance_votes);
                const misc_votes = JSON.parse(data.misc_votes);
                const favorited_orgs = JSON.parse(data.favorited_orgs);
                const claimed_rpt = JSON.parse(data.claimed_rpt);
                const custom_data = JSON.parse(data.custom_data);
                const tickets = JSON.parse(data.tickets);
        
                LOGIN_DATA.data.completed_orgs = completed_orgs;
                LOGIN_DATA.data.profile = profile;
                LOGIN_DATA.data.fame_votes = fame_votes;
                LOGIN_DATA.data.band_votes = band_votes;
                LOGIN_DATA.data.dance_votes = dance_votes;
                LOGIN_DATA.data.misc_votes = misc_votes;
                LOGIN_DATA.data.favorited_orgs = favorited_orgs;
                LOGIN_DATA.data.pt = Number(data.pt);
                LOGIN_DATA.data.claimed_rpt = claimed_rpt;
                LOGIN_DATA.data.tickets = tickets;
                LOGIN_DATA.data.custom_data = custom_data;
                LOGIN_DATA.data.isstudent = data.isstudent;
                
                $("#user-name-input").val(LOGIN_DATA.data.profile.nickname);
                $("#user-name").text(LOGIN_DATA.data.profile.nickname);
                displayUserPtExactly();
        
                LOGIN_DATA.data.profile.icon_path ? $("#user-icon, #user-icon-change")
                .css("background-image", cssURL(LOGIN_DATA.data.profile.icon_path, true)) : void 0;
    
                if (LOGIN_DATA.data.isstudent) $("#pkgo_menu2、#pkgo_menu1").remove();
                //if (getParam("dev") != "setagaquest") $("#pkgo_menu6").remove();
        
                PictoNotifier.notify("success", formatString(TEXTS[LANGUAGE].LOGINED, data.discriminator),
                    { addToPending:true }
                );
    
                _whenLoginDone.forEach(f => f());
            },
            error: function(err){
                addLoadHandler(() => PictoNotifier.notify("warn", "Login Failed"));
                intoLoad("integrity", "top");
            },
            complete: function(){
                outofLoad("integrity", "top");
                FIRST_LOAD_PROPERTY.login = true;
                resolve(void 0);
            }
        });
    
        setTimeout(() => {
            if (!_loginDone)
                intoLoad("integrity", "top");
        }, 2500);
    });
    
    
    setInterval(async function(){
        ws.emit("org.data.crowdstatus", 
            /**@param {{[key: string]: number}} newstatus */
            function(newstatus){
                for (const oname in newstatus){
                    if (!mapObjectComponent[oname]) continue;
                    var gs = newstatus[oname];
                    mapObjectComponent[oname].article.crowd_status = gs;
                    setObjectCrowdStatus(oname, gs);
    
                    if (gs == 0) gs = 1;
                    $("#sstatus-disc-"+oname).removeClass("n1 n2 n3 n0").addClass("n"+gs.toString());
                }
            }
        );
    }, 15*1000);
    
    
    
    
    function letSetHeadcount(){
        var doin = false;
    
        return new Promise(resolve => {
            openPkGoScreen("headcount_screen");
    
            function hisDone(){
                const headcount = Number($("#headcount_select").val());
                const generation = Number($("#generation_select").val()) || null;
                const gender = Number($("#gender_select").val()) || null;
                const pdata = structuredClone(LOGIN_DATA.data.custom_data);
    
                pdata["headcount"] = headcount;
                generation ? pdata["generation"] = generation : 0;
                gender ? pdata["gender"] = gender : 0;
        
                if (doin) return;
    
                doin = true;
    
                intoLoad("ehadcount", "middle");
                
                $.post(ajaxpath.setcustom, { customs: JSON.stringify(pdata) })
                .then(function(){
                    LOGIN_DATA.data.custom_data = structuredClone(pdata);
                    PictoNotifier.notifySuccess(TEXTS[LANGUAGE].THANKS_FOR_COOPERATING);
                    document.getElementById("setupheadcount")?.removeEventListener("click", hisDone);
                    closePkGoScreen("headcount_screen");
                    resolve(void 0);
                })
                .catch(() => {
                    PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
                    doin = false;
                })
                .always(() => outofLoad("ehadcount", "middle"));
            }
        
        
            document.getElementById("setupheadcount")?.addEventListener("click", hisDone);
        });
    }
    
    
    
    
    /**
     * @typedef {import("shepherd.js").Tour} ShepherdTour
     * @typedef {import("shepherd.js").StepOptions} ShepherdStepOptions
     */
    
    
    /**@type {{[key: string]: ShepherdTour}} */
    const Shepherd_Tours = {
        main_screen: new Shepherd.Tour({
            defaultStepOptions: {
                classes: "shepherd-theme-arrows",
                scrollTo: false
            }
        }),
        menu: new Shepherd.Tour({
            defaultStepOptions: {
                classes: "shepherd-theme-arrows",
                scrollTo: false
            }
        }),
        ranking: new Shepherd.Tour({
            defaultStepOptions: {
                classes: "shepherd-theme-arrows",
                scrollTo: false
            }
        }),
        article: new Shepherd.Tour({
            defaultStepOptions: {
                classes: "shepherd-theme-arrows",
                scrollTo: false
            }
        }),
    };
    
    
    /**@type {{[key: string]: ShepherdStepOptions[]}} */
    const Shepherd_Tour_Steps = {
        main_screen: [
            {
                title: "階切り替え",
                text: "閲覧する階を変更できます",
                attachTo: {
                    element: "#fsel-xxl",
                    on: "left"
                },
                buttons: [
                    {
                        text: "次へ",
                        action: Shepherd_Tours.main_screen.next
                    }
                ]
            },
            {
                title: "団体",
                text: "タップするとこの場所にある団体の情報を確認できます",
                attachTo: {
                    element: "#disc-swimming",
                    on: "right"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.main_screen.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.main_screen.next
                    }
                ]
            },
            {
                title: "プロフィール",
                text: "ランキングに載るプロフィールを変更できます(アイコン, ニックネーム)",
                attachTo: {
                    element: "#user-profile-opner",
                    on: "top-end"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.main_screen.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.main_screen.next
                    }
                ]
            },
            {
                title: "メニュー",
                text: "タップするとほかのさまざまな機能をご利用いただけます",
                attachTo: {
                    element: "#pkgo_mainb",
                    on: "top"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.main_screen.back
                    },
                    {
                        text: "了解",
                        action: () => {
                            tour_status.main_screen = MOVEPROPERTY.deny = false;
                            Shepherd_Tours.main_screen.next();
                        }
                    }
                ]
            }
        ],
        menu: [
            {
                title: "QRコード",
                text: "入場記録, スタンプラリーに使用し、ポイントを獲得できます",
                attachTo: {
                    element: "#qrcodebuttonman",
                    on: "top"
                },
                buttons: [
                    {
                        text: "次へ",
                        action: Shepherd_Tours.menu.next
                    }
                ]
            },
            {
                title: "ミッション",
                text: "ミッションを達成するとポイントをもらえます(団体に入室された時にもらえるポイントと同じです)。\nポイントが貯まるトランクが上がって、チケットを獲得できます",
                attachTo: {
                    element: "#pkgo_menu1 > div",
                    on: "top"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.menu.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.menu.next
                    }
                ]
            },
            {
                title: "チケット",
                text: "ミッションで獲得したチケットで景品交換ができます",
                attachTo: {
                    element: "#ticketsbuttonman",
                    on: "top"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.menu.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.menu.next
                    }
                ]
            },
            {
                title: "イベント",
                text: "バンドやダンスなどのイベントスケジュールをご確認いただけます",
                attachTo: {
                    element: "#pkgo_menu3 > div",
                    on: "top"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.menu.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.menu.next
                    }
                ]
            },
            {
                title: "展示団体",
                text: "マップに表示されているアイコンの一覧や検索ができます",
                attachTo: {
                    element: "#pkgo_menu5 > div",
                    on: "top"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.menu.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.menu.next
                    }
                ]
            },
            {
                title: "人気投票",
                text: "イベントや、訪れた団体に人気投票することができます",
                attachTo: {
                    element: "#pkgo_menu2 > div",
                    on: "top"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.menu.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.menu.next
                    }
                ]
            },
            {
                title: "グッズ紹介",
                text: "獅子児祭グッズを紹介します",
                attachTo: {
                    element: "#pkgo_menu4 > div",
                    on: "top"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.menu.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.menu.next
                    }
                ]
            },
            {
                title: "飲食",
                text: "獅子児祭での飲食店の一覧をご覧いただけます",
                attachTo: {
                    element: "#pkgo_menu7 > div",
                    on: "bottom"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.menu.back
                    },
                    {
                        text: "終わる",
                        action: () => {
                            Shepherd_Tours.menu.next();
                            tour_status.pkgo = false;
                        }
                    }
                ]
            }
        ],
        ranking: [
            {
                title: "ランキング",
                text: "ミッションptの上位100人が表示されます（それだけです）",
                attachTo: {
                    element: "#go_to_ranking",
                    on: "left-start"
                },
                buttons: [
                    {
                        text: "終わる",
                        action: () => {
                            Shepherd_Tours.ranking.next();
                            tour_status.pkgo = false;
                        }
                    }
                ]
            }
        ],
        article: [
            {
                title: "お気に入り",
                text: "登録されるとそのアイコンの左下に印が付きます。投票などでの絞り込みにもご活用いただけます",
                attachTo: {
                    element: "#dvd2",
                    on: "bottom"
                },
                buttons: [
                    {
                        text: "次へ",
                        action: Shepherd_Tours.article.next
                    }
                ]
            },
            {
                title: "投票",
                text: "訪れた（入場記録をとった）団体には人気投票ができます",
                attachTo: {
                    element: "#dvd3",
                    on: "bottom"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.article.back
                    },
                    {
                        text: "次へ",
                        action: Shepherd_Tours.article.next
                    }
                ]
            },
            {
                title: "詳細",
                text: "団体の詳細情報",
                attachTo: {
                    element: "#ovv-t-details-sd",
                    on: "bottom"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: Shepherd_Tours.article.back
                    },
                    {
                        text: "次へ",
                        action: () => {
                            $("#ovv-t-details-sd").trigger("click");
                            setTimeout(Shepherd_Tours.article.next, 50);
                        }
                    }
                ]
            },
            {
                title: "訪問pt",
                text: "入場記録をとった際に<br>獲得できるミッションptです<br>混雑状況によって変化します",
                attachTo: {
                    element: ".ev_property",
                    on: "bottom"
                },
                buttons: [
                    {
                        text: "戻る",
                        action: () => {
                            $("#ovv-t-description-sd").trigger("click");
                            setTimeout(Shepherd_Tours.article.back, 50);
                        }
                    },
                    {
                        text: "終わる",
                        action: () => {
                            Shepherd_Tours.article.next();
                            tour_status.article = false;
                        }
                    }
                ]
            }
        ]
    };
    
    
    +function(){
        for (const [tourname, steps] of Object.entries(Shepherd_Tour_Steps)){
            const tour = Shepherd_Tours[tourname];
            steps.forEach(step => tour.addStep(step));
        }
    }();
    
    
    
    
    /**
     * 
     * @param {import("../shishiji-dts/objects").advertisementData} adData <- number currently
     */
    function createAdvNode(adData){
        const sponsorElement = document.createElement("div");
        sponsorElement.classList.add("LXId");
        sponsorElement.innerHTML = `
            <div class="uhbAJw" style="background-image:url(/resources/img/advertisement/tfn-${adData}.png)">
    
            </div>
        `;
    
        return sponsorElement;
    }
    
    
    /**
     * @this {HTMLElement}
     * @param {Event} e 
     */
    function closeTopAdvertisement(e){
        //@ts-ignore
        if (e.target?.id == "top-advertisement-img")
            return;
        $("shishiji-fking-advertisement").addClass("hidden-adv");
    }
    
    
    /**
     * 
     * @param {string} imgpath 
     */
    function displayTopAdvertisement(imgpath){
        $("#top-advertisement-img").attr("src", imgpath);
        $("shishiji-fking-advertisement").removeClass("hidden-adv");
    }
    
    
    
    
    /**
     * when #oive_a is clicked
     */
    function openSearchScreen(){
        openPkGoScreen("search_screen");
        $("#ovie_search_boxw").removeClass("closeL").addClass("openH");
    
        if (!$("#search_result").hasClass("searchen")){
            $("#search_result")
            .empty().off("scroll", showArticleOnScroll).addClass("searchen");
            displayDefaultSearchResult(true);
        } else {
            showLittleArticle();
        }
    }
    
    
    function closeSearchArea(){
        $("#ovie_search_boxw").removeClass("openH").addClass("closeL");
        //$("#search_result").empty();
        $("#oive_a").removeClass("hello").addClass("bye_cry").show();
    }
    
    
    async function showArticleOnScroll(){
        return;
        $(".ABId.wwwnotwith").each(function(){
            var position = this.offsetTop;
            var scroll = $("#search_result").scrollTop() || 0;
            var windowHeight = window.innerHeight;
            
            if (position - scroll < windowHeight){
                const _self = $(this).find(".notwithdetails");
                const disc = _self.attr("disc") || "";
    
                this.classList.remove("wwwnotwith");
                _self.removeClass("notwithdetails");
    
                (function _deprecated(){
                    function __ajax(){
                        $.post(ajaxpath.getart+"?discriminator="+disc, { })
                        .then(data => {
                            _self.html(getHTMLtextContent(
                                getHTMLtextContent(mcFormat(data.article, ()=>""))
                            ) || "詳細を確認できませんでした。");
                        }).fail(__ajax);
                    }
                    __ajax();
                })();
            }
        });
    }
    
    
    /**@ts-ignore @type {JQuery.jqXHR} */
    var _ALL_ART = new Promise(r => r(null));
    
    async function showLittleArticle(){
        var allart = await _ALL_ART;
    
        if (allart == null){
            allart = _ALL_ART = $.post(ajaxpath.getallart);
            allart = await allart;
            //@ts-ignore
            setTimeout(() => _ALL_ART = new Promise(r => r(null)), 5000);
        }
        
        function myload(){
            var t = {}
            for (const disc in allart.article){
                t[disc] = getHTMLtextContent(mcFormat(allart.article[disc] || "", ()=>""))
            }
            window.navigator.clipboard.writeText(JSON.stringify(t, null, 4));
        }
        
        $(".ABId.wwwnotwith").each(function(){
            const _self = $(this).find(".notwithdetails");
            const disc = _self.attr("disc") || "";
            
            _self.html(getHTMLtextContent(
                getHTMLtextContent(mcFormat(allart.article[disc] || "", ()=>""))
            ) || "詳細を確認できませんでした。");
    
            var crowd = Number(allart.crowd[disc]);
            crowd = crowd == 0 ? 1 : crowd;
            $("#sstatus-disc-"+disc).removeClass("n1 n2 n3 n0").addClass(`n${crowd}`);
        });
    }
    
    
    function filterSearchMen(){
        const is_only_fav = $("#fav_search").attr("fav_search");
    
        if (is_only_fav){
            $(".holdmeLikeThat").each(function(el){
                if (!LOGIN_DATA.data.favorited_orgs.includes(this.getAttribute("disc") || ""))
                    this.style.display = "none";
            });
        } else {
            $(".holdmeLikeThat").show();
        }
        
        $(".LXId").remove();
        insertAdvertisement();
    }
    
    
    /**
     * 
     * @param {string[]} sort 
     */
    function resortSearches(sort){
        /**@type {{[key: string]: HTMLElement}} */
        const objectElements = {};
        
        displayDefaultSearchResult(false);
    
        $("#search_result").children().each(function(){
            const disc = this.getAttribute("disc");
            if (!disc) return;
            //@ts-ignore
            objectElements[disc] = this;
        });
    
        $("#search_result").empty();
    
        for (const disc of sort){
            $("#search_result").append(objectElements[disc]);
        }
        $("#search_result").trigger("scroll");
    
        filterSearchMen();
    }
    
    
    /**
     * 
     * @param {boolean} addListener 
     */
    function displayDefaultSearchResult(addListener){
        /**@ts-ignore @type {HTMLElement} */
        const result_box = document.getElementById("search_result");
        const is_only_fav = $("#fav_search").attr("fav_search");
        var no_content = true;
        
        $("#search_result").empty().scrollTop(0);
    
        for (const [evname, dat] of Object.entries(mapObjectComponent)){
            if (is_only_fav && !LOGIN_DATA.data.favorited_orgs.includes(evname))
                continue;
            if (dat.article){
                const nTypeC = document.createElement("div");
                nTypeC.appendChild(createSearchNode(dat));
                const meTc = nTypeC.children[0];
                meTc.addEventListener("click", function(){
                    setParam(ParamName.ARTICLE_ID, dat.discriminator);
                    raiseOverview();
                    writeArticleOverview(dat, true, void 0, void 0, void 0, true);
                });
                result_box.appendChild(meTc);
    
                no_content = false;
            }
        }
    
        insertAdvertisement();
        
        /*if (addListener)
            $("#search_result").on("scroll", showArticleOnScroll);*/
    
        $("#search_result").trigger("scroll");
        showLittleArticle();
    
        if (is_only_fav && no_content){
            const ticketcaution = document.createElement("span");
            ticketcaution.classList.add("iuhagW", "UghaWW");
            ticketcaution.textContent = TEXTS[LANGUAGE].HOW_TO_FAV;
            $("#search_result").append(ticketcaution);
            return;
        }
    }
    
    
    function insertAdvertisement(){
        const artLength = $(".holdmeLikeThat:not([style*=\"display: none\"])").length;
        const addeds = [];
    
        search_adv_promise.then(
            /** @param {advertisementData[]} advData */
            advData => {
                advData = Random.shuffleArray(advData);
    
                const adlength = advData.length;
                const freqency = Math.floor(artLength/advData.length);
    
                if (freqency < 4){
                    advData = advData.slice(0, Math.floor(artLength/4));
                }
                if (freqency == 0) return;
                for (var x = freqency; x < artLength; x = x + freqency){
                    const f = Math.floor(x/freqency) - 1;
                    $(".holdmeLikeThat").eq(x).after(
                        createAdvNode(advData[f])
                    );
                    addeds.push(f)
                }
    
                countAd("search-screen", addeds.join(" "));
            }
        );
    }
    
    
    /**
     * 
     * @param {mapObject} data 
     */
    function createSearchNode(data){
        const pcvt = getPathConverter(data);
        const gcc = {
            "1F": "1階",
            "2F": "2階",
            "3F": "3階",
            "4F": "4階"
        };
    
        const abIdDiv = document.createElement("div");
        abIdDiv.classList.add("ABId", "wwwnotwith", "holdmeLikeThat");
        abIdDiv.setAttribute("disc", data.discriminator);
        const biFffDiv = document.createElement("div");
        biFffDiv.classList.add("BIfff");
        const iconDiv = document.createElement("div");
        iconDiv.classList.add("IcoNium");
        const statusDiv = document.createElement("div");
        statusDiv.classList.add("haVUn");
        statusDiv.id = "sstatus-disc-"+data.discriminator;
        const iconImg = document.createElement("img");
        iconImg.src = pcvt(data.discriminator, data.object.images.icon);
        iconDiv.appendChild(iconImg);
        iconDiv.appendChild(statusDiv);
        const titleH2 = document.createElement("h2");
        titleH2.textContent = data.article.title;
        biFffDiv.appendChild(iconDiv);
        biFffDiv.appendChild(titleH2);
        const venueH4 = document.createElement("h4");
        venueH4.classList.add("auygsWU");
        venueH4.textContent = `${gcc[data.object.floor]}${data.article.venue ? ", " + data.article.venue : ""}`;
        const ainbuDiv = document.createElement("div");
        ainbuDiv.classList.add("AINBU");
        const subtitleH3 = document.createElement("h3");
        subtitleH3.classList.add("smlTtl");
        subtitleH3.textContent = data.article.subtitle || "";
        const ezDesDiv = document.createElement("div");
        ezDesDiv.classList.add("EZdes");
        const contentSpan = document.createElement("span");
        contentSpan.classList.add("janS", "notwithdetails");
        contentSpan.setAttribute("disc", data.discriminator);
        ezDesDiv.appendChild(contentSpan);
        ainbuDiv.appendChild(subtitleH3);
        ainbuDiv.appendChild(ezDesDiv);
        abIdDiv.appendChild(biFffDiv);
        abIdDiv.appendChild(venueH4);
        abIdDiv.appendChild(ainbuDiv);
        
        return abIdDiv;
    }
    
    
    function searchMapObject(){
        const query = $("#org_search_input").val();
        if (loadProcesses.middle.includes("search mapobject") || !query) return;
            intoLoad("search mapobject", "middle");
            
        $.ajax({
            url: ajaxpath.search+`?q=${$("#org_search_input").val()}`,
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({ query: query }),
            crossDomain: true
        })
            .then(result => {
                resortSearches(result);
                outofLoad("search mapobject", "middle");
            })
            .catch(() => PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY))
            .always(() => outofLoad("search mapobject", "middle"));
    }
    
    
    
    
    function openFaqScreen(){
        openPkGoScreen("faq_screen");
    }
    
    
    
    
    /**@type {MediaStream[]} */
    const pendingMediaStreams = [];
    
    
    function startScanningStamp(){
        openPkGoScreen("stamp_rally_scan_screen");
        intoLoad("opening camera", "middle");
    
        if (!("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices))
            PictoNotifier.notifyError(TEXTS[LANGUAGE].BROWSER_DOESNT_HAVE_CAMERA_FUNC);
        else setTimeout(async ()=>{
            /**@ts-ignore @type {HTMLVideoElement} */
            const video = document.getElementById("qrcode-video");
            /**@ts-ignore @type {HTMLCanvasElement} */
            const cvs = document.getElementById("camera-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = cvs.getContext("2d");
            /**@ts-ignore @type {HTMLCanvasElement} */
            const rectCvs = document.getElementById("rect-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const rectCtx =  rectCvs.getContext("2d");
            /**@param {string} url */
            const foundQRCode = (url) => {
                foundStampRally(url);
                $("#close_button_of_stamp_rally_scan_screen").trigger("click");
            }
            const drawRect = (location) => {
                rectCvs.width = contentWidth;
                rectCvs.height = contentHeight;
                drawLine(location.topLeftCorner, location.topRightCorner);
                drawLine(location.topRightCorner, location.bottomRightCorner);
                drawLine(location.bottomRightCorner, location.bottomLeftCorner);
                drawLine(location.bottomLeftCorner, location.topLeftCorner)
            }
            const drawLine = (begin, end) => {
                rectCtx.lineWidth = 4;
                rectCtx.strokeStyle = "#50C878";
                rectCtx.beginPath();
                rectCtx.moveTo(begin.x, begin.y);
                rectCtx.lineTo(end.x, end.y);
                rectCtx.stroke();
            }
            const canvasUpdate = () => {
                cvs.width = contentWidth;
                cvs.height = contentHeight;
                ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
                requestAnimationFrame(canvasUpdate);
            }
            const checkImage = async () => {
                const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
                const code = jsQR(imageData.data, contentWidth, contentHeight);
    
                if (code && code.data){
                    drawRect(code.location);
                    intoLoad("stamp code read", "middle");
                    setTimeout(()=>{
                        foundQRCode(code.data);
                        outofLoad("stamp code read", "middle");
                        ctx.clearRect(0, 0, cvs.width, cvs.height);
                        rectCtx.clearRect(0, 0, rectCvs.width, rectCvs.height);
                    }, 490);
                    return;
                } else {
                    rectCtx.clearRect(0, 0, contentWidth, contentHeight);
                }
                setTimeout(()=>{ checkImage() }, 500);
            }
            var contentWidth;
            var contentHeight;
    
            const media = navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        width: screen.height,
                        height: screen.width,
                        facingMode: {
                            exact: "environment"
                        }
                    }
                }).then((stream) => {
                    pendingMediaStreams.push(stream);
                    video.srcObject = stream;
                    video.onloadeddata = () => {
                        video.play();
                        contentWidth = video.clientWidth;
                        contentHeight = video.clientHeight;
                        canvasUpdate();
                        checkImage();
                        if (!loadProcesses.middle.includes("opening camera")){
                            stream.getTracks().forEach(track => track.stop());
                        } else {
                            outofLoad("opening camera", "middle");
                        }
                    }
                }).catch((e) => {
                    var notifytext = "";
                    switch (e.toString()){
                        case "OverconstrainedError":
                        case "NotFoundError":
                            notifytext = "CAMERA_NOT_FOUND";
                            break;
                        case "NotReadableError":
                            notifytext = "SYSTEM_ERROR";
                            break;
                        case "TypeError":
                            notifytext = "UNKNOWN_ERROR";
                            break;
                        case "SecurityError":
                        default:
                            notifytext = "PLEASE_ALLOW_CAMERA";
                            break;
                    }
                    PictoNotifier.notifyError(TEXTS[LANGUAGE][notifytext], {
                        discriminator: "camera error",
                        do_not_keep_previous: true,
                    });
                    closePkGoScreen("stamp_rally_scan_screen");
                    outofLoad("opening camera", "middle");
                });
                
        }, 250);
    }
    
    
    /**
     * 
     * @param {string} url 
     */
    function foundStampRally(url){
        openPkGoScreen("stamp_rally_scanned_screen");
        $("#uhgaiaSafs").text(url);
    }
    
    
    
    
    function openMyqrcodeScreen(){
        openPkGoScreen("myqrcode_screen");
        $("#myqrcode").attr("src", "");
    
        $.post(ajaxpath.mqr)
        .then(dataurl => {
            const blob_ = dataURLtoBlob(dataurl);
            $("#myqrcode").attr("src", URL.createObjectURL(blob_));
        })
        .catch(err => {
            PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_LOADING_QRCODE);
        });
    }
    
    
    
    
    class PokeGOMenu{
        /**
         * 
         * @param {boolean} [nose] 
         */
        static oepn(nose){
            $("#pkgo_menu_closeAWW").removeClass("oAIKSD");
            $("#pkgo_mainb").css({"pointer-events": "none", "visibility": "hidden"});
            $("#pkgo_menu_close")
            .removeClass("imdisplaynone iiasdIOJAGDjafjiofjoijaoijs")
            .addClass("iiasdIOJ");
            $(".pkgo_menu_insidew").removeClass("oafs");
            $(".pok_anom")
            .removeClass("imdisplaynone aUDGJHJSduijujaijuigsdjuio")
            .addClass("opening_yey");
            $("pokemon-gradient")
            .removeClass("aggjg")
            .addClass("uiagg");
            $("#pkgo_menu_OPEN_RETAINER")
            .removeClass("gauhi8yS");
            $("spreads").removeClass("AUHISGFjjj");
            $(".pkm__h").addClass("AIOSJ");
            $("#theme-meta").attr("content", "#4b4f52");
        }
    
        /**
         * 
         * @param {boolean} [nose] 
         */
        static close(nose){
            $("#pkgo_menu_closeAWW").addClass("oAIKSD");
            $("#pkgo_mainb").css({"pointer-events": "all", "visibility": "visible"});
            $("#pkgo_menu_close")
            .removeClass("iiasdIOJ")
            .addClass("iiasdIOJAGDjafjiofjoijaoijs");
            $(".pkgo_menu_insidew").addClass("oafs");
            $(".pok_anom")
            .removeClass("opening_yey")
            .addClass("aUDGJHJSduijujaijuigsdjuio");
            $("pokemon-gradient")
            .removeClass("uiagg")
            .addClass("aggjg");
            $("#pkgo_menu_OPEN_RETAINER")
            .addClass("gauhi8yS");
            $("#theme-meta").attr("content", "#15202b");
        }
    
    
        static get opened(){
            return !$("#pkgo_menu_closeAWW").hasClass("oAIKSD");
        }
    }
    
    
    function _endpkGof(e){
        e.preventDefault();
        PokeGOMenu.close();
    }
    
    
    /**@this {HTMLElement} */
    function _pkGoPork_atm(){
        const g = $(this).find("spreads");
    
        setTimeout(()=>g.addClass("AUHISGFjjj"), 1)
        g.removeClass("AUHISGFjjj");
    }
    
    
    
    
    function openProfileScreen(){
        if (tour_status.main_screen) return;
        openPkGoScreen("profile_screen");
    
        /*$("#user-name-input").val(LOGIN_INFO.data.profile.nickname);
        LOGIN_INFO.data.profile.icon_path ? $("#user-icon-change")
        .css("background-image", cssURL(LOGIN_INFO.data.profile.icon_path, true)) : void 0;
        profileSaveingInfo.situation.nickname = false;
        profileSaveingInfo.situation.icon_path = false;*/
    }
    
    
    /**
     * @this {HTMLInputElement}
     */
    function onChangeIconInputChange(){
        if (!this.files){
            PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
            return;
        }
    
        const imagefile = this.files[0];
        const blobURL = URL.createObjectURL(imagefile);
    
        $("#user-icon-change").css("background-image", "url("+blobURL+")");
    
        profileSaveingInfo.situation.icon_path = true;
    }
    
    
    async function saveProfileDetails(){
        /**@ts-ignore @type {File[] | null} */
        const imagefiles = document.getElementById("chiconinputimgae")?.files;
        /**@ts-ignore @type {string} */
        const selfNickName = document.getElementById("user-name-input")?.value.replace(/^\s+/, "") || "";
        /**@ts-ignore @type {File} */
        var iconImag = null;
    
        const gx = function(){
            profileSaveingInfo.saving = false;
            PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
        };
    
        if (Object.values(profileSaveingInfo.situation).every(p => !p) || profileSaveingInfo.saving)
            return;
    
        if (!selfNickName){
            PictoNotifier.notifyError(TEXTS[LANGUAGE].NICKNAME_CANT_BE_EMPTY);
            return;
        } else if (selfNickName.length > 12){
            PictoNotifier.notifyError(TEXTS[LANGUAGE].NICKNAME_TOO_LONG);
            return;
        }
    
        const resizeImage = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(event){
                    const img = new Image();
    
                    //@ts-ignore
                    img.src = event.target.result;
    
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        let width = img.width;
                        let height = img.height;
    
                        if (width > height){
                            if (width > 256) {
                                height = height * (256 / width);
                                width = 256;
                            }
                        } else {
                            if (height > 256){
                                width = width * (256 / height);
                                height = 256;
                            }
                        }
    
                        canvas.width = width;
                        canvas.height = height;
                        ctx?.drawImage(img, 0, 0, width, height);
    
                        canvas.toBlob(function(blob){
                            if (blob){
                                const resizedFile = new File([blob], file.name, { type: file.type });
                                resolve(resizedFile);
                            } else {
                                reject(new Error());
                            }
                        }, file.type || "image/png");
                    };
    
                    img.onerror = function() {
                        reject(new Error());
                    };
                };
                reader.readAsDataURL(file);
            });
        };
    
        if (imagefiles && imagefiles[0]){
            iconImag = imagefiles[0];
            try {
                iconImag = await resizeImage(iconImag);
            } catch (e){
                gx();
                return;
            }
        }
    
        const formData = new FormData();
        formData.append("file", iconImag);
        formData.append("nickname", selfNickName);
        profileSaveingInfo.saving = true;
        intoLoad("profile-saver", "top");
    
        $.ajax({
            url: ajaxpath.profileupd,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
        }).done((resultLike) => {
            profileSaveingInfo.saving = 
            profileSaveingInfo.situation.icon_path = 
            profileSaveingInfo.situation.nickname = false;
            LOGIN_DATA.data.profile.nickname = resultLike.nickname;
            LOGIN_DATA.data.profile.icon_path = resultLike.icon_path;
    
            $("#user-name-input").val(LOGIN_DATA.data.profile.nickname);
            $("#user-name").text(LOGIN_DATA.data.profile.nickname);
    
            LOGIN_DATA.data.profile.icon_path ? $("#user-icon, #user-icon-change")
            .css("background-image", cssURL(LOGIN_DATA.data.profile.icon_path, true)) : void 0;
    
            PictoNotifier.notifySave(TEXTS[LANGUAGE].PROFILE_SAVED, {
                do_not_keep_previous: true
            });
        }).fail(gx).always(() => outofLoad("profile-saver", "top"));
    }
    
    
    
    
    /**@type {string[]} */
    var _famevote_selecteds = [];
    
    
    function openVoteScreen(){
        openPkGoScreen("vote_screen");
    }
    
    
    /**
     * 
     * @param {string[]} [appendies] 
     */
    function openFameVoteScreen(appendies){
        const toggler = document.getElementById("aiUHGG");
    
        openPkGoScreen("fame_vote_screen");
        toggler?.classList.remove("faui");
        //@ts-ignore THAT'S OK
        $(toggler?.children[0]?.children[0]).show();$(toggler?.children[0].children[1]).hide();
        toggler?.removeAttribute("stricted");
        setFameVote(appendies);
    }
    
    
    /**
     * 
     * @param {string[]} [appendies] 
     */
    function setFameVote(appendies){
        const havewent = LOGIN_DATA.data.completed_orgs;
        const real_includes = [...LOGIN_DATA.data.fame_votes];
        var scrinto = null;
    
        _famevote_selecteds = [...LOGIN_DATA.data.fame_votes];
        _famevote_selecteds = appendies ? appendies : _famevote_selecteds;
        //_famevote_selecteds.push(...(appndies || []));
    
        const goto_ = appendies?.[0] || _famevote_selecteds[0] || "";
    
        $("#dumn_heres_new_way > .CDId, .iuhagW").remove();
        $("#dumn_heres_new_way").scrollTop(0);
        for (const orgid of havewent){
            const orgdata = getMapObjectData(orgid);
    
            if (orgdata && orgdata.article){
                const div_ = createFameVoteElement(orgdata,
                    _famevote_selecteds.includes(orgid), real_includes.includes(orgid));
                if (orgdata.discriminator == goto_) scrinto = div_;
                $("#dumn_heres_new_way").append(div_);
            }
        }
        $("#vote_right_now").hide();
        setFameVoteButton(true);
    
        const top = (scrinto?.offsetTop || 0) - window.innerHeight/2 + 100 + 40.5;
        $("#dumn_heres_new_way").scrollTop(top);
    
        if (havewent.length == 0){
            const ticketcaution = document.createElement("span");
            ticketcaution.classList.add("iuhagW");
            ticketcaution.textContent = TEXTS[LANGUAGE].HOW_TO_FAME_VOTE;
            $("#dumn_heres_new_way").append(ticketcaution);
        }
    }
    
    
    /**
     * 
     * @param {mapObject} objdata 
     * @param {boolean} selected 
     * @param {boolean} leader 
     */
    function createFameVoteElement(objdata, selected, leader){
        const descdiv = document.createElement("div");
        const div1 = document.createElement("div");
        div1.classList.add("CDId");
        const GGID = document.createElement("div");
        GGID.classList.add("GGId");
        GGID.setAttribute("duty", objdata.discriminator);
        const div3 = document.createElement("div");
        div3.classList.add("BIfff");
        const divY = document.createElement("div");
        divY.classList.add("AUYHs");
        const div4 = document.createElement("div");
        div4.classList.add("IcoNium");
        const img = document.createElement("img");
        img.src = toOrgFilepath(objdata.discriminator, objdata.object.images.icon);
        const h2 = document.createElement("h2");
        h2.textContent = objdata.article.title;
        div4.appendChild(img);
        div3.appendChild(div4);
        div3.appendChild(h2);
        GGID.appendChild(div3);
        GGID.appendChild(divY);
        div1.appendChild(GGID);
        descdiv.classList.add("asujwaGTGg", "manyyearshaspassed");
        div1.appendChild(descdiv);
    
        descdiv.addEventListener("click", function(){
            setParam(ParamName.ARTICLE_ID, objdata.discriminator);
            raiseOverview();
            writeArticleOverview(objdata, true, void 0, void 0, void 0, true);
        });
        GGID.addEventListener("click", function(){
            const disc = this.getAttribute("duty") || "";
            const _self = this;
    
            _famevote_selecteds.includes(disc) ?
                +function(){
                    _famevote_selecteds = _famevote_selecteds.filter(f => f !== disc);
                    _famevote_selecteds = [];
                    $(".GGId").removeClass("imselected");
                    _self.classList.remove("imselected");
                }()
                 : 
                +function(){
                    _famevote_selecteds.push(disc);
                    _famevote_selecteds = [ disc ];
                    $(".GGId").removeClass("imselected");
                    _self.classList.add("imselected");
                }();
            setFameVoteButton();
        });
    
    
        if (selected)
            GGID.classList.add("imselected");
        if (leader)
            GGID.classList.add("imcurrentleader");
    
        return div1;
    }
    
    
    /**
     * 
     * @param {boolean} [_noeditdisplayleast] 
     */
    function setFameVoteButton(_noeditdisplayleast){
        _noeditdisplayleast ? void 0 : $("#vote_right_now").show();
        
        arrayEqual(_famevote_selecteds, LOGIN_DATA.data.fame_votes) ?
        $("#vote_right_now").removeClass("imhere").addClass("imbye")
         : +function(){
            $("#vote_right_now").removeClass("imbye").addClass("imhere");
            $("#vote_right_now").show();
        }();
    }
    
    
    /**
     * @this {HTMLElement}
     */
    function toggleFameVoteFavorte(){
        const stricted = this.getAttribute("stricted");
        
        if (stricted){
            this.classList.remove("faui");
            $(this.children[0].children[0]).show();
            $(this.children[0].children[1]).hide();
            this.removeAttribute("stricted");
        } else {
            this.classList.add("faui");
            $(this.children[0].children[0]).hide();
            $(this.children[0].children[1]).show();
            this.setAttribute("stricted", "true");
        }
    
        const showonly = !stricted;
    
        if (showonly)
            $(".CDId").each(function(){
                if (!LOGIN_DATA.data.favorited_orgs.includes(this.children[0].getAttribute("duty") || "")){
                    this.style.display = "none";
                }
            });
        else
            $(".CDId").show();
    }
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/supports").EventScheduleElement} EventScheduleElement
     * @typedef {import("../shishiji-dts/supports").BanceScheduleElement} BanceScheduleElement
     * @typedef {import("../shishiji-dts/supports").MiscEventDataWrapper} MiscEventDataWrapper
     * @typedef {import("../shishiji-dts/supports").MiscScheduleElement} MiscScheduleElement
     * @typedef {import("../shishiji-dts/supports").EventDataWrapper} EventDataWrapper
     * @typedef {import("../shishiji-dts/supports").Time24} Time24 
     */
    
    
    var _bandvote_selecteds = [];
    var _dancevote_selecteds = [];
    var _miscvote_selecteds = [];
    
    
    function openEventVoteSelectorScreen(){
        openPkGoScreen("event_vote_selector_screen");
    }
    
    
    function openEventScreen(){
        openPkGoScreen("event_screen");
    }
    
    
    /**
     * 
     * @param {keyof EventDataComponent} type 
     */
    function openEventVoteScreen(type){
        return async function(){
            var this_time_selected = [];
    
            openPkGoScreen("event_vote_screen");
            
            _bandvote_selecteds = [...LOGIN_DATA.data.band_votes];
            _dancevote_selecteds = [...LOGIN_DATA.data.dance_votes];
            _miscvote_selecteds = [...LOGIN_DATA.data.misc_votes];
        
            $("#evote_right_now").hide();
            $("#godric_manager > .godric-father").remove();
            $("#godric_manager").scrollTop(0);
    
            switch(type){
                case "band":$("#evote_type").text("バンド人気投票");this_time_selected = [..._bandvote_selecteds];break;
                case "dance":$("#evote_type").text("ダンス人気投票");this_time_selected = [..._dancevote_selecteds];break;
                case "misc":$("#evote_type").text("その他人気投票");this_time_selected = [..._miscvote_selecteds];break;
            }
        
            var goes = null;
    
            /**
             * 
             * @param {string} evname 
             * @returns {Promise<BanceScheduleElement | EventScheduleElement | null>}
             */
            async function searchEventData(evname){
                const daybyday = (await event_data_promise)[type];
                
                if (type == "misc"){
                    for (const _daybyday of Object.values(daybyday)){
                        if (Array.isArray(_daybyday)) continue;
                        for (const evd of [..._daybyday.day1, ..._daybyday.day2]){
                            if (evd.name == evname) return evd;
                        }
                    }
                } else {
                    /* @ts-ignore -> definitely {BanceScheduleElement[]} */
                    for (const evd of [...daybyday.day1, ...daybyday.day2]){
                        if (evd.name == evname) return evd;
                    }
                }
                return null;
            }
            
            for (const ev of (await event_data_promise)[type].vote){
                const cheelm = await searchEventData(ev);
    
                if (cheelm == null){
                    console.log(ev);
                    continue;
                }
    
                const el = createEventVoteElement(cheelm, type);
                $("#godric_manager").append(el);
                if (this_time_selected[0] == ev) goes = el;
            }
    
            setEvoteButton(type);
    
            const top = (goes?.offsetTop || 0) - window.innerHeight/2 + 100 + 50;
            $("#godric_manager").scrollTop(top);
        }
    }
    
    
    /**
     * @param {keyof EventDataComponent} type 
     */
    function setEvoteButton(type){
        prevListener.evote = function(){
            if ($("#evote_right_now").attr("wait")) return;
    
            var evotes = [];
            var prev_evotes = [];
            switch(type){
                case "band": evotes = [..._bandvote_selecteds];prev_evotes = [...LOGIN_DATA.data.band_votes];break;
                case "dance": evotes = [..._dancevote_selecteds];prev_evotes = [...LOGIN_DATA.data.dance_votes];break;
                case "misc": evotes = [..._miscvote_selecteds];prev_evotes = [...LOGIN_DATA.data.misc_votes];break;
            }
        
            intoLoad("evote", "middle");
            $("#evote_right_now").attr("wait", "true");
        
            $.post(ajaxpath.updevote, { evotes: JSON.stringify(evotes), et: type })
            .then(() => {
                if (prev_evotes.length > 0 && evotes.length> 0)
                    PictoNotifier.notifySuccess(TEXTS[LANGUAGE].VOTE_CHANGED);
                else if (evotes.length > 0)
                    PictoNotifier.notifySuccess(TEXTS[LANGUAGE].VOTED);
                else
                    PictoNotifier.notifySuccess(TEXTS[LANGUAGE].CANCELED_VOTING);
    
                $(".imcurrentvold").removeClass("imcurrentvold");
    
                switch(type){
                    case "band":
                        LOGIN_DATA.data.band_votes = [..._bandvote_selecteds];
                        $(".godric-father").each(function(){
                            if (LOGIN_DATA.data.band_votes.includes(this.children[0].getAttribute("duty") || ""))
                                this.classList.add("imcurrentvold");
                        });
                    break;
                    case "dance":
                        LOGIN_DATA.data.dance_votes = [..._dancevote_selecteds];
                        $(".godric-father").each(function(){
                            if (LOGIN_DATA.data.dance_votes.includes(this.children[0].getAttribute("duty") || ""))
                                this.classList.add("imcurrentvold");
                        });
                    break;
                    case "misc":
                        LOGIN_DATA.data.misc_votes = [..._miscvote_selecteds];
                        $(".godric-father").each(function(){
                            if (LOGIN_DATA.data.misc_votes.includes(this.children[0].getAttribute("duty") || ""))
                                this.classList.add("imcurrentvold");
                        });
                    break;
                }
    
                setEventVoteButton(type);
            })
            .catch(() => {
                PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
            })
            .always(() => {
                outofLoad("evote", "middle");
                $("#evote_right_now").attr("wait", null);
            });
        }
    }
    
    
    /**
     * @param {BanceScheduleElement | EventScheduleElement} eventdat 
     * @param {keyof EventDataComponent} type 
     */
    function createEventVoteElement(eventdat, type){
        const divs = document.createElement("div");
        const XYId = document.createElement("div");
        XYId.classList.add("XYId");
        XYId.setAttribute("duty", eventdat.name);
        const h2 = document.createElement("h2");
        h2.textContent = eventdat.name;
        const p = document.createElement("p");
        const hj = document.createElement("div");
        const ico_n = document.createElement("img");
        //@ts-ignore
        if (eventdat.musics) p.textContent = "楽曲: " + eventdat.musics;
        ico_n.onerror = () => ico_n.remove();
        ico_n.src = `/resources/cloud/event/${type}/${eventdat.name.replace(/ /g, "_")}/icon.png`;
        ico_n.classList.add("Oiniums");
        hj.classList.add("fuaAW");
        hj.appendChild(ico_n);
        hj.appendChild(h2);
        XYId.appendChild(hj);
        XYId.appendChild(p);
        divs.appendChild(XYId);
        divs.classList.add("godric-father");
        
        XYId.addEventListener("click", function(){
            const disc = this.getAttribute("duty") || "";
            const _self = this;
    
            $(".godric-father").removeClass("imnihher");
            switch (type){
                case "band":
                    _bandvote_selecteds.includes(disc) ?
                    +function(){
                        _bandvote_selecteds = _bandvote_selecteds.filter(f => f !== disc);
                        _bandvote_selecteds = [];
                        _self.parentElement?.classList.remove("imnihher");
                    }()
                     : 
                    +function(){
                        _bandvote_selecteds.push(disc);
                        _bandvote_selecteds = [ disc ];
                        _self.parentElement?.classList.add("imnihher");
                    }();
                    break;
                case "dance":
                    _dancevote_selecteds.includes(disc) ?
                    +function(){
                        _dancevote_selecteds = _dancevote_selecteds.filter(f => f !== disc);
                        _dancevote_selecteds = [];
                        _self.parentElement?.classList.remove("imnihher");
                    }()
                     : 
                    +function(){
                        _dancevote_selecteds.push(disc);
                        _dancevote_selecteds = [ disc ];
                        _self.parentElement?.classList.add("imnihher");
                    }();
                    break;
                case "misc":
                    _miscvote_selecteds.includes(disc) ?
                    +function(){
                        _miscvote_selecteds = _miscvote_selecteds.filter(f => f !== disc);
                        _miscvote_selecteds = [];
                        _self.parentElement?.classList.remove("imnihher");
                    }()
                     : 
                    +function(){
                        _miscvote_selecteds.push(disc);
                        _miscvote_selecteds = [ disc ];
                        _self.parentElement?.classList.add("imnihher");
                    }();
                    break;
            }
    
            setEventVoteButton(type);
        });
    
        
        switch(type){
            case "band":_bandvote_selecteds.includes(eventdat.name) ? divs.classList.add("imnihher", "imcurrentvold") : void 0;break;
            case "dance":_dancevote_selecteds.includes(eventdat.name) ? divs.classList.add("imnihher", "imcurrentvold") : void 0;break;
            case "misc":_miscvote_selecteds.includes(eventdat.name) ? divs.classList.add("imnihher", "imcurrentvold") : void 0;break;
        }
    
    
        return divs;
    }
    
    
    /**
     * 
     * @param {keyof EventDataComponent} type 
     */
    function setEventVoteButton(type){
        $("#evote_right_now").show();
        
        switch(type){
            case "band":
                arrayEqual(_bandvote_selecteds, LOGIN_DATA.data.band_votes) ?
                $("#evote_right_now").removeClass("imhere").addClass("imbye")
                 : $("#evote_right_now").removeClass("imbye").addClass("imhere");
                break;
            case "dance":
                arrayEqual(_dancevote_selecteds, LOGIN_DATA.data.dance_votes) ?
                $("#evote_right_now").removeClass("imhere").addClass("imbye")
                 : $("#evote_right_now").removeClass("imbye").addClass("imhere");
                break;
            case "misc":
                arrayEqual(_miscvote_selecteds, LOGIN_DATA.data.misc_votes) ?
                $("#evote_right_now").removeClass("imhere").addClass("imbye")
                 : $("#evote_right_now").removeClass("imbye").addClass("imhere");
                break;
        }
    }
    
    
    function openMiscEventVenueScreen(){
        openPkGoScreen("misc_event_venue_screen");
    }
    
    
    /**
     * 
     * @param {keyof EventDataComponent} type 
     * @param {string} [miscvenue] 
     */
    function openEventShedulerScreen(type, miscvenue){
        return async function(){
            openPkGoScreen("event_scheduler_screen");
            readyEventScheduleTable(type, miscvenue);
        }
    }
    
    
    /**
     * 
     * @param {keyof EventDataComponent} type 
     * @param {string} [miscvenue] 
     */
    async function readyEventScheduleTable(type, miscvenue){
        const delpromise = await delay_promise;
    
        $("#godric_manager_pre").empty().scrollTop(0);
    
        switch(type){
            case "band":$("#event_type").text("バンドスケジュール");break;
            case "dance":$("#event_type").text("ダンススケジュール");break;
            case "misc":$("#event_type").text(`${miscvenue} - スケジュール`);break;
        }
        
        SCHEDULE_DELAY.BAND_SCHEDULE_DELAY = Number.isNaN(SCHEDULE_DELAY.BAND_SCHEDULE_DELAY) ? delpromise["b"] : SCHEDULE_DELAY.BAND_SCHEDULE_DELAY;
        SCHEDULE_DELAY.DANCE_SCHEDULE_DELAY = Number.isNaN(SCHEDULE_DELAY.DANCE_SCHEDULE_DELAY) ? delpromise["d"] : SCHEDULE_DELAY.DANCE_SCHEDULE_DELAY;
    
        const event_data = await event_data_promise;
        /**@ts-ignore @type {MiscEventDataWrapper | EventDataWrapper} */
        var event_schedules = event_data[type];
        /**@type {{ends: number; elm: HTMLElement}[][]} */
        const [day1elements, day2elements] = [[], []];
        const now = new Date();
        const delay = type == "misc" ? 0 : SCHEDULE_DELAY[`${type.toUpperCase()}_SCHEDULE_DELAY`];
        var goes = null;
        var DAY = now.getDate() <= 15 ? 1 : 2;
    
        if (type == "misc"){
            event_schedules = event_schedules[miscvenue || ""];
        }
    
        for (const event_schedule of event_schedules.day1){
            const _delay = DAY == 1 ? delay : 0;
            day1elements.push(createEventSchedulerElement(event_schedule, type, _delay));
        }
        for (const event_schedule of event_schedules.day2){
            const _delay = DAY == 2 ? delay : 0;
            day2elements.push(createEventSchedulerElement(event_schedule, type, _delay));
        }
    
        /**@type {{ends: number;elm: HTMLElement;}[]} */
        var searched_elements = [];
        if (DAY == 1){
            searched_elements = day1elements;
        } else if (DAY == 2){
            day1elements.forEach(h => h.elm.classList.add("past_event"));
            searched_elements = day2elements;
        }
        
        const thistime = getAbsTime(`${now.getHours()}:${now.getMinutes()}`);
        
        for (var k = 0; k < searched_elements.length; k++){
            const dayelm = searched_elements[k];
            const nextdayelm = searched_elements[k+1];
    
    
            if (k == 0 && thistime < dayelm.ends){
                dayelm.elm.classList.add("now_playing_event", "metoscrkl");
                goes = dayelm.elm;
                break;
            }
    
            dayelm.elm.classList.add("past_event");
            
            if (nextdayelm && dayelm.ends < thistime && nextdayelm.ends >= thistime){
                nextdayelm.elm.classList.add("now_playing_event", "metoscrkl");
                goes = dayelm.elm;
                break;
            }
    
            // END
            if (!nextdayelm){
                if (DAY == 1){
                    day2elements[0].elm.classList.add("metoscrkl");
                    goes = day2elements[0].elm;
                } else if (DAY == 2){
                    dayelm.elm.classList.add("metoscrkl");
                    goes = dayelm.elm;
                }
            }
        }
    
        const daytitle = document.createElement("h2");
        const delayspan = document.createElement("span");
        const daytitles = [daytitle.cloneNode(), daytitle.cloneNode()];
        const scheduler_display = document.getElementById("godric_manager_pre");
    
        delayspan.classList.add("delayspan_");
        delayspan.innerHTML = `${delay}分遅延`;
        daytitles[0].textContent = "一日目";
        daytitles[1].textContent = "二日目";
    
        delay != 0 ? daytitles[DAY - 1].appendChild(delayspan) : void 0;
    
        scheduler_display?.appendChild(daytitles[0]);
        day1elements.forEach(t => scheduler_display?.appendChild(t.elm));
        scheduler_display?.appendChild(daytitles[1]);
        day2elements.forEach(t => scheduler_display?.appendChild(t.elm));
    
        
        const top = (goes?.offsetTop || 0) - window.innerHeight/2 + 100 + (goes?.clientHeight || 0)/2;
        
        $("#godric_manager_pre").scrollTop(top);
    }
    
    
    /**
     * 
     * @param {BanceScheduleElement | MiscScheduleElement} eventscheduler 
     * @param {keyof EventDataComponent} type 
     * @param {number} delay 
     */
    function createEventSchedulerElement(eventscheduler, type, delay){
        const el = document.createElement("div");
        const ends = addMinute(eventscheduler.starts, eventscheduler.takes);
        el.innerHTML = `
            <div class="event_scheduler_element">
                <div class="scheduler_time_details">
                    ${delay == 0 ? `
                        ${eventscheduler.starts} ~ ${ends}
                    ` 
                    : 
                    `
                        <span class="aviaTa">${eventscheduler.starts} ~ ${ends}</span>
                        <span>${addMinute(eventscheduler.starts, delay)} ~ ${addMinute(ends, delay)}</span>
                    `}
                </div>
                <div class="schedular_main_details">
                    <div class="taC">
                        <img class="Oiniums" src="/resources/cloud/event/${type}/${eventscheduler.name.replace(/ |:|\?/g, "_")}/small_icon.png"
                            onerror="this.remove()">
                        <span class="iuahT">${eventscheduler.name}</span>
                    </div>
                    <span class="AVKT">${eventscheduler.description}</span>
                    ${  //@ts-ignore
                        typeof eventscheduler.musics == "undefined" ? "" :
                    `
                        <hr class="mucdivl">
                        <span class="evmusics">楽曲: ${//@ts-ignore
                        eventscheduler.musics.join(", ")}</span>
                    `}
                </div>
            </div>`;
        return {
            ends: getAbsTime(addMinute(ends, delay)),
            elm: el
        };
    }
    
    
    /**
     * 
     * @param {Time24} time24 
     */
    function getAbsTime(time24){
        const [h, m] = time24.split(":").map(t => Number(t));
        return h*60+m;
    }
    
    
    /**
     * 
     * @param {import("../shishiji-dts/supports").Time24} time24 
     * @param {number} add 
     * @returns {string} H is supposed not to overflow!!
     */
    function addMinute(time24, add){
        var [h, m] = time24.split(":").map(t => Number(t));
        m += add;
        if (m >= 60){
            const k = Math.floor(m/60);
            h += k;
            m = m % 60;
        }
        return `${h}:${m.toString().padStart(2, "0")}`;
    }
    
    
    
    
    /**
     * 
     * @param {string} [only_disc] 
     */
    function openDrinkScreen(only_disc){
        openPkGoScreen("drink_screen");
        $(".drinking").removeClass("uihsadW");
        $(".drinkings").scrollTop(0);
        if (only_disc){
            const g = document.getElementById(`drank-${only_disc}`);
            const top = (g?.offsetTop || 0) - window.innerHeight/2 + 100 + (g?.clientHeight || 0)/2;
            $(".drinkings").scrollTop(top);
            g?.classList.add("uihsadW");
        }
    }
    
    
    +function(){
        Array.from(document.querySelectorAll(".drink-real > img"))
        .forEach(function(me){
            me.addEventListener("click", function(){
                //@ts-ignore
                Popup.popupMedia(me.getAttribute("src") || "", "img", me.cloneNode());
            });
        });
    }();
    
    //@ts-ignore
    "use strict";
    
    
    /**
     * @typedef {import("../../server/handler/user/dts/user").Ticket} Ticket
     */
    
    
    function openTicketsScreen(){
        openPkGoScreen("tickets_screen");
    
        setTicketGUI();
    }
    
    
    function setTicketGUI(){
        const tickets = [...LOGIN_DATA.data.tickets];
        
        $("#ticket_component > .afIOUW, .iuhagW").remove();
    
        if (tickets.length == 0){
            const ticketcaution = document.createElement("span");
            ticketcaution.classList.add("iuhagW");
            ticketcaution.textContent = TEXTS[LANGUAGE].HOW_TO_TICKET;
            $("#ticket_component").append(ticketcaution);
            return;
        }
    
        for (const ticketdata of tickets){
            const ticketman = document.createElement("span");
            ticketman.classList.add("afIOUW");
            const h4 = document.createElement("h4");
            h4.classList.add("awWg");
            h4.textContent = ticketdata.visual.description;
            ticketman.appendChild(h4);
            const section = document.createElement("section");
            section.classList.add("ticketman");
            ticketman.appendChild(section);
            const divImage = document.createElement("div");
            divImage.classList.add("sauaA", "protected");
            section.appendChild(divImage);
            const img = document.createElement("img");
            img.classList.add("agiuW");
            img.src = ticketdata.visual.image;
            divImage.appendChild(img);
            const divDetails = document.createElement("div");
            divDetails.classList.add("asIgW");
            section.appendChild(divDetails);
            const p = document.createElement("p");
            p.textContent = ticketdata.visual.moredetails;
            divDetails.appendChild(p);
            const btn_wrap = document.createElement("div");
            btn_wrap.classList.add("diusahG");
            divDetails.appendChild(btn_wrap);
            const use_button = document.createElement("div");
            use_button.classList.add("shishijibtn", "AWtv");
            use_button.style.width = "130px";
            btn_wrap.appendChild(use_button);
            const span = document.createElement("span");
            span.textContent = "使用する";
            use_button.appendChild(span);
            const reveal_button = document.createElement("div");
            reveal_button.classList.add("shishijibtn", "AWtv");
            reveal_button.style.width = "130px";
            btn_wrap.appendChild(reveal_button);
            const _span = document.createElement("span");
            _span.textContent = "場所を確認";
            reveal_button.appendChild(_span);
    
            use_button.addEventListener("click", useTicketMan(ticketdata));
            reveal_button.addEventListener("click", () => {
                closePkGoScreen("tickets_screen");
                revealOnMap(ticketdata.visual.use_coords);
            });
    
            $("#ticket_component").prepend(ticketman);
        }
    }
    
    
    /**
     * 
     * @param {Ticket} ticketdata 
     * @returns {() => Promise<unknown>}
     */
    function useTicketMan(ticketdata){
        /**
         * @this {HTMLElement}
         */
        return async function(){
            openPkGoScreen("ticket_use_screen");
            
            $("#_what_ticket").text(ticketdata.visual.description);
            $("#ticket_qrcode").attr("src", ticketdata.qrcode);
        };
    }
    
    
    
    
    function openTeaScreen(){
        openPkGoScreen("tea_screen");
    
        const havewent = LOGIN_DATA.data.completed_orgs;
        $("#ASUgAJs > div").remove();
        for (const objdata of Object.values(mapObjectComponent)){
            $("#ASUgAJs").append(`
                <div>
                    <input id="__W${objdata.discriminator}" type="checkbox" class="setartw" who="${objdata.discriminator}" ${havewent.includes(objdata.discriminator) ? "checked" : ""}>
                    <lable for="__W${objdata.discriminator}">${objdata.discriminator}</lable>
                </div>
            `);
            $(`#__W${objdata.discriminator}`).on("input", function(){
                $.post("/.dev/faith", {
                    //@ts-ignore
                    _where: this.getAttribute("who"),
                    //@ts-ignore
                    _process: this.checked ? "add" : "remove",
                }).then(async d => {
                    LOGIN_DATA.data.completed_orgs = d;
                    showGoodOrgs();
                    if (await haveAnyUnclaimeds()){
                        setMenuHasPending("1");
                    }
                });
            });
        }
    }
    
    
    
    
    function openShoppingScreen(){
        openPkGoScreen("showcase_screen");
    }
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/objects").StampCompletionData} StampCompletionData
     * @typedef {import("../shishiji-dts/objects").SpecialMissionCompletionData} SpecialMissionCompletionData
     */
    
    
    async function openStamprallyScreen(){
        openPkGoScreen("stamp_rally_screen");
        await setMissionScreen();
    
        if (isUnvisitedTour("ranking")){
            tour_status.pkgo = true;
            setTimeout(() => startTour("ranking"), 300);
        }
    }
    
    
    async function setMissionScreen(){
        const each_comp = [ 1/5, 3/5, 5/5 ];
        const missionptmap = await prog_pt_promise;
        const specials = await special_missions_promise;
        const claimeds = structuredClone(LOGIN_DATA.data.claimed_rpt);
        const completeds = [];
        const all_unclaimeds = { };
    
        
        $("#intermain, #aka-keeen").empty();
    
        function onRewardUpdate(){
            Object.values(all_unclaimeds).some(t => t == true) ? 
            removeMenuHasPending("1") : setMenuHasPending("1");
        }
    
        function setCompletedScreen(){
            const ttj = completeds.map(i => {
                return `<div class="comaos"><p>${i}</p></div>`;
            }).join("");
    
            if (!document.getElementById("asW"))
                $("#aka-keeen").append(`
                    <div class="aaiV" id="asW">
                        <span class="sagAW">完了済み</span>
                        ${ttj}
                    </div>`);
            else 
                $("#asW").append(ttj);
    
            completeds.length = 0;
        }
        
        for (const floor of ["1F", "2F", "3F", "4F"]){
            +function(floor){
                const objids = getObjectsOfFloor(floor, true);
                const fllength = objids.length;
                const current_floor_claimedup = claimeds[floor];
                const unclaimeds = [ ];
                const ourterritory = document.createElement("span");
                var completed = 0;
                var nextrequires = fllength*each_comp[0];
                var _k = 0;
        
    
                document.getElementById("intermain")?.appendChild(ourterritory);
    
                for (const disc of objids){
                    isCompletedOrg(disc) ? completed++ : void 0;
                }
        
                for (var i = 0; i < each_comp.length; i++){
                    const acc = each_comp[i];
                    const much = Math.floor(fllength*acc);
        
                    if (much == 0) break;
                    
                    if (much > completed){
                        nextrequires = much;
                        break;
                    } else {
                        if (current_floor_claimedup < i){
                            unclaimeds.push(i);
                            all_unclaimeds[floor] = true;
                        }
                    }
                    _k++;
                }
        
                const _pt = missionptmap[floor][_k] || 0;
                
                /**
                 * 
                 * @param {boolean} app 
                 * @param {boolean} update 
                 */
                function defaultNextStep(app, update){
                    update ? onRewardUpdate() : void 0;
                    if (completed == fllength){
                        completeds.push(`${floor}の団体を全て訪れる`);
                        if (update){
                            ourterritory.classList.add("asbHW");
                            setTimeout(() => ourterritory.remove(), 100);
                        } else {
                            ourterritory.remove();
                        }
                        setCompletedScreen();
                        return;
                    }
    
                    const compsec = createNormalMissionSection({
                        title: `${floor} の団体を${nextrequires}コ訪れる`,
                        progress: (completed/nextrequires)*100,
                        compPT: _pt,
                        reelcount: completed,
                    }, app);
                    
                    ourterritory.appendChild(compsec);
                }
        
                if (unclaimeds.length > 0){
                    /**@type {{rwidx: number; elm: HTMLElement}[]} */
                    const rewards = [];
                    
                    for (const rwidx of unclaimeds){
                        const rewsec = createMissionRewardSection({
                            title: `${floor} の団体を${Math.floor(fllength*each_comp[rwidx])}コ訪れる`,
                            progress: 100,
                            compPT: missionptmap[floor][rwidx],
                            reelcount: Math.floor(fllength*each_comp[rwidx]),
                        });
                        rewards.push({
                            rwidx: rwidx,
                            elm: rewsec
                        });
                    }
        
                    var idx = 0;
                    for (const reward of rewards){
                        +function(reward){
                            reward.elm.addEventListener("click", async function(){
                                this.classList.add("plopper");
    
                                intoLoad(`getrpt-${floor}-${reward.rwidx}`, "top");
                                
                                $.post(ajaxpath.uactrpt, { floor: floor, idx: reward.rwidx })
                                .then(data => {
                                    const neu = data.neu;
                                    const ucl = data.ucl;
                                    const _gets = data._gets;
                                    
                                    LOGIN_DATA.data.pt = Number(neu);
                                    LOGIN_DATA.data.claimed_rpt = ucl;
                                    updateSpecialRewards();
                                    notifyAcquision(`${_gets}pt`);
                                    displayUserPtExactly();
    
                                    if (!haveAnyUnclaimeds())
                                        removeMenuHasPending("1");
                                })
                                .catch(() => {
                                    PictoNotifier.notifyError(TEXTS[LANGUAGE].SRY_OPEN_AGAIN);
                                })
                                .always(() => outofLoad(`getrpt-${floor}-${reward.rwidx}`, "top"));
                                
                                setTimeout(() => {
                                    const next_reward = rewards[++idx];
    
                                    if (next_reward){
                                        next_reward.elm.classList.add("awlvig");
                                        ourterritory.appendChild(next_reward.elm);
                                    } else {
                                        all_unclaimeds[floor] = false;
                                        delete all_unclaimeds[floor];
                                        defaultNextStep(true, true);
                                    }
    
                                    this.remove();
                                }, 550);
                            });
                        }(reward);
                    }
                    ourterritory.appendChild(rewards[0].elm);
                } else {
                    defaultNextStep(false, false);
                }
            }(floor);
        }
    
    
        /**
         * 
         * @param {SpecialMission} special 
         * @param {HTMLElement} territory 
         */
        function onSpecialRewardClaim(special, territory){
            /**@this {HTMLElement} */
            return async function(){
                this.classList.add("plopper");
    
                completeds.push(special.title);
                setCompletedScreen();
    
                setTimeout(() => {
                    territory.classList.add("asbHW");
                    setTimeout(() => territory.remove(), 100);
                }, 550);
    
                $.post(ajaxpath.uactrsppt, {
                    mission_id: special.mission_id
                })
                .then(_howa => {
                    notifyAcquision("チケット");
                    all_unclaimeds[special.mission_id] = false;
                    delete all_unclaimeds[special.mission_id];
                    LOGIN_DATA.data.tickets = _howa._new;
                    LOGIN_DATA.data.claimed_rpt = _howa._dnew;
    
                    onRewardUpdate();
                })
                .catch(err => {
                    PictoNotifier.notifyError(TEXTS[LANGUAGE].SRY_OPEN_AGAIN);
                });
            };
        }
    
    
        for (const special of specials){
            if (claimeds.specials.includes(special.mission_id)){
                completeds.push(special.title);
                setCompletedScreen();
                continue;
            }
            +function(special){
                const ourterritory = document.createElement("span");
                const progress = (LOGIN_DATA.data.pt/special.required_pt)*100;
    
                document.getElementById("intermain")?.appendChild(ourterritory);
    
                const oncomplete = onSpecialRewardClaim(special, ourterritory);
                if (progress >= 100){
                    const msisec = createMissionRewardSection({
                        title: special.title,
                        reward: special.reward,
                    });
    
                    msisec.addEventListener("click", oncomplete);
                    ourterritory.appendChild(msisec);
    
                    all_unclaimeds[special.mission_id] = true;
                } else {
                    const msisec = createSpecialMissionSection(special, false);
    
                    ourterritory.appendChild(msisec);
        
                    msisec.addEventListener("become-claimable", function(){
                        const alter = createMissionRewardSection({
                            title: special.title,
                            reward: special.reward,
                        });
                        
                        this.remove();
                        alter.addEventListener("click", oncomplete);
                        ourterritory.appendChild(alter);
    
                        all_unclaimeds[special.mission_id] = true;
                    });
                }
            }(special);
        }
    }
    
    
    /**
     * 
     * @param {SpecialMission} data 
     * @param {boolean} app 
     */
    function createSpecialMissionSection(data, app){
        const progress = (LOGIN_DATA.data.pt/data.required_pt)*100;
        const secdiv = document.createElement("section");
        secdiv.classList.add("diauHOkjkjsa", app ? "awlvig" : "_", "av8YWTg");
        secdiv.innerHTML = `
            <div class="execil">
                <div class="cureft"><p>${data.title}</p></div>
                <div class="stampprogress specialprogress" requires="${data.required_pt}">
                    <span style="width:${progress}%"></span>
                    <div style="left:calc(${progress}% - 4.5px)">${LOGIN_DATA.data.pt}</div>
                </div>
            </div>
            <div class="execij flxxt agawt">
                <img src="${data.reward.image}" class="auiwB">
                <p>${data.reward.description}</p>
            </div>
        `;
    
        return secdiv;
    }
    
    
    function updateSpecialRewards(){
        $(".specialprogress").each(function(){
            const bar = this.children[0];
            const num = this.children[1];
            const required = Number(this.getAttribute("requires"));
            const progress = (LOGIN_DATA.data.pt/required)*100;
            
            if (progress >= 100){
                this.parentElement?.parentElement?.dispatchEvent(new Event("become-claimable"));
            } else {
                $(bar).css("width", `${progress}%`);
                $(num).css("left", `calc(${progress}% - 4.5px)`).text(LOGIN_DATA.data.pt.toString());
            }
        });
    }
    
    
    /**
     * 
     * @param {StampCompletionData} data 
     * @param {boolean} app 
     */
    function createNormalMissionSection(data, app){
        const secdiv = document.createElement("section");
        secdiv.classList.add("diauHOkjkjsa", app ? "awlvig" : "_");
        secdiv.innerHTML = `
            <div class="execil">
                <div class="cureft"><p>${data.title}</p></div>
                <div class="stampprogress">
                    <span style="width:${data.progress}%"></span>
                    <div style="left:calc(${data.progress}% - 4.5px)">${data.reelcount}</div>
                </div>
            </div>
            <div class="execij flxxt">
                <span>
                    <h4>${data.compPT}pt</h4>
                </span>
            </div>
        `;
    
        return secdiv;
    }
    
    
    /**
     * 
     * @param {StampCompletionData | SpecialMissionCompletionData} data 
     */
    function createMissionRewardSection(data){
        const secdiv = document.createElement("section");
        const rewardScr = data.reelcount ? `
            <span>
                <h4>${data.compPT}pt</h4>
            </span>` : 
            //@ts-ignore
            `<img src="${data.reward.image}" class="auiwB"><p>${data.reward.description}</p>`; 
        secdiv.classList.add("uoihgfaSJD");
        secdiv.innerHTML = `
            <div class="execil flxxt">
                <div class="gjaiuags">
                    <p>リワードを受け取る</p>
                    <p class="smallerp">${data.title}</p>
                </div>
            </div>
            <div class="execij flxxt AMVat agawt">
                ${rewardScr}
            </div>
        `;
    
        return secdiv;
    }
    
    
    /**
     * 
     * @param {StampCompletionData} data 
     * @param {boolean} app 
     */
    function createMissionCompletedSection(data, app){
        const secdiv = document.createElement("section");
        secdiv.classList.add("iuhgihuASG", app ? "awlvig" : "_");
        secdiv.innerHTML = `
            <div class="euahcn flxxt">
                <div class="gjaiuags">
                    <h4>${data.title} (${data.reelcount}コ)</h4>
                </div>
            </div>
        `;
    
        return secdiv;
    }
    
    
    function openRankingScreen(){
        openPkGoScreen("ranking_screen");
        readyRanking();
    }
    
    
    function readyRanking(){
        intoLoad("getting-mission-ranking", "top");
        $(".ahugihdb").hide();
        $(".hbSDBs").addClass("gaius");
        $("#aboigHSDV").empty();
        $.post(ajaxpath.ranking)
        .then(rankingdata => {
            var amihere = false;
            var placeinfo = {
                pt: Infinity,
                place: 0,
                dps: 1,
                pre: 0
            }
            for (var i = 1; i <= rankingdata.length; i++){
                const ranking_user = rankingdata[i-1];
                const medalsrc = getMedalPath(ranking_user.pt);
                var place = ranking_user.pt < placeinfo.pt ? placeinfo.pre + placeinfo.dps : placeinfo.pre;
                var num = `<b-i>${place}</b-i>`;
                var clsad = "";
    
                if (ranking_user.pt < placeinfo.pt){
                    placeinfo.dps = 1;
                } else {
                    placeinfo.dps++;
                }
                placeinfo.pre = place;
    
                if (place <= 3){
                    var h = "";
                    if (place == 1){
                        h = "giuja";
                        clsad += "oaguhsT";
                    } else if (place == 2){
                        h = "giujaR";
                        clsad += "h4eADFS";
                    } else if (place == 3){
                        h = "giujfR";
                        clsad += "gAJISW3";
                    }
                    num = `<h2 class="${h}">${place}</h2>`;
                }
    
                $("#aboigHSDV").append(`
                    <div class="ranking_person ${clsad} ${ranking_user.disc==LOGIN_DATA.discriminator?"hugaop":""}" id="printouts-${ranking_user.disc}">
                        <div class="reavhs">
                            ${num}
                            <div style="${ranking_user.icp?`background-image:url(${ranking_user.icp})`:""}">
                                <div class="usahbas" style="${medalsrc?`background-image:url(${medalsrc})`:""}"></div>
                            </div>
                            <h4>${ranking_user.nick}</h4>
                        </div>
                        <p>${ranking_user.pt}pt</p>
                    </div>`);
                placeinfo.pt = ranking_user.pt;
                placeinfo.place = place;
                !amihere ? ranking_user.disc == LOGIN_DATA.discriminator ? amihere = !amihere : void 0 : void 0;
            }
            if (amihere){
                $(".hbSDBs").removeClass("gaius");
                $(".ahugihdb").show();
            } else {
                $(".gaius").append(document.createElement("h-j"));
            }
        })
        .catch(() => PictoNotifier.notifyError(TEXTS[LANGUAGE].FAILED_TO_LOAD_RANKING))
        .always(() => outofLoad("getting-mission-ranking", "top"));
    }
    
    
    function revealMyself(){
        const _it = `printouts-${LOGIN_DATA.discriminator}`;
        document.getElementById(_it)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
    
    
    /**
     * 
     * @returns {Promise<boolean>}
     */
    async function haveAnyUnclaimeds(){
        const each_comp = [ 1/5, 3/5, 5/5 ];
        const claimeds = LOGIN_DATA.data.claimed_rpt;
    
        var really = false;
        
        for (const floor of ["1F", "2F", "3F", "4F"]){
            if (really) break;
            +function(floor){
                const objids = getObjectsOfFloor(floor, true);
                const fllength = objids.length;
                const current_floor_claimedup = claimeds[floor];
                var completed = 0;
                var nextrequires = fllength*each_comp[0];
                var _k = 0;
    
                for (const disc of objids){
                    isCompletedOrg(disc) ? completed++ : void 0;
                }
                
                for (var i = 0; i < each_comp.length; i++){
                    const acc = each_comp[i];
                    const much = Math.floor(fllength*acc);
        
                    if (much == 0) break;
                    
                    if (much > completed){
                        nextrequires = much;
                        break;
                    } else {
                        if (current_floor_claimedup < i){
                            really = true;
                            break;
                        }
                    }
                    _k++;
                }
            }(floor);
        }
    
        const specials = await special_missions_promise;
    
        for (const special of specials){
            if (really) break;
            +function(special){
                const pr = LOGIN_DATA.data.pt/special.required_pt;
    
                if (pr >= 1 && !LOGIN_DATA.data.claimed_rpt.specials.includes(special.mission_id)){
                    really = true;
                }
            }(special);
        }
    
        return really;
    }
    
    
    
    
    // F2
    const routes = [
        [
            [2100, 384],
            [1170, 435]
        ]
    ]
    /**
     * 
     * @param {*} from 
     * @param {*} to 
     */
    function findBestRoute(from, to){
        routes
    }
    
    
    
    
    /**
     * 
     * @param {Coords} from 
     * @param {Coords} to 
     */
    function drawLine(from, to){
        const relpos_from = toCanvasPos(from),
            relpos_to = toCanvasPos(to);
    
        shishiji_ctx.beginPath();
        shishiji_ctx.lineWidth = (20)*zoomRatio;
        shishiji_ctx.strokeStyle = "#009dff";
        shishiji_ctx.moveTo(relpos_from[0], relpos_from[1]);
        shishiji_ctx.lineTo(relpos_to[0], relpos_to[1]);
        shishiji_ctx.stroke();
        shishiji_ctx.closePath();
    }
    
    
    /**
     * 
     * @param {Coords} coords 
     * @param {string} text 
     */
    function drawText(coords, text){
        const pos = toCanvasPos(coords);
        const width = shishiji_ctx.measureText(text).width;
        
        pos[0] -= width/2;
        pos[1] += 8;
    
        shishiji_ctx.textBaseline = "alphabetic";
        shishiji_ctx.font = "16px Calligraphed";
        shishiji_ctx.fillStyle = "#ffffff";
        shishiji_ctx.fillText(text, pos[0], pos[1]);
    }
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/motion").NonnullPosition} NonnullPosition
     */
    
    
    /**
     * 
     * @param {TouchList} touches 
     * @returns {number}
     */
    function getMidestOfTouches(touches){
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
     * @param {TouchList | Touch[]} touches 
     * @returns {NonnullPosition}
     */
    function getMiddlePos(touches){
        var av_x = 0;
        var av_y = 0;
        const _a = touches.length;
    
        for (const t  of touches){
            av_x += t.clientX;
            av_y += t.clientY;
        }
    
        av_x /= _a;
        av_y /= _a;
        return [ av_x, av_y ];
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
     * 
     * @param {NonnullPosition} position 
     */
    function toRotatedCoords(position){
        var coordsC = new Complex(position[0], position[1]);
    
        for (const rotcell of rotationHistory){
            coordsC = coordsC.rotate(-rotcell.arg, rotcell.canvasOrigin);
        }
    
        return _toBackCanvasCoords([ coordsC.real, coordsC.imag ]);
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
     * @param {Coords} backcanvasCoords 
     * @returns {NonnullPosition}
     */
    function toCanvasPos(backcanvasCoords){
        return [
            (backcanvasCoords.x - backcanvas.canvas.coords.x) * zoomRatio,
            (backcanvasCoords.y - backcanvas.canvas.coords.y) * zoomRatio,
        ];
    }
    
    
    /**
     * 
     * @param {NonnullPosition} canvasPos 
     * @returns {Coords}
     */
    function _toBackCanvasCoords(canvasPos){
        return {
            x: (canvasPos[0]/zoomRatio) + backcanvas.canvas.coords.x,
            y: (canvasPos[1]/zoomRatio) + backcanvas.canvas.coords.y,
        };
    }
    
    /**
     * 
     * @param {NonnullPosition} canvasPos 
     * @returns {Coords}
     */
    function toBackCanvasCoords(canvasPos){
        return {
            x: (canvasPos[0]/zoomRatio) + backcanvas.canvas.coords.x,
            y: (canvasPos[1]/zoomRatio) + backcanvas.canvas.coords.y,
        };
    }
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/objects").DrawMapData} DrawMapData
     */
    
    
    /**
     * Draw tiles
     * ⚠️This just draws on children⚠️
     * @param {DrawMapData} data 
     * @param {(all: HTMLElement[]) => any} [donecallback]
     * @param {(loaded: number, all: number) => any} [eachdonecallback] 
     * @returns {Promise<void>} 
     */
    async function drawMap(data, donecallback, eachdonecallback){
        const xrange = data.xrange;
        const yrange = data.yrange;
        const tile_width = data.tile_width;
        const tile_height = data.tile_height;
        const src_formatter = data.format;
        /**@type {HTMLImageElement[]} */
        var all = [];
        var wait = 0;
        var processed = 0;
        /**@type {{ x: number, y: number, dx: number, dy: number, dw: number, dh: number, src: string }[]} */
        var erroredArray = [];
        const tileAmount = (xrange+1)*(yrange+1);
        const map_sizes = {
            width: (xrange+1) * tile_width,
            height: (yrange+1) * tile_height
        };
        const side = 2**12; //=√2^24
    
    
        shishiji_ctx.clearRect(0, 0, shishiji_canvas.width, shishiji_canvas.height);
        _map_children.forEach(p => p.forEach(k => k.remove()));
        _map_children.splice(0);
        
    
        /**@param {number} width  @param {number} height  */
        function _createCvs(width, height){
            const c = document.createElement("canvas");
            c.width = width;
            c.height = height;
            return c;
        }
    
        if (map_sizes.width*map_sizes.height > 2**24){
            for (var horizontal = 0; horizontal < Math.ceil(map_sizes.width / side); horizontal++){
                for (var vertical = 0; vertical < Math.ceil(map_sizes.height / side); vertical++){
                    const cvs = _createCvs(side, side);
                    vertical > 0 ? _map_children[horizontal].push(cvs) : _map_children[horizontal] = [cvs];
                }
            }
        } else {
            const cvs = _createCvs(map_sizes.width, map_sizes.height);
            _map_children[0] = [cvs];
        }
        
        const eacharg = {
            all: (xrange+1)*(yrange+1),
            loaded: 0,
        }
    
        /**
         * 
         * @param {HTMLImageElement} img 
         * @param {number} dx @param {number} dy @param {number} dw @param {number} dh 
         */
        function drawIt(img, dx, dy, dw, dh){
            const floor = Math.floor;
            const startCoords = [ dx, dy ];
            const endCoords = [ (dx+dw), (dy+dh) ];
            const startChildCoords = [ floor(startCoords[0] / side), floor(startCoords[1] / side) ];
            const endChildCoords = [ floor(endCoords[0] / side), floor(endCoords[1] / side) ];
            const currentCoords = [...startCoords];
            const currentChildCoords = [...startChildCoords];
            var remaining_width = dw;
            var remaining_height = dh;
            var dynamicDX = dx % side;
            var dynamicDY = dy % side;
            
            const where_source_drawing = [ 0, 0 ];
            
            for (var vertical = startChildCoords[1]; vertical <= endChildCoords[1]; vertical++){
                var height = remaining_height;
                
                if (floor((dynamicDY + remaining_height) / side) / floor(dynamicDY / side) > 1){
                    height = side - (dynamicDY % side);
                }
    
                // initialize for every vertical draw
                remaining_width = dw;
                dynamicDX = dx % side;
                where_source_drawing[0] = 0;
                currentChildCoords[0] = startChildCoords[0];
    
                for (var horizontal = startChildCoords[0]; horizontal <= endChildCoords[0]; horizontal++){
                    while (remaining_width > 0){
                        var width = remaining_width;
    
                        if (floor((dynamicDX + remaining_width) / side) / floor(dynamicDX / side) > 1){
                            width = side - (dynamicDX % side);
                        }
    
                        if (dynamicDX == side)
                            dynamicDX = 0;
                        if (dynamicDY == side)
                            dynamicDY = 0;
    
                        const child = map_children(currentChildCoords[0], currentChildCoords[1]);
                        
                        child?.getContext("2d")?.drawImage(
                            img, where_source_drawing[0], where_source_drawing[1], width, height, dynamicDX, dynamicDY, width, height,
                        );
    
                        /*console.log(`Drawing image: ${img.src.slice(img.src.lastIndexOf("/")+1)};
            Image{ start: [${[where_source_drawing[0], where_source_drawing[1]]}], end: [${[where_source_drawing[0] + width, where_source_drawing[1] + height]}] };
            Child: (${currentChildCoords}), start: [${[dynamicDX, dynamicDY]}], end: [${[dynamicDX + width, dynamicDY + height]}];`);*/
    
                        currentChildCoords[0]++;
                        dynamicDX += width;
                        where_source_drawing[0] += width;
                        remaining_width -= width;
                    }
                }
    
                dynamicDY += height;
                remaining_height -= height;
                where_source_drawing[1] += height;
                currentChildCoords[1]++;
            }
        }
    
        return new Promise((resolve) => {
            for (var y = 0; y <= yrange; y++){
                for (var x = 0; x <= xrange; x++){
                    var dh = tile_width,
                        dw = tile_height,
                        dx = dw*x,
                        dy = dh*y;
    
                    !function(x, y, dx, dy, dw, dh){
                        const img = new Image();
                        const src = formatString(src_formatter, y, x);
    
                        img.onload = function(){
                            drawIt(img, dx, dy, dw, dh);
                            
                            processed++;
                            eacharg.loaded++;
                            all.push(img);
    
                            if (eachdonecallback)
                                eachdonecallback(eacharg.loaded, eacharg.all);
                            if (all.length >= tileAmount)
                                resolve("map loaded");
                        }
    
                        function reloaderrimg(){
                            var t_advent = Map_retry_cooldown;
    
                            const g = setInterval(() => {
                                setLoadMessage(formatString(TEXTS[LANGUAGE].MAP_LOAD_RETRYING, t_advent));
                                $(".loader__icon").removeClass("_gloads").addClass("_bgoods");
    
                                PictoNotifier.notify(
                                    "no-wifi",
                                    TEXTS[LANGUAGE].NOTIFICATION_CHECK_YOUR_CONNECTION,
                                    {
                                        duration: 5000,
                                        discriminator: "check ur WiFi",
                                        deny_userclose: true
                                    }
                                );
                                t_advent--;
    
                                if (t_advent <= -1){
                                    $(".loader__icon").removeClass("_bgoods").addClass("_gloads");
                                    retry();
                                    clearInterval(g);
                                }
                            }, 1000);
                        }
    
                        function handleError(){
                            var t = Map_retry_cooldown;
    
                            processed++;
    
                            if (processed >= tileAmount)
                                reloaderrimg();
                        }
    
                        function retry(){
                            for (const cvsidata of erroredArray){
                                const img = new Image();
                                const src = cvsidata.src;
    
                                if (eachdonecallback)
                                    eachdonecallback(eacharg.loaded, eacharg.all);
                                else
                                    setLoadMessage(TEXTS[LANGUAGE].LOADING_MAP);
                                processed--;
    
                                img.onload = function(){
                                    drawIt(img, cvsidata.dx, cvsidata.dy, cvsidata.dw, cvsidata.dh);
    
                                    erroredArray = erroredArray.filter(p => { if (p.src != src) return true; });
                                    processed++;
                                    eacharg.loaded++;
    
                                    all.push(img);
    
                                    if (eachdonecallback)
                                        eachdonecallback(eacharg.loaded, eacharg.all);
                                    if (all.length >= tileAmount)
                                        resolve("map loaded");
                                    else if (processed >= tileAmount)
                                        reloaderrimg();
                                }
    
                                img.onerror = handleError;
    
                                img.src = src;
                            }
                        }
    
                        img.onerror = () => {
                            erroredArray.push({ x: x, y: y, dx: dx, dy: dy, dw: dw, dh: dh, src: src });
                            handleError();
                        };
                        
                        setTimeout(() => {
                            img.src = src;
                        }, wait);
    
                        wait += WAIT_BETWEEN_EACH_MAP_IMAGE;
    
                        return 0;
                    }(x, y, dx, dy, dw, dh);
                }
            }
        }).then(() => {
            window.scroll({ top: 0, behavior: "instant" });
    
            /**
             * Check map children whether they were decently drawn
             * @param {number} [sideratio]
             * @deprecated
             */
            function _debugChildren(sideratio){
                const canvas = document.createElement("canvas");
                const children = map_children() || [[]];
                var width = 0; var height = 0;
    
                sideratio = sideratio === void 0 ? 1 : sideratio;
                
                height = children.length*(2**12);
                width = children[0].length*(2**12);
                canvas.width = width; canvas.height = height;
                var o = 0;
                for (const horizontal of children){
                    var h  = 0;
                    for (const vertical of horizontal){
                        canvas.getContext("2d")?.drawImage(vertical, 0, 0, vertical.width, vertical.height, o*(2**12), h, vertical.width, vertical.height);
                        h += vertical.height;
                    }
                    o++;
                }
                const shown = document.createElement("canvas");
                var ratio = 1, rcandidates = [ 1 ];
                shown.width = window.innerWidth*sideratio;
                shown.height = window.innerHeight*sideratio;
                rcandidates = [ shown.width/canvas.width, shown.height/canvas.height ];
                ratio = Math.max(...rcandidates);
                shown.getContext("2d")?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width*ratio, canvas.height*ratio);
                shown.style.top = "0";
                shown.style.left = "0";
                shown.style.zIndex = "9999999";
                shown.style.position = "fixed";
                shown.style.pointerEvents = "none";
                shown.id = "canvas_children_debugger";
                document.body.prepend(shown);
            }
    
            if (typeof donecallback === "function")
                donecallback(all);
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
        const at = accurated ? K[0]+","+K[1] : Math.round(K[0]*abstraction)/abstraction+","+Math.round(K[1]*abstraction)/abstraction;
        
        setParam(ParamName.ZOOM_RATIO, zr);
        setParam(ParamName.COORDS, at);
    }
    
    
    /**
     * 
     * @param {Coords} coords 
     * @param {number} [abs_zoomRatio] 
     * @param {boolean} [set_parm] 
     */
    function setCoordsOnMiddle(coords, abs_zoomRatio, set_parm){
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
        moveMapAssistingNegative({ left: 0, top: 0 });
        set_parm ? setBehavParam() : void 0;
    }
    
    
    /**
     * 
     * @param {DrawMapData} data 
     * @param {{over?: string; under?: string;}} [messages] 
     * @param {(all: HTMLElement[]) => any} [donecallback]
     */
    function readyMap(data, messages, donecallback){
        const loadmsg = `<h4>${messages?.over || ""}</h4><div id="map_load_progress"><div id="ml_progress"></div></div><h4>${messages?.under || ""}</h4>`;
    
        drawMap(data, donecallback, function(loaded, all){
            var progress = loaded/all;
            const bar = document.getElementById("ml_progress");
            
            if (!bar) {
                setLoadMessage(loadmsg);
            }
    
            //@ts-ignore
            //document.getElementById("ml_progress").style.width = progress*100 + "%";
        });
    
        /**
         * @param {number} progress
         */
        return function(progress){
            //@ts-ignore
            document.getElementById("ml_progress").style.width = progress*100 + "%";
        }
    }
    
    
    /**
     * 
     * @param {DrawMapData} mapdata 
     * @returns 
     */
    function setSpareImage(mapdata){
        const spare = new Image();
        spare.src = mapdata.spare;
        mapdata.spareImage = spare;
        return mapdata;
    }
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/motion").Position} _Position
     * @typedef {import("../shishiji-dts/motion").Radian} Radian
     * @typedef {import("../shishiji-dts/motion").MoveData} MoveData
     * 
     * @typedef {import("../shishiji-dts/motion").RotationInfo} RotationInfo
     */
    
    
    /**
     * 
     * @param {TouchList | MouseEvent} y 
     */
    function setCursorpos(y){
        if (y instanceof MouseEvent)
            pointerPosition = [ y.clientX, y.clientY ];
        else
            pointerPosition = getMiddlePos(y);
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
     * @param {MoveData} moved
     * @param {RotationInfo} [rotationinfo] 
     */
    function moveMapAssistingNegative(moved, rotationinfo){
        const [ sinx, cosx ] = [ Math.sin(-totalRotationRad), Math.cos(-totalRotationRad) ];
        const relmoved = { ...moved };
    
        moved = {
            top: relmoved.top*cosx - relmoved.left*sinx,
            left: relmoved.top*sinx + relmoved.left*cosx
        };
    
        var x = backcanvas.canvas.coords.x - moved.left/zoomRatio,
            y = backcanvas.canvas.coords.y - moved.top/zoomRatio;
    
        backcanvas.canvas.width = shishiji_canvas.width/zoomRatio;
        backcanvas.canvas.height = shishiji_canvas.height/zoomRatio;
    
        backcanvas.canvas.coords = { x: x, y: y };
    
        const yokoikeru = 5000;
        const tateikeru = 5000;
        if (backcanvas.canvas.coords.x + backcanvas.canvas.width > yokoikeru){
            backcanvas.canvas.coords.x = yokoikeru - backcanvas.canvas.width;
        }
        if (backcanvas.canvas.coords.y + backcanvas.canvas.height > tateikeru){
            backcanvas.canvas.coords.y = tateikeru - backcanvas.canvas.height;
        }
        if (backcanvas.canvas.coords.x < 2500 - yokoikeru){
            backcanvas.canvas.coords.x = 2500 - yokoikeru;
        }
        if (backcanvas.canvas.coords.y < 2500 - tateikeru){
            backcanvas.canvas.coords.y = 2500 - tateikeru;
        }
    
        reDraw(backcanvas,
            ...[ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ],
            backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, shishiji_canvas.width, shishiji_canvas.height, rotationinfo
        );
    }
    
    
    /**
     * @deprecated use {@linkcode moveMapAssistingNegative} instead for safari support
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {MoveData} moved
     */
    function moveMap(canvas, ctx, moved){
        const x = backcanvas.canvas.coords.y-moved.left/zoomRatio;
        const y = backcanvas.canvas.coords.x-moved.top/zoomRatio;
    
        backcanvas.canvas.coords = { x: x, y: y }; 
        backcanvas.canvas.width = canvas.width/zoomRatio;
        backcanvas.canvas.height = canvas.height/zoomRatio;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backcanvas, Math.floor(backcanvas.canvas.coords.x), Math.floor(backcanvas.canvas.coords.y),
            Math.floor(backcanvas.canvas.width), Math.floor(backcanvas.canvas.height), 0, 0, canvas.width, canvas.height,
        );
    }
    
    
    /**
     * 
     * @param {number} ratio 
     * @param {NonnullPosition} origin
     *   (cursorPosition)
     * @param {NonnullPosition} [pos]
     * @param {boolean} [forceRatio] 
     * @param {boolean} [noredraw] 
     */
    function zoomMapAssistingNegative(ratio, origin, pos, forceRatio, noredraw){
        if (willOverflow(ratio, false)) return;
    
        pos ??= [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
        zoomRatio = forceRatio ? ratio : zoomRatio * ratio;
    
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
        backcanvas.canvas.width = shishiji_canvas.width/zoomRatio; backcanvas.canvas.height = shishiji_canvas.height/zoomRatio;
    
        if (!noredraw)
            reDraw(backcanvas,
                Math.floor(backcanvas.canvas.coords.x), Math.floor(backcanvas.canvas.coords.y),
                Math.floor(backcanvas.canvas.width), Math.floor(backcanvas.canvas.height),
                0, 0, shishiji_canvas.width, shishiji_canvas.height
            );
    }
    
    
    /**
     * @deprecated use {@linkcode zoomMapAssistingNegative} instead for safari support
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} ratio 
     * @param {[number, number]} origin
     *   (cursorPosition)
     * @param {[number, number] | undefined} pos
     */
    function zoomMap(canvas, ctx, ratio, origin, pos){
        if (MOVEPROPERTY.caps.ratio.max < zoomRatio && ratio > 1
            || MOVEPROPERTY.caps.ratio.min > zoomRatio && ratio < 1
            ) return;
    
        pos ??= [ backcanvas.canvas.coords.x, backcanvas.canvas.coords.y ];
    
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
            Math.floor(backcanvas.canvas.coords.x), Math.floor(backcanvas.canvas.coords.y), Math.floor(backcanvas.canvas.width), Math.floor(backcanvas.canvas.height),
            0, 0, canvas.width, canvas.height,
        );
    }
    
    
    /**
     * 
     * @param {HTMLCanvasElement} target 
     * @param {HTMLImageElement | string} spare 
     */
    function drawSpare(target, spare){
        /**@type {[number, number]} */
        const wd = [ 0, 0 ];
        const tctx = target.getContext("2d");
    
    
        function spareRatio(spare){
            return Math.max(target.width/spare.width, target.height/spare.height);
        }
    
        if (typeof spare == "string"){
            tctx?.beginPath();
            //@ts-ignore
            tctx.fillStyle = spare;
            tctx?.fillRect(0, 0, target.width, target.height);
            tctx?.stroke();
            tctx?.closePath();
        } else {
            const r = spareRatio();
            if (r < 1){
                tctx?.drawImage(spare, ...wd, spare.width*r, spare.height*r);
            } else if (spare.width != 0 && spare.height != 0){
                for (var h = 0; h < Math.ceil(target.height/spare.height); h++){
                    for (var w = 0; w < Math.ceil(target.width/spare.width); w++){
                        tctx?.drawImage(spare, ...wd, spare.width, spare.height);
                        wd[0] += spare.width;
                    }
                    wd[0] = 0;
                    wd[1] += spare.height;
                }
            }
        }
    }
    
    
    /**
     * As iOS browser doesn't support nagative argument of `CanvasRenderingContext2D.prototype.drawImage`.
     * 
     * USE:: `_redraw(canvas, ctx, backcanvas,
     *      backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
     *      backcanvas.canvas.width, backcanvas.canvas.height, 0, 0, canvas.width, canvas.height);`
     * @param {CanvasImageSource} image 
     * @param {number} sx @param {number} sy 
     * @param {number} sw @param {number} sh 
     * @param {number} dx @param {number} dy 
     * @param {number} dw @param {number} dh 
     * @param {RotationInfo} [rotationinfo] 
     */
    function reDraw(image, sx, sy, sw, sh, dx, dy, dw, dh, rotationinfo){
        /**@type {NonnullPosition} */
        const canvasCoords = [sx, sy];
        /**@type {NonnullPosition} */
        var transCoords;
        /**@type {number[]} */
        var args = [ sx, sy, sw, sh, dx, dy, dw, dh ];
    
        rotationinfo ??= { rotated: 0, origin: [ shishiji_canvas.width/2, shishiji_canvas.height/2 ] };
    
        const floor = Math.floor;
        const children = map_children();
        const ratio = dw/sw;
        const bctx = backcanvas.getContext("2d");
        const spare = MAPDATA[CURRENT_FLOOR].spare;
    
        bctx?.clearRect(0, 0, backcanvas.width, backcanvas.height);
        shishiji_ctx.clearRect(0, 0, shishiji_canvas.width, shishiji_canvas.height);
    
    
        if (sx < 0 || sy < 0){
            transCoords = canvasCoords.map(
                n => { return -n; }
            );
            args = [
                0, 0,
                sw - transCoords[0],
                sh - transCoords[1],
                transCoords[0]*zoomRatio,
                transCoords[1]*zoomRatio,
                dw - transCoords[0]*zoomRatio,
                dh - transCoords[1]*zoomRatio,
            ];
        }
        
    
        if (children && children.length == 1 && children[0].length == 1){
            /**@param {RotationInfo} rotationinfo  */
            function exe(rotationinfo){
                const origin = rotationinfo.origin;
                const ct = toBackCanvasCoords(origin);
    
                totalRotationRad += rotationinfo.rotated;
                rotationHistory.push({
                    canvasOrigin: new Complex(origin[0], origin[1]),
                    BackOrigin: new Complex(ct.x, ct.y),
                    arg: rotationinfo.rotated
                });
                
                /** @param {NonnullPosition} posT */
                function _dist(posT){
                    return Math.pow((posT[0] - origin[0])**2 + (posT[1] - origin[1])**2, 0.5);
                }
                
                const mainclone = document.createElement("canvas");
                const circleRadius = Math.max(_dist([0,0]), _dist([0, shishiji_canvas.height]),
                    _dist([shishiji_canvas.width, 0]), _dist([shishiji_canvas.width, shishiji_canvas.height]));
                const circleDiameter = circleRadius*2;
                const clctx = mainclone.getContext("2d");
                const CoordsdrawStarts = toBackCanvasCoords([
                    origin[0] - circleRadius,
                    origin[1] - circleRadius,
                ]);
                const CoordsdrawEnds = toBackCanvasCoords([
                    origin[0] + circleRadius,
                    origin[1] + circleRadius,
                ]);
                const CoordsdrawSizes = {
                    width: CoordsdrawEnds.x - CoordsdrawStarts.x,
                    height: CoordsdrawEnds.y - CoordsdrawStarts.y
                };
        
                mainclone.width = mainclone.height = circleDiameter;
        
                clctx?.translate(circleRadius, circleRadius);
                clctx?.rotate(-totalRotationRad);
                clctx?.translate(-circleRadius, -circleRadius);
        
                drawSpare(mainclone, spare);
    
                const gx = {
                    sx: CoordsdrawStarts.x, sy: CoordsdrawStarts.y, sw: CoordsdrawSizes.width, sh: CoordsdrawSizes.height,
                    dx: 0, dy: 0, dw: circleDiameter, dh: circleDiameter
                };
    
                if (gx.sx < 0 || gx.sy < 0){
                    const rat = circleDiameter/CoordsdrawSizes.width;
    
                    gx.sw = gx.sw + gx.sx;
                    gx.sh = gx.sh + gx.sy;
                    gx.sx = gx.sy = 0;
                    gx.dx = gx.dw - (gx.sw * rat);
                    gx.dy = gx.dh - (gx.sh * rat);
                    gx.dw = (gx.sw * rat);
                    gx.dh = (gx.sh * rat);
                }
        
                //@ts-ignore
                clctx?.drawImage(children[0][0], ...Object.values(gx));
        
                shishiji_ctx.drawImage(mainclone,
                    circleRadius-origin[0], circleRadius-origin[1],
                    circleRadius-origin[0]+shishiji_canvas.width-(circleRadius-origin[0]),
                    circleRadius-origin[1]+shishiji_canvas.height-(circleRadius-origin[1]),
                    0, 0, shishiji_canvas.width, shishiji_canvas.height,
                );
                
                updatePositions();
                drawPoints();
                mainclone.remove();
            }
            
            /**@param {RotationInfo} rotationinfo  */
            function rexe(rotationinfo){
                backcanvas.width = shishiji_canvas.width;
                backcanvas.height = shishiji_canvas.height;
                drawSpare(backcanvas, spare);
                //@ts-ignore
                bctx?.drawImage(children[0][0], ...args);
                shishiji_ctx.drawImage(backcanvas, Math.floor(dx), Math.floor(dy), Math.floor(dw), Math.floor(dh));
    
                updatePositions();
                drawPoints();
            }
    
            rexe(rotationinfo);
        } else {
            // Caution! rotation hasn't been implemented yet!!
            // Hmm... what a spare...
            backcanvas.width = dw - 2;
            backcanvas.height = dh - 2;
    
            drawSpare(backcanvas, spare);
    
            if (sx < 0){
                args[2] = sw;
                args[4] = floor(-sx*ratio);
            }
            if (sy < 0){
                args[3] = sh;
                args[5] = floor(-sy*ratio);
            }
            const SX = args[0],
                SY = args[1],
                SW = args[2],
                SH = args[3],
                DX = args[4],
                DY = args[5],
                DW = args[6],
                DH = args[7];
    
    
            /**@see {@link ./devm/illustration/renderMap.png} */
            const side = 2**12;
            const startCoords = [ SX, SY ];
            const endCoords = [ SX+SW, SY+SH ];
            const startChCoords = [ floor(startCoords[0] / side), floor(startCoords[1] / side) ];
            const endChCoords = [ floor(endCoords[0] / side), floor(endCoords[1] / side) ];
            const currentChCoords = [...startChCoords];
            var remaining_width = SW;
            var remaining_height = SH;
    
    
            var minDynamicSX = SX % side;
            var minDynamicSY = SY % side;
    
            const where_drawing = [ floor(DX), floor(DY) ];
            
            const remCache = [ remaining_width, remaining_height ];
            const wdCache = [...where_drawing];
            
            
            
            for (var vertical = startChCoords[1]; vertical <= endChCoords[1]; vertical++){
                var height = remaining_height;
                
                minDynamicSY = minDynamicSY % side;
    
                if (floor((minDynamicSY + remaining_height) / side) / floor(minDynamicSY / side) > 1){
                    height = side - (minDynamicSY % side);
                }
    
                // initialize for every vertical draw
                remaining_width = remCache[0];
                minDynamicSX = SX % side;
                where_drawing[0] = wdCache[0];
                currentChCoords[0] = startChCoords[0];
    
                for (var horizontal = startChCoords[0]; horizontal <= endChCoords[0]; horizontal++){
                    while (remaining_width > 0){
                        var width = remaining_width;
    
                        if (floor((minDynamicSX + remaining_width) / side) / floor(minDynamicSX / side) > 1){
                            width = side - (minDynamicSX % side);
                        }
    
                        if (minDynamicSX == side)
                            minDynamicSX = 0;
                        if (minDynamicSY == side)
                            minDynamicSY = 0;
    
                        const renderMap = map_children(currentChCoords[0], currentChCoords[1]);
    
                        const bc_width = floor(width*ratio),
                            bc_height = floor(height*ratio);
    
                        if (renderMap != null)
                            bctx?.drawImage(renderMap,
                                Math.floor(minDynamicSX), Math.floor(minDynamicSY), Math.floor(width), Math.floor(height),
                                Math.floor(where_drawing[0]), Math.floor(where_drawing[1]), Math.floor(bc_width), Math.floor(bc_height)
                            );
    
                        currentChCoords[0]++;
                        minDynamicSX += width;
                        remaining_width -= width;
                        where_drawing[0] += bc_width;
                    }
                }
    
                minDynamicSY += height;
                remaining_height -= height;
                where_drawing[1] += floor(height*ratio);
                currentChCoords[1]++;
            }
    
            //@ts-ignore
            ctx.drawImage(backcanvas, dx, dy, dw, dh);
    
            function* another(){
                for (var vertical = startChCoords[1]; vertical <= endChCoords[1]; vertical++){
                    for (var horizontal = startChCoords[0]; horizontal <= endChCoords[0]; horizontal++){
                        const source_child_cvs = map_children(horizontal, vertical);
                        const _sx = startCoords[0] - side*horizontal,
                            _sy = startChCoords[1] - side*vertical,
                            _sw = endChCoords[0]*side > endCoords[0] ? side : endCoords[0] - side*horizontal,
                            _sh = endChCoords[1]*side > endCoords[1] ? side : endCoords[1] - side*vertical;
        
                        if (source_child_cvs != null)
                            backcanvas.getContext("2d")?.drawImage(
                            source_child_cvs, Math.floor(_sx), Math.floor(_sy), Math.floor(_sw), Math.floor(_sh), 0, 0, backcanvas.width, backcanvas.height);
                    }
                }
                reDraw(backcanvas,
                    backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
                    backcanvas.canvas.width, backcanvas.canvas.height,
                    0, 0, shishiji_canvas.width, shishiji_canvas.height
                );
            }
    
            updatePositions();
            drawPoints();
        }
    }
    
    
    /**
     * @deprecated
     * @ignore
     * @param {NonnullPosition} origin 
     * @param {number} [rotation] 
     */
    function rotateCanvas(origin, rotation){
        if (rotation === void 0){
            rotation = backcanvas.canvas.rotation;
        }
    
    
        /** @param {NonnullPosition} posT */
        function _dist(posT){
            return Math.pow((posT[0] - origin[0])**2 + (posT[1] - origin[1])**2, 0.5);
        }
    
        const bctx = backcanvas.getContext("2d");
        const mainclone = document.createElement("canvas");
        const circleRadius = Math.max(_dist([0,0]), _dist([0, shishiji_canvas.height]), _dist([shishiji_canvas.width, 0]), _dist([shishiji_canvas.width, shishiji_canvas.height]));
        const circleDiameter = circleRadius*2;
        const CoordsdrawStarts = toBackCanvasCoords([
            origin[0] - circleRadius,
            origin[1] - circleRadius,
        ]);
        const CoordsdrawEnds = toBackCanvasCoords([
            origin[0] + circleRadius,
            origin[1] + circleRadius,
        ]);
        const clctx = mainclone.getContext("2d");
        const spare = MAPDATA[CURRENT_FLOOR].spareImage || new Image();
        
        mainclone.width = mainclone.height = circleDiameter;
    
        bctx?.clearRect(0, 0, backcanvas.width, backcanvas.height);
        shishiji_ctx.clearRect(0, 0, shishiji_canvas.width, shishiji_canvas.height);
    
        backcanvas.width = shishiji_canvas.width;
        backcanvas.height = shishiji_canvas.height;
    
        drawSpare(backcanvas, spare);
    
        bctx?.drawImage(map_children()[0][0], backcanvas.canvas.coords.x, backcanvas.canvas.coords.y,
        backcanvas.canvas.width, backcanvas.canvas.height,
        0, 0, shishiji_canvas.width, shishiji_canvas.height);
    
        clctx?.translate(circleRadius, circleRadius);
        clctx?.rotate(-rotation);
        clctx?.drawImage(backcanvas, -circleRadius, -circleRadius, circleDiameter, circleDiameter,
            CoordsdrawStarts.x, CoordsdrawStarts.y, CoordsdrawEnds.x-CoordsdrawStarts.x, CoordsdrawEnds.y-CoordsdrawStarts.y
        );
        
        shishiji_ctx.drawImage(mainclone, 0, 0, shishiji_canvas.width, shishiji_canvas.height,
            circleRadius-origin[0], circleRadius-origin[1],
            circleRadius-origin[0]+shishiji_canvas.width-(circleRadius-origin[0]), circleRadius-origin[1]+shishiji_canvas.height-(circleRadius-origin[1])
        );
    }
    
    
    
    
    /**
     * @param {TouchEvent} event 
     * @returns {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian, allowRotation: boolean}}
     */
    function touchZoom(event){
        /**@type {NonnullPosition} */
        var crossPos = [ -1, -1 ];
        const abs = Math.abs;
        const touches = event.touches;
        var allowRotation = false;
    
    
        zoomCD++;
        const Fx = {
            previous: {
                slope: (prevTouchINFO.real[0].clientY - prevTouchINFO.real[1].clientY) / (prevTouchINFO.real[0].clientX - prevTouchINFO.real[1].clientX),
            },
            this: {
                slope: (touches[0].clientY - touches[1].clientY) / (touches[0].clientX - touches[1].clientX),
            }
        };
    
        const distance = getMidestOfTouches(touches);
        var diffRatio = distance / previousTouchDistance.distance;
    
        if (previousTouchDistance.x == -1 && previousTouchDistance.y == -1 && previousTouchDistance.distance == -1){
            diffRatio = 1;
        }
    
        previousTouchDistance.distance = distance;
    
        //#region 
        if (Fx.previous.slope == Fx.this.slope){
            var D1 = touches[0].clientX - prevTouchINFO.touches[0].x;
            var D2 = touches[1].clientX - prevTouchINFO.touches[1].x;
    
            (D1 === 0 && D2 === 0 || D1 + D2 == 0) ? D1 = D2 = 1 : void 0;
    
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
            
            crossPos = [ crossX, crossY ];
    
            if (!crossPos.some(t => { return isNaN(t) })) 0;
        }
        //#endregion
    
        if (willOverflow(diffRatio, false)) diffRatio = 1;
    
        const prevOrigin = getMiddlePos(prevTouchINFO.real);
        const currentOrigin = getMiddlePos(touches);
        const x1d = prevOrigin[0] * diffRatio;
        const y1d = prevOrigin[1] * diffRatio;
        const diffx = currentOrigin[0] - x1d;
        const diffy = currentOrigin[1] - y1d;
        /**@type {Radian} */
        var rotation = 0;
        //#region 
        +function(){
            const PI = Math.PI;
            const theta = getThouchesTheta(touches);
    
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
                pastRotateMin = allowRotation = true;
            }
        }();
        //#endregion
    
    
        if (zoomCD > MOVEPROPERTY.touch.zoomCD){
            zoomMapAssistingNegative(diffRatio, [ 0, 0 ], void 0, void 0, true);
            moveMapAssistingNegative({
                top: diffy,
                left: diffx
            }, allowRotation ? {
                rotated: rotation,
                origin: crossPos
            } : void 0);
        }
    
        return { diffRatio: diffRatio, crossPos: crossPos, rotation: rotation, allowRotation: allowRotation };
    }
    
    
    /**
     * 
     * @param {TouchEvent} event 
     */
    function onTouchMove(event){
        const touches = event.touches;
        const pos = getMiddlePos(touches);
        const prevp = pointerPosition;
    
        /**@type {{diffRatio: number, crossPos: NonnullPosition, rotation: Radian, allowRotation: boolean}} */
        var adjust = { diffRatio: 1, crossPos: [ -1, -1 ], rotation: 0, allowRotation: false };
    
    
        pointerPosition = pos;
    
    
        if (touchCD < MOVEPROPERTY.touch.downCD){
            touchCD++;
            return;
        }
        
    
        if (touches.length >= 2 && prevTouchINFO.real !== void 0 && prevTouchINFO.real.length >= 2){
            /**@see {@link (./eventCalcu.js).touchZoom} */
            adjust = touchZoom(event);
            prevTouchINFO.zoom = true;
        } else {
            pastRotateMin = false;
            rotatedThisTime = 0;
            totalRotateThisTime = 0;
            prevTheta = -1;
            zoomCD = 0;
            prevTouchINFO.cross = [ -1, -1 ];
    
            //#region 
            function frict(){
                var touch_0 = { clientX: prevTouchINFO.real[0].clientX, clientY: prevTouchINFO.real[0].clientY, velocity: touchZoomVelocity[0] };
                var touch_1 = { clientX: prevTouchINFO.real[1].clientX, clientY: prevTouchINFO.real[1].clientY, velocity: touchZoomVelocity[1] };
    
                +function(touch_0, touch_1){
                    const orig = [ touch_0, touch_1 ];
                    const a = touchZoomVelocity.a;
    
                    function i(n){
                        return n < 0 ? -1 : 1;
                    }
                    if (zoomFrictInterval !== null)
                        clearInterval(zoomFrictInterval);
            
                    if (isNaN(touch_0.velocity.x) || isNaN(touch_0.velocity.y)
                        || isNaN(touch_1.velocity.x) || isNaN(touch_1.velocity.y)
                        ) return;
                }(touch_0, touch_1);
            }
            if (false)
                frict();
            //#endregion
    
            prevTouchINFO.zoom = false;
        }
    
    
        if (!prevp.some(t => t === null) && touches.length == 1){
            //@ts-ignore
            const map_move = { left: pos[0] - prevp[0], top: pos[1] - prevp[1] };
            moveMapAssistingNegative(map_move);
        }
    
        prevTouchINFO.cross = adjust.crossPos;
        savePrevTouches(touches);
    }
    
    
    
    
    /**
     * Zoom canvas by scrolling mouse wheel
     * @param {WheelEvent} e 
     */
    function canvasonScroll(e){
        var delta = MOVEPROPERTY.scroll * 1;
        e.deltaY > 0 ? delta = 1/delta : void 0;
        //@ts-ignore
        zoomMapAssistingNegative(delta, cursorPosition);
    }
    
    
    /**
     * Zoom canvas by scrolling mouse wheel
     * @param {WheelEvent} e 
     */
    function canvasonCtrScroll(e){
        const rotated = toRadians(2);
        const which_ = e.deltaY < 0 ? 1 : -1;
    
        moveMapAssistingNegative({ top: 0, left: 0 }, {
            rotated: rotated*which_,
            //@ts-ignore
            origin: cursorPosition
        })
    }
    
    
    /**
     * 
     * @param {MouseEvent} e 
     */
    function onMouseMove(e){
        /**@type {NonnullPosition} */
        const pos = [ e.clientX, e.clientY ];
        //@ts-ignore N - null = N
        const moved = { left: pos[0] - pointerPosition[0], top: pos[1] - pointerPosition[1] };
    
        moveMapAssistingNegative(moved);
        pointerPosition = pos;
    }
    
    
    
    
    /**@param {unknown[]} a  */
    function _(...a){
    
    }
    
    
    /**@type {{[key: string]: {pressing: boolean, _do: (arg0: MoveData) => MoveData, _leave: () => void}}} */
    const arrowkeyBehavs = {
        arrowup: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                if (!spckeystatus.ctr)
                    moves.top += spckeystatus.shift ? MOVEPROPERTY.arrowkeys.nosprint : MOVEPROPERTY.arrowkeys.move;
                else
                    zoomMapAssistingNegative(spckeystatus.shift ? MOVEPROPERTY.arrowkeys.nosprintratio : MOVEPROPERTY.arrowkeys.ratio, [shishiji_canvas.width/2, shishiji_canvas.height/2]);
                return moves;
            },
            _leave: function(){
                _(0, MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval);
            },
        },
        arrowdown: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                if (!spckeystatus.ctr)
                    moves.top += spckeystatus.shift ? -MOVEPROPERTY.arrowkeys.nosprint : -MOVEPROPERTY.arrowkeys.move;
                else 
                    zoomMapAssistingNegative(spckeystatus.shift ? 1/MOVEPROPERTY.arrowkeys.nosprintratio : 1/MOVEPROPERTY.arrowkeys.ratio, [shishiji_canvas.width/2, shishiji_canvas.height/2]);
                return moves;
            },
            _leave: function(){
                _(0, -MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval);
            },
        },
        arrowleft: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                moves.left += spckeystatus.shift ?  MOVEPROPERTY.arrowkeys.nosprint : MOVEPROPERTY.arrowkeys.move;
                return moves;
            },
            _leave: function(){
                _(MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval, 0);
            },
        },
        arrowright: {
            pressing: false,
            /**@param {MoveData} moves*/
            _do: function(moves){
                moves.left += spckeystatus.shift ? -MOVEPROPERTY.arrowkeys.nosprint : -MOVEPROPERTY.arrowkeys.move;
                return moves;
            },
            _leave: function(){
                _(-MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval, 0);
            },
        },
    };
    
    
    const spckeystatus = {
        ctr: false,
        shift: false,
    };
    
    
    /**@ts-ignore @type {NodeJS.Timeout} */
    var _ami = 0;
    function _arrowmoves(){
    
        
        clearInterval(_ami);
        clearTimeout(WH_CHANGE_TM);
    
        _ami = setInterval(() => {
            /**@type {MoveData} */
            var _moves = { top: 0, left: 0 };
            for (const _key in arrowkeyBehavs){
                if (arrowkeyBehavs[_key].pressing)
                    _moves = arrowkeyBehavs[_key]._do.call(0, _moves);
            }
            moveMapAssistingNegative(_moves);
        }, MOVEPROPERTY.arrowkeys.interval);
    }
    
    
    function _stopArrowmoves(){
        clearInterval(_ami);
    }
    
    
    window.addEventListener("keydown", function(e){
        const key = e.key.toLowerCase();
    
        spckeystatus.ctr = e.ctrlKey;
        spckeystatus.shift = e.shiftKey;
    
        if (key in arrowkeyBehavs){
            var actives = 0;
            Object.keys(arrowkeyBehavs).forEach(o => { if (arrowkeyBehavs[o].pressing) actives++; })
            if (actives == 0){
                _arrowmoves();
            }
    
            arrowkeyBehavs[key].pressing = true;
        }
    });
    
    
    window.addEventListener("keyup", function(e){
        const key = e.key.toLowerCase();
    
        spckeystatus.ctr = e.ctrlKey;
        spckeystatus.shift = e.shiftKey;
        
        if (key in arrowkeyBehavs){
            arrowkeyBehavs[key].pressing = false;
    
            var actives = 0;
            Object.keys(arrowkeyBehavs).forEach(o => { if (arrowkeyBehavs[o].pressing) actives++; })
            if (actives == 0){
                _stopArrowmoves();
                //@ts-ignore
                WH_CHANGE_TM = setTimeout(() => {
                    setBehavParam();
                }, href_replaceCD);
            }
        }
    });
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/objects").mapObjElement} mapObjectElement
     * @typedef {import("../shishiji-dts/objects").MapObject} mapObject
     */
    
    
    /**
     * use /scripts/coords.py to find coordinate
     * @param {mapObject} objectData 
     */
    async function putMobjonMap(objectData){
        /**@ts-ignore @type {HTMLElement} */
        const viewer = document.getElementById("shishiji-view");
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        const behavior = objectData.object.type.behavior;
        const orgname = objectData.discriminator;
        var zIndex = 1001;
        
        const objectCoords_fromCanvas = {
            x: (objectData.object.coordinate.x - backcanvas.canvas.coords.x) * zoomRatio,
            y: (objectData.object.coordinate.y - backcanvas.canvas.coords.y) * zoomRatio,
        };
        
        var styles = "";
        var classes = "";
        var dfcursor = "pointer";
        const obj_id = formatString(objectIdFormat, orgname);
        const pathConverter = getPathConverter(objectData);
        const iconsrc = pathConverter(orgname, objectData.object.images.icon);
        const date = new Date();
        const today = date.getDay();
        const DAY = today <= 15 ? 1 : 2;
    
    
        switch (behavior){
            case "dynamic":
                classes += "popups realshadow ";
                break;
            default:
            case "static":
                zIndex = 999;
                classes += "mapObj_static";
                if (!objectData.object.type.border)
                    styles += "border: none; border-radius: 0; background-color: transparent;";
                if (!objectData.article && !objectData.object.open_screen){
                    styles += "cursor: default; pointer-events: none;";
                    dfcursor = "default";
                }
                break;
        }
    
    
        if (objectData.object.open_screen){
            classes += "aiughW ";
        }
    
    
        const gt = { df: "", st: "" };
        
        gt.df = `dfsize="${objectData.object.size.width} ${objectData.object.size.height}"`;
        gt.st = `min-width:${objectData.object.size.width}px;min-height:${objectData.object.size.height}px;max-width:${objectData.object.size.width}px;max-height:${objectData.object.size.height}px;`
    
        const element_outerHTML = `
            <div id="${obj_id}" class="mpob centeral" style="transform: translate(${objectCoords_fromCanvas.x}px, ${objectCoords_fromCanvas.y}px); z-index: ${zIndex};${objectData.object.day && objectData.object.day != DAY ? "display:none" : ""}"
                coords="${objectData.object.coordinate.x} ${objectData.object.coordinate.y}"
                behavior="${objectData.object.type.behavior}"
                ${gt.df}>
                <div class="flxxt ${behavior == "dynamic" ? "interrealface" : ""} canvas_interactive mpobmctx ${classes}" style="${gt.st}${styles}" dfcs="${dfcursor}">
                    <div class="ashuW" style="background-image:url('${iconsrc}')"></div>
                </div>
            </div>`;
    
        $(viewer).append(element_outerHTML);
        objectData.article ? setObjectCrowdStatus(objectData.discriminator, objectData.article.crowd_status) : void 0;
        //setObjectVenue(objectData.discriminator, objectData.article.venue);
        const el = $(viewer).children()[$(viewer).children().length - 1];
        
        if (objectData.article){
            listenInterOnEnd(el,
            /** @param {JQuery.jqXHR} articleajax */
            function(e, articleajax){
                const eventDetails = objectData;
    
                this.children[0].classList.add("ADSHIiuhbgnajsyu");
    
                OverView.reduceCoro.push(() => this.children[0].classList.remove("ADSHIiuhbgnajsyu"));
                raiseOverview();
                writeArticleOverview(eventDetails, true);
    
                setParam(ParamName.ARTICLE_ID, objectData.discriminator);
                setBehavParam();
    
                pointerVelocity.v =  pointerVelocity.x =  pointerVelocity.y = 0;
            }, {
                forceLeft: true,
                arg1: function(){
                    return void 0;
                }
            });
        } else if(objectData.object.open_screen){
            listenInterOnEnd(el, function(){
                if (objectData.object.open_screen == "drink_screen"){
                    openDrinkScreen(objectData.discriminator);
                } else {
                    openPkGoScreen(objectData.object.open_screen || "");
                }
            });
        }
    }
    
    
    function clearMapObjects(){
        $(".mpob").remove();
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
                putMobjonMap(objects[y]);
            }
        }
        updatePositions();
        drawPoints();
    }
    
    
    function resetObjectsDecorations(){
        Object.keys(mapObjectComponent).forEach(t => setObjectNormal(t));
    }
    
    
    function showClearedOrgs(){
        resetObjectsDecorations();
        for (const orgname of LOGIN_DATA.data.completed_orgs){
            setObjectCleared(orgname);
        }
    }
    
    
    function showFavoritedOrgs(){
        resetObjectsDecorations();
        for (const orgname of LOGIN_DATA.data.favorited_orgs){
            setObjectFavorite(orgname);
        }
    }
    
    
    function showGoodOrgs(){
        resetObjectsDecorations();
        for (const orgname of LOGIN_DATA.data.completed_orgs){
            setObjectCleared(orgname);
        }
        for (const orgname of LOGIN_DATA.data.favorited_orgs){
            setObjectFavorite(orgname);
        }
    }
    
    
    
    
    
    /**
     * 
     * @param {mapObjectElement} mapobj 
     */
    function isOutofBounds(mapobj){
        const hello = $($(mapobj).children()[0]);
        const transform = window.getComputedStyle(mapobj).transform;
        const values = transform.match(/matrix\((.+)\)/)?.[1]?.split(", ");
        const whereIs = {
            x: parseFloat(values?.[4] || "0"),
            y: parseFloat(values?.[5] || "0")
        };
        const size = {
            width: parseFloat(hello.css("min-width")?.replace("px", "")),
            height: parseFloat(hello.css("min-height")?.replace("px", ""))
        };
        if (
            whereIs.x + size.width/2 < 0 || whereIs.x - size.width/2 > window.innerWidth
            ||
            whereIs.y + size.height/2 < 0 || whereIs.y - size.height/2 > window.innerHeight
        ) return true;
    }
    
    
    function updatePositions(){
        for (const _mapObj of document.getElementsByClassName("mpob")){
            /**@ts-ignore @type {mapObjectElement} */
            const mapObj = _mapObj;
            const outOfBounds = { prev: mapObj.getAttribute("prout"), now: false };
            const coords = getCoords(mapObj);
            var transforms = "";
            const objPosition = {
                x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
                y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
            };
    
            var behavior = getBehavior(mapObj);
            const dfsize = getDefaultSize(mapObj);
    
            var size = Object.create(dfsize);
    
            if (behavior == "dynamic"){
                if (zoomRatio > MOVEPROPERTY.object.dynamic_to_static.over) behavior = "dynatic";
                if (zoomRatio < MOVEPROPERTY.object.dynamic_to_static.under) behavior = "_dynatic";
            }
            
            switch (behavior){
                case "static":
                    size.width = dfsize.width*zoomRatio;
                    size.height = dfsize.height*zoomRatio;
                    break;
                /**
                 * これ重いマジ
                 */
                case "dynatic":
                    size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                    size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                    break;
                case "_dynatic":
                    break;
                    size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
                    size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
                    break;
                case "dynamic":
                    size.width = dfsize.width;
                    size.height = dfsize.height;
                    break;
            }
            
            transforms += `translate(${objPosition.x}px, ${objPosition.y}px)`;
    
            if (
                (objPosition.x + size.width < 0 || objPosition.x - size.width > window.innerWidth
                ||
                objPosition.y + size.height < 0 || objPosition.y - size.height > window.innerHeight)
            ){
                if (outOfBounds.prev) continue;
                else mapObj.setAttribute("prout", "true");
            }  else if(outOfBounds.prev){
                mapObj.removeAttribute("prout");
            }
            
            mapObj.style.transform = transforms;
            
            $($(mapObj).children()[0])
                .css("min-width", size.width+"px")
                .css("min-height", size.height+"px");
                //.css("max-width", size.width+"px")
                //.css("max-height", size.height+"px");
        }
    }
    
    
    function drawPoints(){
        const curpoints = mapPointComponent[CURRENT_FLOOR] || [];
    
        for (const point of curpoints){
            drawText(point.coords, point.name);
        }
    }
    
    
    /**
     * 
     * @param {string} disc 
     * @returns {HTMLElement | null}
     */
    function getObject(disc){
        const k = document.getElementById(formatString(objectIdFormat, disc));
        return k ? k : null;
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     * @param {string} message 
     */
    function setObjectMessageAbove(discriminator, message){
        const obje = getObject(discriminator);
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     */
    function setObjectCleared(discriminator){
        const obje = getObject(discriminator);
        
        if (obje){
            const ch = obje.children[0];
            ch.classList.add("mpob-clerdd");
            ch.classList.remove("_", "favoritE");
            ch.classList.add("cleareD");
    
            //ch.querySelectorAll(".Hjasgia").forEach(e => e.remove());
            //$(ch).prepend(`<div class="Hjasgia"><K></K><R></R></div>`);
        }
    }
    
    
    /**
     * @param {string} discriminator
     * @param {number} status 
     */
    function setObjectCrowdStatus(discriminator, status){
        const obje = getObject(discriminator);
    
        if (status == 0) status = 1;
    
        if (obje){
            const ch = obje.children[0];
    
            if (ch.querySelectorAll(`.crowds-${status}`).length > 0) return;
            ch.querySelectorAll(".AUIHVP").forEach(t => t.remove());
            $(ch).prepend(`<div class="AUIHVP kpls"><span class="crowds-${status}"></span></div>`);
        }
    }
    
    
    /**
     * @deprecated closed my Ito Koyo (who proposed this)
     * @param {string} discriminator
     * @param {string} venue 
     */
    function setObjectVenue(discriminator, venue){
        const obje = getObject(discriminator);
    
        if (obje){
            const ch = obje.children[0];
    
            if (ch.querySelectorAll(".NJIvua").length > 0) return;
            $(ch).prepend(`<div class="NJIvua kpls"><span>${venue}</span></div>`);
        }
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     */
    function setObjectFavorite(discriminator){
        const obje = getObject(discriminator);
        
        if (obje){
            const ch = obje.children[0];
    
            if (ch.querySelectorAll(".AIGbbvwG").length > 0) return;
            $(ch).prepend(`<div class="AIGbbvwG kpls"><span></span></div>`);
        }
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     */
    function setObjectNormal(discriminator){
        const obje = getObject(discriminator);
        
        if (obje){
            const ch = obje.children[0];
            ch.classList.remove("favoritE", "cleareD");
            ch.classList.add("_");
        }
    }
    
    
    function setClearedRate(){
        const rat = Math.ceil((LOGIN_DATA.data.completed_orgs.length/completable)*100);
        var col = "";
        var good = false;
    
        if (rat == 100){
            col = "#4CAF50";
        } else if (rat >= 75){
            col = "#C0CA33";
        } else if (rat >= 50){
            col = "#FDD835";
        } else if (rat >= 25){
            col = "#F4511E";
        } else if (rat >= 0){
            col = "#E53935";
        }
    
        if (LOGIN_DATA.data.completed_orgs.length >= 13){
            good = true;
            col = "#4CAF50";
            $("#oive_r")
            .css("width", "340px")
            .css("height", "60px")
            .css("top", "calc(100dvh - 70px)");
            $("#oive_h")
            .css("padding", "0 10px");
            $("#auyGAWW")
            .text(`2階職員室前の面談室5 へおこしください！ペンを贈呈致します ${rat}% (${LOGIN_DATA.data.completed_orgs.length}/${completable})`);
        } else {
            $("#auyGAWW")
            .css("color", col)
            .text(`${rat}% (${LOGIN_DATA.data.completed_orgs.length}/${completable})`);
        }
    }
    
    
    /**
     * 
     * @param {mapObject | SourcePlace} place 
     */
    function revealOnMap(place){console.log(place)
        const approach_id = Random.string(8);
        const floor = place["object"]?.["floor"] ?? place["floor"];
    
        approach_beings.length = 0;
        approach_beings.push(approach_id);
        MOVEPROPERTY.deny = true;
    
        
        function doApproach(){
            const ittanZR = 0.25;
            const destzr = ZOOMRATIO_ON_SHARE;
            const duration = 3000/5;
            const currentMiddle = toBackCanvasCoords([window.innerWidth/2, window.innerHeight/2]);
            const each = {
                zoom1: (ittanZR < zoomRatio) ? (ittanZR - zoomRatio)/(duration/3) : 0,
                zoom2: (destzr - ittanZR)/(duration/3),
                pos: {
                    x: ((place["object"]?.["coordinate"]?.["x"] ?? place["x"]) - currentMiddle.x)/(duration*(2/3)),
                    y: ((place["object"]?.["coordinate"]?.["y"] ?? place["y"]) - currentMiddle.y)/(duration*(2/3)),
                }
            }
            var s = 0;
    
            function approach(){
                s++;
                if (s > duration){
                    setBehavParam();
                    MOVEPROPERTY.deny = false;
                    return;
                }
                if (s < duration/3)
                    zoomRatio += each.zoom1;
                if (s > duration*(3-1)/3)
                    zoomRatio += each.zoom2;
                if (s < duration*(2/3)){
                    currentMiddle.x += each.pos.x;
                    currentMiddle.y += each.pos.y;
                }
                setCoordsOnMiddle(currentMiddle, zoomRatio);
                approach_beings.includes(approach_id) ? setTimeout(approach, 5) : void 0;
            }
    
            approach();
        }
    
        if (CURRENT_FLOOR == (place["object"]?.["floor"] ?? place["floor"])){
            doApproach();
        } else {
            const data = MAPDATA[floor];
            changeFloor(floor, floor, data)
            .then(doApproach);
        }
    }
    
    
    
    
    class OverView {
        static fullyopened = false;
        /**
         * @type {"closed" | "opening" | "opened" | "closing"}
         */
        static status = "closed";
        /**
         * @type {(() => void)[]}
         */
        static reduceCoro = [];
        
        static get isfullyopened(){
            return this.fullyopened;
        }
    
        static get currentstatus(){
            return this.status;
        }
    }
    
    
    function raiseOverview(){
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        const kk = $(overview);
    
        strictMap();
        OverView.status = "opening";
        overview.style.top = "0vh";
        kk
        .show()
        .removeClass("reducedown")
        .addClass("raiseup")
        .scrollTop(0);
        $("#overview-close-w").show();
        setTimeout(() => {
            OverView.fullyopened = true;
            OverView.status = "opened";
            kk.removeClass("raiseup");
        }, 500);
    
        prevListener.favorite = prevListener.vote = () => void 0;
        prevListener.close = reduceOverview;
        prevListener.share = function shareContent(){
            const discriminator = getParam(ParamName.ARTICLE_ID);
            const data = getMapObjectData(discriminator || "");
            const _url = new URL(window.location.href);
            var shareURL = `${_url.origin}${_url.pathname.replace(/@.*/, "")}?${ParamName.FLOOR}=${CURRENT_FLOOR}&${ParamName.ARTICLE_ID}=${discriminator}`;
    
            if (data == null || discriminator == null){
                console.log(data, discriminator)
                openSharePopup({ title: "" }, "", {}, "", "", {labelkey: "", url: ""}, true);
                return;
            }
    
            const message = `${TEXTS[LANGUAGE].SHARE_EVENT_MESSAGE} ${data.article.title}`;
            
            openSharePopup(
                {
                    title: TEXTS[LANGUAGE].SHARE_EVENT_POPUP_TITLE,
                    subtitle: TEXTS[LANGUAGE].SHARE_EVENT_POPUP_SUBTITLE,
                },
                shareURL,
                {
                    title: TEXTS[LANGUAGE].SHARE_EVENT_DATA_TITLE,
                    text: `${message}\n{__SHARE_URL__}`,
                },
                /**
                 * jump to the object screened on middle of window
                 */
                ParamValues.FROM_ARTICLE_SHARE,
                message,
                {
                    labelkey: "SHARE_EVENT_INCLUDE_EVTH",
                    // active element id match
                    url: `${shareURL}&${ParamName.SCROLL_POS}=${$("#shishiji-overview").scrollTop()}&${ParamName.ART_TARGET}=${$(".tg-active")[0].id.match(/ovv-t-(.*?)-sd/)?.[1]}`,
                }
            );
        }
    }
    
    
    function strictMap(){
        clearInterval(Intervals.reduceOverview);
        $("#user-stricter")
        .removeClass("deactive")
        .addClass("active");
    }
    
    
    function restrictMap(){
        clearTimeout(Intervals.restrict);
        $("#user-stricter")
        .removeClass("active")
        .addClass("deactive");
    }
    
    
    function reduceOverview(){
        /**@ts-ignore @type {HTMLElement} */
        const overview = document.getElementById("shishiji-overview");
        const kk = $(overview);
    
        if (tour_status.article) return;
    
        restrictMap();
        OverView.fullyopened = false;
        OverView.status = "closing";
        overview.style.top = "100vh";
        kk
        .removeClass("raiseup")
        .addClass("reducedown");
        $("#overview-close-c").off("click", reduceOverview);
        $("#overview-context").removeClass("fadein");
    
        $(".tg-active").removeClass("tg-active");
        $("#dvd2").removeClass("ihateky");
        $("#theme-meta").attr("content", "#15202b");
    
        OverView.reduceCoro.forEach(e => e());
        OverView.reduceCoro.length = 0;
        
        Intervals.reduceOverview = setTimeout(() => {
            OverView.status = "closed";
            $("#ev_property").empty();
            $("#--art-header").attr("src", "");
            kk
            .css("border-top", "20px solid white")
            .removeClass("reducedown")
            .scrollTop(0)
            .hide();
        }, 150);
    
        delParam(ParamName.ARTICLE_ID);
    
        if ($("#shishiji-overview").attr("disc") == "jetcoaster"){
            ws.emit("update.jetcoaster.leave");
        }
    }
    
    
    /**
     * HTML を JS にしなさい
     * @param {mapObject} objectData 
     * @param {boolean} fadein 
     * @param {number} [scroll_top]
     * @param {string} [target] 
     * @param {boolean} [FORCE] 
     * @param {boolean} [jump_button] 
     */
    function writeArticleOverview(objectData, fadein, scroll_top, target, FORCE, jump_button){
        /**@ts-ignore @type {HTMLElement} */
        const overview  = document.getElementById("shishiji-overview");
        const color = (objectData.article.theme_color) ? objectData.article.theme_color : "black";
        const font = (objectData.article.font_family) ? objectData.article.font_family : "";
        const orgname = objectData.discriminator;
        const pathConvertfunc = getPathConverter(objectData);
        /**@type {(HTMLImageElement | HTMLVideoElement)[]} */
        const imageNodes = [];
        const detailajax = $.post(ajaxpath.getart+"?discriminator="+objectData.discriminator, { discriminator: objectData.discriminator });
        const loadTimeout = setTimeout(() => intoLoad("loading-article-"+objectData.discriminator, "middle"), 500);
        var articleContext = "";
        var detail_tr = "";
        var art_sct = 0;
    
    
        detailajax.then(data => {
            const article = data.article;
            const crowd = data.crowd;
            const pt = data.pt;
            const tr1 = objectData.object.no_admission ? document.createElement("span") : createCustomTr("訪問pt", pt.toString()+"pt");
            const tr2 = createCustomTr("混雑状況", crowd_status[crowd]);
    
            $(".ev_property").prepend(tr1, tr2);
            detail_tr += tr1.outerHTML + tr2.outerHTML;
    
            articleContext = mcFormat(article, fn => pathConvertfunc(orgname, fn));
            if (articleContext === "<span></span>"){
                articleContext = `<h4 style="width:100%;margin-top:50px;margin-bottom:50px;text-align:center;">${TEXTS[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
            }
            $("#ARTICLE_UNKO").html(articleContext);
        })
        .catch(() => PictoNotifier.notifyError(TEXTS[LANGUAGE].FAILED_TO_LOAD_ARTICLE_CONTENT))
        .always(() => {outofLoad("loading-article-"+objectData.discriminator, "middle");clearTimeout(loadTimeout)});
    
    
        if (objectData.discriminator == "jetcoaster"){
            ws.emit("update.jetcoaster.join");
            ws.off("data.article", prevListener.jetupdater);
            prevListener.jetupdater = async function(data){
                const article = data.article;
                
                articleContext = mcFormat(article, fn => pathConvertfunc(orgname, fn));
                if (articleContext === "<span></span>"){
                    articleContext = `<h4 style="width:100%;margin-top:50px;margin-bottom:50px;text-align:center;">${TEXTS[LANGUAGE].ARTICLE_NO_ARTICLE}</h4>`;
                }
                $("#ARTICLE_UNKO").html(articleContext);
            };
            ws.on("data.article", prevListener.jetupdater);
        }
    
        
        /*if (!window.navigator.onLine){
            PictoNotifier.notify(
                "error",
                TEXTS[LANGUAGE].NOTIFICATION_CONNECTION_ERROR,
                {
                    duration: 2500,
                    discriminator: "article connection error",
                    do_not_keep_previous: true
                }
            );
            $("#ovv-ctx-loading").html(`<div class="flxxt"><div style="width:40%;">${GPATH.ERROR_ZAHUMARU}</div></div>${TEXTS[LANGUAGE].ARTICLE_CONNECTION_ERROR}`);
            $("#overview-share").hide();
            return;
        }*/
    
        if (isUnvisitedTour("article")){
            tour_status.article = true;
            setTimeout(() => startTour("article"), 500);
        }
    
        for (const tr of objectData.article.custom_tr){
            if (tr.title && tr.content)
                detail_tr += createCustomTr(tr.title, tr.content).outerHTML;
        }
        detail_tr += createCustomTr("開催場所", objectData.article.venue).outerHTML;
    
        if (fadein)
            $("#ctx-article").addClass("fadein");
        
        overview.style.borderTop = "solid var(--shishiji-ovv-theme-height) "+color;
        $(overview).css("font-family", font);
        $("#dvd4 > span").text(TEXTS[LANGUAGE].SHARE);
        $("#dvd1 > span").text(TEXTS[LANGUAGE].REVEAL_ON_MAP);
        $("#dvd2 > span").text(TEXTS[LANGUAGE].FAVORITE);
        $("#dvd3 > span").text(TEXTS[LANGUAGE].VOTE);
        $("#ovv-ctx-loading-w").remove();
        $("#ctx-title").text(objectData.article.title);
        $("#shishiji-overview").attr("disc", objectData.discriminator);
    
        setTimeout(() => $("#theme-meta").attr("content", color), 500);
    
        LOGIN_DATA.data.favorited_orgs.includes(orgname) ? $("#dvd2").addClass("ihateky") : $("#dvd2").removeClass("ihateky");
        LOGIN_DATA.data.completed_orgs.includes(orgname) ? (() => {
            $("#dvd3").show().removeClass("uihGAV");
        })() : (() => {
                $("#dvd3").show().addClass("uihGAV");
                prevListener.vote = () => {
                    PictoNotifier.notifyInfo(TEXTS[LANGUAGE].VOTE_AVAILABLE_AFTER_VISITING);
                }
            })();
        lastFavData = {
            deled: null,
            feels: [...LOGIN_DATA.data.favorited_orgs]
        };
        
        function favoriteM(){
            const disc = objectData.discriminator;
            const _prevman = [...LOGIN_DATA.data.favorited_orgs];
            var _deled = false;
    
    
            intoLoad("favud", "top");
    
            if (LOGIN_DATA.data.favorited_orgs.includes(disc)){
                $("#dvd2").removeClass("ihateky");
                LOGIN_DATA.data.favorited_orgs = LOGIN_DATA.data.favorited_orgs.filter(r => r !== disc);
                _deled = true;
            } else {
                $("#dvd2").addClass("ihateky");
                LOGIN_DATA.data.favorited_orgs.push(disc);
            }
    
    
            showGoodOrgs();
            clearTimeout(Intervals.ogfav);
            Intervals.ogfav = setTimeout(() => _exclusive(_deled, _prevman), 500);
        }
    
        /**@param {boolean} deled @param {string[]} prevman */
        function _exclusive(deled, prevman){
            $.post(ajaxpath.updfav, { favorites: JSON.stringify(LOGIN_DATA.data.favorited_orgs) })
            .then(() => {
                showGoodOrgs();
                lastFavData = {
                    deled: deled,
                    feels: [...LOGIN_DATA.data.favorited_orgs]
                };
            })
            .catch(() => {
                PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY, { do_not_keep_previous: true });
                LOGIN_DATA.data.favorited_orgs = [...lastFavData.feels];
                lastFavData !== null ? lastFavData.deled ? $("#dvd2").addClass("ihateky") : $("#dvd2").removeClass("ihateky") : void 0;
                showGoodOrgs();
            })
            .always(() => outofLoad("favud", "top"));
        }
    
        function voteM(){
            reduceOverview();
            openFameVoteScreen([ orgname ]);
        }
    
        function __onload(){
            setTimeout(
            () => {
                $("#ctx-article").addClass("_fadein");
                if (scroll_top !== void 0)
                    $("#shishiji-overview").scrollTop(scroll_top);
                scroll_top = 0;
            }, 25);
        }
    
        /**@this {HTMLElement | JQuery.PlainObject} */
        function mkundraggable(){
            $(this).attr("draggable", "false");
        }
    
        class ctx_article_C{
            static get exists(){
                return true;
            }
    
            /**@param {string} _html @param {() => void} [cb] @param {(HTMLImageElement | HTMLVideoElement)[]} [imageNodeList] */
            static async write(_html, cb, imageNodeList){
                const r = document.getElementById("ctx-article");
                const textnode = document.createElement("span");
    
                textnode.innerHTML = _html;
    
                if (imageNodeList){
                    const imgsrcMap = {};
                    for (const extimg of imageNodeList){
                        const src = extimg.src || "";
                        if (imgsrcMap[src])
                            imgsrcMap[src].push(extimg);
                        else 
                            imgsrcMap[src] = [extimg];
                    }
                    for (const willbe of [...textnode.querySelectorAll("img"), ...textnode.querySelectorAll("video")]){
                        const src = willbe.src || "";
                        const becamables = imgsrcMap[src];
                        const becomes = becamables?.length > 0 ? becamables[0] : willbe.cloneNode(true);
    
                        willbe.parentNode?.replaceChild(becomes, willbe);
                        becomes.style.width = willbe.style.width;
                        imgsrcMap[src] = imgsrcMap[src]?.filter(E => {
                            return E !== becomes;
                        });
                    }
                }
                if (r){
                    r.innerHTML = "";
                    r.appendChild(textnode);
                }
                if (cb)
                    cb();
            }
        };
    
        function chOvv(){
            $(".tg-active").removeClass("tg-active");
            $(this).addClass("tg-active");
            $(".article-image").addClass("doaJSD");
            $("#--art-header").attr("src", pathConvertfunc(orgname, objectData.article.images.header));
            $("#--art-icon").attr("src", pathConvertfunc(orgname, objectData.object.images.icon));
            mkundraggable.call($("#--art-header"));
            mkundraggable.call($("#--art-icon"));
        }
    
        /**@this {HTMLElement} */
        function showDescription(){
            if ($(this).hasClass("tg-active") && !FORCE)
                return;
    
            $("#ctx-article").addClass("_wait_f");
    
            function then(){
                if (imageNodes.length == 0){
                    document.getElementById("ctx-article")?.querySelectorAll("img").forEach(Y => imageNodes.push(Y));
                    document.getElementById("ctx-article")?.querySelectorAll("video").forEach(Y => imageNodes.push(Y));
                }
    
                setTimeout(() => $("#shishiji-overview").scrollTop(art_sct), 25);
            }
            const ads = objectData.object.no_admission ? `<span class="saioguW">※この団体には入場記録がなく、訪問ptももらえません</span>` : "";
            ctx_article_C.write(`${ads}<div id="ARTICLE_UNKO">${articleContext}</div>`, __onload, imageNodes)
            .then(then);
            if (fadein)
                $("#ctx-article").removeClass("fadein").removeClass("_fadein");
            chOvv.call(this);
        }
    
        /**@this {HTMLElement} */
        function showDetails(){
            if ($(this).hasClass("tg-active") && !FORCE)
                return;
    
            art_sct = $("#shishiji-overview").scrollTop() || 0;
            $("#ctx-article").addClass("_wait_f");
    
            const __htmlw = `
            <hr style="margin: 40px 20px 20px 20px;">
            <div class="ev_property">
                <table style="width: 100%;">
                    <tbody>
                        ${detail_tr}
                    </tbody>
                </table>
            </div>
            <hr style="margin: 20px;">
            `;
    
            ctx_article_C.write(__htmlw, __onload);
    
            $("#ctx-article").removeClass("fadein").removeClass("_fadein");
            chOvv.call(this);
        }
    
        $("#ovv-t-description-sd").off("click", Ovv_tg_listener.description).on("click", showDescription);
        $("#ovv-t-details-sd").off("click", Ovv_tg_listener.details).on("click", showDetails);
        Ovv_tg_listener.description = showDescription;
        Ovv_tg_listener.details = showDetails;
        prevListener.favorite = favoriteM;
        LOGIN_DATA.data.completed_orgs.includes(orgname) ? (prevListener.vote = voteM) : void 0;
    
        if (!target || !["description", "details", "else"].includes(target))
            target = "description";
        
        document.getElementById(`ovv-t-${target}-sd`)?.dispatchEvent(new Event("click"));
    
        if (jump_button){
            $("#dvd1").show();
            function ooo(){
                if (PokeGOMenu.opened) PokeGOMenu.close();
                closeAllPkGoScreen();
                prevListener.close(new Event("Avada Kedavra"));
                $("#overview-gogow-w").off("click", ooo);
                setTimeout(() => {
                    revealOnMap(objectData);
                }, 250);
            }
            map_reveal_func = ooo;
        } else {
            $("#dvd1").hide();
        }
    }
    
    
    /**
     * @deprecated
     * @param {string} ctx
     * @param {() => void} [callback] 
     */
    async function writeOverviewContent(ctx, callback){
        new Promise((resolve, reject) => {
            $("#overview-context").html(ctx);
            resolve("");
        }).then(() => {
            if (callback !== void 0)
                callback();
        });
    }
    
    
    
    
    /**
     * 
     * @this {JQuery<HTMLElement>}
     * @param {boolean} openned 
     * @param {boolean} sudden 
     */
    function toggleFeslOn(openned, sudden){
        if (!openned){
            this
            .removeClass("toSel undoSel")
            .addClass("toSel popped");
            $("#place-options-w")
            .show()
            .removeClass("toSel undoSel")
            .addClass("toSel");
            $("#where_am_i").hide();
            $("#psdummy").addClass("greatfulmanbruh");
        } else {
            this
            .removeClass("popped")
            .addClass("undoSel");
            if (sudden)
                $("#place-options-w").hide();
            else
                $("#place-options-w").show();
            $("#place-options-w")
            .removeClass("toSel")
            .addClass("undoSel");
            $("#where_am_i").show();
            $("#psdummy").removeClass("greatfulmanbruh");
        }
    }
    
    
    /**
     * 
     * @param {string} [fn] FloorLike
     */
    function setPlaceSelColor(fn){
        if (fn === void 0) fn = CURRENT_FLOOR;
        
        $(".fselc-cell").removeClass("currentflr");
        $("#floor-"+fn).addClass("currentflr");
    }
    
    
    function legalRatioCap(){
        if (CURRENT_FLOOR == "B1") MOVEPROPERTY.caps.ratio.min = 0.4;
        else MOVEPROPERTY.caps.ratio.min = 0.15;
    }
    
    
    /**
     * 
     * @param {string} floor 
     * @param {string} so_called_floor 
     * @param {DrawMapData} data 
     * @param {boolean} [interaction] 
     * @returns {Promise<void>}
     */
    async function changeFloor(floor, so_called_floor, data, interaction){
        /**@ts-ignore @type {HTMLElement} */
        const fselector = document.getElementById("#place-selector".slice(1));
        /**@ts-ignore @type {HTMLCanvasElement} */
        const loadingf = await startLoad(TEXTS[LANGUAGE].LOADING_MAP, void 0, interaction);
    
    
        overlay_modes.fselector.opened = false;
        CURRENT_FLOOR = floor;
    
        legalRatioCap();
    
        const data_size = {
            width: data.tile_width*(data.xrange+1),
            height: data.tile_height*(data.yrange+1)
        };
        
    
        MAPDATA[CURRENT_FLOOR] = setSpareImage(data);
    
        setParam(ParamName.FLOOR, CURRENT_FLOOR);
        setPlaceSelColor();
    
        return new Promise(async (resolve, reject) => {
            readyMap(data, { over: "", under: so_called_floor }, function(){
                const mapd = {
                    width: (data.xrange+1)*data.tile_width,
                    height: (data.yrange+1)*data.tile_height
                };
                const zr_cands = [document.body.clientWidth/mapd.width, document.body.clientHeight/mapd.height];
                
                backcanvas.canvas.coords = { x: 0, y: 0 };
                
                zoomRatio = Math.min(...zr_cands);
                moveMapAssistingNegative({ left: 0, top: 0 });
                clearMapObjects();
                showDigitsOnFloor(floor, mapObjectComponent);
                showGoodOrgs();
                setBehavParam();
                setCoordsOnMiddle({x: ((data.xrange+1)*data.tile_width)/2, y: ((data.yrange+1)*data.tile_height)/2 }, void 0, true);
                
                endLoad(TEXTS[LANGUAGE].MAP_LOADED, 0).then(resolve);
            });
        });
    }
    
    
    
    
    /**
     * 
     * @param {{title: string; subtitle?: string;}} ovvOptions 
     * @param {string} share_url 
     * @param {ShareData} share_data 
     *      share_data.text?.replace("{__SHARE_URL__}", finalShareURL<decoded>);
     * @param {string} from_where 
     * @param {string} message 
     * @param {{labelkey: string; url: string;}} [change_option] 
     * @param {boolean} [ERROR] 
     */
    function openSharePopup(ovvOptions, share_url, share_data, from_where, message, change_option, ERROR){
        Popup.startLoad();
        share_url = decodeURIComponent(share_url);
        /**@param {string} [ctx]  */
        function onerr(ctx){
            if (ctx === void 0) ctx = TEXTS[LANGUAGE].ERROR_ANY;
            PictoNotifier.notify(
                "error",
                TEXTS[LANGUAGE].NOTIFICATION_ERROR_ANY,
                { 
                    do_not_keep_previous: true, duration: 2500,
                    discriminator: "sharePopup connection error"
                },
            );
            if (Popup.isPoppingup)
                Popup.showasError(ctx);
        }
    
        /**
         * 
         * @param {string} url 
         * @param {string} pn 
         * @param {string} pv 
         */
        function adp(url, pn, pv){
            return url.includes("?") ? `${url}&${pn}=${pv}` : `${url}?${pn}=${pv}`;
        }
        
        $.ajax({
            url: "/share_panel",
            method: "GET",
            timeout: 30000,
            dataType: "html",
        }).done(t => {
            if (Popup.isPoppingup){
                Popup.popupContent(t, function(){
                    const shareURL = adp(share_url, ParamName.URL_FROM, from_where);
                    var fch = [];
                    var _fchp = {share: () => {}, copy: () => {}};
    
                    if (ERROR){
                        onerr();
                        return;
                    }
    
                    $("#ppc-title").text(ovvOptions.title);
                    if (ovvOptions.subtitle)
                        $("#ppc-subtitle").text(ovvOptions.subtitle);
    
                    /**
                     * 
                     * @param {string} [url] 
                     */
                    function shareShare(url){
                        if (window.navigator.share){
                            share_data.text = share_data.text?.replace("{__SHARE_URL__}", url || shareURL);
                            !function(sd){
                                async function T(){
                                    await window.navigator.share(sd);
                                }
                                $("#share-nav").off("click", _fchp.share).on("click", T);
                                _fchp.share = T;
                                return 0;
                            }(share_data);
                        } else {
                            $("#nav-share").remove();
                        }
                    }
    
                    shareShare();
    
    
                    /**
                     * 
                     * @param {string} [url] 
                     */
                    function copyShare(url){
    
                        function T(){
                            window.navigator.clipboard.writeText(url || shareURL);
                            PictoNotifier.notify(
                                "link",
                                TEXTS[LANGUAGE].NOTIFICATION_COPIED_LINK,
                                {
                                    duration: 2500,
                                    discriminator: "copy artshare"
                                }
                            );
                        }
                        $("#share-copy").off("click", _fchp.copy).on("click", T);
    
                        _fchp.copy = T;
                    }
    
                    copyShare();
    
    
                    if (change_option){
                        $("#includeScr").text(TEXTS[LANGUAGE][change_option.labelkey]);
                        $("#includeScrCh").on("change", function(e){
                            //@ts-ignore
                            if (this.checked){
                                for (var i = 0; i < document.getElementsByClassName("share_ebtn").length; i++){
                                    $(document.getElementsByClassName("share_ebtn")[i]).off("click", fch[i]);
                                }
                                const upp = adp(change_option.url, ParamName.URL_FROM, from_where);
                                setShareLink(upp);
                                shareShare(upp);
                                copyShare(upp);
                            } else {
                                setShareLink();
                                shareShare();
                                copyShare();
                            }
                        });
                    } else {
                        $("#includeScrCh").remove();
                    }
                    
                    message = encodeURIComponent(message);
    
    
                    /**
                     * @param {string} [share_url] 
                     */
                    function setShareLink(share_url){
                        const here = encodeURIComponent(share_url || shareURL);
                        const baseText = `${message}%0A${here}`;
                        fch = [];
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
                                    $("#share-gmail").parent().parent().remove();
                                    href = `https://mail.google.com/mail/?view=cm&body=%0A%0A${baseText}`;
                                    break;
                                case "mail":
                                    href = `mailto:?body=%0A%0A${baseText}`;
                                    break;
                                case "sms":
                                    href = `sms:?body=%0A%0A${baseText}`;
                                    break;
                                case "whatsapp":
                                    href = `https://api.whatsapp.com/send?text=${baseText}`;
                                    break;
                                default:
                                    continue;
                            }
            
                            !function(_href){
                                function lopp(){
                                    window.open(_href, "_blank");
                                }
                                $ch.on("click", lopp);
                                fch.push(lopp);
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
                    }
    
                    setShareLink();
                }, {
                    height: 360
                });
            }
        })
        .catch(() => onerr());
    }
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/supports").NotifierOptions} NotifierOptions
     * @typedef {import("../shishiji-dts/supports").NoticeComponent} NoticeComponent
     * @typedef {import("../shishiji-dts/supports").PendingNoticeComponent} PendingNoticeComponent
     */
    
    
    const Notifier = class Notifier{
        /**
         * @type {NoticeComponent[]} 
         */
        static _pending_notices = [];
        static _prop = {
            /**@ts-ignore @type {NodeJS.Timeout} FAKE */
            Timeout: 0,
            /**@ts-ignore @type {NodeJS.Timeout} FAKE */
            _Timeout: 0,
            /**@ts-ignore @type {NodeJS.Timeout} FAKE */
            __Timeout: 0,
            current: "",
            notifying: false,
        };
    
    
        /**
         * 
         * @param {string} html 
         *      some unique id
         * @param {NotifierOptions} [options]
         */
        static notifyHTML(html, options){
            this._invoke.call(Notifier, [ html, options ], false);
        }
    
    
        static get current(){
            return this._prop.current;
        }
    
    
        static get isNotifying(){
            return document.getElementById("--yd-notifier")?.classList.contains("vpopen");
        }
    
    
        /**
         * 
         * @param  {[NotifierArgs, boolean?]} args 
         */
        static _invoke(...args){
            const nargs = args[0];
            var html = nargs[0], options = nargs[1], term = options?.duration,
                discriminator = options?.discriminator, _ispendingf = args[1];
            
            const $notifier = $("#--yd-notifier");
            const te = document.createTextNode(html).textContent;
    
            
            term ??= 3000;
            discriminator ??= html;
            
            if (this._prop.notifying && this._prop.current == discriminator && !options?.do_not_keep_previous)
                return;
    
            if (te?.endsWith(".") || te?.endsWith("!") || te?.endsWith("?"))
                html += "&nbsp;";
           
            if (!_ispendingf)
                this.clearPengings();
        
            this._prop.current = discriminator;
        
            clearTimeout(this._prop.Timeout);
            clearTimeout(this._prop._Timeout);
            clearTimeout(this._prop.__Timeout);
            
            if (this._prop.notifying){
                this.closeNotifier(true);
                this._prop._Timeout = setTimeout(() => {
                    doOpen.apply(this, [options?.deny_userclose]);
                }, 75);
                return;
            }
        
    
            /**
             * 
             * @param {boolean} cant_close 
             */
            function doOpen(cant_close){
                $("#--ott-us")
                .html(html);
                $notifier
                .show()
                .removeClass("hpipe")
                .addClass("vpopen");
    
                if (!cant_close){
                    this._add_closeOnInter();
                } else {
                    $notifier.addClass("--path-through");
                }
            
                this._prop.notifying = true;
    
                if (term !== Infinity)
                    this._prop.Timeout = setTimeout(() => {
                        this.closeNotifier(true);
                    }, term);
            }
    
            doOpen.apply(this, [options?.deny_userclose]);
        }
    
    
        /**
         * 
         * @param {boolean} [keep_discriminator] 
         */
        static closeNotifier(keep_discriminator){
            clearTimeout(this._prop.__Timeout);
            $("#--yd-notifier")
            .removeClass("--path-through")
            .removeClass("vpopen")
            .addClass("hpipe");
            
            this._removeCloseonInter();
            this._prop.notifying = false;
            this._prop.__Timeout = setTimeout(() => {
                $("#--ott-us").empty();
                $("#--yd-notifier").hide();
                if (!keep_discriminator)
                    this._prop.current = "";
                if (Notifier._pending_notices.length > 0)
                    this._invoke_pending();
            }, 70);
        }
    
    
        /**
         * 
         * @param {PendingNoticeComponent} arg 
         */
        static appendPending(arg){
            Notifier._pending_notices.push(arg);
            if (!this.isNotifying)
                this._invoke_pending();
        }
    
    
        static clearPengings(){
            Notifier._pending_notices = [];
        }
    
    
        static _invoke_pending(){
            const arg = Notifier._pending_notices[0];
            this._invoke.call(Notifier, [ arg.html, arg.options ], true);
            Notifier._pending_notices.shift();
        }
    
    
        static _add_closeOnInter(){
            const yfr = $("#--yd-notifier");
            
            yfr
            .removeClass("--path-through")
            .on("touchstart mousedown", this._interClose);
        }
    
    
        static _removeCloseonInter(){
            const yfr = $("#--yd-notifier");
            
            yfr.off("touchstart mousedown", this._interClose);
        }
    
    
        /**
         * 
         * @param {Event | JQuery.Event} e 
         */
        static _interClose(e){
            e.preventDefault();
            Notifier.closeNotifier();
        }
    };
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/supports").NotifierArgs} NotifierArgs
     * @typedef {import("../shishiji-dts/supports").Pictograms} Pictograms
     * @typedef {import("../shishiji-dts/supports").PictoNotifierOptions} PictoNotifierOptions
     */
    
    
    /**
     * Notify message with pictogram like
     * @requires {@linkcode GPATH}
     * @extends Notifier
     */
    const PictoNotifier = class PictoNotifier extends Notifier{
        static tagName = "shishiji-yd-notifier-cd";
        static baseComponent = `<${this.tagName} id="{id}" class="protected flxxt" style="font-size:12px;">{svg}<span>{message}</span></${this.tagName}>`
        static _tagName = "picton-icon-svg";
        static _images = [
            "info",
            "link",
            "no-wifi",
            "success",
            "warn",
            "error",
            "save",
            "input",
            "school",
            "zoom",
            "smile",
            "new",
            "calculating",
            "copy",
            "thanks"
        ];
        static _imagepath = "/resources/svg/{name}.svg";
    
    
        /**
         * 
         * @param {keyof Pictograms} pictogram 
         * @param {string} html 
         * @param {PictoNotifierOptions} [options]
         */
        static notify(pictogram, html, options){
            var svg = "";
            var converter = (a, b) => { return ""; };
            
            switch (pictogram){
                default:
                    break;
                case "no-wifi":
                    !svg ? svg = GPATH.NO_WiFi : void 0;
                case "info":
                case "link":
                converter = this._cpylinnot;
                break;
                case "success":
                case "warn":
                converter = this._shrf;
                break;
                case "error":
                    !svg ? svg = GPATH.ERROR : void 0;
                converter = this._shrnf;
                break;
                case "save":
                case "input":
                case "smile":
                case "thanks":
                converter = this._shrf;
                break;
                case "zoom":
                case "new":
                case "calculating":
                converter = this._shref;
                break;
                case "copy":
                converter = this._shreRf;
            }
            
            if (svg)
                html = converter.call(this, svg, html);
            else 
                html = this._useImg(pictogram, html, converter);
    
            if (options?.addToPending)
                this.appendPending.call(Notifier, { html: html, options: options });
            else
                this.notifyHTML(html, options);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifyInfo(...args){
            args[0] = this._useImg("info", args[0], this._cpylinnot);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifySuccess(...args){
            args[0] = this._useImg("success", args[0], this._shrf);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifyError(...args){
            args[0] = this._shrnf(GPATH.ERROR, args[0]);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifyLink(...args){
            args[0] = this._useImg("link", args[0], this._cpylinnot);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifyNoWiFi(...args){
            args[0] = this._cpylinnot(GPATH.NO_WiFi, args[0]);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifyWarn(...args){
            args[0] = this._useImg("warn", args[0], this._shrf);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifySave(...args){
            args[0] = this._useImg("save", args[0], this._shrf);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifyInput(...args){
            args[0] = this._useImg("input", args[0], this._shrf);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {NotifierArgs} args 
         */
        static notifyZoom(...args){
            args[0] = this._useImg("zoom", args[0], this._shref);
            this.notifyHTML(...args);
        }
        /**
         * 
         * @param {string} name 
         */
        static _getImg(name){
            const img = document.createElement("img");
    
            img.src = PictoNotifier._imagepath.replace("{name}", name);
            return img;
        }
        /**
         * 
         * @param {string} name 
         * @param {string} src 
         */
        static _appendPisElement(name, src){
            const parent = document.createElement(PictoNotifier._tagName);
            const elem = document.createElement("img");
    
            elem.src = src;
            elem.loading = "lazy";
            parent.appendChild(elem);
            parent.classList.add("shy");
            parent.setAttribute("name", name);
            document.body.appendChild(parent);
            return parent;
        }
        /**
         * 
         * @param {string} id 
         * @param {string} svg 
         * @param {string} message 
         */
        static _getComponent(id, svg, message){
            return this.baseComponent
                .replace("{id}", id)
                .replace("{svg}", svg)
                .replace("{message}", message);
        }
        /**
         * 
         * @param {string} svg 
         * @param {string} message 
         */
        static _cpylinnot(svg, message){
            return this._getComponent("cpy-lin-not", svg, message);
        }
        /**
         * 
         * @param {string} svg 
         * @param {string} message 
         */
        static _shrf(svg, message){
            return this._getComponent("shr-f", svg, message);
        }
        /**
         * 
         * @param {string} svg 
         * @param {string} message 
         */
        static _shrnf(svg, message){
            return this._getComponent("shr-notf", svg, message);
        }
        /**
         * 
         * @param {string} svg 
         * @param {string} message 
         */
        static _shref(svg, message){
            return this._getComponent("shr-exf", svg, message);
        }
        /**
         * 
         * @param {string} svg 
         * @param {string} message 
         */
        static _shreRf(svg, message){
            return this._getComponent("shr-eRxf", svg, message);
        }
        /**
         * 
         * @param {string} name 
         * @param {string} message 
         * @param {(a: string, b: string) => string} html_maker 
         */
        static _useImg(name, message, html_maker){
            const img = this._getImg(name);
            const div = document.createElement("div");
    
            div.innerHTML = html_maker.call(this, "", message);
            div.children[0].prepend(img);
            return div.innerHTML;
        }
    }
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/supports").RaidNotifierEvent} RaidNotifierEvent
     * @typedef {import("../shishiji-dts/supports").RaidNotifierOptions} RaidNotifierOptions
     * @typedef {import("../shishiji-dts/supports").RaidNoticeComponent} RaidNoticeComponent
     * @typedef {import("../shishiji-dts/supports").PendingNoticeComponent} RaidPendingNoticeComponent
     * @typedef {import("../shishiji-dts/supports").RaidNotifierArgs} RaidNotifierArgs
     */
    
    
    const RaidNotifier = class RaidNotifier{
        /**
         * @type {RaidNoticeComponent[]} 
         */
        static _pending_notices = [];
        static _prop = {
            /**@ts-ignore @type {NodeJS.Timeout} FAKE */
            Timeout: 0,
            /**@ts-ignore @type {NodeJS.Timeout} FAKE */
            _Timeout: 0,
            /**@ts-ignore @type {NodeJS.Timeout} FAKE */
            __Timeout: 0,
            current: "",
            notifying: false,
        };
        static _pray = false;
        static currentClickListener = () => {};
    
    
        /**
         * 
         * @param {RaidNotifierEvent} rev 
         *      some unique id
         * @param {RaidNotifierOptions} [options]
         */
        static notifyHTML(rev, options){
            this._invoke.call(RaidNotifier, [ rev, options ], false);
        }
    
    
        static get current(){
            return this._prop.current;
        }
    
    
        static get isNotifying(){
            return document.getElementById("raid--yd-notifier")?.classList.contains("vpopen");
        }
    
    
        /**
         * 
         * @param  {[RaidNotifierArgs, boolean?]} args 
         */
        static _invoke(...args){
            const nargs = args[0];
            var details = nargs[0].event_details, options = nargs[1], term = options?.duration,
                discriminator = options?.discriminator, _ispendingf = args[1];
            
            const $notifier = $("#raid--yd-notifier");
            var eventTarget = getMapObjectData(nargs[0].discriminator);
    
            term ??= 3000;
            discriminator ??= Random.string(10);
            
            this._prop.current = discriminator;
        
            clearTimeout(this._prop.Timeout);
            clearTimeout(this._prop._Timeout);
            clearTimeout(this._prop.__Timeout);
            
            if (this._prop.notifying){
                this.closeNotifier(true);
                this._prop._Timeout = setTimeout(() => {
                    doOpen.apply(this, [options?.deny_userclose]);
                }, 105);
                return;
            }
        
    
            /**
             * @this {any}
             * @param {boolean} cant_close 
             */
            function doOpen(cant_close){
                if (eventTarget == null || nargs[0].no_relation){
                    $("#aaGWUIJO").text(nargs[0].discriminator);
                    $("#AuSAJIg").attr("src", nargs[0].image_src || "");
                } else {
                    const _eventTarget = eventTarget;
                    function _oks(){
                        setParam(ParamName.ARTICLE_ID, _eventTarget.discriminator);
                        raiseOverview();
                        writeArticleOverview(_eventTarget, true, void 0, void 0, void 0, true);
                    };
                    $("#aaGWUIJO").text(eventTarget?.article?.title || "");
                    $("#AuSAJIg")
                    .attr("src", toOrgFilepath(eventTarget.discriminator, eventTarget.object.images.icon));
                    $("#raid--yd-notifier").off("click", this.currentClickListener);
                    $("#raid--yd-notifier").on("click", _oks);
                    this.currentClickListener = _oks;
                }
                $("#auijsmjmg").text(nargs[0].time);
                $("#asGUOt").html(details);
                $notifier
                .show()
                .removeClass("hpipe")
                .addClass("vpopen");
    
                if (!cant_close){
                    this._add_closeOnInter();
                } else {
                    $notifier.addClass("--path-through");
                }
            
                this._prop.notifying = true;
            
                if (term !== Infinity)
                    this._prop.Timeout = setTimeout(() => {
                        this.closeNotifier(true);
                    }, term);
            }
    
            doOpen.apply(this, [options?.deny_userclose]);
        }
    
    
        /**
         * 
         * @param {boolean} [keep_discriminator] 
         */
        static closeNotifier(keep_discriminator){
            clearTimeout(this._prop.__Timeout);
            $("#raid--yd-notifier")
            .removeClass("--path-through")
            .removeClass("vpopen")
            .addClass("hpipe");
            
            this._removeCloseonInter();
            this._prop.notifying = false;
            this._prop.__Timeout = setTimeout(() => {
                $("#raid--yd-notifier").hide();
                if (!keep_discriminator)
                    this._prop.current = "";
                if (RaidNotifier._pending_notices.length > 0)
                    this._invoke_pending();
            }, 101);
        }
    
    
        /**
         * 
         * @param {PendingNoticeComponent} arg 
         */
        static appendPending(arg){
            RaidNotifier._pending_notices.push(arg);
            if (!this.isNotifying)
                this._invoke_pending();
        }
    
    
        static clearPengings(){
            RaidNotifier._pending_notices = [];
        }
    
    
        static _invoke_pending(){
            const arg = RaidNotifier._pending_notices[0];
            this._invoke.call(RaidNotifier, [ arg.html, arg.options ], true);
            RaidNotifier._pending_notices.shift();
        }
    
    
        static _add_closeOnInter(){
            const yfr = $("#raid--yd-notifier");
            
            yfr
            .removeClass("--path-through");
            //.on("touchstart mousedown", this._interClose);
            if (!this._pray){
                listenUpSwipe(document.getElementById("raid--yd-notifier") || HTMLElement.prototype, this._interClose);
                this._pray = true;
            }
        }
    
    
        static _removeCloseonInter(){
            const yfr = $("#raid--yd-notifier");
            
            //yfr.off("touchstart mousedown", this._interClose);
        }
    
    
        /**
         * 
         * @param {Event | JQuery.Event} e 
         */
        static _interClose(e){
            RaidNotifier.closeNotifier();
        }
    }
    
    
    //@ts-ignore
    window.RaidNotifier = RaidNotifier;
    
    
    
    
    /**
     * @typedef {import("../shishiji-dts/supports").PopupOptions} PopupOptions
     * @typedef {import("../shishiji-dts/supports").PopupCloseMethod} PopupCloseMethod
     * @typedef {import("../shishiji-dts/supports").PopupCloseListener} PopupCloseListener
     */
    
    
    const Popup = class Popup{
        /**
         * @see {@link _keydisposal}
         */
        static closeKeys = [ "ESCAPE" ];
        /**
         * @type {PopupCloseListener[]} 
         */
        static closeListeners = [];
    
    
        /**
         * 
         * @param {string} _innerHTML 
         * @param {() => void} [callback] 
         * @param {PopupOptions} [options]
         */
        static async popupContent(_innerHTML, callback, options){
            const ppcls = GPATH.X;
    
            if (options === void 0){
                options = {
                    width: 500,
                    height: 450,
                };
            } else {
                if (!options.width)
                    options.width = 500;
                if (!options.height)
                    options.height = 450;
            }
    
            if (options.hideclosebutton && options.forceclosebutton)
                console.warn("hideclosebutton and forceclosebutton shouldn't be true at same time!!");
    
            if (!options.hideclosebutton)
                _innerHTML = ppcls + _innerHTML;
    
            window.removeEventListener("keydown", this._keydisposal);
            $("shishiji-mx-overlay").off("click", this._dispose);
            return new Promise((resolve, reject) => {
                if (!options?.forceclosebutton){
                    window.addEventListener("keydown", this._keydisposal);
                    $("shishiji-mx-overlay").on("click", this._dispose);
                }
                $("shishiji-mx-overlay")
                .removeClass("pipe")
                .addClass("popen");
                $("#shishiji-popup-container-c")
                .removeClass("flxxt")
                .css({
                    "overflow": "",
                    "height": "",
                    "width": "",
                    "max-width": options.width+"px",
                    "max-height": options.height+"px",
                    "left": `calc((var(--window-width) - 48px - min(${options.width}px, var(--window-width) - 48px))/2)`
                })
                .html(_innerHTML)
                .show();
                resolve("");
            }).then(() => {
                $("#ppcls").on("click", this._disposition);
                if (callback !== void 0)
                    callback();
            });
        }
    
    
        /**
         * 
         * @param {string} src 
         * @param {"img" | "video"} mediatype 
         * @param {HTMLElement} [sourceelem] 
         * @param {() => void} [callback] 
         */
        static async popupMedia(src, mediatype, sourceelem, callback){
            const ppcls = GPATH.X;
            /**@ts-ignore @type {HTMLElement} */
            const clone = sourceelem ? sourceelem.cloneNode(true) : document.createElement("span");
            var _html = ppcls;
            
            if (clone){
                $(clone).attr("id", "").attr("class", "").attr("style", "").attr("draggable", "true");
                switch (mediatype){
                    case "video":
                        $(clone).attr("controls", "")
                        .attr("preload", "metadata")
                        .attr("playsinline", "")
                        .attr("autoplay", "")
                        .removeAttr("muted");
                    default:
                        clone.classList.add("suhDWAgd");
                }
            } else {
                switch (mediatype){
                    case "img":
                        _html += `<img class="suhDWAgd" src="${src}" draggable="true">`;
                        break;
                    case "video":
                        _html += `<video class="suhDWAgd" src="${src}" controls preload="metadata" playsinline="" draggable="true"></video>`;
                        break;
                }
            }
    
            // Why
            return new Promise((resolve, reject) => {
                window.addEventListener("keydown", this._keydisposal);
                $("shishiji-mx-overlay")
                .removeClass("pipe")
                .addClass("popen")
                .on("click", this._dispose);
                $("#shishiji-popup-container-c")
                .addClass("flxxt")
                .css({
                    "max-height": "fit-content",
                    "height": "fit-content",
                    "overflow": "visible",
                })
                .html(_html)
                .append(clone)
                .show();
                resolve("");
            }).then(() => {
                $("#ppcls")
                .css({
                    "top": "-40px",
                    "right": "0",
                })
                .on("click", this._disposition);
                /**<path fill="#ffffff"></path> */
                $($($("#ppcls").children()[0]).children()[0])
                .attr("fill", "blue");
    
                if (callback !== void 0)
                    callback();
            });
        }
    
    
        /**
         * 
         * @param {PopupOptions} [options] 
         */
        static startLoad(options){
            this.popupContent(`<div class="protected" id="ppupds"><div class="mx-text-center flxxt">${gglSymbols.loadging}</div></div>`, ()=>{},options);
        }
    
    
        /**
         * 
         * @param {string} message 
         */
        static showasError(message){
            this.popupContent(`<div class="protected" id="ppupds"><div class="mx-text-center flxxt" style="flex-direction:column;"><div style="width:125px;margin-bottom:4px;">${GPATH.ERROR_ZAHUMARU}</div><h4>${message}</h4></div></div>`);
        }
        
    
        /**
         * 
         * @param {PopupCloseMethod | Event | JQuery.Event} [closeMethod] 
         */
        static disPop(closeMethod){
            if (typeof closeMethod !== "string")
                closeMethod = "JAVASCRIPT";
            window.removeEventListener("keydown", Popup._keydisposal);
            $("#ppcls").off("click", Popup._disposition);
            $("shishiji-mx-overlay")
            .removeClass("popen")
            .addClass("pipe")
            .off("click", Popup._dispose);
            $("#shishiji-popup-container-c")
            .hide()
            .empty();
            Popup._callCloseListeners(closeMethod);
        }
    
    
        static get isPoppingup(){
            const me = document.getElementById("shishiji-popup-container-c");
            return ( me?.clientHeight != 0 ) ? true : false;
        }
    
    
        static setsize(){
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
        }
    
    
        /**
         * 
         * @param {PopupCloseListener} callback 
         */
        static addCloseListener(callback){
            this.closeListeners.push(callback);
        }
    
    
        /**
         * 
         * @param {PopupCloseListener} callback 
         */
        static removeCloseListener(callback){
            const l = this.closeListeners.length;
    
            this.closeListeners = this.closeListeners.filter(func => func !== callback);
    
            if (this.closeListeners.length < l)
                return true;
            else
                return false;
        }
    
    
        /**
         * 
         * @param {PopupCloseMethod} method 
         */
        static _difficult(method){
            if (Popup.isPoppingup)
                Popup.disPop(method);
        }
    
        
        static _dispose(){
            Popup._difficult("OVERLAY");
        }
    
    
        static _disposition(){
            Popup.disPop("X BUTTON");
        }
    
    
        /**
         * 
         * @param {KeyboardEvent} e 
         */
        static _keydisposal(e){
            const key = e.key.toUpperCase();
            if (Popup.closeKeys.includes(key)){
                Popup._difficult("KEYBOARD");
            }
        }
    
    
        /**
         * 
         * @param {PopupCloseMethod} method 
         */
        static _callCloseListeners(method){
            this.closeListeners.forEach(func => {
                func(method);
            });
        }
    }
    
    
    //@ts-ignore
    window.Popup = Popup;
    
    
    
    
    /**
     * 
     * @param {() => any} mfunc 
     */
    function _openscreen(mfunc){
        if (tour_status.pkgo) return;
        //_initmemory();
        setTimeout(() => PokeGOMenu.close.call(window, true), 100);
        mfunc();
    }
    
    
    /**
     * 
     * @param {() => any} func 
     */
    function _broken(func){
        return () => _openscreen(func);
    }
    
    
    document.getElementById("pkgo_menu5")?.children[0].addEventListener("click", _broken(openSearchScreen));
    document.getElementById("pkgo_menu3")?.children[0].addEventListener("click", _broken(openEventScreen));
    document.getElementById("pkgo_menu1")?.children[0].addEventListener("click", _broken(openStamprallyScreen));
    document.getElementById("pkgo_menu2")?.children[0].addEventListener("click", _broken(openVoteScreen));
    document.getElementById("pkgo_menu6")?.children[0].addEventListener("click", _broken(openTeaScreen));
    document.getElementById("pkgo_menu7")?.children[0].addEventListener("click", _broken(openDrinkScreen));
    document.getElementById("pkgo_menu4")?.children[0].addEventListener("click", _broken(openShoppingScreen));
    document.getElementById("pkgo_menuXXL")?.children[0].addEventListener("click", _broken(openMyqrcodeScreen));
    document.getElementById("pkgo_menuXXS")?.children[0].addEventListener("click", _broken(openTicketsScreen));
    document.getElementById("user-profile-opner")?.addEventListener("click", _broken(openProfileScreen));
    document.getElementById("bandeventopen")?.addEventListener("click", _broken(openEventVoteScreen("band")));
    document.getElementById("danceeventopen")?.addEventListener("click", _broken(openEventVoteScreen("dance")));
    document.getElementById("misceventopen")?.addEventListener("click", _broken(openEventVoteScreen("misc")));
    document.getElementById("go_to_ranking")?.addEventListener("click", _broken(openRankingScreen));
    document.getElementById("gt_mps")?.addEventListener("click", closeSearchArea);
    document.getElementById("ag8FOKSpoa")?.addEventListener("click", revealMyself);
    document.getElementById("famevotegogo")?.addEventListener("click", _broken(openFameVoteScreen));
    document.getElementById("eventvotegogo")?.addEventListener("click", _broken(openEventVoteSelectorScreen));
    document.getElementById("bandeventopen_")?.addEventListener("click", _broken(openEventShedulerScreen("band")));
    document.getElementById("danceeventopen_")?.addEventListener("click", _broken(openEventShedulerScreen("dance")));
    document.getElementById("misceventopen_")?.addEventListener("click", _broken(openMiscEventVenueScreen));
    document.getElementById("gos_budozyo")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "武道場")));
    document.getElementById("gos_houkou")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "放光館")));
    document.getElementById("gos_syudou")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "修道館ホール")));
    document.getElementById("gos_kousyamae")?.addEventListener("click", _broken(openEventShedulerScreen("misc", "校舎前")));
    
    ["click"]
    .forEach(o => {
        document.getElementById("pkgo_mainb")?.addEventListener(o, function(){
            if (tour_status.main_screen) return;
            PokeGOMenu.oepn();
            if (isUnvisitedTour("menu")){
                tour_status.pkgo = true;
                setTimeout(() => startTour("menu"), 500);
            }
        });
        document.getElementsByTagName("pokemon-gradient")[0].addEventListener(o, function(){
            !tour_status.pkgo ? PokeGOMenu.close() : void 0;
        });
        document.getElementById("pkgo_menu_closeAWW")?.addEventListener(o, function(){
            !tour_status.pkgo ? PokeGOMenu.close() : void 0;
        });
    });
    
    
    +function(){
        const clbtn = document.createElement("shishiji-pkgo-close")
        , a = document.createElement("aoish-s");
        a.classList.add("flxxt");
        clbtn.classList.add("flxxt", "protected");
        clbtn.appendChild(a);
        const patic = document.createElement("div");
        patic.classList.add("particular_closebwrap", "manyyearshaspassed");
        const ignorescrs = ["vote_screen", "fame_vote_screen", "event_vote_screen", "event_vote_selector_screen"];
    
        /**@this {HTMLElement} */
        function closeBomb(){
            if (tour_status.pkgo || tour_status.article) return;
            const id_ = Random.string(6);
            const clid = (this.classList.contains("particular_closebwrap")) ? 
                this.parentElement?.parentElement?.id : this.parentElement?.id;
            closePkGoScreen(clid || "");
            if (this.classList.contains("particular_closebwrap")) return;
            $("#shpkgoanim").append(`<daoijh id="${id_}"><close-outside></close-outside><close-inside class="shishijineon"></close-inside></daoijh>`)
            setTimeout(()=>$("#"+id_).remove(), 501);
        }
    
        for (const clscreen of document.getElementsByTagName("shishiji-pks")){
            if (clscreen.id == "headcount_screen") continue;
            if (ignorescrs.includes(clscreen.id)){
                const _patic = patic.cloneNode(true);
                $(_patic).attr("id", "close_button_of_"+clscreen?.id);
                _patic.addEventListener("click", closeBomb);
                clscreen.querySelector(".AGDaewP")?.appendChild(_patic);
            } else {
                const _clbtn = clbtn.cloneNode(true);
                $(_clbtn).attr("id", "close_button_of_"+clscreen?.id);
                _clbtn.addEventListener("click", closeBomb);
                if (clscreen.id == "stamp_rally_screen") _clbtn.addEventListener("click", async function(){
                    await haveAnyUnclaimeds() ? setMenuHasPending("1") : removeMenuHasPending("1");
                });
                clscreen?.appendChild(_clbtn);
            }
        }
    
        document.getElementById("overview-close-c")?.addEventListener("click", function(){
            closeBomb.call(this);
            prevListener.close();
        });
    }();
    
    
    document.getElementById("close_button_of_stamp_rally_scan_screen")?.addEventListener("click", function(){
        /**@ts-ignore @type {HTMLVideoElement} */
        const gh = document.getElementById("qrcode-video");
        gh.srcObject = null;
        pendingMediaStreams.forEach(stream => {
            stream.getTracks().forEach(track => track.stop());
        });
        pendingMediaStreams.length = 0;
        outofLoad("opening camera", "middle");
    });
    
    
    document.getElementById("showshop")?.addEventListener("click", function(){
        closeAllPkGoScreen();
        setTimeout(() => {
            revealOnMap(mapObjectComponent["shop"]);
        }, 500);
    });
    
    
    document.getElementById("icon-chd")?.addEventListener("click",
    ()=>$("#chiconinputimgae").trigger("click"));
    
    
    document.getElementById("chiconinputimgae")?.addEventListener("change", onChangeIconInputChange);
    
    
    document.getElementById("iasyguf")?.addEventListener("click", saveProfileDetails);
    
    
    +function(){
        /**@this {HTMLTextAreaElement} */
        function s(){
            if ($(this).val()?.toString().length == 0)
                displayDefaultSearchResult(false);
            else
                searchMapObject();
        }
    
        document.getElementById("del_search")?.addEventListener("click", function(){
            $("#org_search_input").val("");
            displayDefaultSearchResult(false);
        });
    
        document.getElementById("fav_search")?.addEventListener("click", function(){
            const fav_search = this.getAttribute("fav_search");
    
            if (fav_search){
                $(this.children[0]).show();
                $(this.children[1]).hide();
                this.removeAttribute("fav_search");
            } else {
                $(this.children[0]).hide();
                $(this.children[1]).show();
                this.setAttribute("fav_search", "true");
            }
    
            filterSearchMen();
        });
    
        document.getElementById("do_search")?.addEventListener("click", function(){s.call($("#org_search_input"))});
    
    
        document.getElementById("org_search_input")?.addEventListener("keydown", function(e){
            if (e.key.toUpperCase() == "ENTER"){
                e.preventDefault();
                s.call(this);
            }
        });
    }();
    
    
    document.getElementById("aiUHGG")?.addEventListener("click", toggleFameVoteFavorte)
    
    
    async function __IGNORE_ME(){
        const r = {};
        for (const disc of Object.keys(mapObjectComponent)){
            await $.post(ajaxpath.getart+"?discriminator="+disc).then(data =>{
                const cont =  data.article;
                const txt = getHTMLtextContent(mcFormat(cont, ()=>""));
                r[disc] = txt;
            });
        }
        console.log(r);
    }
    
    
    
    
    +function(){
        for (const faq_question of document.getElementsByClassName("faq_sec")){
            faq_question.addEventListener("click", function(){
                const about = $(this).attr("about");
        
                $("#faq_question_title").text(this.textContent);
                $("#faq_answers").empty();
                openPkGoScreen("faq_answer_screen");
        
                intoLoad("faq,"+about, "middle");
        
                const pos = () => 
                $.post(ajaxpath.faq, {about: about})
                .then(article => {
                    outofLoad("faq,"+about, "middle");
                    $("#faq_answers").html(article);
                })
                .fail(err => {
                    outofLoad("faq,"+about, "middle");
                    //@ts-ignore
                    $("#faq_answers").text(err.responseText);
                });
                setTimeout(pos, 250);
            });
        }
    }();
    
    
    /**
     * 
     * @param {KeyboardEvent} e 
     */
    function _restrictBreak(e){
        e.key.toUpperCase() == "ENTER" ? e.preventDefault() : void 0;
    }
    
    
    function _nickChanged(){
        const val = $(this).val();
        profileSaveingInfo.situation.nickname =
        (val == LOGIN_DATA.data.profile.nickname) ? false : true;
    }
    
    
    function submitFameVote(){
        if ($("#vote_right_now").attr("wait")) return;
    
        const votes = [..._famevote_selecteds];
    
        intoLoad("famevote", "middle");
        $("#vote_right_now").attr("wait", "true");
    
        $.post(ajaxpath.updfvote, { votes: JSON.stringify(votes) })
        .then(() => {
            const prev_votes = [...LOGIN_DATA.data.fame_votes];
            LOGIN_DATA.data.fame_votes = [..._famevote_selecteds];
    
            if (prev_votes.length > 0 && LOGIN_DATA.data.fame_votes.length > 0)
                PictoNotifier.notifySuccess(TEXTS[LANGUAGE].VOTE_CHANGED, { do_not_keep_previous: true });
            else if (LOGIN_DATA.data.fame_votes.length > 0)
                PictoNotifier.notifySuccess(TEXTS[LANGUAGE].VOTED, { do_not_keep_previous: true });
            else
                PictoNotifier.notifySuccess(TEXTS[LANGUAGE].CANCELED_VOTING, { do_not_keep_previous: true });
        
            $(".imcurrentleader").removeClass("imcurrentleader");
            $(".GGId").each(function(){
                if (LOGIN_DATA.data.fame_votes.includes(this.getAttribute("duty") || "")){
                    this.classList.add("imcurrentleader");
                }
            });
            setFameVoteButton();
        })
        .catch(() => {
            PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
        })
        .always(() => {
            outofLoad("famevote", "middle");
            $("#vote_right_now").attr("wait", null);
        });
    }
    
    
    +function(){
        /**
         * 
         * @param {string} disc 
         * @returns 
         */
        function revealDrink(disc){
            return function(){
                closePkGoScreen("drink_screen");
                //@ts-ignore
                revealOnMap(getMapObjectData(disc));
            }
        }
        document.getElementById("takoyakimap")?.addEventListener("click", revealDrink("takoyaki"));
        document.getElementById("yscafemap")?.addEventListener("click", revealDrink("yscafe"));
        document.getElementById("syokudomap")?.addEventListener("click", revealDrink("syokudo"));
        document.getElementById("maidmap")?.addEventListener("click", revealDrink("maid"));
        document.getElementById("syasuderimap")?.addEventListener("click", revealDrink("syasuderi"));
    }();
    
    
    document.getElementById("user-name-input")?.addEventListener("keydown", _restrictBreak);
    document.getElementById("user-name-input")?.addEventListener("input", _nickChanged);
    document.getElementById("scan_stamp_trans")?.addEventListener("click", startScanningStamp);
    document.getElementById("scan_stamp_growth")?.addEventListener("click", startScanningStamp);
    document.getElementById("vote_right_now")?.addEventListener("click", submitFameVote);
    document.getElementById("evote_right_now")?.addEventListener("click", () => prevListener.evote());
    document.querySelectorAll("shishiji-fking-advertisement, #funny-closer")
        .forEach(u=> u.addEventListener("click", closeTopAdvertisement));
    
    
    
    
    /**
     * 
     * @param {mapObjectElement} mapobj 
     */
    function isOutofBounds(mapobj){
        const hello = $($(mapobj).children()[0]);
        const transform = window.getComputedStyle(mapobj).transform;
        const values = transform.match(/matrix\((.+)\)/)?.[1]?.split(", ");
        const whereIs = {
            x: parseFloat(values?.[4] || "0"),
            y: parseFloat(values?.[5] || "0")
        };
        const size = {
            width: parseFloat(hello.css("min-width")?.replace("px", "")),
            height: parseFloat(hello.css("min-height")?.replace("px", ""))
        };
        if (
            whereIs.x + size.width/2 < 0 || whereIs.x - size.width/2 > window.innerWidth
            ||
            whereIs.y + size.height/2 < 0 || whereIs.y - size.height/2 > window.innerHeight
        ) return true;
    }
    
    
    function updatePositions(){
        for (const _mapObj of document.getElementsByClassName("mpob")){
            /**@ts-ignore @type {mapObjectElement} */
            const mapObj = _mapObj;
            const outOfBounds = { prev: mapObj.getAttribute("prout"), now: false };
            const coords = getCoords(mapObj);
            var transforms = "";
            const objPosition = {
                x: (coords.x - backcanvas.canvas.coords.x) * zoomRatio,
                y: (coords.y - backcanvas.canvas.coords.y) * zoomRatio,
            };
    
            var behavior = getBehavior(mapObj);
            const dfsize = getDefaultSize(mapObj);
    
            var size = Object.create(dfsize);
    
            if (behavior == "dynamic"){
                if (zoomRatio > MOVEPROPERTY.object.dynamic_to_static.over) behavior = "dynatic";
                if (zoomRatio < MOVEPROPERTY.object.dynamic_to_static.under) behavior = "_dynatic";
            }
            
            switch (behavior){
                case "static":
                    size.width = dfsize.width*zoomRatio;
                    size.height = dfsize.height*zoomRatio;
                    break;
                /**
                 * これ重いマジ
                 */
                case "dynatic":
                    size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                    size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.over);
                    break;
                case "_dynatic":
                    break;
                    size.width = dfsize.width*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
                    size.height = dfsize.height*(zoomRatio / MOVEPROPERTY.object.dynamic_to_static.under);
                    break;
                case "dynamic":
                    size.width = dfsize.width;
                    size.height = dfsize.height;
                    break;
            }
            
            transforms += `translate(${objPosition.x}px, ${objPosition.y}px)`;
    
            if (
                (objPosition.x + size.width < 0 || objPosition.x - size.width > window.innerWidth
                ||
                objPosition.y + size.height < 0 || objPosition.y - size.height > window.innerHeight)
            ){
                if (outOfBounds.prev) continue;
                else mapObj.setAttribute("prout", "true");
            }  else if(outOfBounds.prev){
                mapObj.removeAttribute("prout");
            }
            
            mapObj.style.transform = transforms;
            
            $($(mapObj).children()[0])
                .css("min-width", size.width+"px")
                .css("min-height", size.height+"px");
                //.css("max-width", size.width+"px")
                //.css("max-height", size.height+"px");
        }
    }
    
    
    function drawPoints(){
        const curpoints = mapPointComponent[CURRENT_FLOOR] || [];
    
        for (const point of curpoints){
            drawText(point.coords, point.name);
        }
    }
    
    
    /**
     * 
     * @param {string} disc 
     * @returns {HTMLElement | null}
     */
    function getObject(disc){
        const k = document.getElementById(formatString(objectIdFormat, disc));
        return k ? k : null;
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     * @param {string} message 
     */
    function setObjectMessageAbove(discriminator, message){
        const obje = getObject(discriminator);
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     */
    function setObjectCleared(discriminator){
        const obje = getObject(discriminator);
        
        if (obje){
            const ch = obje.children[0];
            ch.classList.add("mpob-clerdd");
            ch.classList.remove("_", "favoritE");
            ch.classList.add("cleareD");
    
            //ch.querySelectorAll(".Hjasgia").forEach(e => e.remove());
            //$(ch).prepend(`<div class="Hjasgia"><K></K><R></R></div>`);
        }
    }
    
    
    /**
     * @param {string} discriminator
     * @param {number} status 
     */
    function setObjectCrowdStatus(discriminator, status){
        const obje = getObject(discriminator);
    
        if (status == 0) status = 1;
    
        if (obje){
            const ch = obje.children[0];
    
            if (ch.querySelectorAll(`.crowds-${status}`).length > 0) return;
            ch.querySelectorAll(".AUIHVP").forEach(t => t.remove());
            $(ch).prepend(`<div class="AUIHVP kpls"><span class="crowds-${status}"></span></div>`);
        }
    }
    
    
    /**
     * @deprecated closed my Ito Koyo (who proposed this)
     * @param {string} discriminator
     * @param {string} venue 
     */
    function setObjectVenue(discriminator, venue){
        const obje = getObject(discriminator);
    
        if (obje){
            const ch = obje.children[0];
    
            if (ch.querySelectorAll(".NJIvua").length > 0) return;
            $(ch).prepend(`<div class="NJIvua kpls"><span>${venue}</span></div>`);
        }
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     */
    function setObjectFavorite(discriminator){
        const obje = getObject(discriminator);
        
        if (obje){
            const ch = obje.children[0];
    
            if (ch.querySelectorAll(".AIGbbvwG").length > 0) return;
            $(ch).prepend(`<div class="AIGbbvwG kpls"><span></span></div>`);
        }
    }
    
    
    /**
     * 
     * @param {string} discriminator 
     */
    function setObjectNormal(discriminator){
        const obje = getObject(discriminator);
        
        if (obje){
            const ch = obje.children[0];
            ch.classList.remove("favoritE", "cleareD");
            ch.classList.add("_");
        }
    }
    
    
    function setClearedRate(){
        const rat = Math.ceil((LOGIN_DATA.data.completed_orgs.length/completable)*100);
        var col = "";
        var good = false;
    
        if (rat == 100){
            col = "#4CAF50";
        } else if (rat >= 75){
            col = "#C0CA33";
        } else if (rat >= 50){
            col = "#FDD835";
        } else if (rat >= 25){
            col = "#F4511E";
        } else if (rat >= 0){
            col = "#E53935";
        }
    
        if (LOGIN_DATA.data.completed_orgs.length >= 13){
            good = true;
            col = "#4CAF50";
            $("#oive_r")
            .css("width", "340px")
            .css("height", "60px")
            .css("top", "calc(100dvh - 70px)");
            $("#oive_h")
            .css("padding", "0 10px");
            $("#auyGAWW")
            .text(`2階職員室前の面談室5 へおこしください！ペンを贈呈致します ${rat}% (${LOGIN_DATA.data.completed_orgs.length}/${completable})`);
        } else {
            $("#auyGAWW")
            .css("color", col)
            .text(`${rat}% (${LOGIN_DATA.data.completed_orgs.length}/${completable})`);
        }
    }
    
    
    /**
     * 
     * @param {mapObject | SourcePlace} place 
     */
    function revealOnMap(place){console.log(place)
        const approach_id = Random.string(8);
        const floor = place["object"]?.["floor"] ?? place["floor"];
    
        approach_beings.length = 0;
        approach_beings.push(approach_id);
        MOVEPROPERTY.deny = true;
    
        
        function doApproach(){
            const ittanZR = 0.25;
            const destzr = ZOOMRATIO_ON_SHARE;
            const duration = 3000/5;
            const currentMiddle = toBackCanvasCoords([window.innerWidth/2, window.innerHeight/2]);
            const each = {
                zoom1: (ittanZR < zoomRatio) ? (ittanZR - zoomRatio)/(duration/3) : 0,
                zoom2: (destzr - ittanZR)/(duration/3),
                pos: {
                    x: ((place["object"]?.["coordinate"]?.["x"] ?? place["x"]) - currentMiddle.x)/(duration*(2/3)),
                    y: ((place["object"]?.["coordinate"]?.["y"] ?? place["y"]) - currentMiddle.y)/(duration*(2/3)),
                }
            }
            var s = 0;
    
            function approach(){
                s++;
                if (s > duration){
                    setBehavParam();
                    MOVEPROPERTY.deny = false;
                    return;
                }
                if (s < duration/3)
                    zoomRatio += each.zoom1;
                if (s > duration*(3-1)/3)
                    zoomRatio += each.zoom2;
                if (s < duration*(2/3)){
                    currentMiddle.x += each.pos.x;
                    currentMiddle.y += each.pos.y;
                }
                setCoordsOnMiddle(currentMiddle, zoomRatio);
                approach_beings.includes(approach_id) ? setTimeout(approach, 5) : void 0;
            }
    
            approach();
        }
    
        if (CURRENT_FLOOR == (place["object"]?.["floor"] ?? place["floor"])){
            doApproach();
        } else {
            const data = MAPDATA[floor];
            changeFloor(floor, floor, data)
            .then(doApproach);
        }
    }
    
    
    
    
    !function(){
        /**@ts-ignore @type {HTMLElement} */
        const fselector = document.getElementById("#place-selector".slice(1));
    
        
        $("#place-options").children().each(function(index, elm){
            if (!this.textContent)
                return;
            const text = this.getAttribute("floor") || "";
            const so_called = this.textContent.replace(/ /g, "");
            if (text.length < 1)
                return;
            
    
            /**@this {HTMLElement} @param {string} name */
            function addListener(name){
                this.addEventListener("click", function(e){
                    e.preventDefault();
                    const data = MAPDATA[name];
                    
                    if (CURRENT_FLOOR === name || data === undefined)
                        return;
    
                    changeFloor(name, so_called, data);
                });
                return 0;
            };
    
            addListener.apply(this, [text])
        });
    
        $(fselector)
        .on("click", function(e){
            e.preventDefault();
            if (e.target?.classList.contains("fselector-btn") || e.target?.id == "psdummy"){
                toggleFeslOn.apply($(fselector), [overlay_modes.fselector.opened]);
                overlay_modes.fselector.opened = !overlay_modes.fselector.opened;
            }
        });
        
        return 0;
    }();
    
    
    
    
    !function(){
        window.addEventListener("click", function(e){
            /**@ts-ignore @type {HTMLElement} */
            const target = e.target;
            
            if ($(target).hasClass("article-image")){
                const src = target.getAttribute("src");
    
                if (src)
                    Popup.popupMedia(src, "img", target);
            }
        });
    
    
        "touchstart mousedown".split(" ").forEach(m => {
            document.getElementById("user-stricter")?.addEventListener(m, function(){
                if (OverView.isfullyopened){
                    reduceOverview();
                }
            });
        });
    
    
        document.getElementById("shishiji-overview")?.addEventListener("click", function(e){
            if (e.pageY < 20){
                document.getElementById("shishiji-overview")?.scrollTo({
                    behavior: "smooth",
                    top: 0,
                })
            }
        });
    
    
        // something to do
        document.getElementById("dvd4")?.addEventListener("click", function(e){
            e.preventDefault();
            prevListener.share();
        });
    
        document.getElementById("dvd1")?.addEventListener("click", function(e){
            e.preventDefault();
            map_reveal_func();
        });
    
        document.getElementById("dvd2")?.addEventListener("click", function(e){
            e.preventDefault();
            prevListener.favorite();
        });
    
        document.getElementById("dvd3")?.addEventListener("click", function(e){
            e.preventDefault();
            prevListener.vote();
        });
    
        return 0;
    }();
    
    
    
    
    !function(){
        /** @ts-ignore @type {HTMLCanvasElement}*/
        const map_wrapper = document.getElementById("shishiji-view");
        /** @ts-ignore @type {HTMLElement}*/
        const fselector = document.getElementById("#place-selector".slice(1));
    
    
        /**
         * @param {Event} e  
         * @returns {boolean}
         */
        function illegal(e){
            const target = e.target;
            if (MOVEPROPERTY.deny) return true;
            //@ts-ignore
            if (target?.classList.contains("canvas_interactive") || target?.tagName.toLowerCase() === "canvas"){
                return false;
            }
            return true;
        }
    
        window.addEventListener("touchstart", (e) => {
            if (illegal(e))
                return;
    
            e.preventDefault();
    
            
            clearTimeout(WH_CHANGE_TM);
    
    
            if (overlay_modes.fselector.opened){
                toggleFeslOn.apply($(fselector), [true]);
                overlay_modes.fselector.opened = false;
            }
            
            init_friction();
            initTouch(e);
            setCursorpos(e.touches);
    
            if (e.touches.length >= 2)
                setTheta(e.touches);
        }, { passive: false });
        window.addEventListener("mousedown", (e) => {
            if (illegal(e))
                return;
    
            e.preventDefault();
    
    
            clearTimeout(WH_CHANGE_TM);
    
            
            if (overlay_modes.fselector.opened){
                toggleFeslOn.apply($(fselector), [true]);
                overlay_modes.fselector.opened = false;
            }
    
            init_friction();
            setCursorpos(e);
    
            window.addEventListener("mousemove", mose_move, { passive: false });
        }, { passive: false });
    
        
    
        window.addEventListener("touchmove", function(e){
            if (illegal(e))
                return;
            e.preventDefault();
            onTouchMove(e);
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
            clearInterval(WH_CHANGE_TM);
            //@ts-ignore
            WH_CHANGE_TM = setTimeout(() => {
                setBehavParam();
            }, href_replaceCD);
            if (spckeystatus.ctr)
                canvasonCtrScroll(e);
            else
                canvasonScroll(e);
        }
    
    
        function mose_move(e){
            if (MOVEPROPERTY.deny) return;
            e.preventDefault();
            map_wrapper.style.cursor = "move";
            Array.from(document.getElementsByClassName("canvas_interactive")).forEach(
                p => {
                    //@ts-ignore
                    p.style.cursor = "move";
                }
            );
            DRAGGING = true;
            onMouseMove(e);
        }
    
    
        function mouse_lost(e){
            e.preventDefault();
            pointerPosition = [ null, null ];
            window.removeEventListener("mousemove", mose_move);
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
    
            var vx = vx0,
                vy = vy0,
                dxa = pointerVelocity.a*i(vx0),
                dya = pointerVelocity.a*i(vy0);
    
            if (isNaN(vx) || isNaN(vy))
                return 0;
    
            const selfi = setInterval(function(){
                var ag = { top: vy/1000, left: vx/1000 };
                if (ag.top*vy0 <= 0) ag.top = 0;
                if (ag.left*vx0 <= 0) ag.left = 0;
    
                moveMapAssistingNegative(ag);
    
                vx += dxa;
                vy += dya;
                if (vx*vx0 <= 0 && vy*vy0 <= 0){
                    //@ts-ignore
                    WH_CHANGE_TM = setTimeout(function(){
                        setBehavParam();
                    }, href_replaceCD);
                    clearInterval(selfi);
                    return;
                }
            }, 1);
            frictDiscount = selfi;
    
            return 0;
        }
    
    
        document.body.addEventListener("mousemove", function(e){
            e.preventDefault();
            cursorPosition = [ e.clientX, e.clientY ];
        });
    
    
        function init_friction(){
            DRAGGING = false;
            //@ts-ignore
            clearInterval(frictDiscount);
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
    
    
    
    
    !function(){
        /**
         * popup
         * using css {@link ../css/shishijimap.css:474}
         */
        !function(){
            return;
            const $cp = $("");
    
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
    
            return 0;
        }();
    
        return 0;
    }();
    
    
    
    
    function setCanvasSizes(){
        shishiji_canvas.width = window.innerWidth;
        shishiji_canvas.height = window.innerHeight;
        shishiji_canvas.style.width = shishiji_canvas.width+"px"; shishiji_canvas.style.height = shishiji_canvas.height+"px";
        backcanvas.canvas.width = shishiji_canvas.width;
        backcanvas.canvas.height = shishiji_canvas.height;
    }
    
    
    !function(){
        /**@ts-ignore @type {string} */
        const loadType = window.performance?.getEntriesByType("navigation")[0].type;
        const PARAMS = {
            article: getParam(ParamName.ARTICLE_ID),
            zoomRatio: Number(getParam(ParamName.ZOOM_RATIO)) || 1,
            floor: getParam(ParamName.FLOOR),
            coords: getParam(ParamName.COORDS)?.split(",").map(a => { return (typeof a === "undefined" || isNaN(Number(a))) ? 0 : Number(a); }) || [ 0, 0 ],
            from: getParam(ParamName.URL_FROM),
            lang: digitLang(getParam(ParamName.LANGUAGE)),
            jumpto: getParam(ParamName.JUMPTO),
            _poor_coords: getParam(ParamName.COORDS)?.split(",").map(a => { return (typeof a === "undefined" || isNaN(Number(a))) ? 0 : Number(a); }) || [ 0, 0 ],
        };
    
    
        //LANGUAGE = PARAMS.lang || getUserLang() || "JA";
        
        if (PARAMS.coords.length != 2 
            || PARAMS.coords.some(u => {
            if (!u || isNaN(u))
                return true;
            }
        )) PARAMS.coords = [ 0, 0 ];
    
        if (loadType == "reload"){
            switch (reloadInitializeLevel){
                case reloadInitializeLevels.DO_EVERYTHING:
                case reloadInitializeLevels.INIT_FLOOR:
                    PARAMS.floor = null;
                    delParam(ParamName.FLOOR);
                case reloadInitializeLevels.INIT_COORDS:
                    PARAMS.coords = [ 0, 0 ];
                    delParam(ParamName.COORDS);
                case reloadInitializeLevels.INIT_ZOOMRADIO:
                    PARAMS.zoomRatio = 1;
                    delParam(ParamName.ZOOM_RATIO);
                case reloadInitializeLevels.CLOSE_ARTICLE:
                    PARAMS.article = null;
                    delParam(ParamName.ARTICLE_ID);
                case reloadInitializeLevels.DO_NOTHING:
                default:
    
            }
        }
    
        const loaderf = startLoad(TEXTS[LANGUAGE].LOADING, "first", true);
        delParam(ParamName.URL_FROM);
        setCanvasSizes();
        setPlaceSelColor();
    
        function setFloors(fldata){
            const flelm = document.createElement("div");
            flelm.classList.add("fselc-cell", "flxxt", "realshadow");
            for (const [fn, fdat] of Object.entries(fldata)){
                if (fn == "initial_floor")  continue;
                const gx = flelm.cloneNode();
                gx.textContent = fdat["so-called"] || fn;
                //@ts-ignore
                gx.setAttribute("floor", fn); gx.id = "floor-"+fn;
                gx.addEventListener("click", function(){
                    if (CURRENT_FLOOR != fn && !tour_status.main_screen){
                        approach_beings.length = 0;
                        changeFloor(fn, gx.textContent || "", MAPDATA[fn], true);
                        MOVEPROPERTY.deny = false;
                        $(".fselc-cell").removeClass("currentflr");
                        $(this).addClass("currentflr");
                    }
                });
                //@ts-ignore
                $("#fsel-xxl").append(gx);
            }
        }
    
        const mapConfigAjax = $.when($.post(ajaxpath.mapdata), $.post(ajaxpath.mapobjs), $.post(ajaxpath.mappoints), LOGIN_AJAX);
    
        function whenWithComplicatedURL(ajaxmapdata, ajaxobjectdata, ajaxpointdata){
            const mapdata = ajaxmapdata[0],
                /**@type {mapObjComponent} */
                objectdata = ajaxobjectdata[0],
                points = ajaxpointdata[0],
                mapdrawncallbacks = [],
                loadendscallbacks = [],
                gcc = {
                    "1F": "1階",
                    "2F": "2階",
                    "3F": "1階",
                    "4F": "4階",
                    "B1": "地下1階"
                };
            MAPDATA = mapdata;
            mapObjectComponent = objectdata;
            mapPointComponent = points;
            setFloors(ajaxmapdata[0]);
    
            var initial_floor = mapdata.initial_floor;
            var initial_data = mapdata[mapdata.initial_floor];
    
            var pure_zr = Boolean(PARAMS.zoomRatio === 1);
    
            if (PARAMS.floor && Object.keys(mapdata).includes(PARAMS.floor)){
                initial_floor = PARAMS.floor;
                initial_data = mapdata[PARAMS.floor];
            }
            if (PARAMS.from == ParamValues.FROM_NAVIGATE){
                const objdata = getMapObjectData(PARAMS.article || "");
                initial_floor = objdata?.object.floor;
                initial_data = mapdata[initial_floor];
                mapdrawncallbacks.push(() => {
                    setCoordsOnMiddle(objdata?.object.coordinate || { x: ((initial_data.xrange+1)*initial_data.tile_width)/2, y: ((initial_data.yrange+1)*initial_data.tile_height)/2 }, zoomRatio, true);
                });
            }
            if (PARAMS.jumpto){
                var data = getMapObjectData(PARAMS.jumpto);
                initial_floor = data?.object.floor;
                initial_data = mapdata[initial_floor];
                PARAMS.article = "";
                delParam(ParamName.JUMPTO);
                delParam(ParamName.ARTICLE_ID);
                mapdrawncallbacks.push(() => {
                    setCoordsOnMiddle(data?.object.coordinate || {
                        x: ((initial_data.xrange+1)*initial_data.tile_width)/2,
                        y: ((initial_data.yrange+1)*initial_data.tile_height)/2
                    }, ZOOMRATIO_ON_SHARE, true);
                    PictoNotifier.notify("info", formatString(TEXTS[LANGUAGE].JUMPED_TO_MAP, data?.article.title));
                });
            }
        
            CURRENT_FLOOR = initial_floor;
            // It's now just a color!!
            //initial_data = setSpareImage(initial_data);
    
            backcanvas.width = initial_data.tile_width*(initial_data.xrange+1);
            backcanvas.height = initial_data.tile_height*(initial_data.yrange+1);
        
            +function(){
                // cut a rational figure of our UI
                var __wait = 0//100//4750;
    
                loaderf.then(async () =>{
                    if (!getLocalStorage("__reception")){
                        // do I have to show reception at first??
                        //setCoordsOnMiddle({x:504,y:1650}, 1);
                        setLocalStorage("__reception", "done-"+(new Date()).toString());
                    }
                    if (LOGIN_DATA.data.custom_data.headcount == 0){
                        letSetHeadcount()
                        .then(() => {
                            if (isUnvisitedTour("main_screen"))
                                tour_status.main_screen = MOVEPROPERTY.deny = true;
                                setTimeout(() => {
                                    startTour("main_screen");
                                }, 250);
                        });
                    }
                    await endLoad(TEXTS[LANGUAGE].MAP_LOADED, __wait);
                    
                    isUnvisitedTour("main_screen") && LOGIN_DATA.data.custom_data.headcount != 0 ? 
                    loadendscallbacks.push(() => {
                        tour_status.main_screen = MOVEPROPERTY.deny = true;
                        startTour("main_screen");
                    }) : 0;
                    loadendscallbacks.forEach(f => f());
                });
    
                $("#app-mount").show();
                if (PARAMS.article){
                    if (PARAMS.from == ParamValues.FROM_NAVIGATE)
                        return;
                    const data = getMapObjectData(PARAMS.article);
                    var scr_position = 0;
                    var article_tg = "description";
    
                    if (data == null){
                        if (PARAMS.from == ParamValues.FROM_ARTICLE_SHARE){
                            setTimeout(() => {
                                PictoNotifier.notify(
                                    "error",
                                    TEXTS[LANGUAGE].NOTIFICATION_SHARED_EVENT_NOT_FOUND,
                                    { duration: 7500, discriminator: "share not found" }
                                );
                            }, 500);
                        }
                        delParam(ParamName.ARTICLE_ID);
                        return;
                    }
    
                    if (PARAMS.from == ParamValues.FROM_ARTICLE_SHARE){
                        const coords = data.object.coordinate;
    
                        CURRENT_FLOOR = initial_floor = data.object.floor;
                        initial_data = MAPDATA[CURRENT_FLOOR];
    
                        mapdrawncallbacks.push(() => setCoordsOnMiddle(coords, ZOOMRATIO_ON_SHARE, true));
                        loadendscallbacks.push(() => {
                            PictoNotifier.notify(
                                "info",
                                TEXTS[LANGUAGE].NOTIFICATION_SHARED_EVENT_FOUND,
                                { duration: 5000, discriminator: "share found" }
                            );
                        });
    
                        const g = getParam(ParamName.SCROLL_POS),
                            y = getParam(ParamName.ART_TARGET);
                        delParam(ParamName.SCROLL_POS);
                        delParam(ParamName.ART_TARGET);
                        if (g != null || y){
                            scr_position = Number(g);
                            if (y)
                                article_tg = y;
                        }
                    }
    
                    loadendscallbacks.push(() => {
                        raiseOverview();
                        writeArticleOverview(data, true, scr_position, article_tg);
                    });
                }
            }();
            
            function mapdrawncallback(){
                const mapd = {
                    width: (initial_data.xrange+1)*initial_data.tile_width,
                    height: (initial_data.yrange+1)*initial_data.tile_height
                };
                const zr_cands = [document.body.clientWidth/mapd.width, document.body.clientHeight/mapd.height];
                
                backcanvas.canvas.coords = {
                    //@ts-ignore
                    x: PARAMS.coords[0], y: PARAMS.coords[1]
                };
                
                if (PARAMS.zoomRatio > MOVEPROPERTY.caps.ratio.max) PARAMS.zoomRatio = MOVEPROPERTY.caps.ratio.max;
                if (PARAMS.zoomRatio < MOVEPROPERTY.caps.ratio.min) PARAMS.zoomRatio = MOVEPROPERTY.caps.ratio.min;
    
                zoomRatio = PARAMS.zoomRatio || Math.min(...zr_cands);
                
                moveMapAssistingNegative({ left: 0, top: 0 });
                showDigitsOnFloor(initial_floor, mapObjectComponent);
                showGoodOrgs();
                setBehavParam();
                legalRatioCap();
                if (pure_zr || PARAMS._poor_coords.some(u => u === 0)){
                    zoomRatio = Math.min(...zr_cands);
                    setCoordsOnMiddle({x: ((initial_data.xrange+1)*initial_data.tile_width)/2, y: ((initial_data.yrange+1)*initial_data.tile_height)/2 }, zoomRatio, true);
                }
                mapdrawncallbacks.forEach(f => f());
            }
    
            $("#floor-"+CURRENT_FLOOR).addClass("currentflr");
            readyMap(initial_data, { over: "", under: gcc[CURRENT_FLOOR] }, mapdrawncallback);
            setParam(ParamName.FLOOR, CURRENT_FLOOR);
            setPlaceSelColor();
        }
    
    
        mapConfigAjax.done(PARAMS.floor ? whenWithComplicatedURL : whenWithComplicatedURL/*whenWithPureURL*/);
    
        return 0;
    }();
    
    
    window.addEventListener("resize", function(e){
        e.preventDefault();
        setCanvasSizes();
        moveMapAssistingNegative({ top: 0, left: 0 });
        window.scroll({ top: 0, behavior: "instant" });
    }, { passive: false });
    
    window.addEventListener("touchstart", function(e){
        //@ts-ignore
        if (e.target.classList.contains("canvas_interactive")){ e.target.classList.add("interactive_trans"); }
    }, {passive: true});
    
    window.addEventListener("touchend", function(e){
        Array.from(document.getElementsByClassName("interactive_trans")).forEach(e => e.classList.remove("interactive_trans"));
    }, {passive: true});
    
    document.oncontextmenu = () => { return false; }
    
    
    if ("serviceWorker" in navigator){
        navigator.serviceWorker.register("/src/assets/service-worker/poverty.js")
        .then(function(registration){
            //console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch(function(error){
            //console.log("Service Worker registration failed:", error);
        });
    }
    
    
    setInterval(async function(){
        for (const cd of LOGIN_DATA.pending_collects){
            letCollect(cd.name, cd.count);
        }
        LOGIN_DATA.pending_collects.length = 0;
    }, 10000);
    
    window.addEventListener("load", function(e){
        
    });
    
    return 0;
})();
