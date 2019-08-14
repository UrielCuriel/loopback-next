"use strict";
// Copyright IBM Corp. 2017,2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('createHasManyThroughRepositoryFactory', () => {
    let customerRepo;
    let orderRepo;
    beforeEach(givenStubbedCustomerRepo);
    it('rejects relations with missing source', () => {
        const relationMeta = givenHasManyThroughDefinition({
            source: undefined,
        });
        testlab_1.expect(() => __1.createHasManyThroughRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo), context_1.Getter.fromValue(customerRepo))).to.throw(/source model must be defined/);
    });
    it('rejects relations with missing target', () => {
        const relationMeta = givenHasManyThroughDefinition({
            target: undefined,
        });
        testlab_1.expect(() => __1.createHasManyThroughRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo), context_1.Getter.fromValue(customerRepo))).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with a target that is not a type resolver', () => {
        const relationMeta = givenHasManyThroughDefinition({
            // tslint:disable-next-line:no-any
            target: Customer,
        });
        testlab_1.expect(() => __1.createHasManyThroughRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo), context_1.Getter.fromValue(orderRepo))).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with keyTo pointing to an unknown property', () => {
        const relationMeta = givenHasManyThroughDefinition({
            target: () => Customer,
            // Let the relation to use the default keyTo value "companyId"
            // which does not exist on the Customer model!
            keyTo: undefined,
        });
        testlab_1.expect(() => __1.createHasManyThroughRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo), context_1.Getter.fromValue(orderRepo))).to.throw(/through model Customer is missing.*foreign key companyId/);
    });
    it('rejects relations with missing "through"', () => {
        const relationMeta = givenHasManyThroughDefinition({
            target: () => Customer,
            through: undefined,
        });
        testlab_1.expect(() => __1.createHasManyThroughRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo), context_1.Getter.fromValue(orderRepo))).to.throw(/through must be a type resolver/);
    });
    it('rejects relations with "through" that is not a type resolver', () => {
        const relationMeta = givenHasManyThroughDefinition({
            target: () => Customer,
        });
        relationMeta.through = true;
        testlab_1.expect(() => __1.createHasManyThroughRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo), context_1.Getter.fromValue(orderRepo))).to.throw(/through must be a type resolver/);
    });
    /*------------- HELPERS ---------------*/
    class Customer extends __1.Entity {
    }
    Customer.definition = new __1.ModelDefinition('Customer').addProperty('id', {
        type: Number,
        id: true,
    });
    class Order extends __1.Entity {
    }
    Order.definition = new __1.ModelDefinition('Order')
        .addProperty('id', {
        type: Number,
        id: true,
    })
        .addProperty('customerId', {
        type: Number,
    });
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Customer, dataSource);
        }
    }
    class OrderRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Order, dataSource);
        }
    }
    function givenStubbedCustomerRepo() {
        customerRepo = testlab_1.createStubInstance(CustomerRepository);
    }
    function givenHasManyThroughDefinition(props) {
        class Company extends __1.Entity {
        }
        Company.definition = new __1.ModelDefinition('Company').addProperty('id', {
            type: Number,
            id: true,
        });
        const defaults = {
            type: __1.RelationType.hasMany,
            targetsMany: true,
            name: 'customers',
            target: () => Customer,
            through: () => Order,
            source: Company,
        };
        return Object.assign(defaults, props);
    }
});
//# sourceMappingURL=has-many-through-repository-factory.unit.js.map