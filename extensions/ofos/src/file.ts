import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { ConfigData } from "./ofos";


export function getConfigData(): ConfigData | null{
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder)
		return null;

	const fp = vscode.Uri.joinPath(workspaceFolder.uri, ".vscode", "ofos.json");
	const data = JSON.parse(fs.readFileSync(fp.fsPath, "utf-8"));
	return data;
}


export function writeConfigData(data: ConfigData): void{
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder)
		throw new Error("No work space");

	const fp = vscode.Uri.joinPath(workspaceFolder.uri, ".vscode", "ofos.json");
	try{ fs.mkdirSync(path.dirname(fp.fsPath)); }catch(e){}
	fs.writeFileSync(fp.fsPath, JSON.stringify(data, null, 4));
}


export function fixConfigData(): void{
	const data = getConfigData();
	const _data: ConfigData = {
		enabled: (data?.enabled || data?.enabled === void 0) ? true : false,
		startupfiles: data?.startupfiles || [""],
	};
	
	writeConfigData(_data);
}


export function openFileCompletely(filepath: string, focus?: boolean): void{
	vscode.workspace.openTextDocument(filepath)
	.then(doc => {
		vscode.window.showTextDocument(doc, { preview: false, preserveFocus: !focus, });
	});
}


export function listFiles(dir: string): string[]{
	const files: string[] = [];
  
	function tverse(cdir: string){
	  	const ims = fs.readdirSync(cdir);
  
	  	for (const im of ims){
			const impath = path.join(cdir, im);
	
			if (fs.statSync(impath).isDirectory()){
				tverse(impath);
			} else {
				files.push(impath);
			}
	  	}
	}

	tverse(dir);
	return files.map(f => { return f.replace(dir, ""); });
}


export function toSlashPath(path: string){
	return path.replace(/\\/g, "/")
			   .replace(/\\\\/g, "/")
			   .replace(/\/\//g, "/");
}


export { }
