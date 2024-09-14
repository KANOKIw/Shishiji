//@ts-check
"use strict";


/**
 * @typedef {import("../../shishiji-dts/objects").MapObject} DmapObject
*/


const secReg = /(§[a-zA-Z0-9]){1}/g,
    session = getCookie(SESSIONKEY),
    orgCloudfi = { maxsize: 0 },
    /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
    _t = { a: 0, },
    /**@type {{raw: string[], colored: string[]}} */
    EDITOR_HISTORY = { raw: [], colored: [] },
    HIST_COLOR = { unhistable: "rgb(143 73 73)", histable: "rgb(255, 142, 142)" },
    /**@type {{[key: string]: string}} */
    DOCORATION_TEXT = {
        "黒": "§0",
        "暗い青": "§1",
        "暗い緑": "§2",
        "暗い水色": "§3",
        "暗い赤": "§4",
        "暗い紫": "§5",
        "金色": "§6",
        "灰色": "§7",
        "暗い灰色": "§8",
        "青色": "§9",
        "緑色": "§a",
        "水色": "§b",
        "赤色": "§c",
        "ピンク": "§d",
        "黄色": "§e",
        "白色": "§f",

        "Mark1": "§j",
        "Mark2": "§i",
        "Mark3": "§p",
        "Mark4": "§g",
        "横線": "§h",

        "大lvl.1": "§z",
        "大lvl.2": "§y",
        "大lvl.3": "§x",
        "太字": "§l",
        "更に太字": "§L",
        "下線": "§n",
        "italic": "§o",
        "中線": "§m",
        "改行": "§v",

        "リセット": "§r",
    },
    DOCOLS = {
        "§0": "sheart1",
        "§1": "sheart2",
        "§2": "sheart3",
        "§3": "sheart4",
        "§4": "sheart5",
        "§5": "sheart6",
        "§6": "sheart7",
        "§7": "sheart8",
        "§8": "sheart9",
        "§9": "sheart10",
        "§a": "sheart11",
        "§b": "sheart12",
        "§c": "sheart13",
        "§d": "sheart14",
        "§e": "sheart15",
        "§f": "sheart16",
        "§h": "sheart99",

        "§j": "sheart100",
        "§i": "sheart101",
        "§p": "sheart102",
        "§g": "sheart103",
    },
    DOSTS = {
        "§l": "sheart17",
        "§n": "sheart18", 
        "§o": "sheart19",
        "§m": "sheart26",
    },
    DODEFS = {
        "§x": "sheart28",
        "§y": "sheart29",
        "§z": "sheart30",
        defaultcls: "sheart31",
    },
    DOFONTS = {
        "§q": "sheart36",
        "§w": "sheart37",
        "§t": "sheart38",
        "§u": "sheart39",
        defaultcls: "sheart40",
    },
    EDITORSR = {
        range: Range.prototype,
        selection: Selection.prototype,
    },
    accepted_cloudfileExtensions = [
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".avi", ".mov", ".flv"
    ],
    DURATION_BETWEEN_LAST_EDIT_AND_AUTO_SAVE = 2000,
    WRITE_PREVIEW_COOLDOWN = 250,
    _zrs = [
        0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9,
        1,
        1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5
    ],
    _zr = Number(getLocalStorage(ZOOMRATIOKEY)),
    _top = Number(getLocalStorage(TOPKEY)),
    PVSTATUS = {
        zooms: { delta: 1.1, max: 5, min: 0.4,
            ratios: _zrs, ratio: _zrs.includes(_zr) ? _zr : 1,
        },
        moves: {
            delta: 20,
            top: isNaN(_top) ? 0 : _top,
        }
    };
var username = "",
    /**@ts-ignore @type {DmapObject} */
    ARTICLEDATA = {},
    change_not_saved_remaining = false,
    /**@ts-ignore @type {NodeJS.Timeout} */
    kes = 0,
    HIST_INDEX = 0,
    STORAGESAVES,
    gglmats,
    /**@type {mapObject} */
    lastsaved,
    LOADW = 0,
    scriptlen = 16,
    lscontent = "";


try {
    STORAGESAVES = JSON.parse(getLocalStorage(EDITORCONFIGKEY) || "{}");
} catch (e){
    STORAGESAVES = {};
    delLocalStorage(EDITORCONFIGKEY)
}

for (const G of document.getElementsByTagName("script")){
    const src = G.src;
    if (src && src.includes("/src/assets/manage/editor/"))
        scriptlen++;
}

const SETTINGS = { 
    autosave: STORAGESAVES[AUTOSAVEKEY] === true ? true : true,
    autosaveNotification: STORAGESAVES[AUTOSAVENOTIFICATIONKEY] === false ? false : true,
    colorEditor: STORAGESAVES[COLOREDITORKEY] === false ? false : true,
    instapreview: STORAGESAVES[INSTAPREVIEWKEY] === true ? true : false,
    quickInputNotification: STORAGESAVES[QUICKINPUTNOTIFICATIONKEY] === false ? false : true,
    visibleSpace: STORAGESAVES[VISIBLESPACEKEY] === false ? false : true,
    visibleOnlyEndSpace: STORAGESAVES[VISIBLEONLYENDSPACEKEY] === false ? false : true,
    solidObject: STORAGESAVES[SOLIDOBJECTKEY] === false ? false : true,
    _solidObject: STORAGESAVES[_SOLIDOBJECTKEY] === false ? false : true,
};
var logout_is_peiding = false;


/**
 * 
 * @param {any} [force] 
 *     `if (this instanceof HTMLElement) denyforce();`
 */
function leaveherep(force){
    function f(){
        logout_is_peiding = false;
        delCookie(SESSIONKEY); 
        window.history.replaceState("", "", "/org/manage/login");
        window.location.assign("/org/manage/login");
    }

    logout_is_peiding = true;
    $.ajax({
        type: "POST",
        url: "/org/manage/auth/logout",
        timeout: 5000,
        data: { session: session },
        success: f,
        error: () => {
            logout_is_peiding = false;
            if (force === true && !(this instanceof HTMLElement)){
                f();
                return;
            }
            if (this instanceof HTMLElement)
                $(this)
                .text("ログアウト")
                .css("color", "black");
            PictoNotifier.notify("error", "通信エラー", { duration: 10000, do_not_keep_previous: true, deny_userclose: true });
        }
    });
}


/**
 * 
 * @param {{over?: string; under?: string;}} [messages] 
 */
function loadsProgBar(messages){
    const loadmsg = `<h4>${messages?.over || ""}</h4><div id="map_load_progress"><div id="ml_progress"></div></div><h4>${messages?.under || ""}</h4>`;

    startLoad(loadmsg);
    
    return function d(p){
        //@ts-ignore
        //document.getElementById("map_load_progress").children[0].style.width = p + "%";
        return d;
    }
}


/**
 * 
 * @param {Event} e 
 */
function preventDefault(e){
    e.preventDefault();
}


window.addEventListener("gesturestart", preventDefault, { passive: false });


window.addEventListener("dblclick", preventDefault, { passive: false });


window.addEventListener("click", function(e){
    const target = e.target;
    //@ts-ignore
    if (target.tagName.toUpperCase() === "VIDEO" && target.classList.contains("cloudfileel") && target.classList.contains("cloudsh"))
        e.preventDefault();
}, { passive: false });


window.addEventListener("DOMContentLoaded", function(){
    document.getElementById("shishiji-overview")?.addEventListener("click", preventDefault, { passive: false });
});


document.getElementById("__cover__")?.remove();


const updatestartupProgress = loadsProgBar({ over: "Welcome to Shishiji Editor" })(0);

LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
