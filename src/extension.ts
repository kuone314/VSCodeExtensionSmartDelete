import * as vscode from 'vscode';
import * as Enumerable from "linq-es2015";


///////////////////////////////////////////////////////////////////////////////////////////////////
function isSingleCullet(selecion: vscode.Range): vscode.Position | null {
	if (!selecion.start.isEqual(selecion.end)) { return null; }
	return selecion.start;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
function smartDelete(editor:vscode.TextEditor){
	const removeRangeAry = Enumerable.from(editor.selections).Select(
		orgSelection => {
			return getSmartDeleteRemoveRange(editor.document, orgSelection);
		}
	).ToArray();

	editor.edit(editBuilder => {
		for(const removeRange of removeRangeAry){
			editBuilder.replace(removeRange, "");
		}
	});
}

function getSmartDeleteRemoveRange(document: vscode.TextDocument, orgSelection: vscode.Selection): vscode.Range {
	const pos = isSingleCullet(orgSelection);
	if (!pos) { return orgSelection; }

	if (!isLineEnd(document, pos)) { return new vscode.Range(pos, pos.translate(0, 1)); }

	const nextLine = getNextLine(document, orgSelection.end.line);
	if (!nextLine) { return orgSelection; }

	const blanksNum = nextLine.firstNonWhitespaceCharacterIndex;
	const nextPos = nextLine.range.start.translate(0,blanksNum);
	return new vscode.Selection(orgSelection.start, nextPos);
}

function isLineEnd(document: vscode.TextDocument, pos: vscode.Position): boolean {
	const line = document.lineAt(pos);
	return line.range.end.isEqual(pos);
}

function getNextLine(document: vscode.TextDocument, lineNum: number): vscode.TextLine | null {
	const nextLineNum = lineNum + 1;
	if (nextLineNum >= document.lineCount) { return null; }
	return document.lineAt(nextLineNum );
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
