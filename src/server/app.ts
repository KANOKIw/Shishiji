import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import fs from "fs";
import https from 'https';
import { Random } from "./random";
import * as mapObjAPI from "./mapObjs";


const port = 25565;
const app = express();
const server = http.createServer(app);
const ws = new SocketIO(server);
const https_cert = {
  	key: "",
  	cert: "",
}


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./"));



ws.on("connection", (socket) => {
	
	socket.on("/data/update/map-objects", (data) => {
		const mapobjects_ = mapObjAPI.getAllObjects(false);
		socket.emit("/client/update/map-objects", mapobjects_);
	});
});



app.post("/api/addobject/", (req, res) => {
	var alr = 0;
	try{
		var e = JSON.parse(req.body.c);
		var y = "./resources/map-objects/third-party"+ req.body.n + ".json";
		if (fs.existsSync(y)) {alr = 1;throw new Error();}
		fs.writeFileSync(y, JSON.stringify(e, null, 4));
		res.status(200).send("ok");
	} catch (E){
		res.status(500).send(alr);
	}
});



app.get("/data/map-objects", (req, res) => {
	const mapobjects_ = mapObjAPI.getAllObjects(false);
	res.send(mapobjects_);
});


app.get("/", function(req, res){
	res.sendFile("C:/server1/Shishiji/src/main/index.html");
})

server.listen(port, function(){
	console.log("socketio, express server listening on port "+port);
});
