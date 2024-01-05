//@ts-check
"use strict";


window.addEventListener("load", function(e){
    this.setInterval(() => {
        var sel = window.getSelection();
        //@ts-ignore
        if (!sel || (sel.anchorNode?.parentElement?.id != "main-editor" && sel.anchorNode?.id != "main-editor"))
            return;
        try {
            var rag = sel.getRangeAt(0);
            EDITORSR.selection = sel;
            EDITORSR.range = rag;
        } catch(e){}
    }, 1);

    startLoad("読み込み中");
    $("#app-mount").show();
    
    $.ajaxSetup({ async: false });
    $.post("/org/manage/auth/editor", { session: session })
    .done(data => {
        const error = data.error;

        username = data.usn;
        
        if (error)
            leaveherep();

        ARTICLEDATA = lastsaved = data.artdata;
        orgCloudfi.maxsize = data.mxcs;
    })
    .catch(leaveherep);
    $.ajaxSetup({ async: true });


    if (!ARTICLEDATA || Object.keys(ARTICLEDATA).length < 1){
        ARTICLEDATA = lastsaved = {
            article: {
                title: "orgname",
                core_grade: "...",
                theme_color: "#000000",
                content: "",
                crowd_status: {
                    level: 0,
                    estimated: 0,
                },
                font_family: null,
                custom_tr: [],
                images: {
                    header: "",
                },
                venue: "",
                schedule: "",
            },
            object: {
                type: {
                    event: "org",
                    behavior: "dynamic"
                },
                coordinate: {
                    x: 0,
                    y: 0
                },
                images: {
                    icon: "",
                },
                size: {
                    width: 50,
                    height: 50
                },
                floor: "F2",
            },
            discriminator: ""
        };
    };

    this.setTimeout(() => {
        endLoad("ようこそ");
    }, 500);

    $("#username-d").text(username);
    $("#main-editor").html(tranparentedXtext(escapeHTML(ARTICLEDATA.article.content)));
    setEditorcdColor();
    $("#ctx-title").text(ARTICLEDATA.article.title || "NAME");


    Array.from(document.getElementsByClassName("motd-dec-b")).forEach((l) => {
        l.addEventListener("click", function(e){
            e.preventDefault();
            const color = this.textContent?.replace(/ /g, "").replace(/\n/g, "");
            if (color == void 0)
                return;
            const decorator = DOCORATION_TEXT[color] || "§k";

            insertText(decorator);
        }, { passive: false });
    });


    this.document.getElementById("main-editor")?.addEventListener("input", function(ev){
        const scr = $("#shishiji-overview").scrollTop();

        // Illegal TAB
        if ($("#main-editor").text().includes("	")){
            $("#main-editor").html(
                replaceTab($("#main-editor").html()).replace(/ /g, "&nbsp;")
            );
        }

        change_not_saved_remaining = true;
        $("#sv_msg").text("");
        allowNsave();
        setEditorcdColor();
        
        const _ihtml = document.getElementById("main-editor")?.innerHTML;

        if (HIST_INDEX < EDITOR_HISTORY.raw.length-1){
            EDITOR_HISTORY.raw.splice(HIST_INDEX+1);
        }
        if (_ihtml && EDITOR_HISTORY.raw.slice(-1)[0] !== _ihtml)
            EDITOR_HISTORY.raw.push(_ihtml);
        HIST_INDEX = EDITOR_HISTORY.raw.length - 1;
        colhistbtn();
        
        ARTICLEDATA.article.content = parseXtext(this.innerHTML);
        writeArticleOverview(ARTICLEDATA, false, scr, void 0, true, true);

        nextAutoSave();
    });


    this.document.getElementById("main-editor")?.addEventListener("keydown", function(ke){
        const key = ke.key.toUpperCase();
        if (key === "TAB"){
            ke.preventDefault();
            // Indent Using Spaces: 4
            insertText("    ");
        }
    });
});
