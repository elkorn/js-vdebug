export default class Assignment {
  constructor({
    identifier, to, declaringScope, referringScope, loc
  }) {
    console.log(to);
    this.identifier = identifier;
    this.referringScopeId = referringScope.id;
    this.declaringScopeId = declaringScope ? declaringScope.id : null;
    this.to = to;
    this.loc = loc;
  }

  isProblematic() {
    return this.declaringScopeId === null;
  }
};
