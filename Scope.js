import _ from 'lodash';

const ids = new WeakMap();
let ID = 0;

export default class Scope {
    constructor() {
        this.params = [];
        this.variables = [];
        this.references = [];
        ids.set(this, ID++);
    }

    get id() {
        return ids.get(this);
    }

    declares(identifier) {
        return _.includes(this.variables.concat(this.params), identifier);
    }
};
