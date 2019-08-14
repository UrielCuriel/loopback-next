"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const debugFactory = require("debug");
const errors_1 = require("../../errors");
const type_resolver_1 = require("../../type-resolver");
const debug = debugFactory('loopback:repository:belongs-to-helpers');
/**
 * Resolves given belongsTo metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * property id metadata
 * @param relationMeta - belongsTo metadata to resolve
 * @internal
 */
function resolveBelongsToMetadata(relationMeta) {
    if (!type_resolver_1.isTypeResolver(relationMeta.target)) {
        const reason = 'target must be a type resolver';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    if (!relationMeta.keyFrom) {
        const reason = 'keyFrom is required';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const sourceModel = relationMeta.source;
    if (!sourceModel || !sourceModel.modelName) {
        const reason = 'source model must be defined';
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    const targetModel = relationMeta.target();
    const targetName = targetModel.modelName;
    debug('Resolved model %s from given metadata: %o', targetName, targetModel);
    const targetProperties = targetModel.definition.properties;
    debug('relation metadata from %o: %o', targetName, targetProperties);
    if (relationMeta.keyTo && targetProperties[relationMeta.keyTo]) {
        // The explicit cast is needed because of a limitation of type inference
        return relationMeta;
    }
    const targetPrimaryKey = targetModel.definition.idProperties()[0];
    if (!targetPrimaryKey) {
        const reason = `${targetName} does not have any primary key (id property)`;
        throw new errors_1.InvalidRelationError(reason, relationMeta);
    }
    return Object.assign(relationMeta, { keyTo: targetPrimaryKey });
}
exports.resolveBelongsToMetadata = resolveBelongsToMetadata;
//# sourceMappingURL=belongs-to.helpers.js.map