import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import fs from "fs";
import https from "https";
import { Random } from "./random";
import * as mapObjAPI from "./mapObjs";


const PORT = 443;
const app = express();
const httpsOptions = {
    cert: fs.readFileSync("./.cert/dev/fullchain.pem").toString("utf-8"),
    key: fs.readFileSync("./.cert/dev/privkey.pem").toString("utf-8")
};
const mapConfData = readJSONSync("./src/server/data/map.json");
const server = https.createServer(httpsOptions, app);
const ws = new SocketIO(server);


//#region 
const mainCandidates = [
	"C:/server1/Shishiji/src/main/index.html",
	"/root/Shishiji/src/main/index.html"
];
var mainFilePath = "";
!function(){
	for (const n of mainCandidates){
		if (fs.existsSync(n)){
			mainFilePath = n;
			break;
		}
	}
	if (mainFilePath.length < 1){
		throw new Error("No file found from: " + mainCandidates);
	}
	return 0;
}();
//#endregion

function readJSONSync(path: string, options?: {
    encoding?: null | undefined;
    flag?: string | undefined;
}){
	return JSON.parse(String(fs.readFileSync(path, options)));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./"));



ws.on("connection", (socket) => {
	
	socket.on("/data/update/map-objects", (data) => {
		const mapobjects_ = mapObjAPI.getAllObjects(true);
		socket.emit("/client/update/map-objects", mapobjects_);
	});
});



app.post("/api/addobject/", (req, res) => {
	var alr = 0;
	try{
		var e = JSON.parse(req.body.c);
		var y = "./resources/map-objects/third-party/"+ req.body.n + ".json";
		if (fs.existsSync(y)) alr = 1;
		fs.writeFileSync(y, JSON.stringify(e, null, 4));
		mapObjAPI.updateObject();
		res.status(200).send("ok");
	} catch (E){
		res.status(500).send({a: alr});
	}
});



app.get("/data/map-data/objects", (req, res) => {
	const mapobjects_ = mapObjAPI.getAllObjects(false);
	res.send(mapobjects_);
});

app.get("/data/map-data/conf", (req, res) => {
	res.send(mapConfData);
});


app.get("/", function(req, res){
	res.sendFile(mainFilePath);
});



http.createServer((express()).all("*", function (request, response) {
    response.redirect(`https://${request.hostname}${request.url}`);
})).listen(80);


server.listen(PORT, function(){
	console.log("socketio, express server listening on port: "+PORT);
});
