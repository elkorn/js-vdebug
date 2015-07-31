'use strict';

var fs = require('fs');
var withAST = require('./withAST').withAST;

withAST(function(ast) {
    fs.writeFile('ast.json', JSON.stringify(ast, 'null', ' '), function(err, data) {
        if (err) {
            throw new Error('Error while writing: ' + err.message);
        }
    });
});
