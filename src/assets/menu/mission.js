//@ts-check
"use strict";


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
