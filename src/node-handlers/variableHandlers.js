import esprima from 'esprima';

import {
  inCurrentScope
}
from '../utils/decorators';

export
const addVariable = inCurrentScope(({
  scope, node
}) => {
  scope.variables.push(node.id.name);
});

export
default {
  enter: {
    [esprima.Syntax.FunctionDeclaration]: addVariable,
    [esprima.Syntax.VariableDeclarator]: addVariable
  }
};
