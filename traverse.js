import esprima from 'esprima';
import {
    withAST
}
from './withInput';
import estraverse from 'estraverse';
import NodeHandlers from './NodeHandlers';
import ScopeChain from './ScopeChain';

export
default

function(customHandlers, done) {
    const handlers = new NodeHandlers(customHandlers);

    withAST(function(ast) {
        let scopeChain = new ScopeChain();
        let scopes = [];

        estraverse.traverse(ast, {
            enter: handlers.handle.bind(handlers, scopeChain),
            leave: node => {
                switch (node.type) {
                case esprima.Syntax.FunctionDeclaration:
                case esprima.Syntax.FunctionExpression:
                case esprima.Syntax.Program:
                    scopes.unshift(scopeChain.pop());
                }
            }
        });

        if (done) {
            done({
                ast, scopes
            });
        }
    });
}
