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
const _ = require("lodash");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const repositories_1 = require("../fixtures/repositories");
describe('HasManyThrough relation', () => {
    // Given a Customer and Seller models - see definitions at the bottom
    let app;
    let controller;
    let customerRepo;
    let orderRepo;
    let sellerRepo;
    let existingCustomerId;
    before(givenApplicationWithMemoryDB);
    before(givenBoundCrudRepositoriesForCustomerAndSeller);
    before(givenCustomerController);
    beforeEach(async () => {
        await sellerRepo.deleteAll();
    });
    beforeEach(async () => {
        existingCustomerId = (await givenPersistedCustomerInstance()).id;
    });
    it('can create an instance of the related model', async () => {
        const seller = await controller.createCustomerSellers(existingCustomerId, {
            name: 'Jam Risser',
        }, { description: 'some order' });
        testlab_1.expect(seller.toObject()).to.containDeep({
            name: 'Jam Risser',
        });
        const persisted = await sellerRepo.findById(seller.id);
        testlab_1.expect(persisted.toObject()).to.deepEqual(seller.toObject());
    });
    it('can find instances of the related model', async () => {
        const seller = await controller.createCustomerSellers(existingCustomerId, {
            name: 'Jam Risser',
        }, { description: 'some order' });
        const notMySeller = await controller.createCustomerSellers(existingCustomerId + 1, {
            name: 'Mark Twain',
        }, { description: 'some order' });
        const foundSellers = await controller.findCustomerSellers(existingCustomerId);
        testlab_1.expect(foundSellers).to.containEql(seller);
        testlab_1.expect(foundSellers).to.not.containEql(notMySeller);
        const persistedOrders = await orderRepo.find({
            where: {
                customerId: existingCustomerId,
            },
        });
        const persisted = await sellerRepo.find({
            where: {
                or: persistedOrders.map((order) => ({
                    id: order.sellerId,
                })),
            },
        });
        testlab_1.expect(persisted).to.deepEqual(foundSellers);
    });
    it('can patch many instances', async () => {
        await controller.createCustomerSellers(existingCustomerId, {
            name: 'Jam Risser',
        }, { description: 'some order' });
        await controller.createCustomerSellers(existingCustomerId, {
            name: 'Jam Risser',
        }, { description: 'some order' });
        const patchObject = { name: 'Mark Twain' };
        const arePatched = await controller.patchCustomerSellers(existingCustomerId, patchObject);
        testlab_1.expect(arePatched.count).to.equal(2);
        const patchedData = _.map(await controller.findCustomerSellers(existingCustomerId), d => _.pick(d, ['name']));
        testlab_1.expect(patchedData).to.eql([
            {
                name: 'Mark Twain',
            },
            {
                name: 'Mark Twain',
            },
        ]);
    });
    it('can delete many instances', async () => {
        await controller.createCustomerSellers(existingCustomerId, {
            name: 'Jam Risser',
        }, { description: 'some order' });
        await controller.createCustomerSellers(existingCustomerId, {
            name: 'Jam Risser',
        }, { description: 'some order' });
        const deletedSellers = await controller.deleteCustomerSellers(existingCustomerId);
        testlab_1.expect(deletedSellers.count).to.equal(2);
        const relatedSellers = await controller.findCustomerSellers(existingCustomerId);
        testlab_1.expect(relatedSellers).to.be.empty();
    });
    it("does not delete instances that don't belong to the constrained instance", async () => {
        await controller.createCustomerSellers(existingCustomerId, {
            name: 'Jam Risser',
        }, { description: 'some order' });
        const newSeller = {
            name: 'Mark Twain',
        };
        await sellerRepo.create(newSeller);
        await controller.deleteCustomerSellers(existingCustomerId);
        const sellers = await sellerRepo.find();
        testlab_1.expect(sellers).to.have.length(1);
        testlab_1.expect(_.pick(sellers[0], ['name'])).to.eql({
            name: 'Mark Twain',
        });
    });
    it('does not create an array of the related model', async () => {
        await testlab_1.expect(customerRepo.create({
            name: 'a customer',
            sellers: [
                {
                    name: 'Mark Twain',
                },
            ],
        })).to.be.rejectedWith(/`sellers` is not defined/);
    });
    // This should be enforced by the database to avoid race conditions
    it.skip('reject create request when the customer does not exist');
    let CustomerController = class CustomerController {
        constructor(customerRepository) {
            this.customerRepository = customerRepository;
        }
        async createCustomerSellers(customerId, sellerData, orderData) {
            return await this.customerRepository
                .sellers(customerId)
                .create(sellerData, orderData);
        }
        async findCustomerSellers(customerId) {
            return await this.customerRepository.sellers(customerId).find();
        }
        async patchCustomerSellers(customerId, seller) {
            return await this.customerRepository.sellers(customerId).patch(seller);
        }
        async deleteCustomerSellers(customerId) {
            return await this.customerRepository.sellers(customerId).delete();
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
    async function givenBoundCrudRepositoriesForCustomerAndSeller() {
        app.repository(repositories_1.CustomerRepository);
        app.repository(repositories_1.OrderRepository);
        app.repository(repositories_1.SellerRepository);
        customerRepo = await app.getRepository(repositories_1.CustomerRepository);
        orderRepo = await app.getRepository(repositories_1.OrderRepository);
        sellerRepo = await app.getRepository(repositories_1.SellerRepository);
    }
    async function givenCustomerController() {
        app.controller(CustomerController);
        controller = await app.get('controllers.CustomerController');
    }
    async function givenPersistedCustomerInstance() {
        return customerRepo.create({ name: 'a customer' });
    }
});
//# sourceMappingURL=has-many-through.relation.acceptance.js.map