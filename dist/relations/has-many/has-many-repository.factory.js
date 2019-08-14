"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const debugFactory = require("debug");
const has_many_helpers_1 = require("./has-many.helpers");
const has_many_repository_1 = require("./has-many.repository");
const debug = debugFactory('loopback:repository:has-many-repository-factory');
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
function createHasManyRepositoryFactory(relationMetadata, targetRepositoryGetter) {
    const meta = has_many_helpers_1.resolveHasManyMetadata(relationMetadata);
    debug('Resolved HasMany relation metadata: %o', meta);
    return function (fkValue) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const constraint = { [meta.keyTo]: fkValue };
        return new has_many_repository_1.DefaultHasManyRepository(targetRepositoryGetter, constraint);
    };
}
exports.createHasManyRepositoryFactory = createHasManyRepositoryFactory;
//# sourceMappingURL=has-many-repository.factory.js.map