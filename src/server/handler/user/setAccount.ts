import { Request, Response, NextFunction as Next } from "express";
import { UserAuth } from "./auth";
import { random } from "./doubt";


export async function setAccount(isstudent: boolean, req: Request, res: Response): Promise<void>{
	const sid = req.cookies["__shjSID"] || "";

	return new Promise(async resolve => {
		try{
			await UserAuth.fineData(sid);
			resolve();
		} catch(e){
			const userdat = await UserAuth.newUser(isstudent);
			const session = random.string(64); // how do we need warrant
			const date = new Date();


			await UserAuth.insertSession(userdat.discriminator, session);
	
			date.setMonth(date.getMonth() + 1);
	
			res.cookie("__shjSID", session, { path: "/", expires: date });

			resolve();
		}
	});
}


export { }
