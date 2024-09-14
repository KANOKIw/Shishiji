//@ts-check
"use strict";


function openTeaScreen(){
    openPkGoScreen("tea_screen");

    const havewent = LOGIN_DATA.data.completed_orgs;
    $("#ASUgAJs > div").remove();
    for (const objdata of Object.values(mapObjectComponent)){
        $("#ASUgAJs").append(`
            <div>
                <input id="__W${objdata.discriminator}" type="checkbox" class="setartw" who="${objdata.discriminator}" ${havewent.includes(objdata.discriminator) ? "checked" : ""}>
                <lable for="__W${objdata.discriminator}">${objdata.discriminator}</lable>
            </div>
        `);
        $(`#__W${objdata.discriminator}`).on("input", function(){
            $.post("/.dev/faith", {
                //@ts-ignore
                _where: this.getAttribute("who"),
                //@ts-ignore
                _process: this.checked ? "add" : "remove",
            }).then(async d => {
                LOGIN_DATA.data.completed_orgs = d;
                showGoodOrgs();
                if (await haveAnyUnclaimeds()){
                    setMenuHasPending("1");
                }
            });
        });
    }
}
