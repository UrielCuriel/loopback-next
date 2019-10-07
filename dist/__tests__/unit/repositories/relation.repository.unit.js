"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('relation repository', () => {
    let customerRepo;
    beforeEach(setupStubbedCustomerRepository);
    context('HasManyRepository interface', () => {
        /**
         * The class below is declared as test for the HasManyEntityCrudRepository
         * interface. The TS Compiler will complain if the interface changes.
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestHasManyEntityCrudRepository {
            create(targetModelData, options) {
                /* istanbul ignore next */
                throw new Error('Method not implemented.');
            }
            find(filter, options) {
                /* istanbul ignore next */
                throw new Error('Method not implemented.');
            }
            async delete(where, options) {
                /* istanbul ignore next */
                throw new Error('Method not implemented.');
            }
            async patch(dataObject, where, options) {
                /* istanbul ignore next */
                throw new Error('Method not implemented.');
            }
        }
    });
    context('DefaultHasManyEntityCrudRepository', () => {
        it('can create related model instance', async () => {
            const constraint = { age: 25 };
            const hasManyCrudInstance = givenDefaultHasManyInstance(constraint);
            await hasManyCrudInstance.create({ id: 1, name: 'Joe' });
            testlab_1.sinon.assert.calledWithMatch(customerRepo.stubs.create, {
                id: 1,
                name: 'Joe',
                age: 25,
            });
        });
        it('can find related model instance', async () => {
            const constraint = { name: 'Jane' };
            const hasManyCrudInstance = givenDefaultHasManyInstance(constraint);
            await hasManyCrudInstance.find({ where: { id: 3 } });
            testlab_1.sinon.assert.calledWithMatch(customerRepo.stubs.find, {
                where: { id: 3, name: 'Jane' },
            });
        });
        context('patch', () => {
            it('can patch related model instance', async () => {
                const constraint = { name: 'Jane' };
                const hasManyCrudInstance = givenDefaultHasManyInstance(constraint);
                await hasManyCrudInstance.patch({ country: 'US' }, { id: 3 });
                testlab_1.sinon.assert.calledWith(customerRepo.stubs.updateAll, { country: 'US', name: 'Jane' }, { id: 3, name: 'Jane' });
            });
            it('cannot override the constrain data', async () => {
                const constraint = { name: 'Jane' };
                const hasManyCrudInstance = givenDefaultHasManyInstance(constraint);
                await testlab_1.expect(hasManyCrudInstance.patch({ name: 'Joe' })).to.be.rejectedWith(/Property "name" cannot be changed!/);
            });
        });
        it('can delete related model instance', async () => {
            const constraint = { name: 'Jane' };
            const hasManyCrudInstance = givenDefaultHasManyInstance(constraint);
            await hasManyCrudInstance.delete({ id: 3 });
            testlab_1.sinon.assert.calledWith(customerRepo.stubs.deleteAll, {
                id: 3,
                name: 'Jane',
            });
        });
    });
    /*------------- HELPERS ---------------*/
    class Customer extends __1.Entity {
    }
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Customer, dataSource);
        }
    }
    function setupStubbedCustomerRepository() {
        customerRepo = testlab_1.createStubInstance(CustomerRepository);
    }
    function givenDefaultHasManyInstance(constraint) {
        return new __1.DefaultHasManyRepository(context_1.Getter.fromValue(customerRepo), constraint);
    }
});
//# sourceMappingURL=relation.repository.unit.js.map