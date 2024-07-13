import openai
openai.api_key = ''

import pylint.lint
def analyze_code(code):
    pylint_opts = ['--disable=all', '--enable=E,F,W,C', '--output-format=text']
    pylint.lint.Run(pylint_opts + [code])

import subprocess
def analyze_code_with_flake8(code):
    result = subprocess.run(['flake8', '--stdin-display-name', 'stdin', '-'], input=code, text=True, capture_output=True)
    return result.stdout

from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import TerminalFormatter

def highlight_code(code):
    return highlight(code, PythonLexer(), TerminalFormatter())


