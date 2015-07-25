import esprima from 'esprima';
import _ from 'lodash';

import Scope from './Scope';
import Reference from './Reference';

import {
    nodeHandler, inCurrentScope
}
from './decorators';

export const addNewScope = nodeHandler(({
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

export const addVariable = inCurrentScope(({
    scope, node
}) => {
    scope.variables.push(node.id.name);
});

export const addNewFunctionScope = _.compose(
    addFunctionParams,
    addNewScope);

// TODO: use these handlers as the first stage in traverse
export default {
  [esprima.Syntax.Program]: addNewScope,
  [esprima.Syntax.FunctionDeclaration]: _.compose(addNewFunctionScope,
                                                  addVariable),
  [esprima.Syntax.FunctionExpression]: addNewFunctionScope,
  [esprima.Syntax.VariableDeclarator]: addVariable
};
