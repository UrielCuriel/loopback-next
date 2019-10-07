"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('createHasOneRepositoryFactory', () => {
    let customerRepo;
    beforeEach(givenStubbedCustomerRepo);
    it('rejects relations with missing source', () => {
        const relationMeta = givenHasOneDefinition({
            source: undefined,
        });
        testlab_1.expect(() => __1.createHasOneRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo))).to.throw(/source model must be defined/);
    });
    it('rejects relations with missing target', () => {
        const relationMeta = givenHasOneDefinition({
            target: undefined,
        });
        testlab_1.expect(() => __1.createHasOneRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo))).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with a target that is not a type resolver', () => {
        const relationMeta = givenHasOneDefinition({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            target: Address,
        });
        testlab_1.expect(() => __1.createHasOneRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo))).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with keyTo pointing to an unknown property', () => {
        const relationMeta = givenHasOneDefinition({
            target: () => Address,
            // Let the relation use the default keyTo value "customerId"
            // which does not exist on the Customer model!
            keyTo: undefined,
        });
        testlab_1.expect(() => __1.createHasOneRepositoryFactory(relationMeta, context_1.Getter.fromValue(customerRepo))).to.throw(/target model Address is missing.*foreign key customerId/);
    });
    /*------------- HELPERS ---------------*/
    class Address extends __1.Entity {
    }
    Address.definition = new __1.ModelDefinition('Address')
        .addProperty('street', {
        type: 'string',
    })
        .addProperty('zipcode', {
        type: 'string',
    })
        .addProperty('city', {
        type: 'string',
    })
        .addProperty('province', {
        type: 'string',
    });
    class Customer extends __1.Entity {
    }
    Customer.definition = new __1.ModelDefinition('Customer').addProperty('id', {
        type: Number,
        id: true,
    });
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Customer, dataSource);
        }
    }
    function givenStubbedCustomerRepo() {
        customerRepo = testlab_1.createStubInstance(CustomerRepository);
    }
    function givenHasOneDefinition(props) {
        const defaults = {
            type: __1.RelationType.hasOne,
            targetsMany: false,
            name: 'address',
            target: () => Address,
            source: Customer,
        };
        return Object.assign(defaults, props);
    }
});
//# sourceMappingURL=has-one-repository-factory.unit.js.map