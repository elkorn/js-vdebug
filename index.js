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
    constructor({identifier, declaringScope, referringScope}) {
        if(!declaringScope) {
            console.log(`Undeclared variable ${identifier} in scope ${referringScope.id} (${referringScope.type} ${referringScope.name})`);
        } else {
            console.log(`${identifier}, ${referringScope.id} -> ${declaringScope.id}`);
        }
    }
}

const REFERENCES = [];

const findReference = ({scopeChain, scope, node}) => {
    if(node.type === 'Identifier') {
        if(scope.declares(node.name) || isRestricted(node.name)) {
            return;
        } else {
            REFERENCES.push(new Reference({
                identifier: node.name,
                declaringScope: scopeChain.findDeclaringScope(node.name),
                referringScope: scope
            }));
        }
    }
};

const findReferencesInBinaryExpression = inCurrentScope(({scopeChain, scope, node}) => {
    findReference({scopeChain, scope, node: node.left});
    findReference({scopeChain, scope, node: node.right});
});

const findReferencesInUnaryExpression = inCurrentScope(({scopeChain, scope, node}) => {
    findReference({scopeChain, scope, node: node.argument});
});

traverse({
    [esprima.Syntax.Program]: addNewScope,
    [esprima.Syntax.FunctionDeclaration]: addNewFunctionScope,
    [esprima.Syntax.FunctionExpression]: addNewFunctionScope,
    [esprima.Syntax.VariableDeclarator]: addVariable,
    [esprima.Syntax.BinaryExpression]: findReferencesInBinaryExpression,
    [esprima.Syntax.UnaryExpression]: findReferencesInUnaryExpression
});
