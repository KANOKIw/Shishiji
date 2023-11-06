//@ts-check

!function(){
    !function(){
        var prevEvent,
            currentEvent;
        document.documentElement.addEventListener("mousemove", function(event){
            pointerVelocity.method = "MOUSE";
            currentEvent = event;
        });
    
        setInterval(function(){
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
                pointerVelocity.x = 50*movementX;
                pointerVelocity.y = 50*movementY;
                pointerVelocity.v = 50*movement;
            }
        }, 20);
        return !0;
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
            var movementX = 0;
            var movementY = 0;
            var movement = 0;
            if (prevEvent && currentEvent){
                var p = g(currentEvent.touches),
                    j = g(prevEvent.touches);
                movementX = p.x - j.x;
                movementY = p.y - j.y;
                movement = Math.sqrt(movementX*movementX + movementY*movementY);
            }
            
            prevEvent = currentEvent;
            if (pointerVelocity.method == "TOUCH"){
                pointerVelocity.x = 50*movementX;
                pointerVelocity.y = 50*movementY;
                pointerVelocity.v = 50*movement;
            }
        }, 20);
        return !0;
    }();
    return !0;
}();
