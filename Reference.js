export default class Reference {
  constructor({
    identifier, declaringScope, referringScope
  }) {
    if (!declaringScope) {
      console.log(`Undeclared variable ${identifier} in scope ${referringScope.id} (${referringScope.type}${referringScope.name ? ' ' + referringScope.name : ''})`);
    } else {
      console.log(`${identifier}, ${referringScope.id} -> ${declaringScope.id}`);
    }
  }
};
