import esprima from 'esprima';
import _ from 'lodash';

import Scope from './Scope';
import Reference from './Reference';

import {
  nodeHandler, inCurrentScope
}
from './decorators';

export
const addNewScope = nodeHandler(({
  scopeChain, node
}) => {
  const scope = new Scope();
  if (node.id) {
    scope.name = node.id.name;
  }

  scope.type = node.type;

  scopeChain.push(scope);
});

const addFunctionParams = inCurrentScope(({
  scope, node
}) => {
  scope.params = node.params.map(_.property('name'));
});

const popScope = nodeHandler(({
  scopeChain
}) => {
  scopeChain.pop();
});

export
const addNewFunctionScope = _.compose(
  addFunctionParams,
  addNewScope);

export
default {
  enter: {
    [esprima.Syntax.Program]: addNewScope,
    [esprima.Syntax.FunctionDeclaration]: addNewFunctionScope,
    [esprima.Syntax.FunctionExpression]: addNewFunctionScope
  },
  leave: {
    [esprima.Syntax.Program]: popScope,
    [esprima.Syntax.FunctionDeclaration]: popScope,
    [esprima.Syntax.FunctionExpression]: popScope
  }
};
