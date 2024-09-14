//@ts-check
"use strict";


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
