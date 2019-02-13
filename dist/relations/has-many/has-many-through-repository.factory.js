"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const debugFactory = require("debug");
const lodash_1 = require("lodash");
const errors_1 = require("../../errors");
const constraint_utils_1 = require("../../repositories/constraint-utils");
const type_resolver_1 = require("../../type-resolver");
const has_many_through_repository_1 = require("./has-many-through.repository");
const debug = debugFactory('loopback:repository:has-many-repository-factory');
/**
 * Enforces a constraint on a repository based on a relationship contract
 * between models. For example, if a Customer model is related to an Order model
 * via a HasMany relation, then, the relational repository returned by the
 * factory function would be constrained by a Customer model instance's id(s).
 *
 * @param relationMetadata The relation metadata used to describe the
 * relationship and determine how to apply the constraint.
 * @param targetRepositoryGetter The repository which represents the target model of a
 * relation attached to a datasource.
 * @returns The factory function which accepts a foreign key value to constrain
 * the given target repository
 */
function createHasManyThroughRepositoryFactory(relationMetadata, targetRepositoryGetter, throughRepositoryGetter) {
    const meta = resolveHasManyThroughMetadata(relationMetadata);
    debug('Resolved HasMany relation metadata: %o', meta);
    return function (fkValue) {
        async function getAdvancedConstraint(targetInstance) {
            return createAdvancedConstraint(targetInstance, meta, throughRepositoryGetter, fkValue);
        }
        return new has_many_through_repository_1.DefaultHasManyThroughRepository(targetRepositoryGetter, throughRepositoryGetter, getAdvancedConstraint);
    };
}
exports.createHasManyThroughRepositoryFactory = createHasManyThroughRepositoryFactory;
async function createAdvancedConstraint(targetInstance, meta, throughRepositoryGetter, fkValue) {
    // tslint:disable-next-line:no-any
    const advancedConstraint = {
        dataObject: { [meta.keyTo]: fkValue },
        filter: {},
        where: {},
    };
    if (targetInstance) {
        // through constraint
        advancedConstraint.dataObject[meta.targetFkName] =
            targetInstance[meta.targetPrimaryKey];
        advancedConstraint.where = { where: advancedConstraint.dataObject };
    }
    else {
        // target constraint
        const throughRepo = await throughRepositoryGetter();
        const throughInstances = await throughRepo.find(constraint_utils_1.constrainFilter(undefined, advancedConstraint.dataObject));
        if (!throughInstances.length) {
            const id = 'through constraint ' + JSON.stringify(advancedConstraint.dataObject);
            throw new errors_1.EntityNotFoundError(throughRepo.entityClass, id);
        }
        advancedConstraint.dataObject = {};
        advancedConstraint.where = {
            or: throughInstances.map((throughInstance) => {
                return { id: throughInstance[meta.targetFkName] };
            }),
        };
    }
    advancedConstraint.filter = {
        where: advancedConstraint.where,
    };
    return advancedConstraint;
}
/**
 * Resolves given hasMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * belongsTo metadata
 * @param relationMeta hasMany metadata to resolve
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
    if (relationMeta.keyTo ||
        relationMeta.targetFkName ||
        relationMeta.targetPrimaryKey) {
        // The explict cast is needed because of a limitation of type inference
        return relationMeta;
    }
    const sourceModel = relationMeta.source;
    if (!sourceModel || !sourceModel.modelName) {
        const reason = 'source model must be defined';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const targetModel = relationMeta.target();
    debug('Resolved model %s from given metadata: %o', targetModel.modelName, targetModel);
    const throughModel = relationMeta.through();
    debug('Resolved model %s from given metadata: %o', throughModel.modelName, throughModel);
    const defaultFkName = lodash_1.camelCase(sourceModel.modelName + '_id');
    const hasDefaultFkProperty = throughModel.definition &&
        throughModel.definition.properties &&
        throughModel.definition.properties[defaultFkName];
    if (!hasDefaultFkProperty) {
        const reason = `through model ${targetModel.name} is missing definition of default foreign key ${defaultFkName}`;
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const targetFkName = lodash_1.camelCase(targetModel.modelName + '_id');
    const hasTargetFkName = throughModel.definition &&
        throughModel.definition.properties &&
        throughModel.definition.properties[targetFkName];
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
        keyTo: defaultFkName,
        targetFkName,
        targetPrimaryKey,
    });
}
//# sourceMappingURL=has-many-through-repository.factory.js.map