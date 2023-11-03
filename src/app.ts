import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import fs from "fs";
import https from 'https';
import { certJSON } from "./propaties";

const port = 25565;
const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
const https_cert: certJSON = {
  	key: "",
  	cert: "",
}


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./"));


app.get("/", function(req, res){
	res.sendFile("C:/server1/Shishiji/src/main/index.html");
})

server.listen(port, function(){
	console.log("socketio, express server listening on port "+port);
});
