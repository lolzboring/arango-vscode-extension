// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AqlParser } from './AqlParser';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "arangodb" is now active!');
	const document: vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document;
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('arangodb.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Arangodb!');
	});

	let sendRequest = vscode.commands.registerCommand('arangodb.sendRequest', () => {
		if (document) {
			let text = document.getText();
			if (text) {
				let parser = new AqlParser(text);
				console.log(parser.query);
				vscode.window.showInformationMessage(parser.query);
			} else {
				vscode.window.showWarningMessage('Please open file with content.');
			}
		} else {
			vscode.window.showErrorMessage('Please open a file.');
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(sendRequest);
}

// This method is called when your extension is deactivated
export function deactivate() {}
