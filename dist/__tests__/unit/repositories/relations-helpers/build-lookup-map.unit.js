"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('buildLookupMap', () => {
    describe('get the result of using reduceAsArray strategy for hasMany relation', () => {
        it('returns multiple instances in an array', () => {
            const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: 1 });
            const pencil = relations_helpers_fixtures_1.createProduct({ name: 'pencil', categoryId: 1 });
            const result = __1.buildLookupMap([pen, pencil], 'categoryId', __1.reduceAsArray);
            const expected = new Map();
            expected.set(1, [pen, pencil]);
            testlab_1.expect(result).to.eql(expected);
        });
        it('return instances in multiple arrays', () => {
            const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: 1 });
            const pencil = relations_helpers_fixtures_1.createProduct({ name: 'pencil', categoryId: 1 });
            const eraser = relations_helpers_fixtures_1.createProduct({ name: 'eraser', categoryId: 2 });
            // 'id' is the foreign key in Category in respect to Product when we talk about belongsTo
            const result = __1.buildLookupMap([pen, eraser, pencil], 'categoryId', __1.reduceAsArray);
            const expected = new Map();
            expected.set(1, [pen, pencil]);
            expected.set(2, [eraser]);
            testlab_1.expect(result).to.eql(expected);
        });
    });
    describe('get the result of using reduceAsSingleItem strategy for belongsTo relation', () => {
        it('returns one instance when one target instance is passed in', () => {
            const cat = relations_helpers_fixtures_1.createCategory({ name: 'stationery', id: 1 });
            const result = __1.buildLookupMap([cat], 'id', __1.reduceAsSingleItem);
            const expected = new Map();
            expected.set(1, cat);
            testlab_1.expect(result).to.eql(expected);
        });
        it('returns multiple instances when multiple target instances are passed in', () => {
            const cat1 = relations_helpers_fixtures_1.createCategory({ name: 'stationery', id: 1 });
            const cat2 = relations_helpers_fixtures_1.createCategory({ name: 'book', id: 2 });
            // 'id' is the foreign key in Category in respect to Product when we talk about belongsTo
            const result = __1.buildLookupMap([cat1, cat2], 'id', __1.reduceAsSingleItem);
            const expected = new Map();
            expected.set(1, cat1);
            expected.set(2, cat2);
            testlab_1.expect(result).to.eql(expected);
        });
    });
});
//# sourceMappingURL=build-lookup-map.unit.js.map