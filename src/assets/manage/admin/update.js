//@ts-check
"use strict";


const spt = $.post("/admin/update/spt");


spt.then(d => {
    $("#da9iouj").val(Number(d.d));
});


Array.from(document.getElementsByClassName("yuihgoV")).forEach(function(el){
    el.addEventListener("click", function(){
        const whe = this.getAttribute("path");

        intoLoad("upd-"+whe, "middle");
        $.post("/admin/update/"+whe)
        .then(() => {
            PictoNotifier.notifySuccess("SUCCESS - "+whe, { do_not_keep_previous:true });
        })
        .catch(() => {
            PictoNotifier.notifyError("ERROR - "+whe, { do_not_keep_previous:true });
        })
        .always(() => outofLoad("upd-"+whe, "middle"));
    });
});


Array.from(document.getElementsByClassName("yuihgoYTV")).forEach(function(el){
    el.addEventListener("click", function(){
        const whe = this.getAttribute("path");
        const key = this.getAttribute("key");
        const val = Number(this.parentNode.querySelector("input").value);

        intoLoad("upd-"+whe, "middle");
        $.post("/admin/update/"+whe, {
            [key]: val
        })
        .then(() => {
            PictoNotifier.notifySuccess("SUCCESS - "+whe, { do_not_keep_previous:true });
        })
        .catch(() => {
            PictoNotifier.notifyError("ERROR - "+whe, { do_not_keep_previous:true });
        })
        .always(() => outofLoad("upd-"+whe, "middle"));
    });
});


Array.from(document.getElementsByClassName("uyggt")).forEach(function(el){
    el.addEventListener("click", function(){
        const whe = this.getAttribute("path");
        const sql = this.parentNode.parentNode.querySelector("textarea").value;

        intoLoad("sql-"+whe, "middle");
        $.post("/admin/sql/"+whe, {
            sql: sql
        })
        .then(() => {
            PictoNotifier.notifySuccess("SUCCESS - "+whe, { do_not_keep_previous:true });
        })
        .catch(e => {
            Popup.popupContent(`
                <div class="protected flxxt" id="ppupds">
                    <span>${JSON.stringify(//@ts-ignore
                        e.responseText, null, 4)}</span>
                </div>
            `);
            PictoNotifier.notifyError("ERROR - "+whe, { do_not_keep_previous:true });
        })
        .always(() => outofLoad("sql-"+whe, "middle"));
    });
});


document.getElementById("runacdbsql")?.addEventListener("input", function(e){
    //@ts-ignore
    localStorage.setItem("__acdb-sql", this.value);
});


//@ts-ignore
document.getElementById("runacdbsql").value = localStorage.getItem("__acdb-sql") || "";


document.getElementById("afsiuhoiw")?.addEventListener("click", function(){
    window.location.href = "/admin/login";
});

