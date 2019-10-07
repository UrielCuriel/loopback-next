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
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('HasMany relation', () => {
    // Given a Customer and Order models - see definitions at the bottom
    let existingCustomerId;
    let ds;
    let customerRepo;
    let orderRepo;
    before(givenDataSource);
    before(givenOrderRepository);
    before(givenCustomerRepository);
    beforeEach(async () => {
        await orderRepo.deleteAll();
        existingCustomerId = (await givenPersistedCustomerInstance()).id;
    });
    it('can create an instance of the related model', async () => {
        async function createCustomerOrders(customerId, orderData) {
            return customerRepo.orders(customerId).create(orderData);
        }
        const order = await createCustomerOrders(existingCustomerId, {
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
        async function createCustomerOrders(customerId, orderData) {
            return customerRepo.orders(customerId).create(orderData);
        }
        async function findCustomerOrders(customerId) {
            return customerRepo.orders(customerId).find();
        }
        const order = await createCustomerOrders(existingCustomerId, {
            description: 'order 1',
        });
        const notMyOrder = await createCustomerOrders(existingCustomerId + 1, {
            description: 'order 2',
        });
        const orders = await findCustomerOrders(existingCustomerId);
        testlab_1.expect(orders).to.containEql(order);
        testlab_1.expect(orders).to.not.containEql(notMyOrder);
        const persisted = await orderRepo.find({
            where: { customerId: existingCustomerId },
        });
        testlab_1.expect(persisted).to.deepEqual(orders);
    });
    //--- HELPERS ---//
    let Order = class Order extends __1.Entity {
    };
    __decorate([
        __1.property({
            type: 'number',
            id: true,
        }),
        __metadata("design:type", Number)
    ], Order.prototype, "id", void 0);
    __decorate([
        __1.property({
            type: 'string',
            required: true,
        }),
        __metadata("design:type", String)
    ], Order.prototype, "description", void 0);
    __decorate([
        __1.property({
            type: 'number',
            required: true,
        }),
        __metadata("design:type", Number)
    ], Order.prototype, "customerId", void 0);
    Order = __decorate([
        __1.model()
    ], Order);
    let Customer = class Customer extends __1.Entity {
    };
    __decorate([
        __1.property({
            type: 'number',
            id: true,
        }),
        __metadata("design:type", Number)
    ], Customer.prototype, "id", void 0);
    __decorate([
        __1.property({
            type: 'string',
        }),
        __metadata("design:type", String)
    ], Customer.prototype, "name", void 0);
    __decorate([
        __1.hasMany(() => Order),
        __metadata("design:type", Array)
    ], Customer.prototype, "orders", void 0);
    Customer = __decorate([
        __1.model()
    ], Customer);
    class OrderRepository extends __1.DefaultCrudRepository {
        constructor(db) {
            super(Order, db);
        }
    }
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(db, orderRepositoryGetter) {
            super(Customer, db);
            this.db = db;
            this.orders = this._createHasManyRepositoryFactoryFor('orders', orderRepositoryGetter);
        }
    }
    function givenDataSource() {
        ds = new __1.juggler.DataSource({ connector: 'memory' });
    }
    function givenOrderRepository() {
        orderRepo = new OrderRepository(ds);
    }
    function givenCustomerRepository() {
        customerRepo = new CustomerRepository(ds, __1.Getter.fromValue(orderRepo));
    }
    async function givenPersistedCustomerInstance() {
        return customerRepo.create({ name: 'a customer' });
    }
});
//# sourceMappingURL=has-many-without-di.relation.acceptance.js.map