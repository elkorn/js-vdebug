import esprima from 'esprima';
import _ from 'lodash';

import Scope from './Scope';
import Reference from './Reference';

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

const addIdentifierReference = inCurrentScope(({
    scopeChain, scope, node
}) => {
    if (scope.declares(node.name) || isRestricted(node.name)) {
        return;
    } else {
      // TODO pass the references in arguments, decouple them from the scope?
      scope.references.push(new Reference({
            identifier: node.name,
            declaringScope: scopeChain.findDeclaringScope(node.name),
            referringScope: scope
        }));
    }
});

const log = obj => console.log(JSON.stringify(obj, null, ' '));

const findReferences = ({
    scopeChain, scope, nodes
}) => {
    for (let node of nodes) {
        let handler = handlers[node.type];
        if (!handler) {
            throw new Error(`I don't know how to look for references in a ${node.type} node :(`);
        }

        handler({
            scopeChain, scope, node
        });
    }
};

const findReferencesInNodeChildren = (...properties) => inCurrentScope(({
    scopeChain, scope, node
}) => {
    const children = properties.reduce((result, prop) => {
        let child = node[prop];
        if (_.isArray(child)) {
            return result.concat(child);
        }

        return result;
    }, []);

    findReferences({
        scopeChain, scope, nodes: children
    });
});

const findReferencesInProperty = nodeHandler(({
    scopeChain, node
}) => {
    if (node.computed === true) {
        throw new Error('computed');
        return findReferencesInNodeChildren('key', 'value')({
            scopeChain, node
        });
    }

    return findReferencesInNodeChildren('value')({
        scopeChain, node
    });
});

const handlers = {
    [esprima.Syntax.Program]: addNewScope,
    [esprima.Syntax.FunctionDeclaration]: _.compose(addNewFunctionScope,
                                                    addVariable),
    [esprima.Syntax.FunctionExpression]: addNewFunctionScope,
    [esprima.Syntax.VariableDeclarator]: addVariable,
    [esprima.Syntax.Identifier]: addIdentifierReference,
    [esprima.Syntax.Literal]: _.noop,
    [esprima.Syntax.ThisExpression]: _.noop,
    [esprima.Syntax.BinaryExpression]: findReferencesInNodeChildren('left', 'right'),
    [esprima.Syntax.UnaryExpression]: findReferencesInNodeChildren('argument'),
    [esprima.Syntax.AssignmentExpression]: findReferencesInNodeChildren('right'),
    [esprima.Syntax.CallExpression]: findReferencesInNodeChildren('callee', 'arguments'),
    [esprima.Syntax.MemberExpression]: findReferencesInNodeChildren('object'),
    [esprima.Syntax.LogicalExpression]: findReferencesInNodeChildren('left', 'right'),
    [esprima.Syntax.Property]: findReferencesInProperty,
    [esprima.Syntax.ObjectExpression]: findReferencesInNodeChildren('properties'),
    [esprima.Syntax.ArrayExpression]: findReferencesInNodeChildren('elements'),
    [esprima.Syntax.NewExpression]: findReferencesInNodeChildren('object', 'arguments')
};

export default handlers;
