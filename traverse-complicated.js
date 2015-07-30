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

const createNodeHandlers = typeHandlerSpecifier => handlerDefinitions => {
  return new NodeHandlers(typeHandlerSpecifier(handlerDefinitions));
};

const bindToScopeChain = scopeChain => handlers => node => handlers.handle(scopeChain, node);

export
default

function({
  customHandlerGroups, done, input
}) {
  const enterHandlerGroups = customHandlerGroups.map(createNodeHandlers(_.property('enter')));
  const leaveHandlerGroups = customHandlerGroups.slice().reverse().map(createNodeHandlers(_.property('leave')));

  const composeHandlerGroups =
          (handlerGroups, scopeChainAttachFn) => node => {
            return (handlerGroups.map(scopeChainAttachFn)).forEach(h => h(node));
          };

  withAST(input, function(ast) {
    let scopeChain = new ScopeChain();
    let result = [];
    const addToResult = inCurrentScope(({
      scope, scopeChain, node
    }) => console.log(scope, scopeChain.current(), node.type));

    leaveHandlerGroups.unshift(new NodeHandlers({
      always: addToResult
    }));

    const bindToLocalScopeChain = handlers => node => {
      handlers.handle(scopeChain, node);
    };

    estraverse.traverse(ast, {
      enter: composeHandlerGroups(enterHandlerGroups, bindToLocalScopeChain),
      leave: composeHandlerGroups(leaveHandlerGroups, bindToLocalScopeChain)
    });

    if (done) {
      done({
        ast, result
      });
    }
  });
}
