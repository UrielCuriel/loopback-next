"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('createBelongsToAccessor', () => {
    let customerRepo;
    let companyRepo;
    beforeEach(givenStubbedCustomerRepo);
    beforeEach(givenStubbedCompanyRepo);
    it('rejects relations with missing source', () => {
        const relationMeta = givenBelongsToDefinition({
            source: undefined,
        });
        testlab_1.expect(() => __1.createBelongsToAccessor(relationMeta, __1.Getter.fromValue(companyRepo), customerRepo)).to.throw(/source model must be defined/);
    });
    it('rejects relations with missing target', () => {
        const relationMeta = givenBelongsToDefinition({
            target: undefined,
        });
        testlab_1.expect(() => __1.createBelongsToAccessor(relationMeta, __1.Getter.fromValue(companyRepo), customerRepo)).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with missing keyFrom', () => {
        const relationMeta = givenBelongsToDefinition({
            keyFrom: undefined,
        });
        testlab_1.expect(() => __1.createBelongsToAccessor(relationMeta, __1.Getter.fromValue(companyRepo), customerRepo)).to.throw(/keyFrom is required/);
    });
    it('rejects relations with a target that is not a type resolver', () => {
        const relationMeta = givenBelongsToDefinition({
            // tslint:disable-next-line:no-any
            target: Customer,
        });
        testlab_1.expect(() => __1.createBelongsToAccessor(relationMeta, __1.Getter.fromValue(companyRepo), customerRepo)).to.throw(/target must be a type resolver/);
    });
    it('throws an error when the target does not have any primary key', () => {
        class Product extends __1.Entity {
        }
        Product.definition = new __1.ModelDefinition('Product').addProperty('categoryId', { type: Number });
        class Category extends __1.Entity {
        }
        Category.definition = new __1.ModelDefinition('Category');
        const productRepo = testlab_1.createStubInstance(__1.DefaultCrudRepository);
        const categoryRepo = testlab_1.createStubInstance(__1.DefaultCrudRepository);
        const relationMeta = {
            type: __1.RelationType.belongsTo,
            name: 'category',
            source: Product,
            target: () => Category,
            keyFrom: 'categoryId',
            // Let the relation to look up keyTo as the primary key of Category
            // (which is not defined!)
            keyTo: undefined,
        };
        testlab_1.expect(() => __1.createBelongsToAccessor(relationMeta, __1.Getter.fromValue(categoryRepo), productRepo)).to.throw(/Category does not have any primary key/);
    });
    /*------------- HELPERS ---------------*/
    class Customer extends __1.Entity {
    }
    Customer.definition = new __1.ModelDefinition('Customer').addProperty('id', {
        type: Number,
        id: true,
    });
    class Company extends __1.Entity {
    }
    Company.definition = new __1.ModelDefinition('Company').addProperty('id', {
        type: Number,
        id: true,
    });
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Customer, dataSource);
        }
    }
    class CompanyRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Company, dataSource);
        }
    }
    function givenStubbedCustomerRepo() {
        customerRepo = testlab_1.createStubInstance(CustomerRepository);
    }
    function givenStubbedCompanyRepo() {
        customerRepo = testlab_1.createStubInstance(CompanyRepository);
    }
    function givenBelongsToDefinition(props) {
        const defaults = {
            type: __1.RelationType.belongsTo,
            name: 'company',
            source: Company,
            target: () => Customer,
            keyFrom: 'customerId',
        };
        return Object.assign(defaults, props);
    }
});
//# sourceMappingURL=belongs-to-repository-factory.unit.js.map