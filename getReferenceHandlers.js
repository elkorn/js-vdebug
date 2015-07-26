import esprima from 'esprima';
import _ from 'lodash';

import Scope from './Scope';
import Reference from './Reference';
import Stack from './Stack';

import {
  nodeHandler, inCurrentScope
}
from './decorators';
import {
  addNewScope, addVariable, addNewFunctionScope
}
from './genericHandlers';

import isRestricted from './isRestricted';

let currentMemberExpression = null;
// FIXME probably a single var is enough.
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
      referringScope: scope
    }));
  }
});

const findReferences = ({
  scopeChain, scope, nodes
}) => {
  for (let node of nodes) {
    // FIXME a problem arises here if we want to refactor to be able to use traverse([genericHandlers, referenceHandlers]) in index.js.
    // Namely, this goes deeper into the tree faster than the traversation itself (is it true?) and creates scopes. We would like to have these scopes created earlier through the use of generic handlers.
    // It's possible that only Identifier nodes should be handled here - in that case the traversation should arrive at them, getting rid of the 'race' in depth search.
    let handler = handlers[node.type];
    if (!handler) {
      throw new Error(`I don't know how to look for references in a ${node.type} node :(`);
    }

    handler({
      scopeChain, scope, node
    });
  }
};

const findReferencesInNodeChildren = (...properties) => inCurrentScope(({
  scopeChain, scope, node
}) => {
  const children = properties.reduce((result, prop) => {
    let child = node[prop];
    if (_.isArray(child)) {
      return result.concat(child);
    }

    return result;
  }, []);
  findReferences({
    scopeChain, scope, nodes: children
  });
});

const findReferencesInProperty = nodeHandler(({
  scopeChain, node
}) => {
  if (node.computed === true) {
    return findReferencesInNodeChildren('key', 'value')({
      scopeChain, node
    });
  }

  return findReferencesInNodeChildren('value')({
    scopeChain, node
  });
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
// const findReferencesInCallExpresion = nodeHandler(({
//   scopeChain, node
// }) => {
//   if (node.callee.type === "MemberExpression") {

//     return findReferencesInNodeChildren('key', 'value')({
//       scopeChain, node
//     });
//   }

//   return findReferencesInNodeChildren('value')({
//     scopeChain, node
//   });
// });

const handlers = {
  // TODO: move to genericHandlers
  [esprima.Syntax.Program]: addNewScope,
  [esprima.Syntax.FunctionDeclaration]: _.compose(addNewFunctionScope,
                                                  addVariable),
  [esprima.Syntax.FunctionExpression]: addNewFunctionScope,
  [esprima.Syntax.VariableDeclarator]: addVariable,
  [esprima.Syntax.Identifier]: addIdentifierReference,
  [esprima.Syntax.Literal]: nodeHandler(_.noop),
  [esprima.Syntax.ThisExpression]: nodeHandler(_.noop),
  [esprima.Syntax.MemberExpression]: setCurrentMember,
  [esprima.Syntax.Property]: pushProperty,
  // [esprima.Syntax.BinaryExpression]: findReferencesInNodeChildren('left', 'right'),
  // [esprima.Syntax.UnaryExpression]: findReferencesInNodeChildren('argument'),
  // [esprima.Syntax.AssignmentExpression]: findReferencesInNodeChildren('right'),
  // [esprima.Syntax.CallExpression]: findReferencesInNodeChildren('callee', 'arguments'),
  // [esprima.Syntax.MemberExpression]: findReferencesInNodeChildren('object'),
  // [esprima.Syntax.LogicalExpression]: findReferencesInNodeChildren('left', 'right'),
  // [esprima.Syntax.Property]: findReferencesInProperty,
  // [esprima.Syntax.ObjectExpression]: findReferencesInNodeChildren('properties'),
  // [esprima.Syntax.ArrayExpression]: findReferencesInNodeChildren('elements'),
  // [esprima.Syntax.NewExpression]: findReferencesInNodeChildren('object', 'arguments')
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
