import * as vscode from "vscode";
import * as file from "./file";

import { openStartupFiles, createConfigFile } from "./handler";


export function activate(context: vscode.ExtensionContext): void{
	openStartupFiles();

	const disposable = vscode.commands.registerCommand("ofos.createConfigFIle", createConfigFile);

	context.subscriptions.push(disposable);
}


export {}
