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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const repositories_1 = require("../fixtures/repositories");
describe('hasOne relation', () => {
    // Given a Customer and Address models - see definitions at the bottom
    let app;
    let controller;
    let customerRepo;
    let addressRepo;
    let existingCustomerId;
    before(givenApplicationWithMemoryDB);
    before(givenBoundCrudRepositoriesForCustomerAndAddress);
    before(givenCustomerController);
    beforeEach(async () => {
        await addressRepo.deleteAll();
        existingCustomerId = (await givenPersistedCustomerInstance()).id;
    });
    it('can create an instance of the related model', async () => {
        const address = await controller.createCustomerAddress(existingCustomerId, {
            street: '123 test avenue',
        });
        testlab_1.expect(address.toObject()).to.containDeep({
            customerId: existingCustomerId,
            street: '123 test avenue',
        });
        const persisted = await addressRepo.findById(address.zipcode);
        testlab_1.expect(persisted.toObject()).to.deepEqual(address.toObject());
    });
    // We do not enforce referential integrity at the moment. It is up to
    // our users to set up unique constraint(s) between related models at the
    // database level
    it.skip('refuses to create related model instance twice', async () => {
        const address = await controller.createCustomerAddress(existingCustomerId, {
            street: '123 test avenue',
        });
        await testlab_1.expect(controller.createCustomerAddress(existingCustomerId, {
            street: '456 test street',
        })).to.be.rejectedWith(/Duplicate entry for Address.customerId/);
        testlab_1.expect(address.toObject()).to.containDeep({
            customerId: existingCustomerId,
            street: '123 test avenue',
        });
        const persisted = await addressRepo.findById(address.zipcode);
        testlab_1.expect(persisted.toObject()).to.deepEqual(address.toObject());
    });
    it('can find instance of the related model', async () => {
        const address = await controller.createCustomerAddress(existingCustomerId, {
            street: '123 test avenue',
        });
        const foundAddress = await controller.findCustomerAddress(existingCustomerId);
        testlab_1.expect(foundAddress).to.containEql(address);
        testlab_1.expect(testlab_1.toJSON(foundAddress)).to.deepEqual(testlab_1.toJSON(address));
        const persisted = await addressRepo.find({
            where: { customerId: existingCustomerId },
        });
        testlab_1.expect(persisted[0]).to.deepEqual(foundAddress);
    });
    // FIXME(b-admike): make sure the test fails with compiler error
    it.skip('ignores where filter to find related model instance', async () => {
        const foundAddress = await controller.findCustomerAddressWithFilter(existingCustomerId, 
        // the compiler should complain that the where field is
        // not accepted in the filter object for the get() method
        // if the following line is uncommented
        {
            where: { street: '456 test road' },
        });
        const persisted = await addressRepo.find({
            where: { customerId: existingCustomerId },
        });
        // TODO: make sure this test fails when where condition is supplied
        // compiler should have errored out (?)
        testlab_1.expect(persisted[0]).to.deepEqual(foundAddress);
    });
    it('reports EntityNotFound error when related model is deleted', async () => {
        const address = await controller.createCustomerAddress(existingCustomerId, {
            street: '123 test avenue',
        });
        await addressRepo.deleteById(address.zipcode);
        await testlab_1.expect(controller.findCustomerAddress(existingCustomerId)).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('can PATCH hasOne instances', async () => {
        const address = await controller.createCustomerAddress(existingCustomerId, {
            street: '1 Amedee Bonnet',
            zipcode: '69740',
            city: 'Genas',
            province: 'Rhone',
        });
        const patchObject = { city: 'Lyon-Genas' };
        const arePatched = await controller.patchCustomerAddress(existingCustomerId, patchObject);
        testlab_1.expect(arePatched).to.deepEqual({ count: 1 });
        const patchedData = await addressRepo.findById(address.zipcode);
        testlab_1.expect(testlab_1.toJSON(patchedData)).to.deepEqual({
            customerId: existingCustomerId,
            street: '1 Amedee Bonnet',
            zipcode: '69740',
            city: 'Lyon-Genas',
            province: 'Rhone',
        });
    });
    it('patches the related instance only', async () => {
        const bob = await customerRepo.create({ name: 'Bob' });
        await customerRepo.address(bob.id).create({ city: 'Paris' });
        const alice = await customerRepo.create({ name: 'Alice' });
        await customerRepo.address(alice.id).create({ city: 'London' });
        const result = await controller.patchCustomerAddress(alice.id, {
            city: 'New York',
        });
        testlab_1.expect(result).to.deepEqual({ count: 1 });
        const found = await customerRepo.address(bob.id).get();
        testlab_1.expect(testlab_1.toJSON(found)).to.containDeep({ city: 'Paris' });
    });
    it('throws an error when PATCH tries to change the foreignKey', async () => {
        await testlab_1.expect(controller.patchCustomerAddress(existingCustomerId, {
            customerId: existingCustomerId + 1,
        })).to.be.rejectedWith(/Property "customerId" cannot be changed!/);
    });
    it('can DELETE hasOne relation instances', async () => {
        await controller.createCustomerAddress(existingCustomerId, {
            street: '1 Amedee Bonnet',
            zipcode: '69740',
            city: 'Genas',
            province: 'Rhone',
        });
        const areDeleted = await controller.deleteCustomerAddress(existingCustomerId);
        testlab_1.expect(areDeleted).to.deepEqual({ count: 1 });
        await testlab_1.expect(controller.findCustomerAddress(existingCustomerId)).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('deletes the related model instance only', async () => {
        const bob = await customerRepo.create({ name: 'Bob' });
        await customerRepo.address(bob.id).create({ city: 'Paris' });
        const alice = await customerRepo.create({ name: 'Alice' });
        await customerRepo.address(alice.id).create({ city: 'London' });
        const result = await controller.deleteCustomerAddress(alice.id);
        testlab_1.expect(result).to.deepEqual({ count: 1 });
        const found = await addressRepo.find();
        testlab_1.expect(found).to.have.length(1);
    });
    /*---------------- HELPERS -----------------*/
    let CustomerController = class CustomerController {
        constructor(customerRepository) {
            this.customerRepository = customerRepository;
        }
        async createCustomerAddress(customerId, addressData) {
            return this.customerRepository.address(customerId).create(addressData);
        }
        async findCustomerAddress(customerId) {
            return this.customerRepository.address(customerId).get();
        }
        async findCustomerAddressWithFilter(customerId, filter) {
            return this.customerRepository.address(customerId).get(filter);
        }
        async patchCustomerAddress(customerId, addressData) {
            return this.customerRepository.address(customerId).patch(addressData);
        }
        async deleteCustomerAddress(customerId) {
            return this.customerRepository.address(customerId).delete();
        }
    };
    CustomerController = __decorate([
        __param(0, __1.repository(repositories_1.CustomerRepository)),
        __metadata("design:paramtypes", [repositories_1.CustomerRepository])
    ], CustomerController);
    function givenApplicationWithMemoryDB() {
        class TestApp extends __1.RepositoryMixin(core_1.Application) {
        }
        app = new TestApp();
        app.dataSource(new __1.juggler.DataSource({ name: 'db', connector: 'memory' }));
    }
    async function givenBoundCrudRepositoriesForCustomerAndAddress() {
        app.repository(repositories_1.CustomerRepository);
        app.repository(repositories_1.AddressRepository);
        customerRepo = await app.getRepository(repositories_1.CustomerRepository);
        addressRepo = await app.getRepository(repositories_1.AddressRepository);
    }
    async function givenCustomerController() {
        app.controller(CustomerController);
        controller = await app.get('controllers.CustomerController');
    }
    async function givenPersistedCustomerInstance() {
        return customerRepo.create({ name: 'a customer' });
    }
});
//# sourceMappingURL=has-one.relation.acceptance.js.map