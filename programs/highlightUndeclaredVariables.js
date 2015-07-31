import fs from 'fs';

import {
  getReferenceHandlers,
  scopeHandlers,
  variableHandlers
}
from '../src/node-handlers';

import traverse from '../verbs/traverse';
import formatSrc from '../verbs/formatSrc';

import log from '../utils/log';

let input;
if (process.argv[2]) {
  input = fs.readFileSync(process.argv[2], 'utf-8');
}

traverse({
  input: input,
  customHandlerGroups: [
    getReferenceHandlers
  ],
  done: ({
    ast, result
  }) => {
    fs.writeFile('formatted.html', formatSrc.highlightProblems(input, result));
    fs.writeFile('syntax.json', JSON.stringify(result, null, '  '));
  }
});
