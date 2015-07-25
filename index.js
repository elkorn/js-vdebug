import esprima from 'esprima';
import _ from 'lodash';

import Scope from './Scope';

import {
    nodeHandler, inCurrentScope
}
from './decorators';
import traverse from './traverse';
import isRestricted from './isRestricted';

const addNewScope = nodeHandler(({
    scopeChain, node
}) => {
    const scope = new Scope();
    if (node.id) {
        scope.name = node.id.name;
    }

    scope.type = node.type;
    if (node.params) {}

    scopeChain.push(scope);
});

const addFunctionParams = inCurrentScope(({
    scope, node
}) => {
    scope.params = node.params.map(_.property('name'));
});

const addVariable = inCurrentScope(({
    scope, node
}) => {
    scope.variables.push(node.id.name);
});


const addNewFunctionScope = _.compose(
    addFunctionParams,
    addNewScope);

class Reference {
    constructor({
        identifier, declaringScope, referringScope
    }) {
        if (!declaringScope) {
            console.log(`Undeclared variable ${identifier} in scope ${referringScope.id} (${referringScope.type}${referringScope.name ? ' ' + referringScope.name : ''})`);
        } else {
            console.log(`${identifier}, ${referringScope.id} -> ${declaringScope.id}`);
        }
    }
}

const REFERENCES = [];

const findReferences = ({
    scopeChain, scope, nodes
}) => {
    for (let node of nodes) {
        // TODO MemberExpression
        if (node.type === 'Identifier') {
            if (scope.declares(node.name) || isRestricted(node.name)) {
                return;
            } else {
                REFERENCES.push(new Reference({
                    identifier: node.name,
                    declaringScope: scopeChain.findDeclaringScope(node.name),
                    referringScope: scope
                }));
            }
        }
    }
};

const findReferencesInNodeChildren = (...properties) =>
          inCurrentScope(({
              scopeChain, scope, node
          }) => {
              const children = properties.reduce((result, prop) => {
                  let child = node[prop];
                  if(_.isArray(child)) {
                      return result.concat(child);
                  }

                  result.push(child);
                  return result;
              }, []);

              findReferences({
                  scopeChain, scope, nodes: children
              });
          });

traverse({
    [esprima.Syntax.Program]: addNewScope,
    [esprima.Syntax.FunctionDeclaration]: _.compose(addNewFunctionScope,
                                                    addVariable),
    [esprima.Syntax.FunctionExpression]: addNewFunctionScope,
    [esprima.Syntax.VariableDeclarator]: addVariable,
    [esprima.Syntax.BinaryExpression]: findReferencesInNodeChildren('left', 'right'),
    [esprima.Syntax.UnaryExpression]: findReferencesInNodeChildren('argument'),
    [esprima.Syntax.AssignmentExpression]: findReferencesInNodeChildren('right'),
    [esprima.Syntax.CallExpression]: findReferencesInNodeChildren('arguments')
});
