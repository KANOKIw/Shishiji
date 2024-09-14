import * as drought from "./drought";
import * as mapObjAPI from "./mapobjs";
import * as miscHandler from "./handler/misc/giveMisc";

import express from "express";
import http from "http";
import fs from "fs";

import { Socket, Server as SocketIO } from "socket.io";
import { app, server, HOST_NAME } from "./drought";
import { socketOnConnection } from "./ws";
import { readJSONSync, Random, writeLog } from "./utils";
import { substituteErrorHandler } from "./drought";
import { validationResult, body  } from "express-validator";
import { User } from "./handler/user/user";
import { UserAuth } from "./handler/user/auth";
import { UserActivity } from "./handler/user/activity";
import { OrgAuth } from "./handler/org/auth";
import { Orgument } from "./handler/org/orgument";
import { TicketAdministrator } from "./handler/misc/ticket";
import { MiscAuth } from "./handler/misc/auth";
import { Updater } from "./handler/misc/updater";


__dirname = __dirname.replace(/[/, \\]src[/, \\]server/, "");


drought.websocketio.on("connection", async function(socket: Socket){
    socketOnConnection.setUserId(socket);
    socketOnConnection.setOrgStatus(socket);
    socketOnConnection.anyHandler(socket);
});


app.post("/org/manage/auth/login", substituteErrorHandler(drought.orgauth.login));

app.post("/org/manage/auth/_login", substituteErrorHandler(drought.orgauth._login));

app.post("/org/manage/auth/logout", substituteErrorHandler(drought.orgauth.logout));

app.post("/org/manage/auth/editor", substituteErrorHandler(drought.orgauth.editor));

app.post("/org/manage/edit/saveothers", substituteErrorHandler(drought.edit.saveothers));

app.post("/org/manage/edit/savemain", substituteErrorHandler(drought.edit.savemain));

app.post("/org/manage/file/list", substituteErrorHandler(drought.cloud.list));

app.post("/org/manage/file/overflow", substituteErrorHandler(drought.cloud.overflow));

app.post("/org/manage/file/upload", substituteErrorHandler(drought.cloud.upload));

app.post("/org/manage/file/delete", substituteErrorHandler(drought.cloud.delete));

app.post("/org/manage/admission/scanned", substituteErrorHandler(drought.useractivity.enterOrg));

app.post("/org/manage/ticket/scanned", substituteErrorHandler(TicketAdministrator.useTicket));

app.post("/org/manage/status/data", substituteErrorHandler(drought.orgauth.statusdata));

app.post("/org/manage/edit/crowd", substituteErrorHandler(drought.edit.setCrowd));

app.post("/org/data", substituteErrorHandler(drought.orgauth.data));


// DELETE THIS
app.post("/.dev/faith", drought.useractivity._devOrg);


app.post("/user/mylord", substituteErrorHandler(User.giveQRCode));

app.post("/user/fightback", substituteErrorHandler(User.callSaveProfile));

app.post("/user/coward", substituteErrorHandler(User.setFameVote));

app.post("/user/sectumsempra", substituteErrorHandler(User.setEventvote));

app.post("/user/scylla", substituteErrorHandler(User.giveOrgSituation));

app.post("/user/loyalty", substituteErrorHandler(User.setFavorite));

app.post("/user/integrity", substituteErrorHandler(drought.userauth.giveFine));

app.post("/user/necron", substituteErrorHandler(drought.useractivity.claimMissionrpt));

app.post("/user/maxor", substituteErrorHandler(drought.useractivity.claimSpecialMissionrpt));

app.post("/user/e/kuudra", async (q, s) => s.send(UserActivity.top100_users));

app.post("/user/e/omegagma", substituteErrorHandler(User.setCustoms))


app.post("/data/map-data/article", substituteErrorHandler(miscHandler.giveArticle));

app.post("/data/map-data/allart", substituteErrorHandler(miscHandler.giveAllArticle));

