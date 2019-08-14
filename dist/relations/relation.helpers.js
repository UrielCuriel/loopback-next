"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * Finds model instances that contain any of the provided foreign key values.
 *
 * @param targetRepository - The target repository where the model instances are found
 * @param fkName - Name of the foreign key
 * @param fkValues - One value or array of values of the foreign key to be included
 * @param scope - Additional scope constraints (not currently supported)
 * @param options - Options for the operations
 */
async function findByForeignKeys(targetRepository, fkName, fkValues, scope, options) {
    // throw error if scope is defined and non-empty
    // see https://github.com/strongloop/loopback-next/issues/3453
    if (scope && !_.isEmpty(scope)) {
        throw new Error('scope is not supported');
    }
    let value;
    if (Array.isArray(fkValues)) {
        if (fkValues.length === 0)
            return [];
        value = fkValues.length === 1 ? fkValues[0] : { inq: fkValues };
    }
    else {
        value = fkValues;
    }
    const where = { [fkName]: value };
    const targetFilter = { where };
    return targetRepository.find(targetFilter, options);
}
exports.findByForeignKeys = findByForeignKeys;
//# sourceMappingURL=relation.helpers.js.map