//@ts-check
"use strict";


// currently...
const goMusic = {
    load: new _Audio("/resources/sound/load.mp3"),
    walking: new _Audio("/resources/sound/walking.mp3"),
    walking_at_night: new _Audio("/resources/sound/walking_at_night.mp3"),
    open: new _Audio("/resources/sound/goOpen.mp3"),
    close: new _Audio("/resources/sound/goClose.mp3"),
    anopen: new _Audio("/resources/sound/goAnotherOpen.mp3"),
    anclose: new _Audio("/resources/sound/goAnotherClose.mp3"),
    taskOpen: new _Audio("/resources/sound/goTaskOpen.mp3"),
    hennaoto: new _Audio("/resources/sound/hennaoto.mp3"),
    current_walking: _Audio.prototype,
};


const goSound = {
    open: ()=>{
        const au = Object.create(goMusic.open);
        au.start();
    },
    close: ()=>{
        const au = Object.create(goMusic.close);
        au.start();
    },
    anopen: ()=>{
        const au = Object.create(goMusic.anopen);
        au.start();
    },
    anclose: ()=>{
        const au = Object.create(goMusic.anclose);
        au.start();
    },
    taskopen: ()=>{
        const au = Object.create(goMusic.taskOpen);
        au.start();
    },
    hennaoto: ()=>{
        const au = Object.create(goMusic.hennaoto);
        au.start();
    },
};
