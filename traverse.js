import esprima from 'esprima';
import estraverse from 'estraverse';
import _ from 'lodash';

import {
  withAST
}
from './withInput';

import {
  inCurrentScope
}
from './decorators';

import NodeHandlers from './NodeHandlers';
import ScopeChain from './ScopeChain';
import scopeHandlers from './scopeHandlers';
import variableHandlers from './variableHandlers';

const composeHandlerGroups = (groups, actionSelector) =>
        groups.map(_.compose(
          NodeHandlers.create,
          _.property(actionSelector)));

const runHandlers = (handlers, scopeChain) => node => handlers.forEach(h => h.handle(scopeChain, node));

export
default

function({
  customHandlerGroups, done, input
}) {
  let scopeChain = new ScopeChain();
  let result = [];
  const addToResultHandler = {
    leave: {
      always: inCurrentScope(({
        scope
      }) => {
        if (result.indexOf(scope) === -1) {
          result.unshift(scope);
        }
      })
    }
  };

  const handlerGroups = [scopeHandlers, addToResultHandler, variableHandlers, ...customHandlerGroups];

  const enterHandlerGroups = composeHandlerGroups(handlerGroups, 'enter');
  const leaveHandlerGroups = composeHandlerGroups(handlerGroups.reverse(), 'leave');

  withAST(input, function(ast) {
    estraverse.traverse(ast, {
      enter: runHandlers(enterHandlerGroups, scopeChain),
      leave: runHandlers(leaveHandlerGroups, scopeChain)
    });

    if (done) {
      done({
        ast, result
      });
    }
  });
}
