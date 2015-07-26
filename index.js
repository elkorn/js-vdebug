import getReferenceHandlers from './getReferenceHandlers';
import traverse from './traverse';
import formatSrc from './formatSrc';
import fs from 'fs';

import log from './log';

let input;
if(process.argv[2]) {
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
