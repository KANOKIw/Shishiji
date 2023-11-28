var LINED = false;
var PENDING_LOGS = [];
var CURRENT_BUTTON_WIDTH = 15;
var EV_QUADRANT = 1;
var LOG_ICON = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSoguY19n3ex7GN9IA6A0K_L2aB7Kd-zEDnA&usqp=CAU";
var IMG_LOADING_ICON = "https://cdn3.emoji.gg/emojis/1792-loading.gif";
var STOPPED = false;
var LOG_DIVIDER = `<hr class="--lgr-content-divider">`;
var Invisible = false;
const ColorList = {
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
const Dec = {
    "k": 'class="--lgr-obfuscated"',
    "l": 'style="font-weight: bolder;"',
    "m": 'style="text-decoration: line-through;"',
    "n": 'style="text-decoration: underline;"',
    "o": 'style="font-style: italic;"',
    "p": 'style=""',
};
const Color = {
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
const Colour = Color;


class console{
    /**
     * 
     * @param  {...any} __log
     * @returns boolean
     *  success or failure
     */
    static log(...__log){
        var location = this._getLocation();
        var clses = document.getElementsByClassName("--lgr-message-ol");
        var content = __log.join(" ")
            .replaceAll(" ", "&nbsp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\n", "<br>");
        var log_ = `
            <li class="--lgr-message-element">
                <div class="--lgr-location">${location}&nbsp;</div>
                <div class="--lgr-message"><span class="--lgr-noth">▶&nbsp;</span>
                    ${this._parse_formatting_code(content)}
                </div>
            </li>
        `;

        if (STOPPED) return;
        
        if (PENDING_LOGS.length > 0 || clses.length == 0){
            PENDING_LOGS.push({content: log_, type: "log"});
            return false;
        }

        Array.from(clses)
        .forEach(elm => {
            elm.innerHTML += log_;
        });

        _set_log_width();
        _set_log_height();
        return true;
    }


    static warn(...__log){
        var location = this._getLocation();
        var clses = document.getElementsByClassName("--lgr-message-ol");
        var content = __log.join(" ")
            .replaceAll(" ", "&nbsp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\n", "<br>");
        var log_ = `
            <li class="--lgr-message-element" style="background-color: rgb(255, 170, 0, 0.1)">
                <div class="--lgr-location">${location}&nbsp;</div>
                <div class="--lgr-message">
                    <span class="--lgr-noth" style="color: orange;">
                        Warn
                    </span>
                    <span class="--lgr-noth">▶</span>
                    <span>
                        ${this._parse_formatting_code(content)}
                    </span>
                </div>
            </li>
        `;

        if (STOPPED) return;
        
        if (PENDING_LOGS.length > 0 || clses.length == 0){
            PENDING_LOGS.push({content: log_, type: "warn"});
            return false;
        }

        Array.from(clses)
        .forEach(elm => {
            elm.innerHTML += log_;
        });

        _set_log_width();
        _set_log_height();
        return true;
    }


    static clear(){
        var log_ols = document.getElementsByClassName("--lgr-message-ol");

        PENDING_LOGS = [];
        for (var log_ol of log_ols){
            for (var ch of log_ol.childNodes){
                if (ch.tagName == "LI" || ch.tagName == "li"){
                    ch.remove();
                }
            }
        }
        for (var log of document.getElementsByClassName("--lgr")){
            log.style.height = "auto";
        }
    }


    static setInvisible(inv){
        Invisible = inv;
        (inv) ? this._hide() : this._show();
    }


    static setStopped(_bool){
        STOPPED = _bool;
    }


    /**
     * 
     * @param {number} button_width
     *  button_width`vw`
     * @param {number} __button_height
     *  Optional
     * @returns
     *  no return
     */
    static setButtonWidth(button_width, __button_height){
        var imgs = document.getElementsByClassName("--lgr-opener");
        var padding_vw = 0 / window.innerWidth;

        button_width -= padding_vw*100;
        CURRENT_BUTTON_WIDTH = button_width;

        if (imgs.length > 0){
            var div_val = imgs[0].naturalHeight/imgs[0].naturalWidth;

            if (isNaN(div_val)){
                if (__button_height)
                    div_val = __button_height/button_width;
                else
                    div_val = 1;
            }
            var he = button_width*(div_val)+"vw";

            Array.from(imgs)
            .forEach(img => {
                img.style.width = button_width+"vw";
                img.style.height = he;
            });
            Array.from(document.getElementsByClassName("--lgr"))
            .forEach(elem => {
                elem.style.paddingTop = he;
            });
            return;
        }
        this.warn("§6On function: console.setButtonWidth(button_width, __button_height)\n§r§l    You had better call this on §nload§r.");
    }


    /**
     * 
     * @param {number} quadrant 
     */
    static setPositionByQuadrant(quadrant){
        var wrapper = document.getElementsByClassName("--lgr-opener-wrapper");
        
        function _forEach(callback){
            Array.from(wrapper).forEach(i => callback(i));
        }

        if (quadrant != undefined)
            EV_QUADRANT = quadrant;
        if (wrapper.length == 0)
            this.warn("§6On function: console.setPositionByQuadrant(quadrant)\n§r§l    You had better call this on §nload§r.");
        
        switch (quadrant){
            case 1:
            default:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-start";
                    wp.style.justifyContent = "end";
                });
                break;
            case 2:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-start";
                    wp.style.justifyContent = "start";
                });
                break;
            case 3:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-end";
                    wp.style.justifyContent = "start";
                });
                break;
            case 4:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-end";
                    wp.style.justifyContent = "end";
                });
                break;
        }
        return true;
    }


    static setLogIcon(path){
        var imgs = document.getElementsByClassName("--lgr-opener");

        for (var img of imgs){
            img.src = path;
            img.style.backgroundImage = `url("${IMG_LOADING_ICON}")`;
            this.setButtonWidth(CURRENT_BUTTON_WIDTH);
            img.addEventListener("load", function _load(){
                console.setButtonWidth(CURRENT_BUTTON_WIDTH);
                this.style.backgroundImage = "none";
                this.removeEventListener("load", _load);
            });
        }
        LOG_ICON = path;
    }


    static clickButton(){
        var log_elements = document.getElementsByClassName("--lgr");
        
        if (log_elements.length == 0)
            return;
        if (LINED){
            Array.from(document.getElementsByClassName("--lgrer"))
            .forEach(logger => {
                logger.style.width = "0px";
                logger.style.height = "0px";
                logger.style.overflow = "visible";
            });

            Array.from(log_elements)
            .forEach(log => {
                log.style.animation = "fade-out 1s linear";
                log.style.display = "none";
            });

            console.setPositionByQuadrant(EV_QUADRANT);
        } else {
            Array.from(document.getElementsByClassName("--lgrer"))
            .forEach(logger => {
                logger.style.width = "100vw";
                logger.style.height = "100vh";
                logger.style.overflow = "scroll";
            });

            Array.from(log_elements)
            .forEach(log => {
                log.style.animation = "fade-in 0.2s linear";
                log.style.display = "block";
                _set_log_height();
            });

            console._reset_position();
        }
        LINED = !LINED;
    }


    static _show(){
        var loggers = document.getElementsByClassName("--lgrer");

        if (loggers.length == 0){
            this.warn("§6On function: console._show()\n§r§l    You had better call this on §nload§r.");
            return;
        }
        Array.from(loggers)
        .forEach(logger => {
            logger.style.display = "block";
        });
    }


    static _hide(){
        var loggers = document.getElementsByClassName("--lgrer");

        if (loggers.length == 0){
            this.warn("§6On function: console._hide()\n§r§l    You had better call this on §nload§r.");
            return;
        }
        Array.from(loggers)
        .forEach(logger => {
            logger.style.display = "none";
        });
    }


    static _reset_position(){
        var wrapper = document.getElementsByClassName("--lgr-opener-wrapper");

        function _forEach(func){
            Array.from(wrapper).forEach(i => func(i));
        }

        _forEach(function(wp){
            wp.style.alignItems = "flex-start";
            wp.style.justifyContent = "start";
        });
    }


    /**
     * 
     * @param  {ErrorEvent} error
     * @param  {...any} __log
     * @returns boolean
     *  success or failure
     */
    static _error_log(error, ...__log){
        var location = this._getLocation(error);
        var clses = document.getElementsByClassName("--lgr-message-ol");
        var _log = __log.join(" ")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replace("\n", "<br>");
        var log_athttp_pos = _log.indexOf("@http");

        if (log_athttp_pos != -1){
            _log = _log.substring(0, log_athttp_pos) + "<br>" + _log.substring(log_athttp_pos, _log.length);
            _log = _log.replaceAll("@http", "&nbsp;&nbsp;&nbsp;&nbsp;@http");
        }
        else {
            _log = _log.replaceAll("at ", "<br>&nbsp;&nbsp;&nbsp;&nbsp;at ");
            _log = _log.replace("<br>&nbsp;&nbsp;&nbsp;&nbsp;at ", "&nbsp;&nbsp;&nbsp;&nbsp;at ");
        }
        
        var url_childs = _log.split("<br>");
        var urls = [];
        var url_pattern = /https?:\/\/[^\s]+/g;

        url_childs.shift();
        for (var url of url_childs){
            var _found = url.match(url_pattern);
            if (_found)
                _found.forEach(ul => urls.push(ul));
        }
        for (var val of urls){
            _log = _log.replaceAll(val, get_location_from_url(val));
        }
        _log = _log.replace(" ", "&nbsp;");
        
        var log = `
            <li class="--lgr-message-element" style="background-color: rgb(255, 0, 0, 0.1)">
                <div class="--lgr-location">${location}&nbsp;</div>
                <div class="--lgr-message">
                    <span class="--lgr-noth" style="color: red;">
                        Error
                    </span>
                    <span class="--lgr-noth">▶</span>
                    <span style="color: red;">
                        ${_log}
                    </span>
                </div>
            </li>
        `;

        if (PENDING_LOGS.length > 0 || clses.length == 0){
            PENDING_LOGS.push({content: log, type: "error"});
            return false;
        }
        
        Array.from(clses)
        .forEach(elm => {
            elm.innerHTML += log;
        });

        _set_log_width();
        _set_log_height();
        return true;
    }


    static _log(log_){
        var clses = document.getElementsByClassName("--lgr-message-ol");

        Array.from(clses)
        .forEach(elm => {
            elm.innerHTML += log_;
        });
        
        if (clses.length == 0)
            return false;

        _set_log_width();
        _set_log_height();
        return true;
    }


    /**
     * 
     * @param {Error | null} err
     * @returns {string}
     *  location of the first call
     */
    static _getLocation(err){
        try {
            if (err != undefined)
                throw err;
            throw new Error();
        } catch(e){
            if (e.stack){
                var traces = e.stack.split("\n");
                if (traces.length > 0){
                    var stackTrace = traces[traces.length -1],
                        _splited = stackTrace.trim().split(":"),
                        charNumber = _splited[_splited.length -1].replace(")", ""),
                        lineNumber = _splited[_splited.length -2],
                        _fin = _splited[_splited.length -3],
                        _slicer = _fin.lastIndexOf("/") +1,
                        que = _fin.indexOf("?"),
                        fileName = _fin;
                    
                    if (_slicer !== 0)
                        fileName = _fin.slice(_slicer, _fin.length);

                    if (fileName.indexOf("?") != -1)
                        fileName = fileName.substring(0, fileName.indexOf("?"));

                    if (fileName == "")
                        fileName = "index.html";
                    return fileName+":"+lineNumber+":"+charNumber;
                }
            }
            return "undefined";
        }
    }

    /**
     * 
     * @param {string} str
     *  log content
     * @returns {string}
     *  color formated html node string
     */
    static _parse_formatting_code(str) {
        var cl_count = 0;
        var dec_count = 0;
        str = "<lgr-cl>§p" + str;
        for (var pat in ColorList) {
            var str_splited = str.split("\u00A7".concat(pat));
            cl_count += str_splited.length - 1;
            str = str_splited.join("<lgr-cl style=\"color: ".concat(ColorList[pat], "\">"));
        }
        for (var decoration in Dec) {
            var code = "\u00A7".concat(decoration);
            while (str.includes(code)) {
                var code = "\u00A7".concat(decoration);
                dec_count++;
                str = str.replace(code, "<lgr-dec ".concat(Dec[decoration], ">"));
                if (str.indexOf("§r") < str.indexOf(code) || str.indexOf(code) == -1) {
                    var esc = "";
                    for (var i = 0; i < cl_count; i++) {
                        esc += "</lgr-cl>";
                    }
                    for (var i = -2; i < dec_count; i++) {
                        esc += "</lgr-dec>";
                    }
                    str = str.replace("§r", esc);
                    cl_count = 0;
                    dec_count = 0;
                }
            }
        }
        for (var i = 0; i <= cl_count; i++) {
            str += "</lgr-cl>";
        }
        for (var i = 0; i < dec_count; i++) {
            str += "</lgr-dec>";
        }
        return str;
    }
}

