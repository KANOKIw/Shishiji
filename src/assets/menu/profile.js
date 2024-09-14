//@ts-check
"use strict";


function openProfileScreen(){
    if (tour_status.main_screen) return;
    openPkGoScreen("profile_screen");

    /*$("#user-name-input").val(LOGIN_INFO.data.profile.nickname);
    LOGIN_INFO.data.profile.icon_path ? $("#user-icon-change")
    .css("background-image", cssURL(LOGIN_INFO.data.profile.icon_path, true)) : void 0;
    profileSaveingInfo.situation.nickname = false;
    profileSaveingInfo.situation.icon_path = false;*/
}


/**
 * @this {HTMLInputElement}
 */
function onChangeIconInputChange(){
    if (!this.files){
        PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
        return;
    }

    const imagefile = this.files[0];
    const blobURL = URL.createObjectURL(imagefile);

    $("#user-icon-change").css("background-image", "url("+blobURL+")");

    profileSaveingInfo.situation.icon_path = true;
}


async function saveProfileDetails(){
    /**@ts-ignore @type {File[] | null} */
    const imagefiles = document.getElementById("chiconinputimgae")?.files;
    /**@ts-ignore @type {string} */
    const selfNickName = document.getElementById("user-name-input")?.value.replace(/^\s+/, "") || "";
    /**@ts-ignore @type {File} */
    var iconImag = null;

    const gx = function(){
        profileSaveingInfo.saving = false;
        PictoNotifier.notifyError(TEXTS[LANGUAGE].ERROR_ANY);
    };

    if (Object.values(profileSaveingInfo.situation).every(p => !p) || profileSaveingInfo.saving)
        return;

    if (!selfNickName){
        PictoNotifier.notifyError(TEXTS[LANGUAGE].NICKNAME_CANT_BE_EMPTY);
        return;
    } else if (selfNickName.length > 12){
        PictoNotifier.notifyError(TEXTS[LANGUAGE].NICKNAME_TOO_LONG);
        return;
    }

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event){
                const img = new Image();

                //@ts-ignore
                img.src = event.target.result;

                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    let width = img.width;
                    let height = img.height;

                    if (width > height){
                        if (width > 256) {
                            height = height * (256 / width);
                            width = 256;
                        }
                    } else {
                        if (height > 256){
                            width = width * (256 / height);
                            height = 256;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(function(blob){
                        if (blob){
                            const resizedFile = new File([blob], file.name, { type: file.type });
                            resolve(resizedFile);
                        } else {
                            reject(new Error());
                        }
                    }, file.type || "image/png");
                };

                img.onerror = function() {
                    reject(new Error());
                };
            };
            reader.readAsDataURL(file);
        });
    };

    if (imagefiles && imagefiles[0]){
        iconImag = imagefiles[0];
        try {
            iconImag = await resizeImage(iconImag);
        } catch (e){
            gx();
            return;
        }
    }

    const formData = new FormData();
    formData.append("file", iconImag);
    formData.append("nickname", selfNickName);
    profileSaveingInfo.saving = true;
    intoLoad("profile-saver", "top");

    $.ajax({
        url: ajaxpath.profileupd,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
    }).done((resultLike) => {
        profileSaveingInfo.saving = 
        profileSaveingInfo.situation.icon_path = 
        profileSaveingInfo.situation.nickname = false;
        LOGIN_DATA.data.profile.nickname = resultLike.nickname;
        LOGIN_DATA.data.profile.icon_path = resultLike.icon_path;

        $("#user-name-input").val(LOGIN_DATA.data.profile.nickname);
        $("#user-name").text(LOGIN_DATA.data.profile.nickname);

        LOGIN_DATA.data.profile.icon_path ? $("#user-icon, #user-icon-change")
        .css("background-image", cssURL(LOGIN_DATA.data.profile.icon_path, true)) : void 0;

        PictoNotifier.notifySave(TEXTS[LANGUAGE].PROFILE_SAVED, {
            do_not_keep_previous: true
        });
    }).fail(gx).always(() => outofLoad("profile-saver", "top"));
}
