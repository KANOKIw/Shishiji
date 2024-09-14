//@ts-check
"use strict";


const params = new URLSearchParams(window.location.search);
const passed_orgname = params.get("psdo") || "";
const went = params.get("went") || "";


window.addEventListener("touchstart", function(e){
    //@ts-ignore
    if (e.target.classList.contains("bot-button") && !e.target.classList.contains("i-cant")){ e.target.classList.add("active"); }
});

window.addEventListener("touchend", function(e){
    Array.from(document.getElementsByClassName("active")).forEach(e => e.classList.remove("active"));
});

document.getElementById("inv_joiner_room")?.addEventListener("click", function(){
    const tm = `/?art=${passed_orgname}&storm=navigate`;
    window.location.assign(tm);
});

-async function(){
    LOGIN_DATA.sid = getCookie("__shjSID");

    try{
        await $.ajax({
            url: "/login",
            type: "POST",
            success: function(data){
                LOGIN_DATA.logined = true;
                LOGIN_DATA.discriminator = data.discriminator;
                addLoadHandler(() => PictoNotifier.notifySuccess(`${data.discriminator} としてログインしています`));
                
                const completed_org = JSON.parse(data.completed_org);
    
                LOGIN_DATA.data.completed_orgs = completed_org;
            },
            error: function(err){
                addLoadHandler(() => PictoNotifier.notifyWarn("ログインしていません！"));
            }
        });
    } catch(e){console.log("Not logined...?")}

    switch(went){
        case "unstoppable":
            await $.post("/org/data", { target: passed_orgname })
            .then(
                /** @param {import("../shishiji-dts/objects").MapObject} orgdata */
                orgdata => {
                    if (!orgdata || !LOGIN_DATA.data.completed_orgs.includes(passed_orgname)){
                        $("#msg-res").text("何事...?");
                        return;
                    }
                    const org_iconurl = toOrgFilepath(passed_orgname, orgdata.object.images.icon);

                    $("#aygsud").attr("src", org_iconurl);
                    $("#completed_org").text(orgdata.article.title);
                    $("#msg-res").text("をコンプリートしました！👏");
                }
            );
            break;
        case "hahahahaha":
            $("#msg-res").text("二回目以降はカウントできません...");
            break;
        case "whatintheworld":
            $("#msg-res").text("受付で配られたチラシに載っているQRコードを読み取ってログインしてからやり直してください！");
            break;
        case "wtfisthisbruh":
            $("#msg-res").text("この展示なに...?");
            break;
        default:
            $("#msg-res").text("何事...?");
            break;
    }
    $("#stamp-result").addClass("beauty");
}();
