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
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('relation decorator', () => {
    describe('hasMany', () => {
        it('takes in complex property type and infers foreign key via source model name', () => {
            let Address = class Address extends __1.Entity {
            };
            __decorate([
                __1.property(),
                __metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            Address = __decorate([
                __1.model()
            ], Address);
            let AddressBook = class AddressBook extends __1.Entity {
            };
            __decorate([
                __1.hasMany(() => Address),
                __metadata("design:type", Array)
            ], AddressBook.prototype, "addresses", void 0);
            AddressBook = __decorate([
                __1.model()
            ], AddressBook);
            const meta = context_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, AddressBook.prototype, 'addresses');
            const jugglerMeta = context_1.MetadataInspector.getPropertyMetadata(__1.MODEL_PROPERTIES_KEY, AddressBook.prototype, 'addresses');
            testlab_1.expect(meta).to.eql({
                type: __1.RelationType.hasMany,
                name: 'addresses',
                source: AddressBook,
                target: () => Address,
            });
            testlab_1.expect(jugglerMeta).to.not.containEql({
                type: Array,
                itemType: () => Address,
            });
            testlab_1.expect(AddressBook.definition.relations).to.eql({
                addresses: {
                    type: __1.RelationType.hasMany,
                    name: 'addresses',
                    source: AddressBook,
                    target: () => Address,
                },
            });
        });
        it('takes in both complex property type and hasMany metadata', () => {
            class Address extends __1.Entity {
            }
            class AddressBook extends __1.Entity {
            }
            __decorate([
                __1.hasMany(() => Address, { keyTo: 'someForeignKey' }),
                __metadata("design:type", Array)
            ], AddressBook.prototype, "addresses", void 0);
            const meta = context_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, AddressBook.prototype, 'addresses');
            const jugglerMeta = context_1.MetadataInspector.getPropertyMetadata(__1.MODEL_PROPERTIES_KEY, AddressBook.prototype, 'addresses');
            testlab_1.expect(meta).to.eql({
                type: __1.RelationType.hasMany,
                name: 'addresses',
                source: AddressBook,
                target: () => Address,
                keyTo: 'someForeignKey',
            });
            testlab_1.expect(jugglerMeta).to.not.containEql({
                type: Array,
                itemType: () => Address,
            });
        });
    });
    describe('belongsTo', () => {
        it('creates juggler property metadata', () => {
            let AddressBook = class AddressBook extends __1.Entity {
            };
            __decorate([
                __1.property({ id: true }),
                __metadata("design:type", Number)
            ], AddressBook.prototype, "id", void 0);
            AddressBook = __decorate([
                __1.model()
            ], AddressBook);
            let Address = class Address extends __1.Entity {
            };
            __decorate([
                __1.belongsTo(() => AddressBook),
                __metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            Address = __decorate([
                __1.model()
            ], Address);
            const jugglerMeta = context_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, Address.prototype);
            testlab_1.expect(jugglerMeta).to.eql({
                addressBookId: {
                    type: Number,
                },
            });
            testlab_1.expect(Address.definition.relations).to.containDeep({
                addressBook: {
                    keyFrom: 'addressBookId',
                    name: 'addressBook',
                    type: 'belongsTo',
                },
            });
        });
        it('assigns it to target key', () => {
            class Address extends __1.Entity {
            }
            __decorate([
                __1.belongsTo(() => AddressBook),
                __metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            class AddressBook extends __1.Entity {
            }
            const meta = context_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, Address.prototype, 'addressBookId');
            testlab_1.expect(meta).to.eql({
                type: __1.RelationType.belongsTo,
                name: 'addressBook',
                source: Address,
                target: () => AddressBook,
                keyFrom: 'addressBookId',
            });
        });
        it('accepts explicit keyFrom and keyTo', () => {
            let Address = class Address extends __1.Entity {
            };
            __decorate([
                __1.belongsTo(() => AddressBook, {
                    keyFrom: 'aForeignKey',
                    keyTo: 'aPrimaryKey',
                    name: 'address-book',
                }),
                __metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            Address = __decorate([
                __1.model()
            ], Address);
            class AddressBook extends __1.Entity {
            }
            const meta = context_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, Address.prototype, 'addressBookId');
            testlab_1.expect(meta).to.containEql({
                keyFrom: 'aForeignKey',
                keyTo: 'aPrimaryKey',
            });
            testlab_1.expect(Address.definition.relations).to.containDeep({
                'address-book': {
                    type: 'belongsTo',
                    keyFrom: 'aForeignKey',
                    keyTo: 'aPrimaryKey',
                },
            });
        });
    });
});
describe('getModelRelations', () => {
    it('returns relation metadata for own and inherited properties', () => {
        let AccessToken = class AccessToken extends __1.Entity {
        };
        __decorate([
            __1.property({ id: true }),
            __metadata("design:type", Number)
        ], AccessToken.prototype, "userId", void 0);
        AccessToken = __decorate([
            __1.model()
        ], AccessToken);
        let User = class User extends __1.Entity {
        };
        __decorate([
            __1.hasMany(() => AccessToken),
            __metadata("design:type", Array)
        ], User.prototype, "accessTokens", void 0);
        User = __decorate([
            __1.model()
        ], User);
        let Order = class Order extends __1.Entity {
        };
        __decorate([
            __1.property({ id: true }),
            __metadata("design:type", Number)
        ], Order.prototype, "customerId", void 0);
        Order = __decorate([
            __1.model()
        ], Order);
        let Customer = class Customer extends User {
        };
        __decorate([
            __1.hasMany(() => Order),
            __metadata("design:type", Array)
        ], Customer.prototype, "orders", void 0);
        Customer = __decorate([
            __1.model()
        ], Customer);
        const relations = __1.getModelRelations(Customer);
        testlab_1.expect(relations).to.containDeep({
            accessTokens: {
                name: 'accessTokens',
                type: 'hasMany',
                target: () => AccessToken,
            },
            orders: {
                name: 'orders',
                type: 'hasMany',
                target: () => Order,
            },
        });
    });
});
//# sourceMappingURL=relation.decorator.unit.js.map