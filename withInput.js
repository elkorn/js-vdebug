'use strict';

const fs = require('fs');
const esprima = require('esprima');

const OPTIONS = {
  loc: true
};

function withDefaultInput(callback) {
  fs.readFile('input.js', function(err, data) {
    if (err) {
      throw new Error('Error while reading: ' + err.message);
    }

    callback(data);
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
