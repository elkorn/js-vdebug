'use strict';

import cli from 'cli';

import {
  write
}
from '../src/utils/data';

import makeAST from '../src/verbs/makeAST';

makeAST(function(ast) {
  write('ast.json', JSON.stringify(ast, null, ' '), (err, data, path) => {
    if (err) {
      cli.fatal(err.message);
      return;
    }

    cli.ok(`Wrote ${path}`);
  });
});
