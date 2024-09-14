//@ts-check
"use strict";


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
