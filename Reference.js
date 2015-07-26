export default class Reference {
  constructor({
    identifier, declaringScope, referringScope, loc
  }) {
    this.identifier = identifier;
    this.referringScopeId = referringScope.id;
    this.declaringScopeId = declaringScope ? declaringScope.id : null;
    this.loc = loc;
  }

  isProblematic() {
    return this.declaringScopeId === null;
  }
};
