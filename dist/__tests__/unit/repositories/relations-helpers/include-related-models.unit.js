"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('includeRelatedModels', () => {
    let productRepo;
    let categoryRepo;
    before(() => {
        productRepo = new relations_helpers_fixtures_1.ProductRepository(relations_helpers_fixtures_1.testdb);
        categoryRepo = new relations_helpers_fixtures_1.CategoryRepository(relations_helpers_fixtures_1.testdb, async () => productRepo);
    });
    beforeEach(async () => {
        await productRepo.deleteAll();
        await categoryRepo.deleteAll();
    });
    it("defines a repository's inclusionResolvers property", () => {
        testlab_1.expect(categoryRepo.inclusionResolvers).to.not.be.undefined();
        testlab_1.expect(productRepo.inclusionResolvers).to.not.be.undefined();
    });
    it('returns source model if no filter is passed in', async () => {
        const category = await categoryRepo.create({ name: 'category 1' });
        await categoryRepo.create({ name: 'category 2' });
        const result = await __1.includeRelatedModels(categoryRepo, [category]);
        testlab_1.expect(result).to.eql([category]);
    });
    it('throws error if the target repository does not have the registered resolver', async () => {
        const category = await categoryRepo.create({ name: 'category 1' });
        await testlab_1.expect(__1.includeRelatedModels(categoryRepo, [category], [{ relation: 'products' }])).to.be.rejectedWith(/Invalid "filter.include" entries: {"relation":"products"}/);
    });
    it('returns an empty array if target model of the source entity does not have any matched instances', async () => {
        const category = await categoryRepo.create({ name: 'category' });
        categoryRepo.inclusionResolvers.set('products', hasManyResolver);
        const categories = await __1.includeRelatedModels(categoryRepo, [category], [{ relation: 'products' }]);
        testlab_1.expect(categories[0].products).to.be.empty();
    });
    it('includes related model for one instance - belongsTo', async () => {
        const category = await categoryRepo.create({ name: 'category' });
        const product = await productRepo.create({
            name: 'product',
            categoryId: category.id,
        });
        productRepo.inclusionResolvers.set('category', belongsToResolver);
        const productWithCategories = await __1.includeRelatedModels(productRepo, [product], [{ relation: 'category' }]);
        testlab_1.expect(productWithCategories[0].toJSON()).to.deepEqual(Object.assign(Object.assign({}, product.toJSON()), { category: category.toJSON() }));
    });
    it('includes related model for more than one instance - belongsTo', async () => {
        const categoryOne = await categoryRepo.create({ name: 'category 1' });
        const productOne = await productRepo.create({
            name: 'product 1',
            categoryId: categoryOne.id,
        });
        const categoryTwo = await categoryRepo.create({ name: 'category 2' });
        const productTwo = await productRepo.create({
            name: 'product 2',
            categoryId: categoryTwo.id,
        });
        const productThree = await productRepo.create({
            name: 'product 3',
            categoryId: categoryTwo.id,
        });
        productRepo.inclusionResolvers.set('category', belongsToResolver);
        const productWithCategories = await __1.includeRelatedModels(productRepo, [productOne, productTwo, productThree], [{ relation: 'category' }]);
        testlab_1.expect(testlab_1.toJSON(productWithCategories)).to.deepEqual([
            Object.assign(Object.assign({}, productOne.toJSON()), { category: categoryOne.toJSON() }),
            Object.assign(Object.assign({}, productTwo.toJSON()), { category: categoryTwo.toJSON() }),
            Object.assign(Object.assign({}, productThree.toJSON()), { category: categoryTwo.toJSON() }),
        ]);
    });
    it('includes related models for one instance - hasMany', async () => {
        const category = await categoryRepo.create({ name: 'category' });
        const productOne = await productRepo.create({
            name: 'product 1',
            categoryId: category.id,
        });
        const productTwo = await productRepo.create({
            name: 'product 2',
            categoryId: category.id,
        });
        categoryRepo.inclusionResolvers.set('products', hasManyResolver);
        const categoryWithProducts = await __1.includeRelatedModels(categoryRepo, [category], [{ relation: 'products' }]);
        testlab_1.expect(testlab_1.toJSON(categoryWithProducts)).to.deepEqual([
            Object.assign(Object.assign({}, category.toJSON()), { products: [productOne.toJSON(), productTwo.toJSON()] }),
        ]);
    });
    it('includes related models for more than one instance - hasMany', async () => {
        const categoryOne = await categoryRepo.create({ name: 'category 1' });
        const productOne = await productRepo.create({
            name: 'product 1',
            categoryId: categoryOne.id,
        });
        const categoryTwo = await categoryRepo.create({ name: 'category 2' });
        const productTwo = await productRepo.create({
            name: 'product 2',
            categoryId: categoryTwo.id,
        });
        const categoryThree = await categoryRepo.create({ name: 'category 3' });
        const productThree = await productRepo.create({
            name: 'product 3',
            categoryId: categoryTwo.id,
        });
        categoryRepo.inclusionResolvers.set('products', hasManyResolver);
        const categoryWithProducts = await __1.includeRelatedModels(categoryRepo, [categoryOne, categoryTwo, categoryThree], [{ relation: 'products' }]);
        testlab_1.expect(testlab_1.toJSON(categoryWithProducts)).to.deepEqual([
            Object.assign(Object.assign({}, categoryOne.toJSON()), { products: [productOne.toJSON()] }),
            Object.assign(Object.assign({}, categoryTwo.toJSON()), { products: [productTwo.toJSON(), productThree.toJSON()] }),
            Object.assign(Object.assign({}, categoryThree.toJSON()), { products: [] }),
        ]);
    });
    // stubbed resolvers
    const belongsToResolver = async (entities) => {
        const categories = [];
        for (const product of entities) {
            const category = await categoryRepo.findById(product.categoryId);
            categories.push(category);
        }
        return categories;
    };
    const hasManyResolver = async (entities) => {
        const products = [];
        for (const category of entities) {
            const product = await categoryRepo.products(category.id).find();
            products.push(product);
        }
        return products;
    };
});
//# sourceMappingURL=include-related-models.unit.js.map