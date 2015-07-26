import getReferenceHandlers from './getReferenceHandlers';
import traverse from './traverse';
import fs from 'fs';

import log from './log';

let input;
if(process.argv[2]) {
  input = fs.readFileSync(process.argv[2]);
}

traverse({
  input: input,
  customHandlerGroups: [
    getReferenceHandlers
  ],
  done: ({
    ast, result
  }) => {
    fs.writeFile('syntax.json', JSON.stringify(result, null, '  '));
  }
});
