//@ts-check
"use strict";


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
