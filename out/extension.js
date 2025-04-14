"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// Bracket highlighting functionality
const vscode = require("vscode");
let activeBracketDecorator;
// Create a decorator for active brackets
function createActiveBracketDecorator() {
    return vscode.window.createTextEditorDecorationType({
        fontWeight: "bold",
    });
}
// Bracket characters to monitor
const openingBrackets = ["(", "[", "{"];
const closingBrackets = [")", "]", "}"];
const bracketPairs = {
    "(": ")",
    "[": "]",
    "{": "}",
    ")": "(",
    "]": "[",
    "}": "{",
};
function findMatchingBracket(document, position) {
    // Get the character at the current position
    const line = document.lineAt(position.line).text;
    if (position.character >= line.length)
        return null;
    const currentChar = line.charAt(position.character);
    // Check if it's a bracket
    if (!openingBrackets.includes(currentChar) &&
        !closingBrackets.includes(currentChar)) {
        return null;
    }
    // Simple bracket matching algorithm
    // Note: For production, you'd want a more robust algorithm that handles nesting
    const searchChar = bracketPairs[currentChar];
    const isOpeningBracket = openingBrackets.includes(currentChar);
    // For opening brackets, search forward
    if (isOpeningBracket) {
        let nestingLevel = 1;
        for (let l = position.line; l < document.lineCount; l++) {
            const lineText = document.lineAt(l).text;
            let c = l === position.line ? position.character + 1 : 0;
            while (c < lineText.length) {
                if (lineText.charAt(c) === currentChar) {
                    nestingLevel++;
                }
                else if (lineText.charAt(c) === searchChar) {
                    nestingLevel--;
                    if (nestingLevel === 0) {
                        return new vscode.Position(l, c);
                    }
                }
                c++;
            }
        }
    }
    // For closing brackets, search backward
    else {
        let nestingLevel = 1;
        for (let l = position.line; l >= 0; l--) {
            const lineText = document.lineAt(l).text;
            let c = l === position.line ? position.character - 1 : lineText.length - 1;
            while (c >= 0) {
                if (lineText.charAt(c) === currentChar) {
                    nestingLevel++;
                }
                else if (lineText.charAt(c) === searchChar) {
                    nestingLevel--;
                    if (nestingLevel === 0) {
                        return new vscode.Position(l, c);
                    }
                }
                c--;
            }
        }
    }
    return null;
}
function updateBracketHighlight(editor) {
    if (!activeBracketDecorator) {
        activeBracketDecorator = createActiveBracketDecorator();
    }
    // Clear existing decorations
    editor.setDecorations(activeBracketDecorator, []);
    // Get current cursor position
    const position = editor.selection.active;
    // Check if cursor is at a bracket or next to one
    let bracketPos = position;
    const line = editor.document.lineAt(position.line).text;
    // Check current position
    let currentChar = line.charAt(position.character);
    let checkPositions = [position];
    // Also check one character to the left if we're not at the start of the line
    if (position.character > 0) {
        checkPositions.push(position.translate(0, -1));
    }
    for (const pos of checkPositions) {
        currentChar = editor.document.lineAt(pos.line).text.charAt(pos.character);
        if (openingBrackets.includes(currentChar) ||
            closingBrackets.includes(currentChar)) {
            const matchingPos = findMatchingBracket(editor.document, pos);
            if (matchingPos) {
                // Create decorations for both brackets
                const decorations = [
                    new vscode.Range(pos, pos.translate(0, 1)),
                    new vscode.Range(matchingPos, matchingPos.translate(0, 1)),
                ];
                // Apply the decorations
                editor.setDecorations(activeBracketDecorator, decorations);
                break;
            }
        }
    }
}
function activate(context) {
    // ... existing activation code ...
    // Create and register the active bracket decorator
    activeBracketDecorator = createActiveBracketDecorator();
    // Add listener for selection changes
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((event) => {
        updateBracketHighlight(event.textEditor);
    }));
    // Add listener for active editor changes
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            updateBracketHighlight(editor);
        }
    }));
}
function deactivate() {
    if (activeBracketDecorator) {
        activeBracketDecorator.dispose();
    }
}
//# sourceMappingURL=extension.js.map