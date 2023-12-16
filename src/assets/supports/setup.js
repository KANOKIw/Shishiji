//@ts-check
"use strict";


!function(){
    // popup
    !function(){
        const $cp = $("#shishiji-popup-container-c");

        /**@param {string} str  */
        function delpxToNum(str){
            return Number(str.replace("px", ""));
        }

        const base = {
            width: delpxToNum($cp.css("width")),
            height: delpxToNum($cp.css("height")),
            margin: delpxToNum($cp.css("margin"))
        };
        
        $(window).on("resize", function(e){
            var width = delpxToNum($cp.css("width"));
            var height = delpxToNum($cp.css("height"));
            var margin = delpxToNum($cp.css("margin"));
            
            if (window.innerWidth <= width+margin*2){
                $cp.css("width", window.innerWidth-margin*2+"px");
                width = window.innerWidth-margin*2;
            } else {
                $cp.css("width", base.width+"px");
            }

            $cp
            .css("top", (window.innerHeight-(margin*2+height))/2+"px")
            .css("left", (window.innerWidth-(margin*2+width))/2+"px");
        });

        window.dispatchEvent(new Event("resize"));
        return 0;
    }();

    return 0;
}();
