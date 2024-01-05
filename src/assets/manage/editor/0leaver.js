//@ts-check
"use strict";


/**
 * @typedef {import("../../shishiji-dts/objects").mapObject} DmapObject
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
    ];
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
    lastsaved;


try {
    STORAGESAVES = JSON.parse(getLocalStorage(EDITORCONFIGKEY) || "{}");
} catch (e){
    STORAGESAVES = {};
    delLocalStorage(EDITORCONFIGKEY)
}

const SETTINGS = { 
    autosave: STORAGESAVES[AUTOSAVEKEY] === true ? true : false,
    autosaveNotification: STORAGESAVES[AUTOSAVENOTIFICATIONKEY] === false ? false : true,
    colorEditor: STORAGESAVES[COLOREDITORKEY] === false ? false : true,
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
        window.location.reload();
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
            PictoNotifier.notifyError("通信エラー", 10000, "failed to logout", { do_not_keep: true, deny_userclose: true });
        }
    });
}
