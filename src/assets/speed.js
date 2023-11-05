!function(){
    var prevEvent,
        currentEvent;
    document.documentElement.addEventListener("mousemove", function(event){
        pointerVelocity.method = "MOUSE";
        currentEvent = event;
    });

    setInterval(function(){
        if (prevEvent && currentEvent){
            var movementX = currentEvent.screenX - prevEvent.screenX;
            var movementY = currentEvent.screenY - prevEvent.screenY;
            var movement = Math.sqrt(movementX*movementX + movementY*movementY);
        }
        
        prevEvent = currentEvent;
        if (pointerVelocity.method == "MOUSE"){
            pointerVelocity.x = 10*movementX;
            pointerVelocity.y = 10*movementY;
            pointerVelocity.v = 10*movement;
        }
    }, 100);
}();


!function(){
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

    setInterval(function(){
        if (prevEvent && currentEvent){
            var p = g(currentEvent.touches),
                j = g(prevEvent.touches);
            var movementX = p.x - j.x;
            var movementY = p.y - j.y;
            var movement = Math.sqrt(movementX*movementX + movementY*movementY);
        }
        
        prevEvent = currentEvent;
        if (pointerVelocity.method == "TOUCH"){
            pointerVelocity.x = 10*movementX;
            pointerVelocity.y = 10*movementY;
            pointerVelocity.v = 10*movement;
        }
    }, 100);
}();
