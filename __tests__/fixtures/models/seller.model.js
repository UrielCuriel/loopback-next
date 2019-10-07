"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
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
const order_model_1 = require("./order.model");
let Seller = class Seller extends __1.Entity {
};
__decorate([
    __1.property({
        type: 'number',
        id: true,
    }),
    __metadata("design:type", Number)
], Seller.prototype, "id", void 0);
__decorate([
    __1.property({
        type: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Seller.prototype, "name", void 0);
__decorate([
    __1.hasMany(() => customer_model_1.Customer, { through: () => order_model_1.Order }),
    __metadata("design:type", Array)
], Seller.prototype, "customers", void 0);
Seller = __decorate([
    __1.model()
], Seller);
exports.Seller = Seller;
//# sourceMappingURL=seller.model.js.map