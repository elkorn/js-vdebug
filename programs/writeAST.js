'use strict';

import cli from 'cli';

import {
  read,
  write
}
from '../src/utils/data';

import makeAST from '../src/verbs/makeAST';

export
default {
  run(filename) {
    makeAST(function(ast) {
      write('ast.json', JSON.stringify(ast, null, ' '), (data, path) => {
        cli.ok(`Wrote ${path}`);
      });
    });
  },

  args() {
    return ['filename'];
  }
};
