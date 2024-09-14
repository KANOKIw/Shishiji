//@ts-check
"use strict";


/**@type {NodeJS.Timeout} */
var update_timeout;


+async function(){
    $.post("/org/manage/auth/editor", { session: getCookie(SESSIONKEY), type: "Status" })
    .then(async editorData => {
        PictoNotifier.notifySuccess("Logined as "+editorData.usn);
        $("#myorgnamew").text(editorData.artdata.article.title);
        $("#aiuWagv").css("display", "flex");

        /**
         * @type {{
         *      visitpt: number;
         *      entered_total: number;
         *      entered_groups: number;
         *      entered_data: string;
         *      duped_entered_total: number;
         *      duped_entered_groups: number;
         *      duped_entered_data: string;
         *      objdata: import("../shishiji-dts/objects").MapObject;
         * }}
         */
        const mydata = await $.post("/org/manage/status/data");
        const objdata = mydata.objdata;

        $("#entered_total").text(mydata.entered_total.toString());
        $("#entered_groups").text(mydata.entered_groups.toString());
        $("#duped_entered_total").text(mydata.duped_entered_total.toString());
        $("#duped_entered_groups").text(mydata.duped_entered_groups.toString());
        $("#visitpt").text(mydata.visitpt.toString()+"pt");

        $("#oa"+objdata.article.crowd_status.toString()).attr("selected", "true");

        document.getElementById("updatecrowd")?.addEventListener("click", async function(){
            const g = $("#crowdstatusselect").val();

            clearTimeout(update_timeout);
            update_timeout = setTimeout(async () => {
                try{
                    const res = await $.post("/org/manage/edit/crowd", { prog: g });
                    PictoNotifier.notifySuccess("更新しました", { do_not_keep_previous: true });
                } catch(e){
                    PictoNotifier.notifyError(String(e));
                }
            }, 500);
        });
    });
}();


document.getElementById("afsiuhoiw")?.addEventListener("click", function(){
    window.location.href = "/org/manage/menu";
});


/**@ts-ignore @type {Socket} */
const ws = io.connect(void 0, {
    withCredentials: true
});


ws.on("org.status.update", updatedata => {
    if (!updatedata.pt){
        $("#entered_total").text(updatedata.entered_total);
        $("#entered_groups").text(updatedata.entered_groups);
        $("#duped_entered_total").text(updatedata.duped_entered_total);
        $("#duped_entered_groups").text(updatedata.duped_entered_groups);
    } else {
        $("#visitpt").text(`${updatedata.pt}pt`);
    }
});
