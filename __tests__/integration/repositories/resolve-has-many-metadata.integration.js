"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const has_many_helpers_1 = require("../../../relations/has-many/has-many.helpers");
describe('keyTo and keyFrom with resolveHasManyMetadata', () => {
    it('resolves metadata using keyTo and keyFrom', () => {
        const meta = has_many_helpers_1.resolveHasManyMetadata(Category.definition.relations['products']);
        testlab_1.expect(meta).to.eql({
            name: 'products',
            type: 'hasMany',
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Product,
            keyTo: 'categoryId',
        });
    });
    it('infers keyFrom if it is not provided', () => {
        const meta = has_many_helpers_1.resolveHasManyMetadata(Category.definition.relations['items']);
        testlab_1.expect(meta).to.eql({
            name: 'items',
            type: 'hasMany',
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Item,
            keyTo: 'categoryId',
        });
    });
    it('infers keyTo if it is not provided', () => {
        const meta = has_many_helpers_1.resolveHasManyMetadata(Category.definition.relations['things']);
        testlab_1.expect(meta).to.eql({
            name: 'things',
            type: 'hasMany',
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Thing,
            keyTo: 'categoryId',
        });
    });
    it('throws if keyFrom, keyTo, and default foreign key name are not provided', async () => {
        let error;
        try {
            has_many_helpers_1.resolveHasManyMetadata(Category.definition.relations['categories']);
        }
        catch (err) {
            error = err;
        }
        testlab_1.expect(error.message).to.eql('Invalid hasMany definition for Category#categories: target model ' +
            'Category is missing definition of foreign key categoryId');
        testlab_1.expect(error.code).to.eql('INVALID_RELATION_DEFINITION');
    });
    it('resolves metadata if keyTo and keyFrom are not provided, but default foreign key is', async () => {
        Category.definition.addProperty('categoryId', { type: 'number' });
        const meta = has_many_helpers_1.resolveHasManyMetadata(Category.definition.relations['categories']);
        testlab_1.expect(meta).to.eql({
            name: 'categories',
            type: 'hasMany',
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Category,
            keyTo: 'categoryId',
        });
    });
    /******  HELPERS *******/
    class Category extends __1.Entity {
    }
    Category.definition = new __1.ModelDefinition('Category')
        .addProperty('id', { type: 'number', id: true, required: true })
        .addRelation({
        name: 'products',
        type: __1.RelationType.hasMany,
        targetsMany: true,
        source: Category,
        keyFrom: 'id',
        target: () => Product,
        keyTo: 'categoryId',
    })
        .addRelation({
        name: 'items',
        type: __1.RelationType.hasMany,
        targetsMany: true,
        source: Category,
        // no keyFrom
        target: () => Item,
        keyTo: 'categoryId',
    })
        .addRelation({
        name: 'things',
        type: __1.RelationType.hasMany,
        targetsMany: true,
        source: Category,
        keyFrom: 'id',
        target: () => Thing,
    })
        .addRelation({
        name: 'categories',
        type: __1.RelationType.hasMany,
        targetsMany: true,
        source: Category,
        // no keyFrom
        target: () => Category,
    });
    class Product extends __1.Entity {
    }
    Product.definition = new __1.ModelDefinition('Product')
        .addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    })
        .addProperty('categoryId', { type: 'number' });
    class Item extends __1.Entity {
    }
    Item.definition = new __1.ModelDefinition('Item')
        .addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    })
        .addProperty('categoryId', { type: 'number' });
    class Thing extends __1.Entity {
    }
    Thing.definition = new __1.ModelDefinition('Thing')
        .addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    })
        .addProperty('categoryId', { type: 'number' });
});
//# sourceMappingURL=resolve-has-many-metadata.integration.js.map