document.getElementById("TAP_ME").addEventListener("click", function(e){
    this.remove();
    const scriptSources = [
        "/src/assets/se/revoke.js",
        "/src/assets/se/go.js",
        "/src/assets/properties.js",
        "/src/assets/restrict.js",
        "/src/assets/globals.v.js",
        "/src/assets/ws.js",
        "/src/assets/mcformat.js",
        "/src/assets/speed.js",
        "/src/assets/login/reap.js",
        "/src/assets/canvas/calculate.js",
        "/src/assets/canvas/display.js",
        "/src/assets/canvas/react.js",
        "/src/assets/canvas/touch.js",
        "/src/assets/canvas/mouse.js",
        "/src/assets/canvas/keyboard.js",
        "/src/assets/objects/create.js",
        "/src/assets/objects/behave.js",
        "/src/assets/objects/overview.js",
        "/src/assets/objects/listener.js",
        "/src/assets/objects/setup.js",
        "/src/assets/menu/adv.js",
        "/src/assets/menu/search.js",
        "/src/assets/menu/faq.js",
        "/src/assets/menu/stamp.js",
        "/src/assets/menu/pokmenu.js",
        "/src/assets/menu/buttons.js",
        "/src/assets/menu/setup.js",
        "/src/assets/ui/fselector.js",
        "/src/assets/supports/share.js",
        "/src/assets/supports/popup.js",
        "/src/assets/supports/setup.js",
        "/src/assets/canvas/setup.js",
        "/src/assets/main.js"
    ];

    async function loadScriptsSequentially(sources) {
        for (var src of sources){
            await loadScript(src);
        }

        PictoNotifier.notify("smile", "Successful!!");
        setLoadMessage("");
        setTimeout(()=>{
            const event = new Event("load");
            window.dispatchEvent(event);
        }, 50);
    }

    var prog = 0;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;

            if (src.includes("listener.js")
            || src.includes("setup.js")
            || src.includes("main.js")
            || src.includes("objects/behave.js")
            || src.includes("menu/setup.js")) {
                script.defer = true;
            }

            script.onload = () => {
                console.log(`Script loaded: ${src}`);
                prog++;
                $("#AIUSFff").text(`${Math.ceil(10000*prog/scriptSources.length)/100}%`);
                $("#ml_progress").css("width", `${Math.ceil(100*prog/scriptSources.length)}%`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`Failed to load script: ${src}`);
                reject(new Error(`Failed to load script: ${src}`));
            };


            document.head.appendChild(script);
        });
    }
    const loadmsg = `<h4>Loading missing scripts</h4><div id="map_load_progress"><div id="ml_progress"></div></div><h4 id="AIUSFff">0%</h4>`;
    startLoad(loadmsg);
    loadScriptsSequentially(scriptSources);
});
