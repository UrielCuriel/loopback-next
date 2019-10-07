"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const decorators_1 = require("../decorators");
const relation_types_1 = require("./relation.types");
exports.RELATIONS_KEY = 'loopback:relations';
/**
 * Decorator for relations
 * @param definition
 * @returns A property decorator
 */
function relation(definition) {
    // Apply relation definition to the model class
    return context_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, definition, {
        decoratorName: '@relation',
    });
}
exports.relation = relation;
/**
 * Get metadata of all relations defined on a given model class.
 *
 * @param modelCtor - The model class (the constructor function).
 * @returns A map of relation definitions
 */
function getModelRelations(modelCtor) {
    // Build model definitions if `@model` is missing
    const modelDef = decorators_1.buildModelDefinition(modelCtor);
    return (modelDef && modelDef.relations) || {};
}
exports.getModelRelations = getModelRelations;
//
// placeholder decorators for relations that are not implemented yet
// TODO: move these decorators to per-relation subdirectories
//
/**
 * Decorator for embedsOne
 * @param definition
 * @returns A property decorator
 */
function embedsOne(definition) {
    const rel = Object.assign({ type: relation_types_1.RelationType.embedsOne }, definition);
    return context_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, rel, {
        decoratorName: '@embedsOne',
    });
}
exports.embedsOne = embedsOne;
/**
 * Decorator for embedsMany
 * @param definition
 * @returns A property decorator
 */
function embedsMany(definition) {
    const rel = Object.assign({ type: relation_types_1.RelationType.embedsMany }, definition);
    return context_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, rel, {
        decoratorName: '@embedsMany',
    });
}
exports.embedsMany = embedsMany;
/**
 * Decorator for referencesOne
 * @param definition
 * @returns A property decorator
 */
function referencesOne(definition) {
    const rel = Object.assign({ type: relation_types_1.RelationType.referencesOne }, definition);
    return context_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, rel, {
        decoratorName: '@referencesOne',
    });
}
exports.referencesOne = referencesOne;
/**
 * Decorator for referencesMany
 * @param definition
 * @returns A property decorator
 */
function referencesMany(definition) {
    const rel = Object.assign({ type: relation_types_1.RelationType.referencesMany }, definition);
    return context_1.PropertyDecoratorFactory.createDecorator(exports.RELATIONS_KEY, rel, {
        decoratorName: '@referencesMany',
    });
}
exports.referencesMany = referencesMany;
//# sourceMappingURL=relation.decorator.js.map