"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('flattenTargetsOfOneToManyRelation', () => {
    describe('gets the result of using reduceAsArray strategy for hasMany relation', () => {
        it('gets the result of passing in a single sourceId', () => {
            const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: 1 });
            const pencil = relations_helpers_fixtures_1.createProduct({ name: 'pencil', categoryId: 1 });
            relations_helpers_fixtures_1.createProduct({ name: 'eraser', categoryId: 2 });
            const result = __1.flattenTargetsOfOneToManyRelation([1], [pen, pencil], 'categoryId');
            testlab_1.expect(result).to.eql([[pen, pencil]]);
        });
        it('gets the result of passing in multiple sourceIds', () => {
            const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: 1 });
            const pencil = relations_helpers_fixtures_1.createProduct({ name: 'pencil', categoryId: 1 });
            const eraser = relations_helpers_fixtures_1.createProduct({ name: 'eraser', categoryId: 2 });
            // use [2, 1] here to show the order of sourceIds matters
            const result = __1.flattenTargetsOfOneToManyRelation([2, 1], [pen, pencil, eraser], 'categoryId');
            testlab_1.expect(result).to.deepEqual([[eraser], [pen, pencil]]);
        });
    });
});
//# sourceMappingURL=flatten-targets-of-one-to-many-relation-helpers.unit.js.map