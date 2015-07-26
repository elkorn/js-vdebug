'use strict';

var fs = require('fs');
var esprima = require('esprima');

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
    callback(esprima.parse(input));
  } else {
    withDefaultInput(function(data) {
      callback(esprima.parse(data));
    });
  }
}

exports.withAST = withAST;
