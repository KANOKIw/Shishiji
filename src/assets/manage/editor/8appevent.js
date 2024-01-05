//@ts-check
"use strict";


window.addEventListener("load", function(){
    document.getElementById("logout__")?.addEventListener("click", () => {
        Popup.popupContent(`
        <div class="protected aioshud" id="ppupds" style="display: flex; align-items: center; justify-content: center;">
            <span style="display: flex; align-items: center; flex-direction: column;">
                <h2>ログアウトしますか？</h2>
                <p id="--logout-adjustmsg"></p>
                <span style="height: 20px;"></span>
                <button id="--yesilogout" style="color:${logout_is_peiding ? "orange" : "black"}">${logout_is_peiding ? "ログアウト中" : "ログアウト"}</button>
            </span>
        </div>`,
        function(){
            if (change_not_saved_remaining){
                $("#--logout-adjustmsg")
                .text("保存していない変更があります")
                .css("margin-top", "10px")
                .css("color", "red");
            }
            document.getElementById("--yesilogout")?.addEventListener("click", function(){
                if (logout_is_peiding){ 
                    PictoNotifier.notifyError("Already logging out");
                    return;
                }
                $(this)
                .text("ログアウト中")
                .css("color", "purple");
                setTimeout(() => {
                    leaveherep.call(this);
                }, 5);
            });
        }, {
            width: 400, height: 300
        });
    });


    this.document.getElementById("save_data_norm")?.addEventListener("click", function(){
        saveMainEditorctx.apply(this);
    });


    this.document.getElementById("__undo_-")?.addEventListener("click", function(){
        if (HIST_INDEX <= 0)
            return;
        HIST_INDEX--;
        $("#main-editor").html(EDITOR_HISTORY.raw[HIST_INDEX]);
        rewrite(false, true);
        allowNsave();
        nextAutoSave();
    });


    this.document.getElementById("__redo_-")?.addEventListener("click", function(){
        if (HIST_INDEX >= EDITOR_HISTORY.raw.length-1)
            return;
        HIST_INDEX++;
        $("#main-editor").html(EDITOR_HISTORY.raw[HIST_INDEX]);
        rewrite(false, true);
        allowNsave();
        nextAutoSave();
    });


    window.addEventListener("resize", function(e){
        //@ts-ignore
        const xpre_height = document.getElementById("editsplitter").clientHeight;
        //@ts-ignore
        const xpre_width = document.getElementById("--ppo").clientWidth;

        const iphone_12_pro_max = {
            height: xpre_height*0.8,
            width: (xpre_height*0.8)*0.46,
        }

        if (iphone_12_pro_max.width > xpre_width-20){
            iphone_12_pro_max.width = xpre_width-20;
            iphone_12_pro_max.height = iphone_12_pro_max.width*2.16;
        }

        $("#article-preview").css("transform", "scale("+iphone_12_pro_max.width/430+")");
    });


    window.dispatchEvent(new Event("resize"));
    setInterval(() => {
        window.dispatchEvent(new Event("resize"));
    }, 500);


    window.addEventListener("keydown", function(e){
        const KEY = e.key.toUpperCase();

        if (e.ctrlKey || e.metaKey){
            switch (KEY){
                case "S":
                    e.preventDefault();
                    if (!isSavable())
                        return;
                    clearTimeout(kes);
                    PictoNotifier.notifySave_("保存しています...", 30000, void 0, { deny_userclose: true });
                    saveMainEditorctx.call(document.getElementById("save_data_norm"), void 0, () => {
                        PictoNotifier.notifySave_("保存しました", 3000);
                    }, () => {
                        PictoNotifier.notifyError("保存に失敗しました", 3000);
                    });
                    break;
                case "Z":
                    e.preventDefault();
                    $("#__undo_-").trigger("click");
                    rewrite(false, true);
                    break;
                case "Y":
                    e.preventDefault();
                    $("#__redo_-").trigger("click");
                    rewrite(false, true);
                    break;
            }
        }
    }, { passive: false });


    $("#--art-header").on("error", function(){ imageError.call(this, "h"); }).attr("src", "");
    $("#--art-icon").on("error", function(){ imageError.call(this, "i"); }).attr("src", "");

    rewrite(true);
});
