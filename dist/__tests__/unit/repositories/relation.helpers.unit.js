"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
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
const __1 = require("../../..");
const decorators_1 = require("../../../decorators");
const model_1 = require("../../../model");
describe('findByForeignKeys', () => {
    let productRepo;
    before(() => {
        productRepo = new ProductRepository(testdb);
    });
    beforeEach(async () => {
        await productRepo.deleteAll();
    });
    it('returns an empty array when no foreign keys are passed in', async () => {
        const fkIds = [];
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', fkIds);
        testlab_1.expect(products).to.be.empty();
    });
    it('returns an empty array when no instances have the foreign key value', async () => {
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', 2);
        testlab_1.expect(products).to.be.empty();
    });
    it('returns an empty array when no instances have the foreign key values', async () => {
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', [2, 3]);
        testlab_1.expect(products).to.be.empty();
    });
    it('returns all instances that have the foreign key value', async () => {
        const pens = await productRepo.create({ name: 'pens', categoryId: 1 });
        const pencils = await productRepo.create({ name: 'pencils', categoryId: 1 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', 1);
        testlab_1.expect(products).to.deepEqual([pens, pencils]);
    });
    it('does not include instances with different foreign key values', async () => {
        const pens = await productRepo.create({ name: 'pens', categoryId: 1 });
        const pencils = await productRepo.create({ name: 'pencils', categoryId: 2 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', 1);
        testlab_1.expect(products).to.deepEqual([pens]);
        testlab_1.expect(products).to.not.containDeep(pencils);
    });
    it('includes instances when there is one value in the array of foreign key values', async () => {
        const pens = await productRepo.create({ name: 'pens', categoryId: 1 });
        const pencils = await productRepo.create({ name: 'pencils', categoryId: 2 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', [2]);
        testlab_1.expect(products).to.deepEqual([pencils]);
        testlab_1.expect(products).to.not.containDeep(pens);
    });
    it('returns all instances that have any of multiple foreign key values', async () => {
        const pens = await productRepo.create({ name: 'pens', categoryId: 1 });
        const pencils = await productRepo.create({ name: 'pencils', categoryId: 2 });
        const paper = await productRepo.create({ name: 'paper', categoryId: 3 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', [1, 3]);
        testlab_1.expect(products).to.deepEqual([pens, paper]);
        testlab_1.expect(products).to.not.containDeep(pencils);
    });
    it('throws error if scope is passed in and is non-empty', async () => {
        let errorMessage;
        try {
            await __1.findByForeignKeys(productRepo, 'categoryId', [1], {
                limit: 1,
            });
        }
        catch (error) {
            errorMessage = error.message;
        }
        testlab_1.expect(errorMessage).to.eql('scope is not supported');
    });
    it('does not throw an error if scope is passed in and is undefined or empty', async () => {
        let products = await __1.findByForeignKeys(productRepo, 'categoryId', [1], undefined, {});
        testlab_1.expect(products).to.be.empty();
        products = await __1.findByForeignKeys(productRepo, 'categoryId', 1, {}, {});
        testlab_1.expect(products).to.be.empty();
    });
    /******************* HELPERS *******************/
    let Product = class Product extends model_1.Entity {
    };
    __decorate([
        decorators_1.property({ id: true }),
        __metadata("design:type", Number)
    ], Product.prototype, "id", void 0);
    __decorate([
        decorators_1.property(),
        __metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    __decorate([
        decorators_1.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "categoryId", void 0);
    Product = __decorate([
        decorators_1.model()
    ], Product);
    class ProductRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Product, dataSource);
        }
    }
    const testdb = new __1.juggler.DataSource({
        name: 'db',
        connector: 'memory',
    });
});
//# sourceMappingURL=relation.helpers.unit.js.map