'use strict';

var fs = require('fs');
var esprima = require('esprima');

function withInput(callback) {
    fs.readFile('input.js', function(err, data) {
        if (err) {
            throw new Error('Error while reading: ' + err.message);
        }

        callback(data);
    });
}

function withAST(callback) {
    withInput(function(data){
        callback(esprima.parse(data));
    });
}

exports.withInput = withInput;
exports.withAST = withAST;
