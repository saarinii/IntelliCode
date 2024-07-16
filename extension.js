const vscode = require('vscode');

async function analyzeCode(code) {
  const response = await fetch('http://localhost:5000/get_analysis', {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to analyze code');
  }

  const analysis = await response.json();
  return analysis;
}

async function analyzeSelectedText(triggerText) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (selectedText.toLowerCase() === triggerText.toLowerCase()) {
    const code = editor.document.getText(editor.selection);
    try {
      const analysis = await analyzeCode(code);
      // Display analysis logic (refer to previous improvements)
      if (analysis.analysis) {
        vscode.window.showInformationMessage(`Analysis: ${analysis.analysis}`);
      } else if (analysis.error) {
        vscode.window.showErrorMessage(`Analysis Error: ${analysis.error}`);
      } else {
        vscode.window.showWarningMessage('Unexpected response from analysis server');
      }
    } catch (error) {
      vscode.window.showErrorMessage('Failed to analyze code');
    }
  }
}

vscode.commands.registerCommand('my-extension.analyzeSelection', () => {
  analyzeSelectedText("analyze"); // Replace "analyze" with your desired trigger text
});

vscode.commands.registerCommand('my-extension.analyzeRightClick', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const selection = editor.selection;

  const items = [{
    label: 'Analyze Selected Code',
    command: 'my-extension.analyzeSelection'
  }];

  const selectionKind = editor.selection.kind;
  if (selectionKind === vscode.TextSelectionKind.Empty) {
    // Optional: Disable the menu if no text is selected
    return;
  }

  const result = await vscode.window.showContextMenu(items);
  // ... handle user selection from the context menu (optional)
});

// Register the context menu command
vscode.extensions.onContextMenusRegistered(context => {
  context.addContextMenuItem({
    when: vscode.env.languageId === 'your-language-id', // Replace with the language your extension supports
    command: 'my-extension.analyzeRightClick',
  });
});
