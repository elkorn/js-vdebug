'use strict';

import {
  read
}
from '../utils/data';

import esprima from 'esprima';

const OPTIONS = {
  loc: true
};

function withDefaultInput(callback) {
  read('input.js', function(err, data, path) {
    if (err) {
      throw new Error('Error while reading: ' + err.message);
    }

    callback(data, path);
  });
}

function withAST(input, callback) {
  if (input) {
    callback(esprima.parse(input, OPTIONS));
  } else {
    withDefaultInput(function(data) {
      callback(esprima.parse(data));
    });
  }
}

exports.withAST = withAST;
