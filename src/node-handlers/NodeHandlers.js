import esprima from 'esprima';
import _ from 'lodash';
import log from '../utils/log';

import {
  nodeHandler
}
from '../utils/decorators';

const DEFAULT_HANDLERS = _.values(esprima.Syntax).reduce((result, value) => {
  result[value] = nodeHandler(_.noop);

  return result;
}, {});

const privates = new WeakMap();

class NodeHandlers {
  constructor(customHandlers) {
    if (customHandlers) {
      privates.set(this, Object.assign({}, DEFAULT_HANDLERS, customHandlers));
    } else {
      privates.set(this, DEFAULT_HANDLERS);
    }
  }

  handle(scopeChain, node) {
    let handlers = privates.get(this);
    let usedHandlers = [
      handlers[node.type]
    ];

    if (handlers.hasOwnProperty('always')) {
      usedHandlers.unshift(handlers.always);
    }

    return _.compose(...usedHandlers)({
      scopeChain, node
    });
  }

  toJSON() {
    return `NodeHandler(\n\t${Object.keys(privates.get(this)).join(',\n\t')})`;
  }
};

NodeHandlers.EMPTY = new NodeHandlers({});
NodeHandlers.create = customHandlers => new NodeHandlers(customHandlers);

export
default NodeHandlers;
