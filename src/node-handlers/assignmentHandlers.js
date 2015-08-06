import esprima from 'esprima';
import _ from 'lodash';

import Scope from '../nouns/Scope';
import Assignment from '../nouns/Assignment';
import Stack from '../utils/Stack';

import {
  nodeHandler, inCurrentScope
}
from '../utils/decorators';

import {
  stackPusher, stackPopper
}
from '../utils/stack-shortcuts';

import isRestricted from '../utils/validation/isRestricted';

const assignmentStack = new Stack();

const ASSIGNMENT_RESOLVERS = {
  [esprima.Syntax.AssignmentExpression]: ({
    scope, node, scopeChain, assignment
  }) => {
    if (node.name === assignment.right.name) {
      scope.assignments.push(new Assignment({
        identifier: node.name,
        declaringScope: scopeChain.findDeclaringScope(node.name),
        referringScope: scope,
        to: assignment.left.name,
        loc: node.loc
      }));
    }
  }, [esprima.Syntax.VariableDeclarator]: ({
    scope, node, scopeChain, assignment
  }) => {
    if(node.name === assignment.init.name) {
      scope.assignments.push(new Assignment({
        identifier: node.name,
        declaringScope: scopeChain.findDeclaringScope(node.name),
        referringScope: scope,
        to: assignment.id.name,
        loc: node.loc
      }));
    }
  }
};

const identifyAssignment = inCurrentScope(({
  scope, node, scopeChain
}) => {
  const currentAssignment = assignmentStack.peek();
  if (!currentAssignment) {
    return;
  }

  ASSIGNMENT_RESOLVERS[currentAssignment.type]({
    scope, scopeChain, node, assignment: currentAssignment
  });
});

const identifyDeclarator = inCurrentScope(({
  scope, node, scopeChain
}) => {
  const currentAssignment = assignmentStack.peek();
  if (!currentAssignment) {
    return;
  }

  console.log(currentAssignment, node);
});

const push = stackPusher(assignmentStack);
const pop = stackPopper(assignmentStack);

const enterHandlers = {
  [esprima.Syntax.Identifier]: identifyAssignment, [esprima.Syntax.AssignmentExpression]: push, [esprima.Syntax.VariableDeclarator]: push
};

const leaveHandlers = {
  [esprima.Syntax.AssignmentExpression]: pop, [esprima.Syntax.VariableDeclarator]: pop
};

export
default {
  enter: enterHandlers,
  leave: leaveHandlers
};
