'use strict';

import esprima from 'esprima';
import cli from 'cli';

import {
  write
}
from '../src/utils/data';

const PATH = 'esprima-syntax.json';

export
default {
  run() {
    write(PATH, JSON.stringify(esprima.Syntax, null, ' '), path => {
      cli.ok(`Wrote ${PATH}.`);
    });
  },

  usage() {
    return '';
  },

  args() {
    return [];
  }
};
