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
describe('BelongsTo relation', () => {
    // Given a Customer and Order models - see definitions at the bottom
    let app;
    let controller;
    let customerRepo;
    let orderRepo;
    let shipmentRepo;
    before(givenApplicationWithMemoryDB);
    before(givenBoundCrudRepositories);
    before(givenOrderController);
    beforeEach(async () => {
        await orderRepo.deleteAll();
    });
    it('can find customer of order', async () => {
        const customer = await customerRepo.create({ name: 'Order McForder' });
        const order = await orderRepo.create({
            customerId: customer.id,
            description: 'Order from Order McForder, the hoarder of Mordor',
        });
        const result = await controller.findOwnerOfOrder(order.id);
        testlab_1.expect(result).to.deepEqual(customer);
    });
    it('can find shipment of order with a custom foreign key name', async () => {
        const shipment = await shipmentRepo.create({
            name: 'Tuesday morning shipment',
        });
        const order = await orderRepo.create({
            // eslint-disable-next-line @typescript-eslint/camelcase
            shipment_id: shipment.id,
            description: 'Order that is shipped Tuesday morning',
        });
        const result = await controller.findOrderShipment(order.id);
        testlab_1.expect(result).to.deepEqual(shipment);
    });
    //--- HELPERS ---//
    let OrderController = class OrderController {
        constructor(orderRepository) {
            this.orderRepository = orderRepository;
        }
        async findOwnerOfOrder(orderId) {
            return this.orderRepository.customer(orderId);
        }
        async findOrderShipment(orderId) {
            return this.orderRepository.shipment(orderId);
        }
    };
    OrderController = __decorate([
        __param(0, __1.repository(repositories_1.OrderRepository)),
        __metadata("design:paramtypes", [repositories_1.OrderRepository])
    ], OrderController);
    function givenApplicationWithMemoryDB() {
        class TestApp extends __1.RepositoryMixin(core_1.Application) {
        }
        app = new TestApp();
        app.dataSource(new __1.juggler.DataSource({ name: 'db', connector: 'memory' }));
    }
    async function givenBoundCrudRepositories() {
        app.repository(repositories_1.CustomerRepository);
        app.repository(repositories_1.OrderRepository);
        app.repository(repositories_1.ShipmentRepository);
        customerRepo = await app.getRepository(repositories_1.CustomerRepository);
        orderRepo = await app.getRepository(repositories_1.OrderRepository);
        shipmentRepo = await app.getRepository(repositories_1.ShipmentRepository);
    }
    async function givenOrderController() {
        app.controller(OrderController);
        controller = await app.get('controllers.OrderController');
    }
});
//# sourceMappingURL=belongs-to.relation.acceptance.js.map