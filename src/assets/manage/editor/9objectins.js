//@ts-check
"use strict";


document.getElementById("addImageb")?.addEventListener("click", e => {
    Popup.popupContent(`
    <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
        <h2 style="padding-top: 30px;">写真を挿入</h2>
        <h4 id="__caut_imad"></h4>
        <hr class="dhr-ppo">
        <h4>ファイル名</h4>
        <input id="addImg_path_" type="text" style="margin-bottom: 20px;" placeholder="ファイル名"></input>
        <h4>写真の幅(画面の横幅に対する %)</h4>
        <input id="addImg_width_" type="text" placeholder="0 ~ 100" value="100"></input>
        <hr class="dhr-ppo">
        <button id="insertImgb" class="ppu-decb"><h4>追加</h4></button>
        <h4 id="others---meg"></h4>
    </div>
    `, function(){
        /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
        var _t = { a: 0, };
        var tm = 0;
        document.getElementById("insertImgb")?.addEventListener("click", function(){
            //@ts-ignore
            var path = replaceTab(document.getElementById("addImg_path_")?.value.replace(" ", "")) || "";
            //@ts-ignore
            var width = document.getElementById("addImg_width_")?.value.replace(" ", "") || "";

            /**@param {string} msg  */
            function notifyMSG(msg){
                clearTimeout(_t.a);
                $("#others---meg").text(msg).css("color", "red");
                _t.a = setTimeout(() => {
                    $("#others---meg").text("");
                }, 3000);
            }

            if (path.length < 1 || width.length < 1){
                $("#__caut_imad").text("埋めていない箇所があります").css("color", "red");
                return;
            }

            width = Number(width);
            
            if (isNaN(width) || width > 100 || width < 0){
                notifyMSG("幅に誤りがあります( 0 < 幅 < 100 )");
                return;
            }

            $("#__caut_imad").text("");
            const imgFormat = `∫:IMG-S=${path}-W=${width};∫`;
            
            Popup.disPop();

            insertText(imgFormat);
        });
    }, {
        height: 375
    });
});


document.getElementById("addVideob")?.addEventListener("click", e => {
    Popup.popupContent(`
    <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
        <h2 style="padding-top: 30px;">動画を挿入</h2>
        <h4 id="__caut_imad"></h4>
        <hr class="dhr-ppo">
        <h4>ファイル名</h4>
        <input id="addImg_path_" type="text" style="margin-bottom: 20px;" placeholder="ファイル名"></input>
        <h4>動画の幅(画面の横幅に対する %)</h4>
        <input id="addImg_width_" type="text" placeholder="0 ~ 100" value="100"></input>
        <hr class="dhr-ppo">
        <button id="insertImgb" class="ppu-decb"><h4>追加</h4></button>
        <h4 id="others---meg"></h4>
    </div>
    `, function(){
        /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
        var _t = { a: 0, };
        document.getElementById("insertImgb")?.addEventListener("click", function(){
            //@ts-ignore
            var path = replaceTab(document.getElementById("addImg_path_")?.value.replace(" ", "")) || "";
            //@ts-ignore
            var width = document.getElementById("addImg_width_")?.value.replace(" ", "") || "";

            /**@param {string} msg  */
            function notifyMSG(msg){
                clearTimeout(_t.a);
                $("#others---meg").text(msg).css("color", "red");
                _t.a = setTimeout(() => {
                    $("#others---meg").text("");
                }, 3000);
            }

            if (path.length < 1 || width.length < 1){
                $("#__caut_imad").text("埋めていない箇所があります").css("color", "red");
                return;
            }

            width = Number(width);
            if (isNaN(width) || width > 100 || width < 0){
                notifyMSG("幅に誤りがあります( 0 < 幅 < 100 )");
                return;
            }

            $("#__caut_imad").text("");
            const videoFormat = `∫:VIDEO-S=${path}-W=${width};∫`;
            
            Popup.disPop();

            insertText(videoFormat);
        });
    }, {
        height: 375
    });
});


document.getElementById("addLinkb")?.addEventListener("click", e => {
    Popup.popupContent(`
    <div class="protected" id="ppupds" style="display: flex; align-items: center; flex-flow: column;">
        <h2 style="padding-top: 30px;">リンクを挿入</h2>
        <h4 id="__caut_imad"></h4>
        <hr class="dhr-ppo">
        <h4>URL</h4>
        <input id="addLink_url_" type="text" style="margin-bottom: 20px;" placeholder="https?://"></input>
        <h4>テキスト</h4>
        <input id="addLink_text_" type="text" style="margin-bottom: 20px;" placeholder="任意"></input>
        <hr class="dhr-ppo">
        <button id="insertLinkb" class="ppu-decb"><h4>追加</h4></button>
        <h4 id="others---meg"></h4>
    </div>
    `, function(){
        /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
        var _g = { a: 0, };
        const up = /^https?:\/\/(?:(?!-T=).)+$/;
        document.getElementById("insertLinkb")?.addEventListener("click", function(){
            //@ts-ignore
            var url = replaceTab(document.getElementById("addLink_url_")?.value.replace(/ /g, "").replace(/θ/g, "%CE%B8")) || "";
            //@ts-ignore
            var text = replaceTab(document.getElementById("addLink_text_")?.value) || "";

            /**@param {string} msg  */
            function notifyMSG(msg){
                clearTimeout(_g.a);
                $("#others---meg").text(msg).css("color", "red");
                _g.a = setTimeout(() => {
                    $("#others---meg").text("");
                }, 3000);
            }

            if (url.length < 1){
                $("#__caut_imad").text("URLを入力してください").css("color", "red");
                return;
            }

            if (!up.test(url)){
                $("#__caut_imad").text("無効なURLです").css("color", "red");
                return;
            }

            $("#__caut_imad").text("");
            const linkFormat = `#:LINK-H=${url}-T=${text};#`;
            
            Popup.disPop();

            insertText(linkFormat);
        });
    }, {
        height: 400
    });
});


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
