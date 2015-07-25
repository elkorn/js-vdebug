import esprima from 'esprima';
import estraverse from 'estraverse';
import _ from 'lodash';

import {
    withAST
}
from './withInput';

import NodeHandlers from './NodeHandlers';
import ScopeChain from './ScopeChain';

export
default
function(customHandlerGroups, done) {
    const handlerGroups = customHandlerGroups.map(customHandlers => new NodeHandlers(customHandlers));

    withAST(function(ast) {
        let scopeChain = new ScopeChain();
        let scopes = [];

        estraverse.traverse(ast, {
            enter: _.compose.apply(
                _,
                handlerGroups.map(handlers => handlers.handle.bind(handlers, scopeChain))),
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
