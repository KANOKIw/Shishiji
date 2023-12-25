import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";



export async function createConfigFile(){
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	
	if (!workspaceFolder)
		return;

	const baseconfig = {
		startupfiles: [
			""
		]
	};
	const filePath = vscode.Uri.joinPath(workspaceFolder.uri, ".vscode", "ofos.json");
	
	fs.writeFileSync(filePath.fsPath, JSON.stringify(baseconfig, null, 4));

	const doc = await vscode.workspace.openTextDocument(filePath);
	await vscode.window.showTextDocument(doc);
	
	const editor = vscode.window.activeTextEditor;

	if (!editor) return;

	const newpos = new vscode.Position(3, 12);
	const newsel = new vscode.Selection(newpos, newpos);

	editor.selection = newsel;
	editor.revealRange(newsel);
}


export function openFileCompletely(filepath: string){
	vscode.workspace.openTextDocument(filepath)
	.then(doc => {
		vscode.window.showTextDocument(doc, { preview: false });
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
  


export function activate(context: vscode.ExtensionContext){
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	
	if (!workspaceFolder)
		return;

	const cfgpath = path.join(workspaceFolder.uri.fsPath || "", ".vscode", "ofos.json");

	if (!fs.existsSync(cfgpath))
		return;

	const ofosConfig = JSON.parse(fs.readFileSync(cfgpath, "utf8"));
	const startupFiles: string[] = ofosConfig.startupfiles || [];


	startupFiles.map(p => { if (p.startsWith("./")) return p.slice(2); else return p; });
	startupFiles.forEach((fn: string) => {
		const fp = path.join(workspaceFolder.uri.fsPath, fn);

		function leavetry(){
			throw new Error();
		}

		if (fs.existsSync(fp)){
			openFileCompletely(fp);
		} else {
			try{
				const dir = path.dirname(fp);
				
				if (!fs.existsSync(dir)) 
					leavetry();
				
				if (fp.endsWith("*^childdir")){
					const files = fs.readdirSync(dir);

					for (const fn of files){
						const absp = path.join(dir, fn);
						if (!fs.statSync(absp).isDirectory())
							openFileCompletely(absp);
					}
				} else if (fp.endsWith("*")){
					const files = listFiles(dir);

					for (const fn of files){
						openFileCompletely(path.join(dir, fn));
					}
				} else {
					leavetry();
				}
			} catch (e){
				vscode.window.showErrorMessage(`Failed opening file: ${fp}`);
			}
		}
	});


	const disposable = vscode.commands.registerCommand("ofos.createConfigFIle", createConfigFile);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
