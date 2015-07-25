import {
    withAST
}
from './withInput';
import estraverse from 'estraverse';
import _ from 'lodash';
import esprima from 'esprima';
import NodeHandlers from './NodeHandlers';
import {
    nodeHandler, inCurrentScope
}
from './decorators';

import ScopeChain from './ScopeChain';
import Scope from './Scope';

const addNewScope = nodeHandler(({
    scopeChain, node
}) => {
    const scope = new Scope();
    if (node.id) {
        scope.name = node.id.name;
    }

    scope.type = node.type;
    if (node.params) {}

    scopeChain.push(scope);
});

const addFunctionParams = inCurrentScope(({
    scope, node
}) => {
    scope.params = node.params.map(_.property('name'));
});

const addVariable = inCurrentScope(({
    scope, node
}) => {
    scope.variables.push(node.id.name);
});

const addNewFunctionScope = _.compose(
    addFunctionParams,
    addNewScope);

const handlers = new NodeHandlers({
    [esprima.Syntax.Program]: addNewScope,
    [esprima.Syntax.FunctionDeclaration]: addNewFunctionScope,
    [esprima.Syntax.FunctionExpression]: addNewFunctionScope,
    [esprima.Syntax.VariableDeclarator]: addVariable
});

withAST(function(ast) {
    let scopeChain = new ScopeChain();

    estraverse.traverse(ast, {
        enter: handlers.handle.bind(handlers, scopeChain)
    });

    console.log(scopeChain.toString());
});
