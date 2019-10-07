"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository-tests
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const bson_1 = require("bson");
const __1 = require("../../../..");
const relation_helpers_1 = require("../../../../relations/relation.helpers");
const relations_1 = require("../../../../relations");
describe('unit tests, simulates mongodb env for helpers of inclusion resolver ', () => {
    describe('helpers for formating instances', () => {
        it('checks isBsonType', () => {
            const objId = new bson_1.ObjectID();
            const numId = 1;
            testlab_1.expect(relations_1.isBsonType(objId)).to.be.true();
            testlab_1.expect(relations_1.isBsonType(numId)).to.be.false();
        });
        context('deduplicate + isBsonType', () => {
            it('passes in a  simple unique array', () => {
                const id1 = new bson_1.ObjectID();
                const id2 = new bson_1.ObjectID();
                const result = relations_1.deduplicate([id1, id2]);
                testlab_1.expect(result).to.deepEqual([id1, id2]);
            });
            it('passes in a multiple items array', () => {
                const id1 = new bson_1.ObjectID();
                const id2 = new bson_1.ObjectID();
                const id3 = new bson_1.ObjectID();
                const result = relations_1.deduplicate([id3, id1, id1, id3, id2]);
                testlab_1.expect(result).to.deepEqual([id3, id1, id2]);
            });
        });
    });
    describe('helpers for generating inclusion resolvers', () => {
        // the tests below simulate mongodb environment.
        context('normalizeKey + buildLookupMap', () => {
            it('checks if id has been normalized', async () => {
                const id = new bson_1.ObjectID();
                testlab_1.expect(relations_1.normalizeKey(id)).to.eql(id.toString());
            });
            it('creates a lookup map with a single key', () => {
                const categoryId = new bson_1.ObjectID();
                const pen = createProduct({ name: 'pen', categoryId: categoryId });
                const pencil = createProduct({ name: 'pencil', categoryId: categoryId });
                const result = relations_1.buildLookupMap([pen, pencil], 'categoryId', relations_1.reduceAsArray);
                // expects this map to have String/Product pair
                const expected = new Map();
                const strId = categoryId.toString();
                expected.set(strId, [pen, pencil]);
                testlab_1.expect(result).to.eql(expected);
            });
            it('creates a lookup map with more than one keys', () => {
                const categoryId = new bson_1.ObjectID();
                const anotherCategoryId = new bson_1.ObjectID();
                const pen = createProduct({ name: 'pen', categoryId: categoryId });
                const pencil = createProduct({ name: 'pencil', categoryId: categoryId });
                const eraser = createProduct({
                    name: 'eraser',
                    categoryId: anotherCategoryId,
                });
                const result = relations_1.buildLookupMap([pen, eraser, pencil], 'categoryId', relations_1.reduceAsArray);
                // expects this map to have String/Product pair
                const expected = new Map();
                const strId1 = categoryId.toString();
                const strId2 = anotherCategoryId.toString();
                expected.set(strId1, [pen, pencil]);
                expected.set(strId2, [eraser]);
                testlab_1.expect(result).to.eql(expected);
            });
        });
        context('normalizeKey + flattenMapByKeys', () => {
            it('checks if id has been normalized', async () => {
                const categoryId = new bson_1.ObjectID();
                const anotherCategoryId = new bson_1.ObjectID();
                const pen = createProduct({ name: 'pen', categoryId: categoryId });
                const pencil = createProduct({ name: 'pencil', categoryId: categoryId });
                const eraser = createProduct({
                    name: 'eraser',
                    categoryId: anotherCategoryId,
                });
                // stub map
                const map = new Map();
                const strId1 = categoryId.toString();
                const strId2 = anotherCategoryId.toString();
                map.set(strId1, [pen, pencil]);
                map.set(strId2, [eraser]);
                const result = relation_helpers_1.flattenMapByKeys([anotherCategoryId, categoryId], map);
                testlab_1.expect(result).to.eql([[eraser], [pen, pencil]]);
            });
        });
    });
    //** helpers
    let Product = class Product extends __1.Entity {
    };
    __decorate([
        __1.property({ id: true }),
        __metadata("design:type", Object)
    ], Product.prototype, "id", void 0);
    __decorate([
        __1.property(),
        __metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    __decorate([
        __1.belongsTo(() => Category),
        __metadata("design:type", Object)
    ], Product.prototype, "categoryId", void 0);
    Product = __decorate([
        __1.model()
    ], Product);
    let Category = class Category extends __1.Entity {
    };
    __decorate([
        __1.property({ id: true }),
        __metadata("design:type", Object)
    ], Category.prototype, "id", void 0);
    __decorate([
        __1.property(),
        __metadata("design:type", String)
    ], Category.prototype, "name", void 0);
    __decorate([
        __1.hasMany(() => Product, { keyTo: 'categoryId' }),
        __metadata("design:type", Array)
    ], Category.prototype, "products", void 0);
    Category = __decorate([
        __1.model()
    ], Category);
    function createProduct(properties) {
        return new Product(properties);
    }
});
//# sourceMappingURL=mongo-related-helpers.unit.js.map