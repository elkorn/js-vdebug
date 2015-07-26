import esprima from 'esprima';
import _ from 'lodash';

const DEFAULT_HANDLERS = _.values(esprima.Syntax).reduce((result, value) => {
  result[value] = _.noop;
  return result;
}, {});

const privates = new WeakMap();

export
default class NodeHandlers {
  constructor(customHandlers) {
    privates.set(this, Object.assign({}, DEFAULT_HANDLERS, customHandlers));
  }

  handle(scopeChain, node) {
    return privates.get(this)[node.type]({
      scopeChain, node
    });
  }
};
