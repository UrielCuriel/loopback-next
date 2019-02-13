"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
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
const __1 = require("../../../");
describe('model decorator', () => {
    let Address = class Address extends __1.ValueObject {
    };
    Address = __decorate([
        __1.model()
    ], Address);
    let Phone = class Phone extends __1.ValueObject {
    };
    Phone = __decorate([
        __1.model()
    ], Phone);
    let Receipt = class Receipt extends __1.Entity {
    };
    Receipt = __decorate([
        __1.model({
            properties: {
                id: {
                    type: 'number',
                    required: true,
                },
            },
        })
    ], Receipt);
    let Account = class Account extends __1.Entity {
    };
    Account = __decorate([
        __1.model()
    ], Account);
    let Profile = class Profile extends __1.Entity {
    };
    Profile = __decorate([
        __1.model()
    ], Profile);
    let Product = class Product extends __1.Entity {
    };
    __decorate([
        __1.property(),
        __metadata("design:type", String)
    ], Product.prototype, "id", void 0);
    __decorate([
        __1.property(),
        __metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    __decorate([
        __1.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "price", void 0);
    Product = __decorate([
        __1.model()
    ], Product);
    let Order = class Order extends __1.Entity {
    };
    __decorate([
        __1.property({
            mysql: {
                column: 'QTY',
            },
        }),
        __metadata("design:type", Number)
    ], Order.prototype, "quantity", void 0);
    __decorate([
        __1.property({ type: 'string', id: true, generated: true }),
        __metadata("design:type", String)
    ], Order.prototype, "id", void 0);
    __decorate([
        __1.belongsTo(() => Customer),
        __metadata("design:type", String)
    ], Order.prototype, "customerId", void 0);
    __decorate([
        __1.property(),
        __metadata("design:type", Boolean)
    ], Order.prototype, "isShipped", void 0);
    Order = __decorate([
        __1.model({ name: 'order' })
    ], Order);
    let Customer = class Customer extends __1.Entity {
    };
    __decorate([
        __1.property({ type: 'string', id: true, generated: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "id", void 0);
    __decorate([
        __1.embedsOne(),
        __metadata("design:type", Address)
    ], Customer.prototype, "address", void 0);
    __decorate([
        __1.embedsMany(),
        __metadata("design:type", Array)
    ], Customer.prototype, "phones", void 0);
    __decorate([
        __1.referencesMany(),
        __metadata("design:type", Array)
    ], Customer.prototype, "accounts", void 0);
    __decorate([
        __1.referencesOne(),
        __metadata("design:type", Profile)
    ], Customer.prototype, "profile", void 0);
    __decorate([
        __1.hasMany(() => Order),
        __metadata("design:type", Array)
    ], Customer.prototype, "orders", void 0);
    __decorate([
        __1.hasOne(() => Order),
        __metadata("design:type", Order)
    ], Customer.prototype, "lastOrder", void 0);
    __decorate([
        __1.relation({ type: __1.RelationType.hasMany }),
        __metadata("design:type", Array)
    ], Customer.prototype, "recentOrders", void 0);
    Customer = __decorate([
        __1.model()
    ], Customer);
    // Skip the tests before we resolve the issue around global `Reflector`
    // The tests are passing it run alone but fails with `npm test`
    it('adds model metadata', () => {
        const meta = context_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Order);
        testlab_1.expect(meta).to.eql({ name: 'order' });
    });
    it('adds model metadata without name', () => {
        const meta = context_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Receipt);
        testlab_1.expect(meta).to.eql({
            name: 'Receipt',
            properties: {
                id: {
                    type: 'number',
                    required: true,
                },
            },
        });
    });
    it('adds model metadata with custom name', () => {
        let Doohickey = class Doohickey {
        };
        Doohickey = __decorate([
            __1.model({ name: 'foo' })
        ], Doohickey);
        const meta = context_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Doohickey);
        testlab_1.expect(meta).to.eql({ name: 'foo' });
    });
    it('updates static property "modelName"', () => {
        let Category = class Category extends __1.Entity {
        };
        Category = __decorate([
            __1.model()
        ], Category);
        testlab_1.expect(Category.modelName).to.equal('Category');
    });
    it('adds model metadata with arbitrary properties', () => {
        let Arbitrary = class Arbitrary {
        };
        Arbitrary = __decorate([
            __1.model({ arbitrary: 'property' })
        ], Arbitrary);
        const meta = context_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Arbitrary) ||
            /* istanbul ignore next */ {};
        testlab_1.expect(meta.arbitrary).to.eql('property');
    });
    it('adds property metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, Order.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.quantity).to.eql({
            type: Number,
            mysql: {
                column: 'QTY',
            },
        });
        testlab_1.expect(meta.id).to.eql({ type: 'string', id: true, generated: true });
        testlab_1.expect(meta.isShipped).to.eql({ type: Boolean });
    });
    it('adds explicitly declared array property metadata', () => {
        let ArrayModel = class ArrayModel {
        };
        __decorate([
            __1.property({ type: Array }),
            __metadata("design:type", Array)
        ], ArrayModel.prototype, "strArr", void 0);
        ArrayModel = __decorate([
            __1.model()
        ], ArrayModel);
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, ArrayModel.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.strArr).to.eql({ type: Array });
    });
    it('adds embedsOne metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.address).to.eql({
            type: __1.RelationType.embedsOne,
        });
    });
    it('adds embedsMany metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.phones).to.eql({
            type: __1.RelationType.embedsMany,
        });
    });
    it('adds referencesMany metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.accounts).to.eql({
            type: __1.RelationType.referencesMany,
        });
    });
    it('adds referencesOne metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.profile).to.eql({
            type: __1.RelationType.referencesOne,
        });
    });
    it('adds hasMany metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.orders).to.containEql({
            type: __1.RelationType.hasMany,
            name: 'orders',
        });
        testlab_1.expect(meta.orders.source).to.be.exactly(Customer);
        testlab_1.expect(meta.orders.target()).to.be.exactly(Order);
    });
    it('adds belongsTo metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Order.prototype) || /* istanbul ignore next */ {};
        const relationDef = meta.customerId;
        testlab_1.expect(relationDef).to.containEql({
            type: __1.RelationType.belongsTo,
            name: 'customer',
            target: () => Customer,
            keyFrom: 'customerId',
        });
        testlab_1.expect(relationDef.source).to.be.exactly(Order);
        testlab_1.expect(relationDef.target()).to.be.exactly(Customer);
    });
    it('adds hasOne metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.lastOrder).to.containEql({
            type: __1.RelationType.hasOne,
            name: 'lastOrder',
            target: () => Order,
            source: Customer,
        });
    });
    it('adds relation metadata', () => {
        const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype) || /* istanbul ignore next */ {};
        testlab_1.expect(meta.recentOrders).to.eql({
            type: __1.RelationType.hasMany,
        });
    });
    it('adds hasMany metadata to the constructor', () => {
        class Person extends __1.Entity {
        }
        let House = class House extends __1.Entity {
        };
        __decorate([
            __1.property(),
            __metadata("design:type", String)
        ], House.prototype, "name", void 0);
        __decorate([
            __1.hasMany(() => Person, { keyTo: 'fk' }),
            __metadata("design:type", Array)
        ], House.prototype, "person", void 0);
        House = __decorate([
            __1.model()
        ], House);
        const relationMeta = context_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, House.prototype, 'person');
        testlab_1.expect(House.definition).to.have.property('relations');
        testlab_1.expect(House.definition.relations).to.containEql({ person: relationMeta });
    });
    describe('property namespace', () => {
        describe('array', () => {
            it('"@property.array" adds array metadata', () => {
                let TestModel = class TestModel {
                };
                __decorate([
                    __1.property.array(Product),
                    __metadata("design:type", Array)
                ], TestModel.prototype, "items", void 0);
                TestModel = __decorate([
                    __1.model()
                ], TestModel);
                const meta = context_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, TestModel.prototype) || /* istanbul ignore next */ {};
                testlab_1.expect(meta.items).to.eql({ type: Array, itemType: Product });
            });
            it('throws when @property.array is used on a non-array property', () => {
                testlab_1.expect.throws(() => {
                    // tslint:disable-next-line:no-unused
                    class Oops {
                    }
                    __decorate([
                        __1.property.array(Product),
                        __metadata("design:type", Product)
                    ], Oops.prototype, "product", void 0);
                }, Error, __1.property.ERR_PROP_NOT_ARRAY);
            });
        });
    });
});
//# sourceMappingURL=model-and-relation.decorator.unit.js.map