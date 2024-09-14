import * as vscode from "vscode";
import path from "path";
import child_process from "child_process";
import fs from "fs";

import { listFiles, toSlashPath } from "./file";


export function activate(context: vscode.ExtensionContext){
	const do_workspace_directory = vscode.commands.registerCommand("npmr.do_workspace_directory", async function(){
		const workspacefoldor = vscode.workspace.workspaceFolders?.[0];

		if (workspacefoldor){
			const workspace = workspacefoldor.uri.fsPath;
			const packageJsonPath = path.join(workspace, "package.json");

			if (fs.existsSync(packageJsonPath)){
				const bar = setInstallingBar();
				await installDependencies(packageJsonPath, true);
				bar.dispose();
			} else {
				vscode.window.showErrorMessage("No package.json found in the workspace.");
			}
		} else {
			vscode.window.showErrorMessage("No workspace opened.");
		}
	});
	const do_all_directory = vscode.commands.registerCommand("npmr.do_all_directory", async function(){
		const workspacefoldor = vscode.workspace.workspaceFolders?.[0];

		if (workspacefoldor){
			const workspace = workspacefoldor.uri.fsPath;
			const packageJsonPaths = listFiles(workspace)
			.filter(_path => {
				if (path.basename(_path) === "package.json" && !toSlashPath(_path).includes("/node_modules/"))
					return true;
			})
			.map(_path=> {
				return path.join(workspace, _path);
			});
			
			if (packageJsonPaths.length == 0){
				vscode.window.showErrorMessage("No package.json found under the workspace.");
			} else {
				const installation: Promise<void>[] = [];
				const bar = setInstallingBar();

				for (const packageJsonPath of packageJsonPaths){
					installation.push(installDependencies(packageJsonPath));
				}
				Promise.all(installation)
				.then(rs => {
					bar.dispose();
				});
			}
		} else {
			vscode.window.showErrorMessage("No workspace opened.");
		}
	});

	context.subscriptions.push(do_workspace_directory, do_all_directory);
}


async function installDependencies(pkgjsonpath: string, showerr?: boolean){
	const packageJson = JSON.parse(fs.readFileSync(pkgjsonpath, { encoding: "utf-8" }));
	const dependenciesMap: {[key: string]: string} = packageJson["dependencies"] || {};
	const devDependenciesMap: {[key: string]: string} = packageJson["devDependencies"] || {};
	const enginesMap: {[key: string]: string} = packageJson["devDependencies"] || {};
	const dir = path.dirname(pkgjsonpath);

	if (Object.keys({ ...dependenciesMap, ...devDependenciesMap, ...enginesMap }).length > 0){
		const dependencies: string[] = [];
		const devDependencies: string[] = [];
		const engines: string[] = [];

		for (const name in dependenciesMap){
			const version: string = dependenciesMap[name];
			dependencies.push(name.concat("@", version.slice(1)));
		}
		for (const dname in devDependenciesMap){
			const version: string = devDependenciesMap[dname];
			devDependencies.push(dname.concat("@", version.slice(1)));
		}
		for (const ename in devDependenciesMap){
			const version: string = enginesMap[ename];
			engines.push(ename.concat("@", version.slice(1)));
		}

		const command = "npm install ".concat([ ...dependencies, ...devDependencies, ...engines ].join(" "));
		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

		statusBarItem.text = "$(sync~spin) Installing dependencies";
		statusBarItem.show();

		process.chdir(dir);
		child_process.exec(command, (err) => {
			statusBarItem.dispose();
			if (err){
				vscode.window.showErrorMessage(`Error while installing package: \nDirectory: ${dir}, Error: ${err.message}`);
				return;
			}
			vscode.window.showInformationMessage(`Directory: ${dir}\ndependencies: ${dependencies.length > 0 ? dependencies.join(", ") : "none"}
			\ndevDependencies: ${devDependencies.length > 0 ? devDependencies.join(", ") : "none"}
			\nengines: ${engines.length > 0 ? engines.join(", ") : "none"}`);
		});
	} else if (showerr){
		vscode.window.showInformationMessage("No dependencies or devDependencies found in package.json.",);
	}
}


function setInstallingBar(){
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

	statusBarItem.text = "$(sync~spin) Installing dependencies";
	statusBarItem.show();

	return statusBarItem;
}


export { }
