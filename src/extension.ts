import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('smart-delete.smartDelete', () => {
			vscode.window.showInformationMessage('smartDelete!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('smart-delete.smartBackspace', () => {
			vscode.window.showInformationMessage('smartBackspace!');
		})
	);
}
