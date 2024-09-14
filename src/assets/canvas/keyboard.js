//@ts-check
"use strict";


/**@param {unknown[]} a  */
function _(...a){

}


/**@type {{[key: string]: {pressing: boolean, _do: (arg0: MoveData) => MoveData, _leave: () => void}}} */
const arrowkeyBehavs = {
    arrowup: {
        pressing: false,
        /**@param {MoveData} moves*/
        _do: function(moves){
            if (!spckeystatus.ctr)
                moves.top += spckeystatus.shift ? MOVEPROPERTY.arrowkeys.nosprint : MOVEPROPERTY.arrowkeys.move;
            else
                zoomMapAssistingNegative(spckeystatus.shift ? MOVEPROPERTY.arrowkeys.nosprintratio : MOVEPROPERTY.arrowkeys.ratio, [shishiji_canvas.width/2, shishiji_canvas.height/2]);
            return moves;
        },
        _leave: function(){
            _(0, MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval);
        },
    },
    arrowdown: {
        pressing: false,
        /**@param {MoveData} moves*/
        _do: function(moves){
            if (!spckeystatus.ctr)
                moves.top += spckeystatus.shift ? -MOVEPROPERTY.arrowkeys.nosprint : -MOVEPROPERTY.arrowkeys.move;
            else 
                zoomMapAssistingNegative(spckeystatus.shift ? 1/MOVEPROPERTY.arrowkeys.nosprintratio : 1/MOVEPROPERTY.arrowkeys.ratio, [shishiji_canvas.width/2, shishiji_canvas.height/2]);
            return moves;
        },
        _leave: function(){
            _(0, -MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval);
        },
    },
    arrowleft: {
        pressing: false,
        /**@param {MoveData} moves*/
        _do: function(moves){
            moves.left += spckeystatus.shift ?  MOVEPROPERTY.arrowkeys.nosprint : MOVEPROPERTY.arrowkeys.move;
            return moves;
        },
        _leave: function(){
            _(MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval, 0);
        },
    },
    arrowright: {
        pressing: false,
        /**@param {MoveData} moves*/
        _do: function(moves){
            moves.left += spckeystatus.shift ? -MOVEPROPERTY.arrowkeys.nosprint : -MOVEPROPERTY.arrowkeys.move;
            return moves;
        },
        _leave: function(){
            _(-MOVEPROPERTY.arrowkeys.move*1000/MOVEPROPERTY.arrowkeys.interval, 0);
        },
    },
};


const spckeystatus = {
    ctr: false,
    shift: false,
};


/**@ts-ignore @type {NodeJS.Timeout} */
var _ami = 0;
function _arrowmoves(){

    
    clearInterval(_ami);
    clearTimeout(WH_CHANGE_TM);

    _ami = setInterval(() => {
        /**@type {MoveData} */
        var _moves = { top: 0, left: 0 };
        for (const _key in arrowkeyBehavs){
            if (arrowkeyBehavs[_key].pressing)
                _moves = arrowkeyBehavs[_key]._do.call(0, _moves);
        }
        moveMapAssistingNegative(_moves);
    }, MOVEPROPERTY.arrowkeys.interval);
}


function _stopArrowmoves(){
    clearInterval(_ami);
}


window.addEventListener("keydown", function(e){
    const key = e.key.toLowerCase();

    spckeystatus.ctr = e.ctrlKey;
    spckeystatus.shift = e.shiftKey;

    if (key in arrowkeyBehavs){
        var actives = 0;
        Object.keys(arrowkeyBehavs).forEach(o => { if (arrowkeyBehavs[o].pressing) actives++; })
        if (actives == 0){
            _arrowmoves();
        }

        arrowkeyBehavs[key].pressing = true;
    }
});


window.addEventListener("keyup", function(e){
    const key = e.key.toLowerCase();

    spckeystatus.ctr = e.ctrlKey;
    spckeystatus.shift = e.shiftKey;
    
    if (key in arrowkeyBehavs){
        arrowkeyBehavs[key].pressing = false;

        var actives = 0;
        Object.keys(arrowkeyBehavs).forEach(o => { if (arrowkeyBehavs[o].pressing) actives++; })
        if (actives == 0){
            _stopArrowmoves();
            //@ts-ignore
            WH_CHANGE_TM = setTimeout(() => {
                setBehavParam();
            }, href_replaceCD);
        }
    }
});
