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

        estraverse.traverse(ast, {
            enter: handlers.handle.bind(handlers, scopeChain)
        });

        if (done) {
            done({
                ast, scopeChain
            });
        }
    });
}
