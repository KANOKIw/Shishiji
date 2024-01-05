//@ts-check
"use strict";


/**
 * 
 * @param {{files: string[], totalsize: number, sizemap: {[key: string]: number}, mxcs: number}} responsedata 
 */
function writeCloudonPopup(responsedata){
    /**@type {string[]} */
    const files = responsedata.files;
    /**@type {number} */
    const totalsize = responsedata.totalsize;
    const sizemap = responsedata.sizemap;
    const displaysize = Math.ceil(totalsize*100)/100;

    orgCloudfi.maxsize = responsedata.mxcs;

    files.map((e) => { return toOrgFilepath(username, e); });
    $("#orgcloud-filelist").empty();
    
    var color = "lightgreen";

    if (totalsize >= orgCloudfi.maxsize){
        color = "red";
    } else if (totalsize >= orgCloudfi.maxsize*3/4){
        color = "orange";
    } else if (totalsize >= orgCloudfi.maxsize/2){
        color = "yellow";
    }

    $("#--cloud-desc").html(`<span style="color: lightgreen;">${orgCloudfi.maxsize.toLocaleString()}MB</span> まで使用できます&nbsp;(<span style="color: ${color};">${displaysize.toLocaleString()}</span>/${orgCloudfi.maxsize.toLocaleString()})`);

    for (const file of files){
        const mediatype = getMediaType(file);
        const src = toOrgFilepath(username, file);
        var _html = "";

        switch (mediatype){
            case "image":
                _html += `
                <div class="cloud-file-el">
                    <div class="cloudfileele" uname="${file}">
                        <img class="cloudfileel cloudsh" src="${src}" uname="${file}">
                        <h4 class="cloudfileel">${file}</h4>
                        <p class="cloudfileel" style="font-size: 75%;">${Math.ceil(sizemap[file]*1000)/1000}MB</p>
                    </div>
                </div>`;
                break;
            case "video":
                _html += `
                <div class="cloud-file-el">
                    <div class="cloudfileele" uname="${file}">
                        <video class="cloudfileel cloudsh" uname="${file}" src="${src}#t=0.001" controls preload="metadata" playsinline></video>
                        <h4 class="cloudfileel">${file}</h4>
                        <p class="cloudfileel" style="font-size: 75%;">${Math.ceil(sizemap[file]*1000)/1000}MB</p>
                    </div>
                </div>`;
                break;
        }
        $("#orgcloud-filelist")
        .append(_html)
        .scrollTop(0);
    }

    $(".cloudfileele").on("click", () => {});
}
