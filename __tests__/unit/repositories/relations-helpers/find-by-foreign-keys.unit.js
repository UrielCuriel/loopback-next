"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('findByForeignKeys', () => {
    let productRepo;
    // use beforeEach to restore sinon stub
    beforeEach(() => {
        productRepo = testlab_1.createStubInstance(relations_helpers_fixtures_1.ProductRepository);
    });
    it('returns an empty array when no foreign keys are passed in', async () => {
        const RESULTS = [];
        productRepo.stubs.find.resolves(RESULTS);
        const fkIds = [];
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', fkIds);
        testlab_1.expect(products).to.be.empty();
        testlab_1.sinon.assert.notCalled(productRepo.stubs.find);
    });
    it('returns an empty array when no instances have the foreign key value', async () => {
        const find = productRepo.stubs.find;
        find.resolves([]);
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', 2);
        testlab_1.expect(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
    });
    it('returns an empty array when no instances have the foreign key values', async () => {
        const find = productRepo.stubs.find;
        find.resolves([]);
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', [2, 3]);
        testlab_1.expect(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
    });
    it('returns all instances that have the foreign key value', async () => {
        const find = productRepo.stubs.find;
        const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: 1 });
        const pencil = relations_helpers_fixtures_1.createProduct({ name: 'pencil', categoryId: 1 });
        find.resolves([pen, pencil]);
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', 1);
        testlab_1.expect(products).to.deepEqual([pen, pencil]);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: 1,
            },
        });
    });
    it('does not include instances with different foreign key values', async () => {
        const find = productRepo.stubs.find;
        const pen = await productRepo.create({ name: 'pen', categoryId: 1 });
        const pencil = await productRepo.create({ name: 'pencil', categoryId: 2 });
        find.resolves([pen]);
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', 1);
        testlab_1.expect(products).to.deepEqual([pen]);
        testlab_1.expect(products).to.not.containDeep(pencil);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: 1,
            },
        });
    });
    it('includes instances when there is one value in the array of foreign key values', async () => {
        const find = productRepo.stubs.find;
        const pen = await productRepo.create({ name: 'pen', categoryId: 1 });
        const pencil = await productRepo.create({ name: 'pencil', categoryId: 2 });
        find.resolves([pencil]);
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', [2]);
        testlab_1.expect(products).to.deepEqual([pencil]);
        testlab_1.expect(products).to.not.containDeep(pen);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: 2,
            },
        });
    });
    it('returns all instances that have any of multiple foreign key values', async () => {
        const pen = relations_helpers_fixtures_1.createProduct({ name: 'pen', categoryId: 1 });
        const pencil = relations_helpers_fixtures_1.createProduct({ name: 'pencil', categoryId: 2 });
        const paper = relations_helpers_fixtures_1.createProduct({ name: 'paper', categoryId: 3 });
        const find = productRepo.stubs.find;
        find.resolves([pen, paper]);
        const products = await __1.findByForeignKeys(productRepo, 'categoryId', [1, 3]);
        testlab_1.expect(products).to.deepEqual([pen, paper]);
        testlab_1.expect(products).to.not.containDeep(pencil);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: {
                    inq: [1, 3],
                },
            },
        });
    });
    // update the test when scope is supported
    it('throws error if scope is passed in and is non-empty', async () => {
        productRepo.stubs.find.resolves([]);
        await testlab_1.expect(__1.findByForeignKeys(productRepo, 'categoryId', [1], { limit: 1 })).to.be.rejectedWith('scope is not supported');
        testlab_1.sinon.assert.notCalled(productRepo.stubs.find);
    });
    // update the test when scope is supported
    it('does not throw an error if scope is passed in and is undefined or empty', async () => {
        const find = productRepo.stubs.find;
        find.resolves([]);
        let products = await __1.findByForeignKeys(productRepo, 'categoryId', [1], undefined, {});
        testlab_1.expect(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
        products = await __1.findByForeignKeys(productRepo, 'categoryId', 1, {}, {});
        testlab_1.expect(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
    });
});
//# sourceMappingURL=find-by-foreign-keys.unit.js.map