import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import fs from "fs";
import https from "https";
import * as mapObjAPI from "./mapObjs";
import { readJSONSync, Random } from "./utils";
import * as PostHandler from "./handler/post";
import fileUpload from "express-fileupload";



const PORT = 443;
const app = express();
const httpsOptions = {
    cert: fs.readFileSync("./.cert/dev/fullchain.pem").toString("utf-8"),
    key: fs.readFileSync("./.cert/dev/privkey.pem").toString("utf-8")
};
const mapConfData = readJSONSync("./src/server/data/map.json");
const server = https.createServer(httpsOptions, app);
const ws = new SocketIO(server);

__dirname = __dirname.replace(/[/, \\]src[/, \\]server/, "");


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("./"));


ws.on("connection", (socket) => {
	
	socket.on("/data/update/map-objects", (data) => {
		const mapobjects_ = mapObjAPI.getAllObjects(true);
		socket.emit("/client/update/map-objects", mapobjects_);
	});


	socket.on("disconnect", (reason) => {
		
	});
});



app.post("/org/manage/auth/login", PostHandler.OrgAuth.login);

app.post("/org/manage/auth/_login", PostHandler.OrgAuth._login)

app.post("/org/manage/auth/editor", PostHandler.OrgAuth.editor);

app.post("/org/manage/edit/saveothers", PostHandler.Edit.saveothers);

app.post("/org/manage/edit/savemain", PostHandler.Edit.savemain);

app.post("/org/manage/file/list", PostHandler.File.list);

app.post("/org/manage/file/overflow", PostHandler.File.overflow);

app.post("/org/manage/file/upload", PostHandler.File.upload);

app.post("/org/manage/file/delete", PostHandler.File.delete);



app.get("/data/map-data/objects", (req, res) => {
	const mapobjects_ = mapObjAPI.getAllObjects(false);
	res.send(mapobjects_);
});

app.get("/data/map-data/conf", (req, res) => {
	res.send(mapConfData);
});

app.get(["/test/", "/test/@:PARAMS"], function(req, res){
	res.sendFile(__dirname + "/test/index.html");
});



app.get("/org/manage/edit", function(req, res){
	res.sendFile(__dirname + "/src/manage/org/edit.html");
});

app.get("/org/manage/login", function(req, res){
	res.sendFile(__dirname + "/src/manage/org/login.html");
});


app.get(["/", "/@:PARAMS"], function(req, res){
	res.sendFile(__dirname + "/test/index.html");
});



http.createServer((express()).all("*", function (request, response) {
    response.redirect(`https://${request.hostname}${request.url}`);
})).listen(80);


server.listen(PORT, function(){
	console.log("socketio, express server listening on port: "+PORT);
});
