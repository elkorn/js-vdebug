import _ from 'lodash';

const scopes = new WeakMap();

const callMethod = (method, ...args) => obj => obj[method].apply(obj, args);

export
default class ScopeChain {
  constructor() {
    scopes.set(this, []);
  }

  pop() {
    return scopes.get(this).shift();
  }

  push(scope) {
    const chain = scopes.get(this);
    scope.id = chain.length;
    return chain.unshift(scope);
  }

  findDeclaringScope(identifier) {
    return scopes.get(this).find(callMethod('declares', identifier));
  }

  current() {
    return scopes.get(this)[0];
  }

  toString() {
    return JSON.stringify(scopes.get(this), null, ' ');
  }
};
