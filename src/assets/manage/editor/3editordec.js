//@ts-check
"use strict";


function setEditorcdColor(){
    const ncoloredText = document.getElementById("main-editor")?.innerText || "";
    const colorRes = colorXtext(ncoloredText);
    const editor = $("#main-editor");
    const editorcd = $("#main-editor-cd");
    var gCos = editor.html().replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
    var cdHTML = gCos;

    
    if (SETTINGS.colorEditor || SETTINGS.solidObject){
        if (Object.keys(colorRes.removebrs).length > 0){
            var lineBreaks = 0;
            for (var [rmpls, rmd] of Object.entries(colorRes.removebrs)){
                lineBreaks += (rmpls.match(/<br>/g) || []).length;
                rmpls = rmpls.replace(/\u00A0/g, " ");
                cdHTML = cdHTML.replace(rmpls.replace(/ /g, "&nbsp;"), rmd);
            }
            const single = lineBreaks <= 1;
            editor
            .trigger("blur")
            .html(cdHTML.replace(/ /g, "&nbsp;").replace("	", "   "));
            PictoNotifier.notify(
                "info",
                `Oops, you can't insert ${single ? "a " : ""}line break${single ? "" : "s"} there!!`,
                {
                    discriminator: "no line break there",
                    do_not_keep_previous: true
                }
            );
        }
    }


    if (SETTINGS.colorEditor){
        /**
         * Transparented main editor text size fitter!!
         * This is awesome!!
         */
        /*const fontcolorres = colorFonts(editor.html(), true);
        if (fontcolorres.found)
            editor
            .trigger("blur")
            .html(
                fontcolorres.result
            );*/
        cdHTML = colorRes.text;
    }


    if (SETTINGS.visibleSpace){
        if (SETTINGS.visibleOnlyEndSpace)
            cdHTML = visibleOnlyEndSpace(cdHTML);
        else
            cdHTML = visibleSpace(cdHTML);
    }

    editorcd.html(cdHTML);
}


/**
 * 
 * @param {string | null | undefined} text 
 * @returns {{text: string, removebrs: {[key: string]: string} | {}}}
 */
function colorXtext(text){
    if (text === null || text === void 0)
        return { text: "", removebrs: {} };

    const htmlParser = document.createElement("span");

    text = legalHTML(text);

    for (const sectionkey in DOCOLS){
        text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DOCOLS[sectionkey]}">${sectionkey}</span>`);
    }

    for (const sectionkey in DOSTS){
        text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DOSTS[sectionkey]}">${sectionkey}</span>`);
    }
    
    for (const sectionkey in DODEFS){
        text = text.replace(new RegExp(sectionkey, "g"), `<span class="${DODEFS.defaultcls}">${sectionkey}</span>`);
    }

    text = decorateFonts(text).result;
    text = text.replace(/§v/g, `<span class="sheart32">§v</span>`);
    text = text.replace(/§r/g, `<span class="sheart33">§r</span>`);
    text = text.replace(/§k/g, `<span class="sheart34">§<span class="MCOBF">r</span></span>`);


    /**
     * 
     * @param {string} htmlLike 
     */
    function getTextContent(htmlLike){
        htmlParser.innerHTML = htmlLike;
        return htmlParser.textContent || "";
    }

    
    const removebrs = {};
    const Regs = {
        image: /∫\:(IMG)-S=([^-]+)-W=(\d+);∫/,
        video: /∫\:(VIDEO)-S=([^-]+)-W=(\d+);∫/,
        link: /#\:LINK-H=(https?:\/\/(?:(?!-T=).)+)-T=((?:(?!;#).)*);#/
    };
    const mediable = text.matchAll(/∫(?:(?!∫).)+∫/g);   //*/const mediable = text.matchAll(/(∫:(?:(?!;∫).)+;∫)|(∫<br>:(?:(?!;∫).)+;∫)|(∫:(?:(?!;<br>∫).)+;<br>∫)/g);
    const linkable = text.matchAll(/#(?:(?!#).)+#/g);   //*/const linkable = text.matchAll(/(#:(?:(?!;#).)+;#)|(#<br>:(?:(?!;#).)+;#)|(#:(?:(?!;<br>#).)+;<br>#)/g);
    

    for (const mediam of mediable){
        const matchHTML = mediam[0];
        const _componented = getTextContent(matchHTML);
        const thismatch = Regs.image.exec(_componented) || Regs.video.exec(_componented);
   
        if (thismatch){
            const type = thismatch[1];
            const src = thismatch[2].replace(/ |\u00A0/g, "&nbsp;");
            const width = thismatch[3];
            const colored = `<span class="sheart22">∫:${type}-S=<span class="sheart23">${src}</span>-W=<span class="sheart23">${width}</span>;∫</span>`;

            text = text.replace(matchHTML, colored);
            if (matchHTML.includes("<br>"))
                removebrs[matchHTML] = _componented;
        }
    }

    for (const linkm of linkable){
        const matchHTML = linkm[0];
        const _componented = getTextContent(matchHTML);
        const thismatch = Regs.link.exec(_componented);
        
        if (thismatch){
            const href = thismatch[1].replace(/ |\u00A0/g, "&nbsp;");
            const _text = thismatch[2].replace(/ |\u00A0/g, "&nbsp;");
            const colored = `<span class="sheart24">#:LINK-H=<span class="sheart25">${href}</span>-T=<span class="sheart25">${_text}</span>;#</span>`;
        
            text = text.replace(matchHTML, colored);
            if (matchHTML.includes("<br>"))
                removebrs[matchHTML] = _componented;
        }
    }

    
    htmlParser.remove();
    return { text: text, removebrs: removebrs };
}


/**
 * 
 * @param {string} htmlLike 
 */
function visibleSpace(htmlLike){
    htmlLike = htmlLike.replace(/\u00A0/g, " ");
    return htmlLike.replace(/(&nbsp;)+/g, function(match){
        const points = "·".repeat(match.length / "&nbsp;".length);
        return `<span class="sheart35">${points}</span>`;
    }).replace(/　+/g, function(match){
        console.log(match)
        const points = "・".repeat(match.length);
        return `<span class="sheart35">${points}</span>`;
    });
}


LOADW++;
updatestartupProgress(LOADW*100/scriptlen);
