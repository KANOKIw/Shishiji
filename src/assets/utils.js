//@ts-check
"use strict";


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
