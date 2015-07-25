export default class Reference {
  constructor({
    identifier, declaringScope, referringScope
  }) {

    this.identifier = identifier;
    this.referringScopeId = referringScope.id;
    this.declaringScopeId = declaringScope ? declaringScope.id : null;
  }

  isProblematic() {
    return !!this.declaringScopeId;
  }
};
