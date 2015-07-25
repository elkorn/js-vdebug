'use strict';

var fs = require('fs');
var withAST = require('./withInput').withAST;

console.log(require('esprima').Syntax);
withAST(function(ast) {
    fs.writeFile('syntax.json', JSON.stringify(ast, 'null', ' '), function(err, data) {
        if (err) {
            throw new Error('Error while writing: ' + err.message);
        }

        console.log('all done!');
    });
});
