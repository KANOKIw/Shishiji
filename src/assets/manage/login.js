//@ts-nocheck


!function(){
    "use strict";
    const msgfield = document.getElementById("required-not-filled");

    var msgt = 0;

    document.cookie = "__ogauthk=; max-age=0; path=/org/manage";
    
    document.getElementById("login_enter")?.addEventListener("click", async function(e){
        const username = document.getElementById("login_username")?.value;
        const password = document.getElementById("login_password")?.value;

        if (!username || !password){
            clearTimeout(msgt);
            msgfield.style.display = "block";
            msgfield.textContent = "入力されていない箇所があります";
            msgt = setTimeout(() => {
                msgfield.style.display = "none";
                msgfield.textContent = "";
            }, 5000);
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
            console.log(data)
            const error = data.error;
            
            switch (error){
                case void 0:
                    break;
                default:
                    clearTimeout(msgt);
                    msgfield.style.display = "block";
                    msgfield.textContent = error;
                    msgt = setTimeout(() => {
                        msgfield.style.display = "none";
                        msgfield.textContent = "";
                    }, 5000);
                    return;
            }

            window.location.href = "/org/manage/menu";
        });
    });

    const _session = getCookie(SESSIONKEY);

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
                window.location.href = "/org/manage/menu";
            }
        })
        .catch(err => {
            document.cookie = "__ogauthk=; max-age=0; path=/";
        });
    }


    document.getElementById("login_username").addEventListener("keydown", function(e){
        if (e.key?.toUpperCase() == "ENTER" && this.value.length > 0){
            document.getElementById("login_password").focus();
        }
    });

    document.getElementById("login_password").addEventListener("keydown", function(e){
        if (e.key?.toUpperCase() == "ENTER" && this.value.length > 0){
            document.getElementById("login_enter").dispatchEvent(new Event("click"));
        }
    });

    window.addEventListener("keydown", function(e){
        if (e.key?.toUpperCase() == "ENTER" && this.document.activeElement == this.document.body){
            this.document.getElementById("login_enter").dispatchEvent(new Event("click"));
        }
    });

    document.getElementById("buttonEye").addEventListener("click", function (){
        const txtPass = document.getElementById("login_password");
        const btnEye = document.getElementById("buttonEye");

        if (txtPass.type === "text"){
            txtPass.type = "password";
            btnEye.className = "fa fa-eye";
        } else {
            txtPass.type = "text";
            btnEye.className = "fa fa-eye-slash";
        }
    });

    return 0;
}();
