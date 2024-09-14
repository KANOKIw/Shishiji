//@ts-check
"use strict";


/**@type {MediaStream[]} */
const pendingMediaStreams = [];


function startScanningStamp(){
    openPkGoScreen("stamp_rally_scan_screen");
    intoLoad("opening camera", "middle");

    if (!("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices))
        PictoNotifier.notifyError(TEXTS[LANGUAGE].BROWSER_DOESNT_HAVE_CAMERA_FUNC);
    else setTimeout(async ()=>{
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
        /**@param {string} url */
        const foundQRCode = (url) => {
            foundStampRally(url);
            $("#close_button_of_stamp_rally_scan_screen").trigger("click");
        }
        const drawRect = (location) => {
            rectCvs.width = contentWidth;
            rectCvs.height = contentHeight;
            drawLine(location.topLeftCorner, location.topRightCorner);
            drawLine(location.topRightCorner, location.bottomRightCorner);
            drawLine(location.bottomRightCorner, location.bottomLeftCorner);
            drawLine(location.bottomLeftCorner, location.topLeftCorner)
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
                drawRect(code.location);
                intoLoad("stamp code read", "middle");
                setTimeout(()=>{
                    foundQRCode(code.data);
                    outofLoad("stamp code read", "middle");
                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    rectCtx.clearRect(0, 0, rectCvs.width, rectCvs.height);
                }, 490);
                return;
            } else {
                rectCtx.clearRect(0, 0, contentWidth, contentHeight);
            }
            setTimeout(()=>{ checkImage() }, 500);
        }
        var contentWidth;
        var contentHeight;

        const media = navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    width: screen.height,
                    height: screen.width,
                    facingMode: {
                        exact: "environment"
                    }
                }
            }).then((stream) => {
                pendingMediaStreams.push(stream);
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
                PictoNotifier.notifyError(TEXTS[LANGUAGE][notifytext], {
                    discriminator: "camera error",
                    do_not_keep_previous: true,
                });
                closePkGoScreen("stamp_rally_scan_screen");
                outofLoad("opening camera", "middle");
            });
            
    }, 250);
}


/**
 * 
 * @param {string} url 
 */
function foundStampRally(url){
    openPkGoScreen("stamp_rally_scanned_screen");
    $("#uhgaiaSafs").text(url);
}
