//@ts-check
"use strict";


/**
 * 
 * @param {SETTINGS} data 
 */
function editorConfigStorage(data){
    data.solidObject = data.colorEditor || data.solidObject;
    return {
        [AUTOSAVEKEY]: data.autosave,
        [AUTOSAVENOTIFICATIONKEY]: data.autosaveNotification,
        [COLOREDITORKEY]: data.colorEditor,
        [INSTAPREVIEWKEY]: data.instapreview,
        [QUICKINPUTNOTIFICATIONKEY]: data.quickInputNotification,
        [VISIBLESPACEKEY]: data.visibleSpace,
        [VISIBLEONLYENDSPACEKEY]: data.visibleOnlyEndSpace,
        [SOLIDOBJECTKEY]: data.solidObject,
        [_SOLIDOBJECTKEY]: data._solidObject,
    };
}


function saveEditorConfig(){
    setLocalStorage(EDITORCONFIGKEY, JSON.stringify(editorConfigStorage(SETTINGS)));
}


document.getElementById("editorSettings")?.addEventListener("click", function(){
    const spacePreview = {
        half: {
            none: `<span class="sheart0">I&nbsp;love&nbsp;tomatos&nbsp;&nbsp;&nbsp;</span>`,
            visibleAllSpace: `<span class="sheart0">I·love·tomatos···</span>`.replace(/·/g, `<span class="sheart35">·</span>`),
            visibleOnlyEndSpace: `<span class="sheart0">I love tomatos···</span>`.replace(/·/g, `<span class="sheart35">·</span>`),
        },
        full: {
            none: `<span class="sheart0">あなた　好き　　</span>`,
            visibleAllSpace: `<span class="sheart0">あなた・好き・・</span>`.replace(/・/g, `<span class="sheart35">・</span>`),
            visibleOnlyEndSpace: `<span class="sheart0">あなた　好き・・</span>`.replace(/・/g, `<span class="sheart35">・</span>`),
        },
    };
    const createToggle = (id, checked) => {
        const input = document.createElement("input");
        input.id = id;
        input.className = "toggle_input";
        input.type = "checkbox";
        if (checked) input.checked = true;
        const label = document.createElement("label");
        label.htmlFor = id;
        label.className = "toggle_label";
        const div = document.createElement("div");
        div.className = "toggle_button";
        div.appendChild(input);
        div.appendChild(label);
        return div;
    };
    
    const container = document.createElement("div");
    container.className = "protected";
    container.id = "ppupds";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.flexFlow = "column";
    const title = document.createElement("h2");
    title.textContent = "エディターの設定";
    container.appendChild(title);
    const placeholder = document.createElement("p");
    placeholder.textContent = "****";
    container.appendChild(placeholder);
    const hr1 = document.createElement("hr");
    hr1.className = "dhr-ppo rsgafwad";
    container.appendChild(hr1);
    const flexContainer = document.createElement("div");
    flexContainer.className = "flxxt";
    const colorEditorDiv = document.createElement("div");
    colorEditorDiv.className = "okjoipjiok konogt";
    const colorEditorLabel = document.createElement("h4");
    colorEditorLabel.textContent = "配色";
    colorEditorDiv.appendChild(colorEditorLabel);
    colorEditorDiv.appendChild(createToggle("editorcolor_tg", SETTINGS.colorEditor));
    flexContainer.appendChild(colorEditorDiv);
    const autosaveDiv = document.createElement("div");
    autosaveDiv.className = "okjoipjiok konogt";
    const autosaveLabel = document.createElement("h4");
    autosaveLabel.textContent = "オートセーブ";
    autosaveDiv.appendChild(autosaveLabel);
    autosaveDiv.appendChild(createToggle("autosave_tg", SETTINGS.autosave));
    flexContainer.appendChild(autosaveDiv);
    const instapreviewDiv = document.createElement("div");
    instapreviewDiv.className = "okjoipjiok konogt";
    const instapreviewLabel = document.createElement("h4");
    instapreviewLabel.textContent = "即時プレビュー";
    instapreviewDiv.appendChild(instapreviewLabel);
    const note = document.createElement("t");
    note.style.fontSize = "8px";
    note.textContent = "This may take more battery!!";
    instapreviewDiv.appendChild(note);
    instapreviewDiv.appendChild(createToggle("instapreview_tg", SETTINGS.instapreview));
    flexContainer.appendChild(instapreviewDiv);
    
    container.appendChild(flexContainer);
    container.appendChild(hr1.cloneNode(true));
    
    // 通知セクション
    const notificationTitle = document.createElement("h4");
    notificationTitle.textContent = "通知";
    container.appendChild(notificationTitle);
    
    const notificationContainer = document.createElement("div");
    notificationContainer.className = "flxxt";
    
    // 自動入力
    const quickInputDiv = document.createElement("div");
    quickInputDiv.className = "okjoipjiok";
    const quickInputLabel = document.createElement("h4");
    quickInputLabel.id = "autoinput_hh";
    quickInputLabel.className = "prehh";
    quickInputLabel.textContent = "自動入力";
    quickInputDiv.appendChild(quickInputLabel);
    quickInputDiv.appendChild(createToggle("quickinputnotification_tg", SETTINGS.quickInputNotification));
    notificationContainer.appendChild(quickInputDiv);
    
    // オートセーブ通知
    const autosaveNotificationDiv = document.createElement("div");
    autosaveNotificationDiv.className = "okjoipjiok";
    const autosaveNotificationLabel = document.createElement("h4");
    autosaveNotificationLabel.id = "autosave_hh";
    autosaveNotificationLabel.className = "prehh";
    autosaveNotificationLabel.textContent = "オートセーブ";
    autosaveNotificationDiv.appendChild(autosaveNotificationLabel);
    autosaveNotificationDiv.appendChild(createToggle("autosavenotification_tg", SETTINGS.autosaveNotification));
    notificationContainer.appendChild(autosaveNotificationDiv);
    container.appendChild(notificationContainer);
    container.appendChild(hr1.cloneNode(true));
    const visibleSpaceTitle = document.createElement("h4");
    visibleSpaceTitle.textContent = "空白を視覚化";
    container.appendChild(visibleSpaceTitle);
    container.appendChild(createToggle("visiblespace_tg", SETTINGS.visibleSpace));
    const spaceDetails = document.createElement("div");
    spaceDetails.id = "jjjadios";
    spaceDetails.className = "paOojiA";
    const halfWidthSpaceDiv = document.createElement("div");
    halfWidthSpaceDiv.className = "pprajisda";
    const halfWidthSpaceLabel = document.createElement("p");
    halfWidthSpaceLabel.style.fontSize = "12px";
    halfWidthSpaceLabel.textContent = "半角スペース";
    halfWidthSpaceDiv.appendChild(halfWidthSpaceLabel);
    halfWidthSpaceDiv.appendChild(document.createElement("div")).id = "half-width-space-pre";
    halfWidthSpaceDiv.className = "code-pre";
    const endSpaceDiv = document.createElement("div");
    endSpaceDiv.className = "pprajisda";
    const endSpaceLabel = document.createElement("p");
    endSpaceLabel.style.fontSize = "12px";
    endSpaceLabel.textContent = "各行末のみ";
    endSpaceDiv.appendChild(endSpaceLabel);
    const endSpaceToggle = createToggle("visibleonlyendspace_tg", SETTINGS.visibleOnlyEndSpace);
    endSpaceToggle.style.transform = "scale(0.75)";
    endSpaceDiv.appendChild(endSpaceToggle);
    const fullWidthSpaceDiv = document.createElement("div");
    fullWidthSpaceDiv.className = "pprajisda";
    const fullWidthSpaceLabel = document.createElement("p");
    fullWidthSpaceLabel.style.fontSize = "12px";
    fullWidthSpaceLabel.textContent = "全角スペース";
    fullWidthSpaceDiv.appendChild(fullWidthSpaceLabel);
    fullWidthSpaceDiv.appendChild(document.createElement("div")).id = "full-width-space-pre";
    fullWidthSpaceDiv.className = "code-pre";
    spaceDetails.appendChild(halfWidthSpaceDiv);
    spaceDetails.appendChild(endSpaceDiv);
    spaceDetails.appendChild(fullWidthSpaceDiv);
    container.appendChild(spaceDetails);
    container.appendChild(hr1.cloneNode(true));
    const finalText = document.createElement("p");
    finalText.id = "dspp";
    finalText.style.fontSize = "12px";
    container.appendChild(finalText);
    const objectContainer = document.createElement("div");
    objectContainer.style.width = "95%";
    objectContainer.style.marginTop = "8px";
    const objectTitle = document.createElement("div");
    objectTitle.id = "ADSmdaaa";
    objectTitle.textContent = "オブジェクト";
    objectContainer.appendChild(objectTitle);
    const oodAOIj = document.createElement("div");
    oodAOIj.className = "oodAOIj";
    const createObjectDiv = (labelText, codeText) => {
        const oodaji = document.createElement("div");
        oodaji.className = "oodaji";
        const p = document.createElement("p");
        p.style.fontSize = "12px";
        p.textContent = labelText;
        const codeDiv = document.createElement("div");
        codeDiv.className = "code-pre ASOKJjmm";
        const span = document.createElement("span");
        span.className = `sheart22 ${labelText === "リンク" ? "sheart24" : ""}`;
        span.innerHTML = codeText;
        codeDiv.appendChild(span);
        oodaji.appendChild(p);
        oodaji.appendChild(codeDiv);
        return oodaji;
    };
    oodAOIj.appendChild(createObjectDiv("写真", `%:IMG-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%`));
    oodAOIj.appendChild(createObjectDiv("動画", `%:VIDEO-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%`));
    oodAOIj.appendChild(createObjectDiv("リンク", `θ:LINK-H=<span class="sheart25">{URL}</span>-T=<span class="sheart25">{text}</span>;θ`));
    objectContainer.appendChild(oodAOIj);
    container.appendChild(objectContainer);
    
    Popup.popupContent(
    `<div class="protected" id="ppupds" style="display:flex;align-items:center;justify-content:center;flex-flow:column;">
        <h2>エディターの設定</h2><p>****</p>
        <hr class="dhr-ppo rsgafwad">
        <div class="flxxt">
            <div class="okjoipjiok konogt">
                <h4>配色</h4>
                <div class="toggle_button">
                    <input id="editorcolor_tg" class="toggle_input" type="checkbox" ${SETTINGS.colorEditor ? "checked" : ""}>
                    <label for="toggle" class="toggle_label"></label>
                </div>
            </div>
            <div class="okjoipjiok konogt">
                <h4>オートセーブ</h4>
                <div class="toggle_button">
                    <input id="autosave_tg" class="toggle_input" type="checkbox" ${SETTINGS.autosave ? "checked" : ""}>
                    <label for="toggle" class="toggle_label"></label>
                </div>
            </div>
            <div class="okjoipjiok konogt">
                <h4>即時プレビュー</h4>
                <t style="font-size:8px;">This may take more battery!!</t>
                <div class="toggle_button">
                    <input id="instapreview_tg" class="toggle_input" type="checkbox" ${SETTINGS.instapreview ? "checked" : ""}>
                    <label for="toggle" class="toggle_label"></label>
                </div>
            </div>
        </div>
        <hr class="dhr-ppo rsgafwad">
        <h4>通知</h4>
        <div class="flxxt">
            <div class="okjoipjiok">
                <h4 id="autoinput_hh" class="prehh">自動入力</h4>
                <div class="toggle_button">
                    <input id="quickinputnotification_tg" class="toggle_input" type="checkbox" ${SETTINGS.quickInputNotification ? "checked" : ""}>
                    <label for="toggle" class="toggle_label"></label>
                </div>
            </div>
            <div class="okjoipjiok">
                <h4 id="autosave_hh" class="prehh">オートセーブ</h4>
                <div class="toggle_button">
                    <input id="autosavenotification_tg" class="toggle_input" type="checkbox" ${SETTINGS.autosaveNotification ? "checked" : ""}>
                    <label for="toggle" class="toggle_label"></label>
                </div>
            </div>
        </div>
        <hr class="dhr-ppo rsgafwad">
        <h4>空白を視覚化</h4>
        <div class="toggle_button">
            <input id="visiblespace_tg" class="toggle_input" type="checkbox" ${SETTINGS.visibleSpace ? "checked" : ""}>
            <label for="toggle" class="toggle_label"></label>
        </div>
        <div id="jjjadios" class="paOojiA">
            <div class="pprajisda">
                <p style="font-size:12px;">半角スペース</p>
                <div id="half-width-space-pre" class="code-pre"></div>
            </div>
            <div class="pprajisda">
                <p style="font-size:12px;">各行末のみ</p>
                <div id="dAWsdang" class="toggle_button" style="transform:scale(0.75);">
                    <input id="visibleonlyendspace_tg" class="toggle_input" type="checkbox" ${SETTINGS.visibleOnlyEndSpace ? "checked" : ""}>
                    <label for="toggle" class="toggle_label"></label>
                </div>
            </div>
            <div class="pprajisda">
                <p style="font-size:12px;">全角スペース</p>
                <div id="full-width-space-pre" class="code-pre"></div>
            </div>
        </div>
        <hr class="dhr-ppo rsgafwad">
        <!--h4>オブジェクトをブロック化</h4>
        <div class="toggle_button ${SETTINGS.colorEditor ? "brunotoggl" : ""}" id="ASDpadSS">
            <input id="solidobject_tg" class="toggle_input" type="checkbox" ${(SETTINGS.colorEditor || SETTINGS.solidObject) ? "checked" : ""}>
            <label for="toggle" class="toggle_label"></label>
        </div-->
        <p id="dspp" style="font-size:12px;"></p>
        <div style="width: 95%;margin-top:8px;">
            <div id="ADSmdaaa">
                オブジェクト
            </div>
            <div class="oodAOIj">
                <div class="oodaji">
                    <p style="font-size:12px;">写真</p>
                    <div class="code-pre ASOKJjmm">
                        <span class="sheart22">%:IMG-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%</span>
                    </div>
                </div>
                <div class="oodaji">
                    <p style="font-size:12px;">動画</p>
                    <div class="code-pre ASOKJjmm">
                        <span class="sheart22">%:VIDEO-S=<span class="sheart23">{source}</span>-W=<span class="sheart23">{width}</span>;%</span>
                    </div>
                </div>
                <div class="oodaji">
                    <p style="font-size:12px;">リンク</p>
                    <div class="code-pre ASOKJjmm">
                        <span class="sheart24">θ:LINK-H=<span class="sheart25">{URL}</span>-T=<span class="sheart25">{text}</span>;θ</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    function(){
        function save(){
            saveEditorConfig();
            setEditorcdColor();
        }

        function ospacepre(){
            const y = document.getElementById("dAWsdang");
            const z = document.getElementById("jjjadios");
            if (SETTINGS.visibleSpace){
                y?.classList.remove("brunotoggl_");
                z?.classList.remove("brunotoggl");
            } else {
                y?.classList.add("brunotoggl_");
                z?.classList.add("brunotoggl");
            }
        }

        function sspacepre(){
            const a = $("#half-width-space-pre"),
                b = $("#full-width-space-pre");
            if (SETTINGS.visibleOnlyEndSpace){
                a.html(spacePreview.half.visibleOnlyEndSpace);
                b.html(spacePreview.full.visibleOnlyEndSpace);
            } else {
                a.html(spacePreview.half.visibleAllSpace);
                b.html(spacePreview.full.visibleAllSpace);
            }
        }

        function stext(){
            const g = $("#dspp");
            if (SETTINGS.colorEditor){
                g
                .text("配色が有効の場合は常に有効になります")
                .css("color", "orange")
                .css("visibility", "visible");
            } else {
                g
                .text("ブロック内では改行が無効になります")
                .css("color", "lightgreen")
                .css("visibility", "visible");
            }
        }

        function cobjblock(){
            const r = document.getElementById("ASDpadSS");
            if (SETTINGS.colorEditor){
                r?.classList.add("brunotoggl");
            } else {
                r?.classList.remove("brunotoggl");
            }
        }

        document.getElementById("editorcolor_tg")?.addEventListener("input", function(){
            //@ts-ignore
            SETTINGS.colorEditor = (this.checked) ? true : false;
            const slo = document.getElementById("solidobject_tg");

            if (SETTINGS.colorEditor){
                //@ts-ignore
                SETTINGS.solidObject = slo.checked = true;
                slo?.dispatchEvent(new Event("input"));
            } else {
                //@ts-ignore
                slo.checked = SETTINGS.solidObject = SETTINGS._solidObject;
            }
            stext();
            cobjblock();
            save();
        });

        document.getElementById("autosave_tg")?.addEventListener("click", function(){
            //@ts-ignore
            SETTINGS.autosave = (this.checked) ? true : false;
            nextAutoSave();
            save();
        });

        document.getElementById("instapreview_tg")?.addEventListener("click", function(){
            //@ts-ignore
            SETTINGS.instapreview = (this.checked) ? true : false;
            nextAutoSave();
            save();
        });

        document.getElementById("quickinputnotification_tg")?.addEventListener("click", function(){
            //@ts-ignore
            SETTINGS.quickInputNotification = (this.checked) ? true : false;
            save();
        });

        document.getElementById("autosavenotification_tg")?.addEventListener("click", function(){
            //@ts-ignore
            SETTINGS.autosaveNotification = (this.checked) ? true : false;
            save();
        });

        document.getElementById("visiblespace_tg")?.addEventListener("input", function(){
            //@ts-ignore
            SETTINGS.visibleSpace = (this.checked) ? true : false;
            ospacepre();
            sspacepre();
            save();
        });

        document.getElementById("visibleonlyendspace_tg")?.addEventListener("click", function(){
            if (!SETTINGS.visibleSpace){
                //@ts-ignore
                this.checked = SETTINGS.visibleOnlyEndSpace;
                return;
            }
            //@ts-ignore
            SETTINGS.visibleOnlyEndSpace = (this.checked) ? true : false;
            sspacepre();
            save();
        });

        document.getElementById("solidobject_tg")?.addEventListener("input", function(e){
            if (SETTINGS.colorEditor){
                //@ts-ignore
                this.checked = SETTINGS.solidObject = true;
                return;
            }
            //@ts-ignore
            SETTINGS.solidObject = SETTINGS._solidObject = (this.checked) ? true : false;
            stext();
            save();
        });

        ospacepre();
        sspacepre();
        cobjblock();
        stext();
    }, {
        width: 600,
        height: 650
    });
});


saveEditorConfig();


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
