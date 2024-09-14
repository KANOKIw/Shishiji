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
