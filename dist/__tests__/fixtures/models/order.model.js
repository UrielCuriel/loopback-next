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
const __1 = require("../../..");
const customer_model_1 = require("./customer.model");
const shipment_model_1 = require("@loopback/repository-tests/dist/crud/relations/fixtures/models/shipment.model");
const seller_model_1 = require("./seller.model");
let Order = class Order extends __1.Entity {
};
__decorate([
    __1.property({
        type: 'string',
        id: true,
    }),
    __metadata("design:type", String)
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
        type: 'boolean',
        required: false,
    }),
    __metadata("design:type", Boolean)
], Order.prototype, "isShipped", void 0);
__decorate([
    __1.belongsTo(() => customer_model_1.Customer),
    __metadata("design:type", Number)
], Order.prototype, "customerId", void 0);
__decorate([
    __1.belongsTo(() => seller_model_1.Seller),
    __metadata("design:type", Number)
], Order.prototype, "sellerId", void 0);
__decorate([
    __1.belongsTo(() => shipment_model_1.Shipment, { name: 'shipment' }),
    __metadata("design:type", Number)
], Order.prototype, "shipment_id", void 0);
Order = __decorate([
    __1.model()
], Order);
exports.Order = Order;
//# sourceMappingURL=order.model.js.map