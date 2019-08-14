"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const debugFactory = require("debug");
const lodash_1 = require("lodash");
const errors_1 = require("../../errors");
const type_resolver_1 = require("../../type-resolver");
const debug = debugFactory('loopback:repository:has-many-through-helpers');
/**
 * Creates constraint used to query target
 * @param relationMeta - hasManyThrough metadata to resolve
 * @param throughInstances - Instances of through entities used to constrain the target
 * @internal
 */
function createTargetConstraint(relationMeta, throughInstances) {
    const { targetPrimaryKey } = relationMeta;
    const targetFkName = relationMeta.keyThrough;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraint = {
        or: throughInstances.map((throughInstance) => {
            return {
                [targetPrimaryKey]: throughInstance[targetFkName],
            };
        }),
    };
    return constraint;
}
exports.createTargetConstraint = createTargetConstraint;
/**
 * Creates constraint used to query through
 * @param relationMeta - hasManyThrough metadata to resolve
 * @param fkValue - Value of the foreign key used to constrain through
 * @param targetInstance - Instance of target entity used to constrain through
 * @internal
 */
function createThroughConstraint(relationMeta, fkValue, targetInstance) {
    const { targetPrimaryKey } = relationMeta;
    const targetFkName = relationMeta.keyThrough;
    const sourceFkName = relationMeta.keyTo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let constraint = { [sourceFkName]: fkValue };
    if (targetInstance) {
        constraint[targetFkName] = targetInstance[targetPrimaryKey];
    }
    return constraint;
}
exports.createThroughConstraint = createThroughConstraint;
/**
 * Resolves given hasMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * belongsTo metadata
 * @param relationMeta - hasManyThrough metadata to resolve
 * @internal
 */
function resolveHasManyThroughMetadata(relationMeta) {
    if (!type_resolver_1.isTypeResolver(relationMeta.target)) {
        const reason = 'target must be a type resolver';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    if (!type_resolver_1.isTypeResolver(relationMeta.through)) {
        const reason = 'through must be a type resolver';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const throughModel = relationMeta.through();
    const throughModelProperties = throughModel.definition && throughModel.definition.properties;
    const targetModel = relationMeta.target();
    const targetModelProperties = targetModel.definition && targetModel.definition.properties;
    // Make sure that if it already keys to the foreign key property,
    // the key exists in the target model
    if (relationMeta.keyTo &&
        throughModelProperties[relationMeta.keyTo] &&
        relationMeta.keyThrough &&
        throughModelProperties[relationMeta.keyThrough] &&
        relationMeta.targetPrimaryKey &&
        targetModelProperties[relationMeta.targetPrimaryKey]) {
        // The explict cast is needed because of a limitation of type inference
        return relationMeta;
    }
    const sourceModel = relationMeta.source;
    if (!sourceModel || !sourceModel.modelName) {
        const reason = 'source model must be defined';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    debug('Resolved model %s from given metadata: %o', targetModel.modelName, targetModel);
    debug('Resolved model %s from given metadata: %o', throughModel.modelName, throughModel);
    const sourceFkName = relationMeta.keyTo || lodash_1.camelCase(sourceModel.modelName + '_id');
    const hasSourceFkProperty = throughModelProperties[sourceFkName];
    if (!hasSourceFkProperty) {
        const reason = `through model ${targetModel.name} is missing definition of default foreign key ${sourceFkName}`;
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const targetFkName = relationMeta.keyThrough || lodash_1.camelCase(targetModel.modelName + '_id');
    const hasTargetFkName = throughModelProperties[targetFkName];
    if (!hasTargetFkName) {
        const reason = `through model ${throughModel.name} is missing definition of target foreign key ${targetFkName}`;
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const targetPrimaryKey = targetModel.definition.idProperties()[0];
    if (!targetPrimaryKey) {
        const reason = `target model ${targetModel.modelName} does not have any primary key (id property)`;
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    return Object.assign(relationMeta, {
        keyTo: sourceFkName,
        keyThrough: targetFkName,
        targetPrimaryKey,
    });
}
exports.resolveHasManyThroughMetadata = resolveHasManyThroughMetadata;
//# sourceMappingURL=has-many-through.helpers.js.map