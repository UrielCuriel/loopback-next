"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const debugFactory = require("debug");
const has_many_through_helpers_1 = require("./has-many-through.helpers");
const has_many_through_repository_1 = require("./has-many-through.repository");
const debug = debugFactory('loopback:repository:has-many-through-repository-factory');
/**
 * Enforces a constraint on a repository based on a relationship contract
 * between models. For example, if a Customer model is related to an Order model
 * via a HasMany relation, then, the relational repository returned by the
 * factory function would be constrained by a Customer model instance's id(s).
 *
 * @param relationMetadata - The relation metadata used to describe the
 * relationship and determine how to apply the constraint.
 * @param targetRepositoryGetter - The repository which represents the target model of a
 * relation attached to a datasource.
 * @returns The factory function which accepts a foreign key value to constrain
 * the given target repository
 */
function createHasManyThroughRepositoryFactory(relationMetadata, targetRepositoryGetter, throughRepositoryGetter) {
    const meta = has_many_through_helpers_1.resolveHasManyThroughMetadata(relationMetadata);
    debug('Resolved HasManyThrough relation metadata: %o', meta);
    return function (fkValue) {
        function getTargetContraint(throughInstances) {
            return has_many_through_helpers_1.createTargetConstraint(meta, throughInstances);
        }
        function getThroughConstraint(targetInstance) {
            const constriant = has_many_through_helpers_1.createThroughConstraint(meta, fkValue, targetInstance);
            return constriant;
        }
        return new has_many_through_repository_1.DefaultHasManyThroughRepository(targetRepositoryGetter, throughRepositoryGetter, getTargetContraint, getThroughConstraint);
    };
}
exports.createHasManyThroughRepositoryFactory = createHasManyThroughRepositoryFactory;
//# sourceMappingURL=has-many-through-repository.factory.js.map