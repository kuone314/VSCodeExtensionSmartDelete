import * as vscode from 'vscode';
import * as Enumerable from "linq-es2015";

///////////////////////////////////////////////////////////////////////////////////////////////////
function smartDelete(editor:vscode.TextEditor){

}

///////////////////////////////////////////////////////////////////////////////////////////////////
function smartBackspace(editor:vscode.TextEditor){

}

///////////////////////////////////////////////////////////////////////////////////////////////////
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('smart-delete.smartDelete', () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) { return; }

			smartDelete(editor);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('smart-delete.smartBackspace', () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) { return; }

			smartBackspace(editor);
		})
	);
}
