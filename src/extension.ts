import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('smart-delete.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from smart delete!');
	});

	context.subscriptions.push(disposable);
}
