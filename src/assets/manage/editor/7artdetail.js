//@ts-check
"use strict";


document.getElementById("smthElse")?.addEventListener("click", function(e){
    Popup.popupContent(`
    <div class="protected aioshud" id="ppupds" style="display:flex;align-items:center;justify-content:center;flex-flow:column;">
        <h4 style="padding-top: 5px;">テーマカラー</h4>
        <input type="color" id="theme_color_picker" value="${ARTICLEDATA.article.theme_color}">
        <hr class="dhr-ppo rsgafwad">
        <h4>フォント</h4>
        <select id="font_family_input">
            <option value="">標準</option>
            <option value="Horror">ホラー</option>
            <option value="Handwritten">手書き風</option>
            <option value="Calligraphed">筆記体</option>
        </select>
        <div style="width: 95%;margin-top:8px;">
            <div class="oodAOIj">
                <div class="oodaji">
                    <span style="font-size:12px;" class="flxxt">
                        <p>標準</p>
                        <div class="code-pre ASOKJjmm">
                            <span class="sheart40">§q</span>
                        </div>
                    </span>
                    <div id="sans-serif-pre" class="jkhafuis">
                        <span class="sheart36">あいう 亜伊卯 abc 123</span>
                    </div>
                </div>
                <div class="oodaji">
                    <span style="font-size:12px;" class="flxxt">
                        <p>ホラー</p>
                        <div class="code-pre ASOKJjmm">
                            <span class="sheart40">§w</span>
                        </div>
                    </span>
                    <div id="horror-pre" class="jkhafuis">
                        <span class="sheart37">あいう 亜伊卯 abc 123</span>
                    </div>
                </div>
                <div class="oodaji">
                    <span style="font-size:12px;" class="flxxt">
                        <p>手書き風</p>
                        <div class="code-pre ASOKJjmm">
                            <span class="sheart40">§t</span>
                        </div>
                    </span>
                    <div id="handwritten-pre" class="jkhafuis">
                        <span class="sheart38">あいう 亜伊卯 abc 123</span>
                    </div>
                </div>
                <div class="oodaji">
                    <span style="font-size:12px;" class="flxxt">
                        <p>筆記体</p>
                        <div class="code-pre ASOKJjmm">
                            <span class="sheart40">§u</span>
                        </div>
                    </span>
                    <div id="calligraphed-pre" class="jkhafuis">
                        <span class="sheart39">あいう 亜伊卯 abc 123</span>
                    </div>
                </div>
            </div>
        </div>
        <hr class="dhr-ppo rsgafwad">
        <h4>中心学年</h4>
        <select id="core_grade_input">
            <option value="...">特になし</option>
            <option value="1年生">1年生</option>
            <option value="2年生">2年生</option>
            <option value="3年生">3年生</option>
            <option value="4年生">4年生</option>
            <option value="5年生">5年生</option>
            <option value="6年生">6年生</option>
        </select>
        <hr class="dhr-ppo rsgafwad">
        <h4>ヘッダー画像; (5:2)</h4>
        <input type="text" id="header_path_input" value="${ARTICLEDATA.article.images.header}" placeholder="ファイル名">
        <hr class="dhr-ppo rsgafwad">
        <h4>アイコン画像; (1:1)</h4>
        <input type="text" id="icon_path_input" value="${ARTICLEDATA.object.images.icon}" placeholder="ファイル名">
        <hr class="dhr-ppo rsgafwad">
        <button id="save_data_else" class="ppu-decb"><h4 id="save_data_else_www">保存</h4></button>
        <h4 id="others---meg"></h4>
    </div>
    `, () => {
        const _this = document.getElementById("save_data_else_www") || document.createElement("span"),
            _save = "保存";

            
        function _k(){
            _this.remove();
            Popup.removeCloseListener(_k);
        }

        Popup.addCloseListener(_k);

        for (const op of document.querySelectorAll("option")){
            if (
                op.parentElement?.id == "font_family_input" && op.value === ARTICLEDATA.article.font_family
                || op.parentElement?.id == "core_grade_input" && op.value === ARTICLEDATA.article.core_grade
            ){
                op.selected = true;
            }
        }

        /**@ts-ignore @type {{[key: string]: NodeJS.Timeout}} */
        var _t = { a: 0, };
        document.getElementById("save_data_else")?.addEventListener("click", function(e){
            //@ts-ignore
            const color = document.getElementById("theme_color_picker")?.value || "#ffffff";
            //@ts-ignore
            const font_family = document.getElementById("font_family_input")?.value || "";
            //@ts-ignore
            const core_grade = document.getElementById("core_grade_input")?.value || "特になし";
            //@ts-ignore
            var venue = document.getElementById("venue_input")?.value || "";
            //@ts-ignore
            var header_path = document.getElementById("header_path_input")?.value.replace(" ", "") || "";
            //@ts-ignore
            var icon_path = document.getElementById("icon_path_input")?.value.replace(" ", "") || "";


            if ($(_this).text() == "保存しています")
                return;
            
            const fns = [ header_path, icon_path ];
            if (fns.some(a => a.includes("/") || (!a.includes(".") && a.length > 0))){
                clearTimeout(_t.a);
                $(_this).text("画像に誤りがあります").css("color", "red");
                _t.a = setTimeout(() => {
                    $(_this).text(_save).css("color", "black");
                }, 3000);
                return;
            }

            ARTICLEDATA.article.theme_color = color;
            ARTICLEDATA.article.font_family = font_family;
            ARTICLEDATA.article.core_grade = core_grade;
            ARTICLEDATA.article.venue = venue;
            ARTICLEDATA.article.images.header = header_path;
            ARTICLEDATA.object.images.icon = icon_path;
            
            $(_this).text("保存しています").css("color", "orange");

            setTimeout(() => {
                $.post("/org/manage/edit/saveothers", { session: session, nmap: JSON.stringify(ARTICLEDATA) })
                .done(d => {
                    lastsaved = ARTICLEDATA;
                    clearTimeout(_t.a);
                    $(_this).text("保存しました").css("color", "green");
                    rewrite(true);
                    _t.a = setTimeout(() => {
                        $(_this).text(_save).css("color", "black");
                    }, 3000);
                })  
                .catch(err => {
                    clearTimeout(_t.a);
                    $(_this).text("失敗しました").css("color", "red");
                    _t.a = setTimeout(() => {
                        $(_this).text(_save).css("color", "black");
                    }, 3000);
                });
            }, 250);
        });
    }, { 
        width: 500,
        height: 620,
        forceclosebutton: true
    });
});


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
