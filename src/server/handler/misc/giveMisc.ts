import * as mapObjAPI from "../../mapobjs";
import fs from "fs";
import axios from "axios";
import { Request, Response } from "express";
import { Orgument } from "../org/orgument";
import { countAccess, countDB, websocketio } from "../../drought";
import { MiscAuth } from "./auth";
import { Actype } from "./dts/misc";


export var band_delay = Number(fs.readFileSync("./.data/event/delay/band_delay"));
export var dance_delay = Number(fs.readFileSync("./.data/event/delay/dance_delay"));
const misc_login_passwords = {
	scheduler: "qa_int",
	update: "kanokiw"
};


export async function giveArticle(req: Request, res: Response){
	const disc = req.query["discriminator"] || (req.body ? req.body.discriminator : "");
	const article = mapObjAPI.getArticle(disc);
	
	res.send({article: article, crowd: Orgument.crowd_status[disc], pt: Orgument.visit_pt_table[disc]});
}


export async function giveAllArticle(req: Request, res: Response){
	res.send({ article: mapObjAPI.ALL_MAP_OBJECTS_ARTICLE, crowd: Orgument.crowd_status});
}


export async function giveObjects(req: Request, res: Response){
	const mapobjects_ = mapObjAPI.getAllObjects(true);

	res.send(mapobjects_);
}


export async function giveFAQ(req: Request, res: Response){
	const about: string = req.body.about;
	const fp = "./resources/html-ctx/faq/"+about+".html";
	
	if (fs.existsSync(fp))
		res.status(200).sendFile(__dirname+fp.slice(1));
	else
		res.status(500).send("Internal Server Error");
}


/**
 * @deprecated
 * @param req 
 * @param res 
 */
export async function giveSearchResult(req: Request, res: Response){
	const search_query: string = req.query["q"] || req.body["query"];
	
    try{
		const response = await axios.post("http://127.0.0.1:5000/search", { query: search_query });
		res.json(response.data);
	} catch(e){
		res.status(500).send({ error: e });
		console.error(e)
	}
}


export async function countCollect(req: Request, res: Response){
	const content = req.body["f"];
	const count = Number(req.body["v"]) || 0;

	if (content == "adv"){
		const advtype = req.body["b"];
		const advnums: number[] = req.body["d"].split(" ").map((p: string) => Number(p));
	
		for (const num of advnums)
			countAccess("ad-"+advtype+"-"+num.toString());
	} else {
		countAccess(content, Number(count));
	}
	res.status(204).end();
}


export async function login(request: Request, response: Response){
	const password: string = request.body["password"];
	const actype: keyof Actype = request.body["actype"];

	if (actype && password && misc_login_passwords[actype] == password){
		const sid = await MiscAuth.setSession(response, actype);
		const date = new Date();

		date.setMonth(date.getMonth() + 1);

		response.cookie(`__msid-${actype}`, sid, { path: "/", expires: date });
		response.status(200).end();

		countAccess("admin-"+actype);
	} else {
		response.status(403).end();
	}
}


export async function setScheduleDelay(request: Request, response: Response){
	const auth = await MiscAuth.auth(request, "scheduler");
	const delay = Number(request.body["delay"]);
	const type: string = request.body["type"];

	if (auth && !Number.isNaN(delay) && ["band", "dance"].includes(type)){
		await fs.promises.writeFile(`./.data/event/${type}_delay`, delay.toString());
		
		switch(type){
			case "band":
				band_delay = delay;
				break;
			case "dance":
				dance_delay = delay;
				break;
		}
		
		websocketio.emit("data.delay", { b: band_delay, d: dance_delay });
		response.status(200).send({ message: "success" });
	} else if (Number.isNaN(delay)){
		response.status(400).end();
	} else {
		response.status(403).end();
	}
}


export { }
