import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as file from "./file";


export function openStartupFiles(): void{
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	const leditor = vscode.window.activeTextEditor;
	
	if (!workspaceFolder)
		return;

	const cfgpath = path.join(workspaceFolder.uri.fsPath || "", ".vscode", "ofos.json");

	if (!fs.existsSync(cfgpath))
		return;

	const ofosConfig = file.getConfigData();
	const enabled: boolean = (ofosConfig?.enabled || ofosConfig?.enabled === void 0) ? true : false;
	const startupFiles: string[] = ofosConfig?.startupfiles || [];

	if (!enabled)
		return;


	startupFiles.map(p => { if (p.startsWith("./")) return p.slice(2); else return p; });
	startupFiles.forEach((fn: string) => {
		const fp = path.join(workspaceFolder.uri.fsPath, fn);

		function leavetry(){
			throw new Error();
		}

		if (fs.existsSync(fp) && !fs.statSync(fp).isDirectory()){
			file.openFileCompletely(fp);
		} else {
			try{
				const dir = path.dirname(fp.slice(0, fp.lastIndexOf("*")+1));
				const excludeOptions = fp.replace(dir, "").slice(3);
				var excludes: string[] = [];
				
				
				if (excludeOptions.startsWith("[") && excludeOptions.endsWith("]"))
					excludes = excludeOptions.slice(1, excludeOptions.length -1).split(" ").map(t => { return "/" + t.replace(/ /g, ""); });
				else
					excludes.push("/" + excludeOptions.replace(/ /g, ""));

				
				if (!fs.existsSync(dir) || !fp.includes("*")) 
					leavetry();
				

				if (excludes.length == 1 && excludes[0] == "/"){
					const files = file.listFiles(dir);

					for (const fn of files){
						file.openFileCompletely(path.join(dir, fn));
					}
				} else if (excludes.length == 1 && excludes[0] == "/*"){
					const files = fs.readdirSync(dir);

					for (const fn of files){
						const absp = path.join(dir, fn);

						if (!fs.statSync(absp).isDirectory())
							file.openFileCompletely(absp);
					}
				} else if (excludes.length > 0){
					const files = file.listFiles(dir);

					excludes = excludes.filter(o => { if (o != "/") return true; })

					for (const fn of files){
						const absp = path.join(dir, fn);
						
						if (excludes.some(p => {
							const _pat = file.toSlashPath(p);
							if (file.toSlashPath(fn).startsWith(_pat.endsWith("/") ? _pat : _pat+"/"))
								return true;
						})) continue;
						
						if (!fs.statSync(absp).isDirectory())
							file.openFileCompletely(absp);
					}
				}
			} catch (e){
				var adjust = ". \n";
				
				switch (fn){
					case "":
						adjust += 'Did you mean "*"?';
				}

				vscode.window.showErrorMessage(
					`Error handling with path: "${fn}"${adjust}`
				);
			}
		}
	});

    if (leditor)
		file.openFileCompletely(leditor.document.uri.fsPath, true);

	return;
}


export async function createConfigFile(): Promise<unknown>{
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	
	if (!workspaceFolder)
		return;

	const baseconfig = {
		enabled: true,
		startupfiles: [
			""
		]
	};
	const filePath = vscode.Uri.joinPath(workspaceFolder.uri, ".vscode", "ofos.json");

	if (!fs.existsSync(filePath.fsPath))
		file.writeConfigData(baseconfig);
	else
		file.fixConfigData();

	return new Promise(async (resolve, reject) => {
		const doc = await vscode.workspace.openTextDocument(filePath);
		const editor = vscode.window.activeTextEditor;

		await vscode.window.showTextDocument(doc);
	
		if (!editor){
			resolve("");
			return;
		}
	
		const newpos = new vscode.Position(3, 11);
		const newsel = new vscode.Selection(newpos, newpos);
	
		editor.selection = newsel;
		editor.revealRange(newsel);

		resolve("");
	});
}


export { }
