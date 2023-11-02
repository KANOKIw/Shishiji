"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socket_io_1 = require("socket.io");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 80;
const crypto = require("crypto");
const https = require('https');


const options = {
    /*key: fs.readFileSync("/Certbot/live/kanokiw.com/privkey.pem"),
    cert: fs.readFileSync("/Certbot/live/kanokiw.com/cert.pem"),
    ca: [fs.readFileSync("/Certbot/live/kanokiw.com/chain.pem"), fs.readFileSync("/Certbot/live/kanokiw.com/fullchain.pem")]*/
};

var Random = /** @class */ (function () {
    function Random() {
    }
    /**
     * Returns a pseudorandomly chosen int value between the specified origin (inclusive) and the specified bound (inclusive).
     * @param {number} origin the least value that can be returned
     * @param {number} bound the upper bound (inclusive) for the returned value
     *
     * @returns a pseudorandomly chosen int value between the origin (inclusive) and the bound (inclusive)
     * @throws IllegalArgumentException - if origin is greater than or equal to bound
     */
    Random.prototype.nextInt = function (origin, bound) {
        if (origin === undefined && bound === undefined) {
            var num = Math.random();
            return num > 0.5 ? 1 : 0;
        }
        return Math.floor(Math.random() * (bound - origin + 1)) + origin;
    };
    Random.prototype.string = function (length) {
        var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (!length)
            length = 16;
        return Array.from(crypto.getRandomValues(new Uint8Array(length))).map((n)=>S[n%S.length]).join('');
    };
    /**
     * Random choices from given Array
     * @param {Array<any>} list
     * @returns any
     */
    Random.prototype.randomChoice = function (list) {
        return list[this.nextInt(0, list.length - 1)];
    };
    return Random;
}());

var random = new Random();

function time() {
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth();
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    if (month < 10)
        month = "0".concat(month);
    if (date < 10)
        date = "0".concat(date);
    if (hour < 10)
        hour = "0".concat(hour);
    if (minute < 10)
        minute = "0".concat(minute);
    if (second < 10)
        second = "0".concat(second);
    return "[".concat(year, "-").concat(month, "-").concat(date, " ").concat(hour, ":").concat(minute, ":").concat(second, "]");
}


function _time()
{
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth();
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    if (month < 10)
        month = "0".concat(month);
    if (date < 10)
        date = "0".concat(date);
    if (hour < 10)
        hour = "0".concat(hour);
    if (minute < 10)
        minute = "0".concat(minute);
    if (second < 10)
        second = "0".concat(second);
    return [year, "/", month, "/", date, " ", hour, ":", minute, ":", second].join("");
}


function getJSON(path, encoding){
    if (!encoding){
        encoding = "utf-8";
    }
    return JSON.parse(fs.readFileSync(path, encoding));
}


function getParam(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function toAbsPath(url, html){
    var _url = new URL(url);
    var domain = _url.origin;
    // startsWith("/[^/]");
    html = html.replaceAll(/(src|href|content)="\/([^\/].*?)"/g, '$1="' + domain + '/$2"');
    html = html.replaceAll(/url\("\/([^\/].+)"\)/g, 'url("' + domain + '/$1")');
    // startsWith("./");
    html = html.replaceAll(/(src|href|content)="\.\/(.*?)"/g, '$1="' + url.substring(0, url.lastIndexOf("/")) + '/$2"');
    html = html.replaceAll(/url\("\.\/(.+)"\)/g, 'url("' + url.substring(0, url.lastIndexOf("/")) + '/$1")');
    // startsWith("//");
    html = html.replaceAll(/(src|href|content)="\/\/(.*?)"/g, '$1="' + _url.protocol + '//$2"');
    html = html.replaceAll(/url\("\/\/(.+)"\)/g, 'url("' +  _url.protocol + '//$1")');
    return html;
}


function addInterval(html, url){
    html += `\n<script id="__THIRD_PARTY_kanokiw.com__">\n`;
    html += `const __ORIGINAL_URL__ = "${url}";\n`;
    html += fs.readFileSync("./src/js/__THIRD_PARTY_kanokiw.com__.js");
    html += "\n</script>";
    return html;
}


function reNewTitle(html, title){
    var ori = html;
    var html = html.replaceAll(/(<title[^>]*>)(.*?)<\/title>/gi, "$1$2" + title + "</title>");
    return html;
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./"));

var server = http.createServer(options, app);
var io = new socket_io_1.Server(server, {

});

io.on("connection", function (socket) {
    socket.on("disconnect", function(event){

    });
});


server.listen(PORT, function () {
    console.log("".concat(time(), " Running Express Server at mode:").concat(PORT));
});

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "/src/lost/index.html");
});