/**
 * 
 * @param {string} url
 *  raw url
 * @returns {string}
 *  location
 */
function get_location_from_url(url){
    var sliced = url.lastIndexOf("/") +1;
    var que = url.indexOf("?");
    var loc = "";

    if (sliced !== 0)
        loc = url.slice(sliced, url.length);
    if (loc.indexOf("?") != -1)
        loc = loc.substring(0, que);
    if (loc.substring(0, 1) == ":")
        loc = "index.html"+loc;
    return loc;
}


function set_logger(button_width){
    if (!button_width)
        button_width = CURRENT_BUTTON_WIDTH;
    __init__(button_width);
}


function __init__(button_width){
    if (!document.body){
        document.createElement("body");
    }

    document.body.innerHTML = `<div class="--lgrer"></div>`+document.body.innerHTML;
    document.body.style.margin = "0";

    var css = document.createElement("style");

    css.media = "screen";
    
    var fadein = "@keyframes fade-in{" + [
        "0% {opacity: 0}",
        "100% {opacity: 1.0}"
    ].join("") + "}";

    var fadeout = "@keyframes fade-out{" + [
        "0% {opacity: 1.0}",
        "100% {opacity: 0}"
    ].join("") + "}";

    var base_style_sheet = `
    .--lgrer{
        font-family: Consolas, 'Courier New', monospace;
        width: auto;
        min-width: 100wv;
        z-index: 2147483647;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none; 
        -webkit-user-drag: none;
        -khtml-user-select: none;
        -khtml-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-select: none; 
        -ms-user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    .--lgr-message-element{
        list-style: none;
        font-size: 20px;
        border-bottom: solid 3px gray;
    }
    .--lgr-message{
        word-break: break-all;
    }
    .--lgr-location{
        text-align: right;
        color: gray;
        right: 0;
    }
    .--lgr-opener{
        background-color: white;
        border: solid 2px black;
    }
    .--lgr-content-divider{
        margin: 0;
    }
    .--lgr-opener{
        background-image: url("${IMG_LOADING_ICON}");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
    }
    .--lgr-message-ol{
        padding: 10px;
    }
    .--lgr-opener-wrapper{
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        position: fixed;
    }
    .--lgr-noth{
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
    }
    `;

    var rules = document.createTextNode([fadein, fadeout, base_style_sheet].join("\n"));
    css.appendChild(rules);
    document.head.appendChild(css);

    var first = document.body.children.item(1);

    if (first)
        first.style.margin = "0";
    
    var loggers = document.getElementsByClassName("--lgrer");

    for (var logger of loggers){
        logger.style.position = "fixed";
        logger.innerHTML = `
        <div class="--lgr-opener-wrapper" style="display: flex; position: absolute; z-index: 1001;">
            <img class="--lgr-opener" alt=""></img>
        </div>
        <div class="--lgr" style="z-index: 1000; display: none; background-color: white; min-width: 100vw; width: 100vw; min-height: 100vh; height: 100vh; padding-left: 2px;">
            <ol class="--lgr-message-ol">
                <span style="display: none" aria-hidden="true">上矢印・下矢印キーを使ってログを素早く確認しましょう。新しいログをうけとると、リストの一番下に追加されます。</span>
            </ol>
        </div>`;
    }
    console.setInvisible(Invisible);
    console.setPositionByQuadrant(EV_QUADRANT);
    
    var log_openers = document.getElementsByClassName("--lgr-opener");

    for (var opener of log_openers){
        opener.addEventListener("load", function _load(){
            console.setButtonWidth(CURRENT_BUTTON_WIDTH);
            this.style.backgroundImage = "none";
            this.removeEventListener("load", _load);
        });

        opener.src = LOG_ICON;
        console.setButtonWidth(button_width);
        
        opener.addEventListener("click", console.clickButton);
    }
}


