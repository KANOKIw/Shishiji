//@ts-check
"use strict";


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
