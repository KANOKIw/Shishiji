//@ts-check
"use strict";


const _Audio = class _Audio{
    /**
     * 
     * @param {string} source Path
     * @param {number} [timeout] Immediate?
     * @param {{success?: ()=>any; fail?: (reason: string)=>any}} [direct_cbks] 
     */
    constructor(source, timeout, direct_cbks){
        this.source = source;
        
        this.audio_ctx = new AudioContext();
        this.audio_buffer = null;
        this.audio_buffer_node = null;
        this.start_time = 0;
        this.paused_time = 0;
        this.is_playing = false;

        // waiting for teachers' approval
        return;
        this.initializeAudio(timeout)
        .then(direct_cbks?.success)
        .catch(direct_cbks?.fail);
    }

    /**
     * 
     * @param {number} [timeout] 
     * @returns {Promise<void>}
     */
    async initializeAudio(timeout){
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(this.source);
                const response_buffer = await response.arrayBuffer();

                this.audio_buffer = await this.audio_ctx.decodeAudioData(response_buffer);
                this.prepareAudioBufferNode();

                if (timeout){
                    if (!firstInter){
                        const startAudio = () => {
                            if (!this.is_playing) {
                                this.start(0);
                                resolve();
                            }
                        };

                        const events = "touchstart mousedown".split(" ");
                        events.forEach(e => document.body.addEventListener(e, startAudio));

                        setTimeout(() => {
                            events.forEach(e => document.body.removeEventListener(e, startAudio));
                            if (!this.is_playing) {
                                reject("timeout");
                            }
                        }, timeout);
                    } else {
                        this.start();
                        resolve();
                    }
                } else {
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    prepareAudioBufferNode() {
        this.audio_buffer_node = this.audio_ctx.createBufferSource();
        this.audio_buffer_node.buffer = this.audio_buffer;
        this.audio_buffer_node.connect(this.audio_ctx.destination);

        this.audio_buffer_node.onended = () => {
            this.is_playing = false;
            this.start_time = 0;
            this.paused_time = 0;
        };
    }

    start(offset = 0){
        if (this.is_playing) return;
    
        this.prepareAudioBufferNode();
        this.audio_buffer_node?.start(0, offset);
        this.start_time = this.audio_ctx.currentTime - offset;
        this.is_playing = true;
    }

    pause(){
        if (!this.is_playing) return;

        this.audio_buffer_node?.stop();
        this.paused_time = this.audio_ctx.currentTime - this.start_time;
        this.is_playing = false;
    }

    stop(){
        if (!this.is_playing) return;
        
        try{
            this.audio_buffer_node?.stop();
            this.is_playing = false;
            this.start_time = 0;
            this.paused_time = 0;
        } catch(e){}
    }

    /**
     * Play the audio from the current paused position
     */
    resume() {
        if (this.is_playing) return;

        this.start(this.paused_time);
    }
}


//@ts-ignore
window._Audio = _Audio;
