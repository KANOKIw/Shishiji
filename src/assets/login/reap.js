//@ts-check
"use strict";


const _whenLoginDone = [];
var _loginDone = false;
/**
 * 
 * @param {()=>any} f 
 */
function addLoginListener(f){
    if (_loginDone) f();
    else _whenLoginDone.push(f);
}


/**@type {Promise<void>} */
const LOGIN_AJAX = new Promise(async function(resolve){
    $.ajax({
        url: ajaxpath.integrity,
        type: "POST",
        /**
         * 
         * @param {import("../../server/handler/user/dts/user").UserLoginRecord} data 
         */
        success: function(data){
            _loginDone = true;
            LOGIN_DATA.logined = true;
            LOGIN_DATA.discriminator = data.discriminator;
            
            const completed_orgs = JSON.parse(data.completed_orgs);
            const profile = JSON.parse(data.profile);
            const fame_votes = JSON.parse(data.fame_votes);
            const band_votes = JSON.parse(data.band_votes);
            const dance_votes = JSON.parse(data.dance_votes);
            const misc_votes = JSON.parse(data.misc_votes);
            const favorited_orgs = JSON.parse(data.favorited_orgs);
            const claimed_rpt = JSON.parse(data.claimed_rpt);
            const custom_data = JSON.parse(data.custom_data);
            const tickets = JSON.parse(data.tickets);
    
            LOGIN_DATA.data.completed_orgs = completed_orgs;
            LOGIN_DATA.data.profile = profile;
            LOGIN_DATA.data.fame_votes = fame_votes;
            LOGIN_DATA.data.band_votes = band_votes;
            LOGIN_DATA.data.dance_votes = dance_votes;
            LOGIN_DATA.data.misc_votes = misc_votes;
            LOGIN_DATA.data.favorited_orgs = favorited_orgs;
            LOGIN_DATA.data.pt = Number(data.pt);
            LOGIN_DATA.data.claimed_rpt = claimed_rpt;
            LOGIN_DATA.data.tickets = tickets;
            LOGIN_DATA.data.custom_data = custom_data;
            LOGIN_DATA.data.isstudent = data.isstudent;
            
            $("#user-name-input").val(LOGIN_DATA.data.profile.nickname);
            $("#user-name").text(LOGIN_DATA.data.profile.nickname);
            displayUserPtExactly();
    
            LOGIN_DATA.data.profile.icon_path ? $("#user-icon, #user-icon-change")
            .css("background-image", cssURL(LOGIN_DATA.data.profile.icon_path, true)) : void 0;

            if (LOGIN_DATA.data.isstudent) $("#pkgo_menu2、#pkgo_menu1").remove();
            //if (getParam("dev") != "setagaquest") $("#pkgo_menu6").remove();
    
            PictoNotifier.notify("success", formatString(TEXTS[LANGUAGE].LOGINED, data.discriminator),
                { addToPending:true }
            );

            _whenLoginDone.forEach(f => f());
        },
        error: function(err){
            addLoadHandler(() => PictoNotifier.notify("warn", "Login Failed"));
            intoLoad("integrity", "top");
        },
        complete: function(){
            outofLoad("integrity", "top");
            FIRST_LOAD_PROPERTY.login = true;
            resolve(void 0);
        }
    });

    setTimeout(() => {
        if (!_loginDone)
            intoLoad("integrity", "top");
    }, 2500);
});


setInterval(async function(){
    ws.emit("org.data.crowdstatus", 
        /**@param {{[key: string]: number}} newstatus */
        function(newstatus){
            for (const oname in newstatus){
                if (!mapObjectComponent[oname]) continue;
                var gs = newstatus[oname];
                mapObjectComponent[oname].article.crowd_status = gs;
                setObjectCrowdStatus(oname, gs);

                if (gs == 0) gs = 1;
                $("#sstatus-disc-"+oname).removeClass("n1 n2 n3 n0").addClass("n"+gs.toString());
            }
        }
    );
}, 15*1000);
