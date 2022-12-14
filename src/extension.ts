import * as vscode from 'vscode';
import * as Enumerable from "linq-es2015";


///////////////////////////////////////////////////////////////////////////////////////////////////
function isSingleCullet(selecion: vscode.Range): vscode.Position | null {
	if (!selecion.start.isEqual(selecion.end)) { return null; }
	return selecion.start;
}

function isEmptyLine(document: vscode.TextDocument, lineMum: number): boolean {
	return (document.lineAt(lineMum).text.length === 0);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
function smartDelete(editor:vscode.TextEditor){
	editor.selections = Enumerable.from(editor.selections).Select(
		orgSelection => {
			return getSmartDeleteRemoveRange(editor.document, orgSelection);
		}
	).ToArray();

	vscode.commands.executeCommand('deleteRight');
}

function getSmartDeleteRemoveRange(document: vscode.TextDocument, orgSelection: vscode.Selection): vscode.Selection {
	const pos = isSingleCullet(orgSelection);
	if (!pos) { return orgSelection; }

	if (!isLineEnd(document, pos)) { return orgSelection; }
	if (isEmptyLine(document, pos.line)) { return orgSelection; }

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
	editor.selections = Enumerable.from(editor.selections).Select(
		orgSelection => {
			return getSmartBackspaceRemoveRange(editor.document, orgSelection);
		}
	).ToArray();

	vscode.commands.executeCommand('deleteLeft');
}

function getSmartBackspaceRemoveRange(document: vscode.TextDocument, orgSelection: vscode.Selection): vscode.Selection {
	const pos = isSingleCullet(orgSelection);
	if (!pos) { return orgSelection; }

	if (!isLineStart(document, pos)) { return orgSelection; }

	const prevLine = getPrevLine(document, orgSelection.end.line);
	if (!prevLine) { return orgSelection; }
	if (isEmptyLine(document, prevLine.lineNumber)) { return orgSelection; }
	const prevLineEnd = prevLine.range.end;

	const currLine = document.lineAt(orgSelection.end);
	const blanksNum = currLine.firstNonWhitespaceCharacterIndex;
	const currHeadPos = orgSelection.end.translate(0,blanksNum);

	return new vscode.Selection(prevLineEnd, currHeadPos);
}

function isLineStart(document: vscode.TextDocument, pos: vscode.Position): boolean {
	const line = document.lineAt(pos);
	return line.range.start.isEqual(pos);
}

function getPrevLine(document: vscode.TextDocument, lineNum: number): vscode.TextLine | null {
	const prevLineNum = lineNum - 1;
	if (prevLineNum <= 0) { return null; }
	return document.lineAt(prevLineNum );
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
