import cli from 'cli';

import {
  read,
  write
} from '../src/utils/data';

import {
  getReferenceHandlers,
  scopeHandlers,
  variableHandlers
}
from '../src/node-handlers';

import traverse from '../src/verbs/traverse';
import formatSrc from '../src/verbs/formatSrc';

const work = input => {
  traverse({
    input: input,
    customHandlerGroups: [
      getReferenceHandlers
    ],
    done: ({
      ast, result
    }) => {
      write('formatted.html', formatSrc.highlightProblems(input, result), (err, path) => {
        cli.ok(`Wrote ${path}`);
      });
    }
  });
};

if (process.argv[2]) {
  read(process.argv[2], (err, input, path) => {
    if(err) {
      cli.fatal(err.message);
    }

    work(input);
  });
} else {
  cli.fatal('Provide a file to analyze. It must be in the data/in directory.');
}
