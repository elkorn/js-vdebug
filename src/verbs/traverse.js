import esprima from 'esprima';
import estraverse from 'estraverse';
import _ from 'lodash';

import makeAST from './makeAST';

import {
  inCurrentScope
}
from '../utils/decorators';

import ScopeChain from '../nouns/ScopeChain';

import NodeHandlers from '../node-handlers/NodeHandlers';
import scopeHandlers from '../node-handlers/scopeHandlers';
import variableHandlers from '../node-handlers/variableHandlers';

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
  makeAST(input, function(ast) {
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
