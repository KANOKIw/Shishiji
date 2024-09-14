//@ts-check
"use strict";


var gdash = [];


!function(){
    var prevEvent,
        currentEvent;

    document.documentElement.addEventListener("mousemove", function(event){
        pointerVelocity.method = "MOUSE";
        currentEvent = event;
    });

    gdash.push(function(){
        var movementX = 0;
        var movementY = 0;
        var movement = 0;

        if (prevEvent && currentEvent){
            var movementX = currentEvent.screenX - prevEvent.screenX;
            var movementY = currentEvent.screenY - prevEvent.screenY;
            var movement = Math.sqrt(movementX*movementX + movementY*movementY);
        }

        prevEvent = currentEvent;

        if (pointerVelocity.method == "MOUSE"){
            pointerVelocity.x = 100*movementX;
            pointerVelocity.y = 100*movementY;
            pointerVelocity.v = 100*movement;
        }
    });
    return 0;
}();


!function(){
    var wait_o2 = 0;
    /**@type {NodeJS.Timeout} */
    var t;

    function g(t){
        var k = 0;
        var r = 0;
        for (var w  of t){
            k += w.clientX;
            r += w.clientY;
        }
        k /= t.length;
        r /= t.length;
        return { x: k, y: r };
    }

    var prevEvent,
        currentEvent;

    document.documentElement.addEventListener("touchmove", function(event){
        pointerVelocity.method = "TOUCH";
        currentEvent = event;
    });

    gdash.push(function(){
        var movementX = 0;
        var movementY = 0;
        var movement = 0;


        if (currentEvent && currentEvent.touches.length >= 2){
            wait_o2 = 1;
            if (t)
                clearTimeout(t);
            t = setTimeout(()=>{
                wait_o2 = 0;
            }, 250);
        }

        if (prevEvent && currentEvent && currentEvent.touches.length == 1 && wait_o2 === 0){
            var p = g(currentEvent.touches),
                j = g(prevEvent.touches);
            movementX = p.x - j.x;
            movementY = p.y - j.y;
            movement = Math.sqrt(movementX*movementX + movementY*movementY);
        }
        
        prevEvent = currentEvent;

        if (pointerVelocity.method == "TOUCH"){
            pointerVelocity.x = 100*movementX;
            pointerVelocity.y = 100*movementY;
            pointerVelocity.v = 100*movement;
        }
    });
    return 0;
}();

!function(){
    /**@type {NodeJS.Timeout} */
    var t;

    function g(t){
        var k = 0;
        var r = 0;
        for (var w  of t){
            k += w.clientX;
            r += w.clientY;
        }
        k /= t.length;
        r /= t.length;
        return {x: k, y: r};
    }

    var prevEvent,
        currentEvent;

    document.documentElement.addEventListener("touchmove", function(event){
        pointerVelocity.method = "TOUCH";
        currentEvent = event;
    });

    gdash.push(function(){
        var movements = {
            0: {
                x: 0,
                y: 0,
            },
            1: {
                x: 0,
                y: 0,
            },
        };

        if (!currentEvent && !prevEvent || currentEvent.touches.length == 1) 
            return;

        if (prevEvent && currentEvent && currentEvent.touches.length == 1){
            for (var i = 0; i < 2; i++){
                var p = currentEvent.touches[i];
                var j = prevEvent.touches[i];
                movements[i].x = p.clientX - j.clientX;
                movements[i].y = p.clientY - j.clientY;
            }
        }
        
        prevEvent = currentEvent;

        if (pointerVelocity.method == "TOUCH"){
            for (var i = 0; i < 2; i++){
                touchZoomVelocity[i].x = 100*movements[i].x;
                touchZoomVelocity[i].y = 100*movements[i].y;
            }
        }
    });
    return 0;
}();


setInterval(() => gdash.forEach(g=>g()), 20);
