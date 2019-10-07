"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('flattenTargetsOfOneToOneRelation', () => {
    describe('uses reduceAsSingleItem strategy for belongsTo relation', () => {
        it('gets the result of passing in a single sourceId', () => {
            const stationery = relations_helpers_fixtures_1.createCategory({ id: 1, name: 'stationery' });
            const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: stationery.id });
            relations_helpers_fixtures_1.createProduct({ name: 'eraser', categoryId: 2 });
            const result = __1.flattenTargetsOfOneToOneRelation([pen.categoryId], [stationery], 'id');
            testlab_1.expect(result).to.eql([stationery]);
        });
        it('gets the result of passing in multiple sourceIds', () => {
            const stationery = relations_helpers_fixtures_1.createCategory({ id: 1, name: 'stationery' });
            const book = relations_helpers_fixtures_1.createCategory({ id: 2, name: 'book' });
            const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: stationery.id });
            const pencil = relations_helpers_fixtures_1.createProduct({
                name: 'pencil',
                categoryId: stationery.id,
            });
            const erasers = relations_helpers_fixtures_1.createProduct({ name: 'eraser', categoryId: book.id });
            // the order of sourceIds matters
            const result = __1.flattenTargetsOfOneToOneRelation([erasers.categoryId, pencil.categoryId, pen.categoryId], [book, stationery, stationery], 'id');
            testlab_1.expect(result).to.deepEqual([book, stationery, stationery]);
        });
    });
    describe('uses reduceAsSingleItem strategy for hasOne relation', () => {
        it('gets the result of passing in a single sourceId', () => {
            const pen = relations_helpers_fixtures_1.createProduct({ id: 1, name: 'pen' });
            const penMaker = relations_helpers_fixtures_1.createManufacturer({
                name: 'Mr. Plastic',
                productId: pen.id,
            });
            const result = __1.flattenTargetsOfOneToOneRelation([pen.id], [penMaker], 'productId');
            testlab_1.expect(result).to.eql([penMaker]);
        });
        it('gets the result of passing in multiple sourceIds', () => {
            const pen = relations_helpers_fixtures_1.createProduct({ id: 1, name: 'pen' });
            const pencil = relations_helpers_fixtures_1.createProduct({ id: 2, name: 'pencil' });
            const eraser = relations_helpers_fixtures_1.createProduct({ id: 3, name: 'eraser' });
            const penMaker = relations_helpers_fixtures_1.createManufacturer({
                name: 'Mr. Plastic',
                productId: pen.id,
            });
            const pencilMaker = relations_helpers_fixtures_1.createManufacturer({
                name: 'Mr. Tree',
                productId: pencil.id,
            });
            const eraserMaker = relations_helpers_fixtures_1.createManufacturer({
                name: 'Mr. Rubber',
                productId: eraser.id,
            });
            // the order of sourceIds matters
            const result = __1.flattenTargetsOfOneToOneRelation([eraser.id, pencil.id, pen.id], [penMaker, pencilMaker, eraserMaker], 'productId');
            testlab_1.expect(result).to.deepEqual([eraserMaker, pencilMaker, penMaker]);
        });
    });
});
//# sourceMappingURL=flatten-targets-of-one-to-one-relation.helpers.unit.js.map