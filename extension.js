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

vscode.commands.registerCommand('my-extension.analyzeCode', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const code = editor.document.getText(selection);

  try {
    const analysis = await analyzeCode(code);
  
    // Improved logic for displaying analysis (replace placeholders with your logic)
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
});

vscode.window.onDidChangeTextEditorSelection(async (e) => {
  // Optionally, trigger analysis automatically on selection change
  // ...
});
