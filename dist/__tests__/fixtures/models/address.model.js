"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
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
let Address = class Address extends __1.Entity {
};
__decorate([
    __1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
__decorate([
    __1.property({
        type: 'string',
        id: true,
    }),
    __metadata("design:type", String)
], Address.prototype, "zipcode", void 0);
__decorate([
    __1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    __1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Address.prototype, "province", void 0);
__decorate([
    __1.belongsTo(() => customer_model_1.Customer),
    __metadata("design:type", Number)
], Address.prototype, "customerId", void 0);
Address = __decorate([
    __1.model()
], Address);
exports.Address = Address;
//# sourceMappingURL=address.model.js.map