import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('smart-delete.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from smart delete!');
		})
	);
}
