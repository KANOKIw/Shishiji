//@ts-check
"use strict";


setInterval(() => {
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

$("#app-mount").show();

$.ajaxSetup({ async: false });
$.post("/org/manage/auth/editor", { session: session, type: "Editor" })
.done(data => {
    const error = data.error;

    username = data.usn;
    
    if (error)
        leaveherep();

    ARTICLEDATA = lastsaved = data.artdata;
    lscontent = ARTICLEDATA.article.content;
    orgCloudfi.maxsize = data.mxcs;
})
.catch(leaveherep);
$.ajaxSetup({ async: true });


if (!ARTICLEDATA || Object.keys(ARTICLEDATA).length < 1){
    ARTICLEDATA = lastsaved = {
        article: {
            title: "orgname",
            subtitle: "",
            core_grade: "...",
            theme_color: "#000000",
            content: "",
            crowd_status: 0,
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
            floor: "2F",
        },
        discriminator: ""
    };
};

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


var doing = false;
var remaining = false;
function nextWrite(){
    if (doing){
        remaining = true;
    } else {
        doing = true;
        setTimeout(() => {
            write();
            doing = false;
            if (remaining){
                remaining = false;
                nextWrite();
            }
        }, WRITE_PREVIEW_COOLDOWN);
    }
}


function write(){
    const scr = $("#shishiji-overview").scrollTop();
    writePreviewerOverview(ARTICLEDATA, false, scr, void 0, true, true, void 0, true);
}


document.getElementById("main-editor")?.addEventListener("input", function(e){
    const me = $("#main-editor");

    // Illegal TAB
    if (me.text().includes("	")){
        me
        .html(
            replaceTab($("#main-editor").html()).replace(/ /g, "&nbsp;")
        )
        .trigger("blur");
    }

    change_not_saved_remaining = true;
    $("#sv_msg").text("");
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
    if (SETTINGS.instapreview)
        write();
    else
        nextWrite();

    if (!allowNsave())
        change_not_saved_remaining = false;
    nextAutoSave();
});


document.getElementById("main-editor")?.addEventListener("keydown", function(ke){
    const key = ke.key.toUpperCase();
    if (key === "TAB"){
        ke.preventDefault();
        // Indent Using Spaces: 4
        insertText("    ");
    }
}, { passive: false });


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
