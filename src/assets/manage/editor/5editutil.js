//@ts-check
"use strict";


/**
 * @returns {boolean}
 */
function isSavable(){
    function _(){
        if ($(this).css("background-color") == "rgb(247, 255, 142)")
            return true;
        else
            return false;
    }
    return _.call(document.getElementById("save_data_norm"));
}


/**
 * @this {HTMLElement}
 * @param {boolean} [do_not_showmessage] 
 * @param {() => void} [donecallback] 
 * @param {() => void} [errorcallback] 
 */
function saveMainEditorctx(do_not_showmessage, donecallback, errorcallback){
    if (!isSavable())
        return;

    $("#sv_msg").text("保存しています...").css("color", "orange");
    $("#save_data_norm")
    .css("background-color", "rgb(144 149 81)")
    .css("background-color", "rgb(144 149 81)");

    setTimeout(() => {
        $.post("/org/manage/edit/savemain", { session: session, nmap: JSON.stringify(ARTICLEDATA) })
        .done(d => {
            change_not_saved_remaining = false;
            lastsaved = ARTICLEDATA;
            lscontent = ARTICLEDATA.article.content;

            clearTimeout(_t.a);

            if (!do_not_showmessage){
                $("#sv_msg").text("保存しました").css("color", "green");
                _t.a = setTimeout(() => {
                    $("#sv_msg").text("");
                }, 3000);
            }
            $("#save_data_norm")
            .css({
                "background-color": "rgb(144 149 81)",
                "cursor": "not-allowed",
            });

            rewrite(false, true);
            if (donecallback)
                donecallback();
        })  
        .catch(err => {
            clearTimeout(_t.a);
            allowNsave();
            $("#sv_msg").text("失敗しました").css("color", "red");
            _t.a = setTimeout(() => {
                $("#sv_msg").text("");
            }, 3000);

            if (errorcallback)
                errorcallback();
        });
    }, 250);
}


function setLineN(){
    const brs = $("#main-editor").html().matchAll(/<br>/g);
    const bns = $("#main-editor").html().matchAll(/\n/g);
    
    $("#main-editor-linen").html("");
    var i = 1;
    for (const r of brs){
        $("#main-editor-linen").append(i+"<br>");
        i++;
    }
    for (const n of bns){
        $("#main-editor-linen").append(i+"<br>");
        i++;
    }
}


function nextAutoSave(){
    clearTimeout(kes);
    if (SETTINGS.autosave){
        kes = setTimeout(() => {
            if (!isSavable())
                return;
            PictoNotifier.notifySave("オートセーブ中...", { duration: 30000 });
            saveMainEditorctx.apply(document.getElementById("save_data_norm"), [true, () => {
                $("#sv_msg").text("オートセーブ完了").css("color", "green");
                if (SETTINGS.autosaveNotification)
                    PictoNotifier.notify("save", "オートセーブ完了");
            }, () => {
                allowNsave();
                $("#sv_msg").text("オートセーブ失敗").css("color", "red");
                PictoNotifier.notify("error", "オートセーブに失敗");
            }]);
        }, DURATION_BETWEEN_LAST_EDIT_AND_AUTO_SAVE);
    }
}


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
