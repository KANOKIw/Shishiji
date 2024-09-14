//@ts-check
"use strict";


const g = $.post(ajaxpath.alldel);
var _b = 0;
var _d = 0;


g.then(d => {
    $("#band_delayer").val(d.b);
    $("#dance_delayer").val(d.d);
    _b = Number(d.b);
    _d = Number(d.d);
});


/**
 * 
 * @param {"band" | "dance"} type 
 * @param {number} delay 
 */
function send_(type, delay){
    intoLoad("setter", "middle");
    $.post("/admin/setter/schedule", {
        delay: delay,
        type: type
    })
    .then(() => {
        switch(type){
			case "band":
				_b = delay;
				break;
			case "dance":
				_d = delay;
				break;
		}
        PictoNotifier.notifySuccess("Success!!");
    })
    .catch(() => {
        PictoNotifier.notifySuccess("Error: try reloading");
    })
    .always(() => intoLoad("setter", "middle"));
}


document.getElementById("asiu9W")?.addEventListener("click", function(){
    //@ts-ignore
    const delay = $("#band_delayer").val();

    if (_b == delay){
        PictoNotifier.notifyError("Same", { do_not_keep_previous: true });
        return;
    }

    if (Number.isNaN(delay)){
        PictoNotifier.notifyError("Error", { do_not_keep_previous: true });
        return;
    }

    //@ts-ignore
    send_("band", delay);
});


document.getElementById("asiu9WAMv")?.addEventListener("click", function(){
    //@ts-ignore
    const delay = $("#dance_delayer").val();

    if (_d == delay){
        PictoNotifier.notifyError("Same", { do_not_keep_previous: true });
        return;
    }

    if (Number.isNaN(delay)){
        PictoNotifier.notifyError("Error", { do_not_keep_previous: true });
        return;
    }

    //@ts-ignore
    send_("dance", delay);
});


document.getElementById("afsiuhoiw")?.addEventListener("click", function(){
    window.location.href = "/admin/login";
});
