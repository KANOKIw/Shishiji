//@ts-check
"use strict";


document.getElementById("login_enter")?.addEventListener("click", function(){
    const actype = $("#adWWv").val();
    const pw = $("#login_password").val();

    $.post("/admin/e/login", {
        actype: actype,
        password: pw
    })
    .then(r => {
        window.location.href = "/admin/"+actype;
    })
    .catch(e => {
        PictoNotifier.notifyError("Error");
    });
});


document.getElementById("login_password")?.addEventListener("keydown", function(e){
    if (e.key.toUpperCase() == "ENTER"){
        e.preventDefault();
        document.getElementById("login_enter")?.dispatchEvent(new WheelEvent("click"));
    }
});
