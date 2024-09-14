//@ts-check
"use strict";


function _cloudok(data){
    /**@type {string[]} */
    const files = data.files;
    var givestr = "30万集めてアプリ内広告をなくしたいので、募金をしてくれた団体には5000円で2000MB増量いたします。5年E組までお越しください。";

    if (
        ARTICLEDATA.article.title.includes("ちぎり絵")
        || ARTICLEDATA.article.title.includes("3年")
    ) givestr = "アプリ内広告邪魔だよね！！ほんとむかつく！！";

    if (files && Popup.isPoppingup){
        Popup.popupContent(`
        <div class="protected --posa" id="ppupds">
            <h4 style="padding-top: 20px;">あなたの団体(${username})のクラウド</h4>
            <p id="--cloud-desc"></p>
            <p style="font-size: 15%;">${givestr}</p>
            <hr class="dhr-ppo" style="margin: 5px 0 10px 0;">
            <p style="margin-bottom: 5px; color: #b7b7b7;">クリックしてファイル名をコピー</p>
            <div id="orgcloud-filelist">

            </div>
            <div class="flxxt">
                <div class="ertxs">
                    <button id="uploadfb" class="ppu-decb" style="margin-top: 5px; color: black;"><h4 id="uploadfbh">アップロード</h4></button>
                    <input type="file" id="uploadfi" style="margin: 10px; margin-top: 5px;" accept="${accepted_cloudfileExtensions.join(",")}">
                </div>
                <div class="ertxs">
                    <button id="deletefb" class="ppu-decb" style="margin-top: 5px; color: black;"><h4 id="deletefbh">削除</h4></button>
                    <input type="text" id="deletefi" style="margin: 10px; margin-top: 5px;" placeholder="削除するファイル名">
                </div>
            </div>
        </div>`,
        function(){
            writeCloudonPopup(data);

            /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
            const _h = { a: 0, b: 0, };
            document.getElementById("uploadfb")?.addEventListener("click", e => {
                /**@ts-ignore @type {File} */
                var file = document.getElementById("uploadfi").files[0];

                if ($("#uploadfbh").text() != "アップロード"){
                    return;
                }

                clearTimeout(_h.a);

                if (file){
                    clearTimeout(_h.a);

                    if (getMediaType(file.name) == "unknown"){
                        $("#uploadfbh").text("ファイル形式が無効です").css("color", "red");
                        _h.a = setTimeout(() => {
                            $("#uploadfbh").text("アップロード").css("color", "black");
                        }, 3000);
                        return;
                    }

                    $("#uploadfbh").text("アップロード中...").css("color", "orange");

                    setTimeout(() => {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("session", session || "");

                        $.when(
                            $.post("/org/manage/file/overflow", { session: session, size: file.size })
                        ).done(function(overflowData){
                            const acceptable = overflowData.acceptable,
                                overflow = overflowData.overflow;
                                
                            if (acceptable){
                                $.when(
                                    $.ajax({
                                        url: "/org/manage/file/upload",
                                        type: "POST",
                                        data: formData,
                                        processData: false,
                                        contentType: false,
                                    })
                                ).done(function(uploadData){
                                    const scr = $("#shishiji-overview").scrollTop();

                                    writeCloudonPopup(uploadData);

                                    rewrite(true, true, true);
                        
                                    PictoNotifier.notify(
                                        "success",
                                        `${uploadData.uploaded} をアップロードしました`,
                                        {
                                            duration: 5000,
                                            discriminator: "file uploaded",
                                            do_not_keep_previous: true
                                        }
                                    );
                            
                                    $("#uploadfbh").text("アップロードに成功").css("color", "green");
                                    _h.a = setTimeout(() => {
                                        $("#uploadfbh").text("アップロード").css("color", "black");
                                    }, 2500);
                                    //@ts-ignore
                                    document.getElementById("uploadfi").value = "";
                                }).fail(function(err){
                                    const errjson = err.responseJSON;
        
                                    if (err.status == 413 && errjson.overflow !== void 0){
                                        sayOverflowing.call(null, errjson.overflow);
                                    } else {
                                        $("#uploadfbh").text("エラー").css("color", "red");
                                        _h.a = setTimeout(() => {
                                            $("#uploadfbh").text("アップロード").css("color", "black");
                                        }, 5000);
                                    }
                                });
                            } else {
                                sayOverflowing.call(null, overflow);
                            }
                        }).catch(function(){
                            $("#uploadfbh").text("エラー").css("color", "red");
                            _h.a = setTimeout(() => {
                                $("#uploadfbh").text("アップロード").css("color", "black");
                            }, 5000);
                        });
                        /**
                         * 
                         * @param {number} howmuch 
                         */
                        function sayOverflowing(howmuch){
                            howmuch = Math.ceil(howmuch * 10000) / 10000;
                        
                            PictoNotifier.notify(
                                "error",
                                `クラウドに ${howmuch}MB 容量が足りません`,
                                {
                                    duration: 5000,
                                    discriminator: "Cloud is overflowing!",
                                    do_not_keep_previous: true,
                                    deny_userclose: true
                                }
                            );
                    
                            $("#uploadfbh").text(`${howmuch}MB 容量が足りません`).css("color", "red");
                            _h.a = setTimeout(() => {
                                $("#uploadfbh").text("アップロード").css("color", "black");
                            }, 5000);
                        }
                    }, 500);
                } else{
                    $("#uploadfbh").text("ファイルが選択されていません").css("color", "red");
                    _h.a = setTimeout(() => {
                        $("#uploadfbh").text("アップロード").css("color", "black");
                    }, 1500);
                }
            });

            document.getElementById("deletefb")?.addEventListener("click", e => {
                /**@ts-ignore @type {Array<string>} */
                var filenames = (document.getElementById("deletefi").value || "").split(" "), _fl = filenames;

                if ($("#deletefbh").text() == "削除しています"){
                    return;
                }

                clearTimeout(_h.b);
                
                if (filenames.length == 0){
                    $("#deletefbh").text("ファイル名を入力してください").css("color", "red");
                    _h.b = setTimeout(() => {
                        $("#deletefbh").text("削除").css("color", "black");
                    }, 1500);
                    return;
                }

                const af = [];
                var really = false;
                Array.from(document.getElementsByClassName("cloudsh")).forEach(e => {
                    af.push(e.getAttribute("uname"));
                });

                filenames = filenames.filter(T => T.length > 0);
                filenames.forEach(fn => {
                    if (!af.includes(fn)){
                        const disc = "file: "+fn+" not found",
                            opt = { duration: 1000 };
                        if (!really){
                            Notifier.clearPengings();
                            Notifier.notifyHTML(disc, opt);
                            really = true;
                        } else {
                            Notifier.appendPending({
                                html: disc,
                                options: opt
                            });
                        }
                        filenames = filenames.filter(S => S !== fn);
                    }
                });
                

                if (filenames.length == 0){
                    var msg = "削除できるファイルがありません";
                    if (_fl.every(W => W.length == 0))
                        msg = "ファイル名を入力してください";
                    clearTimeout(_h.b);
                    $("#deletefbh").text(msg).css("color", "red");
                    _h.b = setTimeout(() => {
                        $("#deletefbh").text("削除").css("color", "black");
                    }, 1500);
                    return;
                }

                $("#deletefbh").text("削除しています").css("color", "orange");

                setTimeout(() => {
                    $.post("/org/manage/file/delete", { session: session, files: JSON.stringify(filenames) })
                    .done(data => {
                        writeCloudonPopup(data);

                        rewrite(true, true, true);
                        
                        /**@type {Array<string>} */
                        const deleted = data.deleted;
                        
                        for (const deld of deleted){
                            if (deld === deleted[0]){
                                var e = 1000;
                                if (deleted.length == 1)
                                    e = 3000;
                                Notifier.clearPengings();
                                PictoNotifier.notify(
                                    "success",
                                    `${deld} を削除しました`,
                                    {
                                        duration: e,
                                        discriminator: "file deleted",
                                        do_not_keep_previous: true
                                    }
                                );
                            } else {
                                PictoNotifier.notify(
                                    "success",
                                    `${deld} を削除しました`,
                                    {
                                        duration: 1000,
                                        discriminator: "file deleted",
                                        addToPending: true
                                    }
                                );
                            }
                        }

                        $("#deletefbh").text("削除に成功").css("color", "green");
                        _h.b = setTimeout(() => {
                            $("#deletefbh").text("削除").css("color", "black");
                        }, 5000);
                        //@ts-ignore
                        document.getElementById("deletefi").value = "";
                    })
                    .catch(err => {
                        $("#deletefbh").text("エラー").css("color", "red");
                        _h.b = setTimeout(() => {
                            $("#deletefbh").text("削除").css("color", "black");
                        }, 3000);
                    });
                }, 500);
            });
        }, { width: 1200, height: 1200 });
    }
}



function _cloudfail(e){
    const ctx = TEXTS[LANGUAGE].ERROR_ANY;
    
    if (e.statusText != "abort")
        PictoNotifier.notify(
            "error",
            TEXTS[LANGUAGE].NOTIFICATION_ERROR_ANY,
            {
                duration: 2500,
                discriminator: "sharePopup connection error",
                do_not_keep_previous: true, deny_userclose: true
            }
        );

    if (Popup.isPoppingup)
        Popup.showasError(ctx);
}


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
