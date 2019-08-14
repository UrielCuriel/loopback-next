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
const _ = require("lodash");
const __1 = require("../..");
const repositories_1 = require("../fixtures/repositories");
describe('HasMany relation', () => {
    // Given a Customer and Order models - see definitions at the bottom
    let app;
    let controller;
    let customerRepo;
    let orderRepo;
    let existingCustomerId;
    before(givenApplicationWithMemoryDB);
    before(givenBoundCrudRepositoriesForCustomerAndOrder);
    before(givenCustomerController);
    beforeEach(async () => {
        await orderRepo.deleteAll();
    });
    beforeEach(async () => {
        existingCustomerId = (await givenPersistedCustomerInstance()).id;
    });
    it('can create an instance of the related model', async () => {
        const order = await controller.createCustomerOrders(existingCustomerId, {
            description: 'order 1',
        });
        testlab_1.expect(order.toObject()).to.containDeep({
            customerId: existingCustomerId,
            description: 'order 1',
        });
        const persisted = await orderRepo.findById(order.id);
        testlab_1.expect(persisted.toObject()).to.deepEqual(order.toObject());
    });
    it('can find instances of the related model', async () => {
        const order = await controller.createCustomerOrders(existingCustomerId, {
            description: 'order 1',
        });
        const notMyOrder = await controller.createCustomerOrders(existingCustomerId + 1, {
            description: 'order 2',
        });
        const foundOrders = await controller.findCustomerOrders(existingCustomerId);
        testlab_1.expect(foundOrders).to.containEql(order);
        testlab_1.expect(foundOrders).to.not.containEql(notMyOrder);
        const persisted = await orderRepo.find({
            where: { customerId: existingCustomerId },
        });
        testlab_1.expect(persisted).to.deepEqual(foundOrders);
    });
    it('can patch many instances', async () => {
        await controller.createCustomerOrders(existingCustomerId, {
            description: 'order 1',
            isShipped: false,
        });
        await controller.createCustomerOrders(existingCustomerId, {
            description: 'order 2',
            isShipped: false,
        });
        const patchObject = { isShipped: true };
        const arePatched = await controller.patchCustomerOrders(existingCustomerId, patchObject);
        testlab_1.expect(arePatched.count).to.equal(2);
        const patchedData = _.map(await controller.findCustomerOrders(existingCustomerId), d => _.pick(d, ['customerId', 'description', 'isShipped']));
        testlab_1.expect(patchedData).to.eql([
            {
                customerId: existingCustomerId,
                description: 'order 1',
                isShipped: true,
            },
            {
                customerId: existingCustomerId,
                description: 'order 2',
                isShipped: true,
            },
        ]);
    });
    it('throws error when query tries to change the foreignKey', async () => {
        await testlab_1.expect(controller.patchCustomerOrders(existingCustomerId, {
            customerId: existingCustomerId + 1,
        })).to.be.rejectedWith(/Property "customerId" cannot be changed!/);
    });
    it('can delete many instances', async () => {
        await controller.createCustomerOrders(existingCustomerId, {
            description: 'order 1',
        });
        await controller.createCustomerOrders(existingCustomerId, {
            description: 'order 2',
        });
        const deletedOrders = await controller.deleteCustomerOrders(existingCustomerId);
        testlab_1.expect(deletedOrders.count).to.equal(2);
        const relatedOrders = await controller.findCustomerOrders(existingCustomerId);
        testlab_1.expect(relatedOrders).to.be.empty();
    });
    it("does not delete instances that don't belong to the constrained instance", async () => {
        const newOrder = {
            customerId: existingCustomerId + 1,
            description: 'another order',
        };
        await orderRepo.create(newOrder);
        await controller.deleteCustomerOrders(existingCustomerId);
        const orders = await orderRepo.find();
        testlab_1.expect(orders).to.have.length(1);
        testlab_1.expect(_.pick(orders[0], ['customerId', 'description'])).to.eql(newOrder);
    });
    it('does not create an array of the related model', async () => {
        await testlab_1.expect(customerRepo.create({
            name: 'a customer',
            orders: [
                {
                    description: 'order 1',
                },
            ],
        })).to.be.rejectedWith(/`orders` is not defined/);
    });
    context('when targeting the source model', () => {
        it('gets the parent entity through the child entity', async () => {
            const parent = await customerRepo.create({ name: 'parent customer' });
            const child = await customerRepo.create({
                name: 'child customer',
                parentId: parent.id,
            });
            const childsParent = await controller.getParentCustomer(child.id);
            testlab_1.expect(_.pick(childsParent, ['id', 'name'])).to.eql(_.pick(parent, ['id', 'name']));
        });
        it('creates a child entity through the parent entity', async () => {
            const parent = await customerRepo.create({
                name: 'parent customer',
            });
            const child = await controller.createCustomerChildren(parent.id, {
                name: 'child customer',
            });
            testlab_1.expect(child.parentId).to.equal(parent.id);
            const children = await controller.findCustomerChildren(parent.id);
            testlab_1.expect(children).to.containEql(child);
        });
    });
    // This should be enforced by the database to avoid race conditions
    it.skip('reject create request when the customer does not exist');
    let CustomerController = class CustomerController {
        constructor(customerRepository) {
            this.customerRepository = customerRepository;
        }
        async createCustomerOrders(customerId, orderData) {
            return this.customerRepository.orders(customerId).create(orderData);
        }
        async findCustomerOrders(customerId) {
            return this.customerRepository.orders(customerId).find();
        }
        async patchCustomerOrders(customerId, order) {
            return this.customerRepository.orders(customerId).patch(order);
        }
        async deleteCustomerOrders(customerId) {
            return this.customerRepository.orders(customerId).delete();
        }
        async getParentCustomer(customerId) {
            return this.customerRepository.parent(customerId);
        }
        async createCustomerChildren(customerId, customerData) {
            return this.customerRepository.customers(customerId).create(customerData);
        }
        async findCustomerChildren(customerId) {
            return this.customerRepository.customers(customerId).find();
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
    async function givenBoundCrudRepositoriesForCustomerAndOrder() {
        app.repository(repositories_1.CustomerRepository);
        app.repository(repositories_1.OrderRepository);
        customerRepo = await app.getRepository(repositories_1.CustomerRepository);
        orderRepo = await app.getRepository(repositories_1.OrderRepository);
    }
    async function givenCustomerController() {
        app.controller(CustomerController);
        controller = await app.get('controllers.CustomerController');
    }
    async function givenPersistedCustomerInstance() {
        return customerRepo.create({ name: 'a customer' });
    }
});
//# sourceMappingURL=has-many.relation.acceptance.js.map