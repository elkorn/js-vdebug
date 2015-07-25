let ids = new WeakMap();
let ID = 0;

export default class Scope {
    constructor() {
        this.params = [];
        this.variables = [];
        ids.set(this, ID++);
    }

    get id() {
        return ids.get(this);
    }
}
