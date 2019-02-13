"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const relations_1 = require("../../../relations");
// Given a Customer and Order models - see definitions at the bottom
let db;
let customerRepo;
let orderRepo;
let sellerRepo;
let reviewRepo;
describe('HasMany relation', () => {
    let existingCustomerId;
    let customerOrderRepo;
    let customerSellerRepo;
    let customerAuthoredReviewFactoryFn;
    let customerApprovedReviewFactoryFn;
    before(givenCrudRepositories);
    before(givenPersistedCustomerInstance);
    before(givenConstrainedRepositories);
    before(givenRepositoryFactoryFunctions);
    beforeEach(async function resetDatabase() {
        await orderRepo.deleteAll();
        await reviewRepo.deleteAll();
    });
    it('can create an instance of the related model', async () => {
        const order = await customerOrderRepo.create({
            description: 'an order desc',
        });
        const persisted = await orderRepo.findById(order.id);
        testlab_1.expect(order).to.deepEqual(persisted);
    });
    it('can find an instance of the related model', async () => {
        const order = await customerOrderRepo.create({
            description: 'an order desc',
        });
        const notMyOrder = await orderRepo.create({
            description: "someone else's order desc",
            customerId: existingCustomerId + 1,
        });
        const persistedOrders = await orderRepo.find({
            where: {
                customerId: existingCustomerId,
            },
        });
        const orders = await customerOrderRepo.find();
        testlab_1.expect(orders).to.containEql(order);
        testlab_1.expect(orders).to.not.containEql(notMyOrder);
        testlab_1.expect(orders).to.deepEqual(persistedOrders);
    });
    it('can create an instance of a related model through a junction table', async () => {
        const seller = await customerSellerRepo.create({
            name: 'Jam Risser',
        }, {
            description: 'some order description',
        });
        const persisted = await sellerRepo.findById(seller.id);
        testlab_1.expect(seller).to.deepEqual(persisted);
    });
    it('can find an instance of a related model through a junction table', async () => {
        const seller = await customerSellerRepo.create({
            name: 'Jam Risser',
        }, {
            description: 'some order description',
        });
        const notTheSeller = await sellerRepo.create({
            name: 'Mark Twain',
        }, {
            description: 'some order description',
        });
        const persistedOrders = await orderRepo.find({
            where: {
                customerId: existingCustomerId,
            },
        });
        const persistedSellers = await sellerRepo.find({
            where: {
                or: persistedOrders.map((order) => ({
                    id: order.sellerId,
                })),
            },
        });
        const sellers = await customerSellerRepo.find();
        testlab_1.expect(sellers).to.containEql(seller);
        testlab_1.expect(sellers).to.not.containEql(notTheSeller);
        testlab_1.expect(sellers).to.deepEqual(persistedSellers);
    });
    it('finds appropriate related model instances for multiple relations', async () => {
        // note(shimks): roundabout way of creating reviews with 'approves'
        // ideally, the review repository should have a approve function
        // which should 'approve' a review
        // On another note, this test should be separated for 'create' and 'find'
        await customerAuthoredReviewFactoryFn(existingCustomerId).create({
            description: 'my wonderful review',
            approvedId: existingCustomerId + 1,
        });
        await customerAuthoredReviewFactoryFn(existingCustomerId + 1).create({
            description: 'smash that progenitor loving approve button',
            approvedId: existingCustomerId,
        });
        const reviewsApprovedByCustomerOne = await customerApprovedReviewFactoryFn(existingCustomerId).find();
        const reviewsApprovedByCustomerTwo = await customerApprovedReviewFactoryFn(existingCustomerId + 1).find();
        const persistedReviewsApprovedByCustomerOne = await reviewRepo.find({
            where: {
                approvedId: existingCustomerId,
            },
        });
        const persistedReviewsApprovedByCustomerTwo = await reviewRepo.find({
            where: {
                approvedId: existingCustomerId + 1,
            },
        });
        testlab_1.expect(reviewsApprovedByCustomerOne).to.eql(persistedReviewsApprovedByCustomerOne);
        testlab_1.expect(reviewsApprovedByCustomerTwo).to.eql(persistedReviewsApprovedByCustomerTwo);
    });
    //--- HELPERS ---//
    async function givenPersistedCustomerInstance() {
        const customer = await customerRepo.create({ name: 'a customer' });
        existingCustomerId = customer.id;
    }
    function givenConstrainedRepositories() {
        const orderFactoryFn = __1.createHasManyRepositoryFactory(Customer.definition.relations.orders, __1.Getter.fromValue(orderRepo));
        const sellerFactoryFn = relations_1.createHasManyThroughRepositoryFactory(Customer.definition.relations.sellers, __1.Getter.fromValue(sellerRepo), __1.Getter.fromValue(orderRepo));
        customerOrderRepo = orderFactoryFn(existingCustomerId);
        customerSellerRepo = sellerFactoryFn(existingCustomerId);
    }
    function givenRepositoryFactoryFunctions() {
        customerAuthoredReviewFactoryFn = __1.createHasManyRepositoryFactory(Customer.definition.relations.reviewsAuthored, __1.Getter.fromValue(reviewRepo));
        customerApprovedReviewFactoryFn = __1.createHasManyRepositoryFactory(Customer.definition.relations.reviewsApproved, __1.Getter.fromValue(reviewRepo));
    }
});
describe('BelongsTo relation', () => {
    let findCustomerOfOrder;
    before(givenCrudRepositories);
    before(givenAccessor);
    beforeEach(async function resetDatabase() {
        await Promise.all([
            customerRepo.deleteAll(),
            orderRepo.deleteAll(),
            reviewRepo.deleteAll(),
        ]);
    });
    it('finds an instance of the related model', async () => {
        const customer = await customerRepo.create({ name: 'Order McForder' });
        const order = await orderRepo.create({
            customerId: customer.id,
            description: 'Order from Order McForder, the hoarder of Mordor',
        });
        const result = await findCustomerOfOrder(order.id);
        testlab_1.expect(result).to.deepEqual(customer);
    });
    it('throws EntityNotFound error when the related model does not exist', async () => {
        const order = await orderRepo.create({
            customerId: 999,
            description: 'Order of a fictional customer',
        });
        await testlab_1.expect(findCustomerOfOrder(order.id)).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    //--- HELPERS ---//
    function givenAccessor() {
        findCustomerOfOrder = __1.createBelongsToAccessor(Order.definition.relations.customer, __1.Getter.fromValue(customerRepo), orderRepo);
    }
});
//--- HELPERS ---//
class Order extends __1.Entity {
}
Order.definition = new __1.ModelDefinition('Order')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('description', { type: 'string', required: true })
    .addProperty('customerId', { type: 'number' })
    .addProperty('sellerId', { type: 'number' })
    .addRelation({
    name: 'customer',
    type: __1.RelationType.belongsTo,
    source: Order,
    target: () => Customer,
    keyFrom: 'customerId',
    keyTo: 'id',
});
class Review extends __1.Entity {
}
Review.definition = new __1.ModelDefinition('Review')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('description', { type: 'string', required: true })
    .addProperty('authorId', { type: 'number', required: false })
    .addProperty('approvedId', { type: 'number', required: false });
class Customer extends __1.Entity {
}
Customer.definition = new __1.ModelDefinition('Customer')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('name', { type: 'string', required: true })
    .addProperty('orders', { type: Order, array: true })
    .addProperty('reviewsAuthored', { type: Review, array: true })
    .addProperty('reviewsApproved', { type: Review, array: true })
    .addRelation({
    name: 'orders',
    type: __1.RelationType.hasMany,
    source: Customer,
    target: () => Order,
    keyTo: 'customerId',
})
    .addRelation({
    name: 'reviewsAuthored',
    type: __1.RelationType.hasMany,
    source: Customer,
    target: () => Review,
    keyTo: 'authorId',
})
    .addRelation({
    name: 'reviewsApproved',
    type: __1.RelationType.hasMany,
    source: Customer,
    target: () => Review,
    keyTo: 'approvedId',
})
    .addRelation({
    name: 'sellers',
    type: __1.RelationType.hasMany,
    source: Customer,
    target: () => Seller,
    through: () => Order,
});
class Seller extends __1.Entity {
}
Seller.definition = new __1.ModelDefinition('Seller')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('name', { type: 'string', required: true })
    .addRelation({
    name: 'customers',
    type: __1.RelationType.hasMany,
    source: Seller,
    target: () => Customer,
    through: () => Order,
});
function givenCrudRepositories() {
    db = new __1.juggler.DataSource({ connector: 'memory' });
    customerRepo = new __1.DefaultCrudRepository(Customer, db);
    orderRepo = new __1.DefaultCrudRepository(Order, db);
    reviewRepo = new __1.DefaultCrudRepository(Review, db);
    sellerRepo = new __1.DefaultCrudRepository(Seller, db);
}
//# sourceMappingURL=relation.factory.integration.js.map