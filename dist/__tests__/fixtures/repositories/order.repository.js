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
const context_1 = require("@loopback/context");
const __1 = require("../../..");
const models_1 = require("../models");
let OrderRepository = class OrderRepository extends __1.DefaultCrudRepository {
    constructor(db, customerRepositoryGetter, shipmentRepositoryGetter) {
        super(models_1.Order, db);
        this.db = db;
        this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter);
        this.shipment = this.createBelongsToAccessorFor('shipment', shipmentRepositoryGetter);
    }
};
OrderRepository = __decorate([
    __param(0, context_1.inject('datasources.db')),
    __param(1, __1.repository.getter('CustomerRepository')),
    __param(2, __1.repository.getter('ShipmentRepository')),
    __metadata("design:paramtypes", [__1.juggler.DataSource, Function, Function])
], OrderRepository);
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map