function _set_log_width(){
    var logs = document.getElementsByClassName("--lgr");
    var max = 0;
    
    Array.from(document.getElementsByClassName("--lgr-message"))
    .forEach(elem => {
        var wd = elem.innerWidth;
        max = (wd > max) ? wd : max;
    });
    /*for (var log of logs){
        log.style.width = max+"px";
    }*/
}


function _set_log_height(){
    var he = 0;

    for (var lmc of document.getElementsByClassName("--lgr-message-element")){
        he += lmc.clientHeight;
        for (var hr of document.getElementsByClassName("--lgr-content-divider")){
            he += .0015;
        }
    }
    he /= document.getElementsByClassName("--lgr-message-ol").length;
    var logs = document.getElementsByClassName("--lgr");

    Array.from(logs)
    .forEach(log => log.style.height = he+600+"px");
}


/**
 * 
 * @returns boolean
 *  whether every pending log was done successful
 */
function write_pending_logs(){
    for (var dict of PENDING_LOGS){
        var content = dict.content;
        var type = dict.type;
        var success;

        switch (type){
            case "log":
            case "error":
            case "warn":
                success = console._log(content);
                break;
            default: 
                break;
        }
        
        if (success){
            PENDING_LOGS = PENDING_LOGS.filter(item => {
                return item !== dict;
            });
        }
    }
    return PENDING_LOGS.length == 0;
}


function onError(event){
    var log = event;
    if (event.error){
        if (event.error.stack){
            log = event.error.stack;
        } else {
            log = event.error;
        }
    }
    console._error_log(event.error, log);
}


function onLoad(){
    var abc = "123456789abcdefghijklmnopqrstuvwxyz";
    var obfuscaters = abc.split("").concat(abc.slice(9).toUpperCase().split(""));

    set_logger();

    this.setInterval(function(){
        var obfs = document.getElementsByClassName("--lgr-obfuscated");
        for (var obf of obfs){
            for (var ch of obf.childNodes){
                var content = "";
                for (var char of ch.textContent.split("")){
                    var c = parseInt(Math.random() * (obfuscaters.length -1));
                    content += obfuscaters[c];
                }
                ch.textContent = content;
            }
        }
    }, 10);
    var me = this.setInterval(
        function(){
            var clearable = write_pending_logs();
            // commentouted to prevent log dissapear by deleting log block
            if (clearable){
                //clearInterval(me);
            }
        }
    , 5);
}


window.addEventListener("error", onError);
window.addEventListener("load", onLoad);
