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
var Customer_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
const address_model_1 = require("@loopback/repository-tests/dist/crud/relations/fixtures/models/address.model");
const order_model_1 = require("./order.model");
const seller_model_1 = require("./seller.model");
let Customer = Customer_1 = class Customer extends __1.Entity {
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
    __1.hasMany(() => order_model_1.Order),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
__decorate([
    __1.hasMany(() => seller_model_1.Seller, { through: () => order_model_1.Order }),
    __metadata("design:type", Array)
], Customer.prototype, "sellers", void 0);
__decorate([
    __1.hasOne(() => address_model_1.Address),
    __metadata("design:type", typeof (_a = typeof address_model_1.Address !== "undefined" && address_model_1.Address) === "function" ? _a : Object)
], Customer.prototype, "address", void 0);
__decorate([
    __1.hasMany(() => Customer_1, { keyTo: 'parentId' }),
    __metadata("design:type", Array)
], Customer.prototype, "customers", void 0);
__decorate([
    __1.belongsTo(() => Customer_1),
    __metadata("design:type", Number)
], Customer.prototype, "parentId", void 0);
Customer = Customer_1 = __decorate([
    __1.model()
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=customer.model.js.map