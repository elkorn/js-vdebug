import esprima from 'esprima';
import _ from 'lodash';

import Scope from '../nouns/Scope';
import Reference from '../nouns/Reference';
import Stack from '../utils/Stack';

import {
  nodeHandler, inCurrentScope
}
from '../utils/decorators';

import isRestricted from '../utils/validation/isRestricted';

// TODO are single vars enough here? See the case of nested Property and MemberExpression nodes.
let currentMemberExpression = null;
let currentPropertyStack = new Stack();

const shouldSkip = node => _.some([
  currentMemberExpression && node === currentMemberExpression.property, (() => {
    const currentProperty = currentPropertyStack.peek();
    return currentProperty && node.name === currentProperty.key.name;
  })()
]);

const addIdentifierReference = inCurrentScope(({
  scopeChain, scope, node
}) => {
  if (scope.declares(node.name) || isRestricted(node.name) || shouldSkip(node)) {
    return;
  } else {
    // TODO pass the references in arguments, decouple them from the scope?
    scope.references.push(new Reference({
      identifier: node.name,
      declaringScope: scopeChain.findDeclaringScope(node.name),
      referringScope: scope,
      loc: node.loc
    }));
  }
});

const pushProperty = nodeHandler(({
  node
}) => {
  if (node.computed === false) {
    currentPropertyStack.push(node);
  }
});

const popProperty = nodeHandler(({
  node
}) => {
  if (node.computed === false) {
    currentPropertyStack.pop();
  }
});

const setCurrentMember = nodeHandler(({
  node
}) => currentMemberExpression = node);

const clearCurrentMember = nodeHandler(() => currentMemberExpression = null);

const handlers = {
  [esprima.Syntax.Identifier]: addIdentifierReference,
  [esprima.Syntax.Literal]: nodeHandler(_.noop),
  [esprima.Syntax.ThisExpression]: nodeHandler(_.noop),
  [esprima.Syntax.MemberExpression]: setCurrentMember,
  [esprima.Syntax.Property]: pushProperty
};

const leaveHandlers = {
  [esprima.Syntax.MemberExpression]: clearCurrentMember,
  [esprima.Syntax.Property]: popProperty,
};

export
default {
  enter: handlers,
  leave: leaveHandlers
};