app.post("/data/map-data/objects", substituteErrorHandler(miscHandler.giveObjects));

app.post("/data/map-data/conf", drought.resData(drought.mapConfData));

app.post("/data/map-data/point", drought.resData(drought.mapPointData));

app.post("/data/adv", drought.resData(drought.advData));

app.post("/data/faq", substituteErrorHandler(miscHandler.giveFAQ));

app.post("/data/mission/pt", substituteErrorHandler(drought.useractivity.giveMissionPt));

app.post("/data/mission/specmsi", async (q, s) => s.send(UserActivity.special_missions));

app.post("/data/event", drought.resFile(__dirname + "/.data/event/all.json"));

app.post("/data/gawries", async (q, s) => s.send(Orgument.crowd_status));

app.post("/data/spirit", async (q, s) => s.send({ b: miscHandler.band_delay, d: miscHandler.dance_delay }));


app.post("/search", substituteErrorHandler(miscHandler.giveSearchResult));


app.post("/collect", substituteErrorHandler(miscHandler.countCollect));


app.get("/share_panel", drought.resFile(__dirname + "/resources/html-ctx/share.html"));


app.get(["/test/", "/test/@", "/test/@:PARAMS"], drought.resFile(__dirname + "/test/index.html"));


app.get("/org/manage/login", drought.resFile(__dirname + "/src/manage/org/login.html"));

app.get("/org/manage/menu", OrgAuth.getAuthed(__dirname + "/src/manage/org/menu.html"));

app.get("/org/manage/edit", OrgAuth.getAuthed(__dirname + "/src/manage/org/editor.html"));

app.get("/org/manage/admission", OrgAuth.getAuthed(__dirname + "/src/manage/org/admission.html"));

app.get("/org/manage/status", OrgAuth.getAuthed(__dirname + "/src/manage/org/status.html"));

app.get("/org/manage/ticket", OrgAuth.getTicketAuthed(__dirname + "/src/manage/org/ticket.html"));


app.post("/admin/e/login", miscHandler.login);

app.get("/admin/login", drought.resFile(__dirname + "/src/manage/admin/login.html"));

app.get("/admin/scheduler", MiscAuth.getAuthed(__dirname + "/src/manage/admin/scheduler.html", "scheduler"));

app.get("/admin/update", MiscAuth.getAuthed(__dirname + "/src/manage/admin/update.html", "update"));

app.post("/admin/setter/schedule", miscHandler.setScheduleDelay);

app.post("/admin/update/map_objects", Updater.mapObjects);

app.post("/admin/update/ranking", Updater.ranking);

app.post("/admin/update/visitpt", Updater.visitPT);

app.post("/admin/update/st_visitpt", Updater.strictVisitPT);

app.post("/admin/update/spt", (q, s) => s.send({ d: Orgument.visitpt_stricted }));

app.post("/admin/sql/userdb", Updater.runUserDBSQL);


app.get(["/dev", "/dev@", "/dev@:PARAMS", "/dev/@", "/dev/@:PARAMS"], drought.resMainApp("general", __dirname + "/test/index_dev.html"));

app.get(["/test", "/test@", "/test@:PARAMS", "/test/@", "/test/@:PARAMS"], drought.resMainApp("general", __dirname + "/test/index.html"));


app.get(["/student", "/student@", "/student@:PARAMS", "/student/@", "/student/@:PARAMS"], drought.resMainApp("student", __dirname + "/src/main/index.min.html"));

app.get(["/", "/@", "/@:PARAMS"], drought.resMainApp("general", __dirname + "/src/main/index.html"));


http.createServer((express()).all("*", function (request, response){
    response.redirect(`https://${HOST_NAME}${request.url}`);
})).listen(80);


server.listen(443, function(){
	writeLog("\n\n[main/info] [Server] Shishijifes Nodejs Server started.");
});
