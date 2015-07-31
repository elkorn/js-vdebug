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

export default function(input, callback) {
  if (typeof input === 'string') {
    callback(esprima.parse(input, OPTIONS));
  } else {
    withDefaultInput(function(data) {
      if(typeof input === 'function') {
        input(esprima.parse(data));
      } else {
        callback(esprima.parse(data));
      }
    });
  }
}
