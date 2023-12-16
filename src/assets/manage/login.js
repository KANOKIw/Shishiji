//@ts-nocheck


!function(){
    "use strict";
    
    const msgfield = document.getElementById("required-not-filled");

    document.getElementById("login_enter")?.addEventListener("click", async function(e){
        const username = document.getElementById("login_username")?.value;
        const password = document.getElementById("login_password")?.value;

        if (!username || !password){
            msgfield.style.display = "block";
            msgfield.textContent = "入力されていない箇所があります";
            return;
        }

        fetch("/org/manage/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password }),
        })
        .then(r => {
            return r.json();
        })
        .then(data => {
            const error = data.error;
            
            switch (error){
                case void 0:
                    break;
                default:
                    msgfield.style.display = "block";
                    msgfield.textContent = error;
                    return;
            }

            window.location.href = "/org/manage/edit";
        });
    });

    const _session = getCookie("__ogauthk");

    if (_session){
        fetch("/org/manage/auth/_login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session: _session }),
        })
        .then(r => {
            return r.json();
        })
        .then(data => {
            if (data.permitted){
                window.location.href = "/org/manage/edit";
            }
        })
        .catch(err => {

        });
    }


    document.getElementById("login_username").addEventListener("keydown", function(e){
        if (e.key.toUpperCase() == "ENTER"){
            document.getElementById("login_password").focus();
        }
    });

    document.getElementById("login_password").addEventListener("keydown", function(e){
        if (e.key.toUpperCase() == "ENTER"){
            document.getElementById("login_enter").dispatchEvent(new Event("click"));
        }
    });

    return 0;
}();
