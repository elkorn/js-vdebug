import cli from 'cli';

import {
  read,
  write
}
from '../src/utils/data';

import {
  getReferenceHandlers,
  scopeHandlers,
  variableHandlers
}
from '../src/node-handlers';

import traverse from '../src/verbs/traverse';
import formatSrc from '../src/verbs/format-src';

const work = input => {
  traverse({
    input: input,
    customHandlerGroups: [
      getReferenceHandlers
    ],
    done: ({
      ast, result
    }) => {
      console.log(result);
      write('formatted.html', formatSrc.showVariableUsage(input, result), path => {
        cli.ok(`Wrote ${path}`);
      });
    }
  });
};

export
default {
  run(filename) {
    if (filename) {
      read(filename, input => {
        work(input);
      });
    } else {
      cli.fatal('Provide a file to analyze. It must be in the data/in directory.');
    }
  },

  usage() {
    return 'Usage info about showUndeclaredVariables';
  },

  args() {
    return ['filename'];
  }
};
