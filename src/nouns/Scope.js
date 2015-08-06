import _ from 'lodash';

export default class Scope {
    constructor() {
        this.params = [];
        this.variables = [];
        this.references = [];
        this.assignments = [];
    }

    declares(identifier) {
      return this.name === identifier || _.includes(this.variables.concat(this.params), identifier);
    }
};
