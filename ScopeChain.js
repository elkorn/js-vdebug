const scopes = new WeakMap();

export default class ScopeChain {
    constructor() {
        scopes.set(this, {
            chain: [],
            current: -1
        });
    }

    pop() {
        let state = scopes.get(this);
        state.current--;
        return state.chain.pop();
    }

    push(scope) {
        let state = scopes.get(this);
        state.current++;
        return state.chain.push(scope);
    }

    current() {
        let state = scopes.get(this);
        return state.chain[state.current];
    }

    toString() {
        return JSON.stringify(scopes.get(this), null, ' ');
    }
};
