import esprima from 'esprima';
import estraverse from 'estraverse';
import _ from 'lodash';

import {
  withAST
}
from './withInput';

import {
  nodeHandler
}
from './decorators';

import NodeHandlers from './NodeHandlers';
import ScopeChain from './ScopeChain';

export
default

function({
  customHandlerGroups, done, input
}) {
  const handlerGroups = customHandlerGroups.map(({
    enter, leave
  }) => {
    return {
      enter: new NodeHandlers(enter),
      leave: new NodeHandlers(leave)
    };
  });

  withAST(input, function(ast) {
    let scopeChain = new ScopeChain();
    let result = [];
    const popScope = nodeHandler(({
      node
    }) => {
      switch (node.type) {
      case esprima.Syntax.FunctionDeclaration:
      case esprima.Syntax.FunctionExpression:
      case esprima.Syntax.Program:
        result.unshift(scopeChain.pop());
      }
    });

    estraverse.traverse(ast, {
      enter: _.compose.apply(
        _,
        handlerGroups.map(({
          enter
        }) => enter.handle.bind(enter, scopeChain))),
      leave: _.compose.apply(
        _, [popScope].concat(handlerGroups.map(({
          leave
        }) => leave.handle.bind(leave, scopeChain))))
    });

    if (done) {
      done({
        ast, result
      });
    }
  });
}
