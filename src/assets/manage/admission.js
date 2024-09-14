//@ts-check
"use strict";


const gsession = getCookie(SESSIONKEY);
const scannedData = [ ];


/**
 * 
 * @param {any} [force] 
 *     `if (this instanceof HTMLElement) denyforce();`
 */
function leaveherep(force){
    function f(){
        delCookie(SESSIONKEY); 
        window.history.replaceState("", "", "/org/manage/login");
        window.location.assign("/org/manage/login");
    }

    $.ajax({
        type: "POST",
        url: "/org/manage/auth/logout",
        timeout: 5000,
        data: { session: gsession },
        success: f,
        error: () => {
            logout_is_peiding = false;
            if (force === true && !(this instanceof HTMLElement)){
                f();
                return;
            }
            if (this instanceof HTMLElement)
                $(this)
                .text("ログアウト")
                .css("color", "black");
            PictoNotifier.notify("error", "通信エラー", { duration: 10000, do_not_keep_previous: true, deny_userclose: true });
        }
    });
}


+async function(){
    document.getElementById("afsiuhoiw")?.addEventListener("click", function(){
        window.location.href = "/org/manage/menu";
    });
    $.post("/org/manage/auth/editor", { session: gsession, type: "Admission" })
    .then(editorData => {
        PictoNotifier.notifySuccess("Logined as "+editorData.usn);
        $("#myorgnamew").text(editorData.artdata.article.title);
        async function startScanningStamp(){
            intoLoad("opening camera", "middle");

            /**@ts-ignore @type {HTMLVideoElement} */
            const video = document.getElementById("qrcode-video");
            /**@ts-ignore @type {HTMLCanvasElement} */
            const cvs = document.getElementById("camera-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const ctx = cvs.getContext("2d");
            /**@ts-ignore @type {HTMLCanvasElement} */
            const rectCvs = document.getElementById("rect-canvas");
            /**@ts-ignore @type {CanvasRenderingContext2D} */
            const rectCtx =  rectCvs.getContext("2d");
            /**@param {string} data */
            const foundQRCode = (data) => {
                const rl = JSON.parse(data);
                $.post("/org/manage/admission/scanned", { data: data })
                .then((data) => {
                    const msg = data.message;
                    
                    PictoNotifier.notifySuccess("記録しました: " + rl.user_id + (msg == "duped" ? " (二回目以降)" : ""), {
                        do_not_keep_previous: true
                    });
                })
                .catch(e => {
                    PictoNotifier.notifyError("エラー！：不明なQRコード、もしくは不明なユーザーです", {
                        do_not_keep_previous: true
                    });
                })
                .always(() => {checkImage();outofLoad("posting data", "middle")});
            }
            const drawRect = (location) => {
                rectCvs.width = contentWidth;
                rectCvs.height = contentHeight;
                drawLine(location.topLeftCorner, location.topRightCorner);
                drawLine(location.topRightCorner, location.bottomRightCorner);
                drawLine(location.bottomRightCorner, location.bottomLeftCorner);
                drawLine(location.bottomLeftCorner, location.topLeftCorner);
            }
            const drawLine = (begin, end) => {
                rectCtx.lineWidth = 4;
                rectCtx.strokeStyle = "#50C878";
                rectCtx.beginPath();
                rectCtx.moveTo(begin.x, begin.y);
                rectCtx.lineTo(end.x, end.y);
                rectCtx.stroke();
            }
            const canvasUpdate = () => {
                cvs.width = contentWidth;
                cvs.height = contentHeight;
                ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
                requestAnimationFrame(canvasUpdate);
            }
            const checkImage = async () => {
                const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
                const code = jsQR(imageData.data, contentWidth, contentHeight);
    
                if (code && code.data){
                    const strdata = JSON.stringify(code.data);

                    if (scannedData.includes(strdata)){
                        setTimeout(()=>{ checkImage() }, 100);
                        return;
                    }

                    intoLoad("posting data", "middle");
                    drawRect(code.location);
                    foundQRCode(code.data);
                    scannedData.push(strdata);
                    setTimeout(() => {
                        scannedData.splice(scannedData.indexOf(strdata), 1);
                    }, (60)*1000);
                    return;
                } else {
                    rectCtx.clearRect(0, 0, contentWidth, contentHeight);
                }
                setTimeout(checkImage, 100);
            }
            var contentWidth;
            var contentHeight;
    
            const mwidth = window.innerWidth;
            const mheight = window.innerHeight - 100;
            
            const media = navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        width: screen.height,
                        height: screen.width,
                        facingMode: {
                            exact: "user"
                        }
                    }
                }).then((stream) => {
                    video.srcObject = stream;
                    video.onloadeddata = () => {
                        video.play();
                        contentWidth = video.clientWidth;
                        contentHeight = video.clientHeight;
                        canvasUpdate();
                        checkImage();
                        if (!loadProcesses.middle.includes("opening camera")){
                            stream.getTracks().forEach(track => track.stop());
                        } else {
                            outofLoad("opening camera", "middle");
                        }
                    }
                }).catch((e) => {
                    var notifytext = "";
                    switch (e.toString()){
                        case "OverconstrainedError":
                        case "NotFoundError":
                            notifytext = "CAMERA_NOT_FOUND";
                            break;
                        case "NotReadableError":
                            notifytext = "SYSTEM_ERROR";
                            break;
                        case "TypeError":
                            notifytext = "UNKNOWN_ERROR";
                            break;
                        case "SecurityError":
                        default:
                            notifytext = "PLEASE_ALLOW_CAMERA";
                            break;
                    }
                    PictoNotifier.notify("error", TEXTS[LANGUAGE][notifytext], {
                        discriminator: "camera error",
                        do_not_keep_previous: false,
                        addToPending: true
                    });
                    closePkGoScreen("stamp_rally_scan_screen");
                    outofLoad("opening camera", "middle");
                });
        }
        startScanningStamp();
    })
    .catch(leaveherep);
}();
