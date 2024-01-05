//@ts-check
"use strict";


function _cloudok(data){
    /**@type {string[]} */
    const files = data.files;
    
    if (files && Popup.isPoppingup){
        Popup.popupContent(`
        <div class="protected --posa" id="ppupds">
            <h4 style="padding-top: 20px;">あなたの団体(${username})のクラウド</h4>
            <p id="--cloud-desc"></p>
            <p style="font-size: 50%;">課金で増えます</p>
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
                    <input type="text" id="deletefi" style="margin: 10px; margin-top: 5px;" placeholder="ファイル名">
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
                        var formData = new FormData();
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
                                    writeCloudonPopup(uploadData);
                        
                                    PictoNotifier.notifySuccess(
                                        `${uploadData.uploaded} をアップロードしました`,
                                        5000,
                                        "file uploaded",
                                        { do_not_keep: true },
                                    );
                            
                                    $("#uploadfbh").text("アップロードに成功").css("color", "green");
                                    _h.a = setTimeout(() => {
                                        $("#uploadfbh").text("アップロード").css("color", "black");
                                    }, 5000);
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
                        
                            PictoNotifier.notifyError(
                                `クラウドに ${howmuch}MB 容量が足りません`,
                                5000,
                                "Cloud is overflowing!",
                                { do_not_keep: true, deny_userclose: true },
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
                /**@ts-ignore @type {string | null} */
                const filename = document.getElementById("deletefi").value.replace(/ /g, "");

                if ($("#deletefbh").text() == "削除しています"){
                    return;
                }

                clearTimeout(_h.b);

                if (!filename){
                    $("#deletefbh").text("ファイル名を入力してください").css("color", "red");
                    _h.b = setTimeout(() => {
                        $("#deletefbh").text("削除").css("color", "black");
                    }, 1500);
                    return;
                }

                var exists = false;
                Array.from(document.getElementsByClassName("cloudsh")).forEach(e => {
                    if (e.getAttribute("uname") == filename)
                        exists = true;
                });

                if (!exists){
                    clearTimeout(_h.b);
                    $("#deletefbh").text("ファイルが見つかりません").css("color", "red");
                    _h.b = setTimeout(() => {
                        $("#deletefbh").text("削除").css("color", "black");
                    }, 1500);
                    return;
                }

                $("#deletefbh").text("削除しています").css("color", "orange");

                setTimeout(() => {
                    $.post("/org/manage/file/delete", { session: session, filename: filename })
                    .done(data => {
                        writeCloudonPopup(data);
                        
                        PictoNotifier.notifySuccess(
                            `${data.deleted} を削除しました`,
                            5000,
                            "file deleted", 
                            { do_not_keep: true },
                        );

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
        }, { width: 1200, height: 800 });
    }
}


function _cloudfail(){
    const ctx = TEXT[LANGUAGE].ERROR_ANY;
    
    PictoNotifier.notifyError(
        TEXT[LANGUAGE].NOTIFICATION_ERROR_ANY,
        2500,
        "sharePopup connection error",
        { do_not_keep: true, deny_userclose: true },
    );

    if (Popup.isPoppingup)
        Popup.showasError(ctx);
}
