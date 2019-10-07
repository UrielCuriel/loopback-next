"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('model', () => {
    const customerDef = new __1.ModelDefinition('Customer');
    customerDef
        .addProperty('id', 'string')
        .addProperty('email', 'string')
        .addProperty('firstName', String)
        .addProperty('lastName', __1.STRING)
        .addProperty('address', 'object')
        .addProperty('phones', 'array')
        .addSetting('id', 'id');
    const realmCustomerDef = new __1.ModelDefinition('RealmCustomer');
    realmCustomerDef
        .addProperty('realm', 'string')
        .addProperty('email', 'string')
        .addProperty('firstName', String)
        .addProperty('lastName', __1.STRING)
        .addSetting('id', ['realm', 'email']);
    const userDef = new __1.ModelDefinition('User');
    userDef
        .addProperty('id', { type: 'string', id: true })
        .addProperty('email', 'string')
        .addProperty('password', 'string')
        .addProperty('firstName', String)
        .addProperty('lastName', __1.STRING)
        .addSetting('hiddenProperties', ['password']);
    const flexibleDef = new __1.ModelDefinition('Flexible');
    flexibleDef
        .addProperty('id', { type: 'string', id: true })
        .addSetting('strict', false);
    const addressDef = new __1.ModelDefinition('Address');
    addressDef
        .addProperty('street', 'string')
        .addProperty('city', 'string')
        .addProperty('state', String)
        .addProperty('zipCode', __1.STRING);
    class Address extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Address.definition = addressDef;
    const phoneDef = new __1.ModelDefinition('Phone');
    phoneDef.addProperty('number', 'string').addProperty('label', 'string');
    class Phone extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Phone.definition = phoneDef;
    class Customer extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Customer.definition = customerDef;
    class RealmCustomer extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    RealmCustomer.definition = realmCustomerDef;
    class User extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    User.definition = userDef;
    class Flexible extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Flexible.definition = flexibleDef;
    function createCustomer() {
        const customer = new Customer();
        customer.id = '123';
        customer.email = 'xyz@example.com';
        return customer;
    }
    function createCustomerWithContact() {
        const customer = new Customer();
        customer.id = '123';
        customer.email = 'xyz@example.com';
        customer.address = new Address({
            street: '123 A St',
            city: 'San Jose',
            state: 'CA',
            zipCode: '95131',
        });
        customer.phones = [
            new Phone({ label: 'home', number: '111-222-3333' }),
            new Phone({ label: 'work', number: '111-222-5555' }),
        ];
        return customer;
    }
    function createRealmCustomer() {
        const customer = new RealmCustomer();
        customer.realm = 'org1';
        customer.email = 'xyz@example.com';
        return customer;
    }
    function createUser() {
        const user = new User();
        user.id = '123';
        user.email = 'xyz@example.com';
        user.password = '1234test';
        user.firstName = 'Test User';
        return user;
    }
    it('adds properties', () => {
        testlab_1.expect(customerDef.name).to.eql('Customer');
        testlab_1.expect(customerDef.properties).have.properties('id', 'email', 'lastName', 'firstName');
        testlab_1.expect(customerDef.properties.lastName).to.eql({ type: __1.STRING });
    });
    it('adds settings', () => {
        testlab_1.expect(customerDef.settings).have.property('id', 'id');
    });
    it('lists id properties', () => {
        testlab_1.expect(customerDef.idProperties()).to.eql(['id']);
        testlab_1.expect(userDef.idProperties()).to.eql(['id']);
        testlab_1.expect(realmCustomerDef.idProperties()).to.eql(['realm', 'email']);
    });
    it('converts to json', () => {
        const customer = createCustomer();
        Object.assign(customer, { extra: 'additional data' });
        testlab_1.expect(customer.toJSON()).to.eql({ id: '123', email: 'xyz@example.com' });
        // notice that "extra" property was discarded from the output
    });
    it('converts to json recursively', () => {
        const customer = createCustomerWithContact();
        testlab_1.expect(customer.toJSON()).to.eql({
            id: '123',
            email: 'xyz@example.com',
            address: {
                street: '123 A St',
                city: 'San Jose',
                state: 'CA',
                zipCode: '95131',
            },
            phones: [
                { label: 'home', number: '111-222-3333' },
                { label: 'work', number: '111-222-5555' },
            ],
        });
    });
    it('includes navigational properties in JSON (strict-mode)', () => {
        class Category extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        class Product extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        Category.definition = new __1.ModelDefinition('Category')
            .addSetting('strict', true)
            .addProperty('id', { type: 'number', id: true, required: true })
            .addRelation({
            name: 'products',
            type: __1.RelationType.hasMany,
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Product,
            keyTo: 'categoryId',
        });
        const category = new Category({
            id: 1,
            products: [new Product({ id: 2, categoryId: 1 })],
        });
        const data = category.toJSON();
        testlab_1.expect(data).to.deepEqual({
            id: 1,
            products: [{ id: 2, categoryId: 1 }],
        });
    });
    it('includes navigational properties in JSON (non-strict-mode)', () => {
        class Category extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        class Product extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        Category.definition = new __1.ModelDefinition('Category')
            .addSetting('strict', false)
            .addProperty('id', { type: 'number', id: true, required: true })
            .addRelation({
            name: 'products',
            type: __1.RelationType.hasMany,
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Product,
            keyTo: 'categoryId',
        });
        const category = new Category({
            id: 1,
            products: [new Product({ id: 2, categoryId: 1 })],
        });
        const data = category.toJSON();
        testlab_1.expect(data).to.deepEqual({
            id: 1,
            products: [{ id: 2, categoryId: 1 }],
        });
    });
    it('supports non-strict model in toJSON()', () => {
        const DATA = { id: 'uid', extra: 'additional data' };
        const instance = new Flexible(DATA);
        const actual = instance.toJSON();
        testlab_1.expect(actual).to.deepEqual(DATA);
    });
    it('converts to plain object', () => {
        const customer = createCustomer();
        Object.assign(customer, { unknown: 'abc' });
        testlab_1.expect(customer.toObject()).to.eql({ id: '123', email: 'xyz@example.com' });
        testlab_1.expect(customer.toObject({ ignoreUnknownProperties: false })).to.eql({
            id: '123',
            email: 'xyz@example.com',
            unknown: 'abc',
        });
    });
    it('converts to plain object recursively', () => {
        const customer = createCustomerWithContact();
        Object.assign(customer, { unknown: 'abc' });
        Object.assign(customer.address, { unknown: 'xyz' });
        testlab_1.expect(customer.toObject()).to.eql({
            id: '123',
            email: 'xyz@example.com',
            address: {
                street: '123 A St',
                city: 'San Jose',
                state: 'CA',
                zipCode: '95131',
            },
            phones: [
                { label: 'home', number: '111-222-3333' },
                { label: 'work', number: '111-222-5555' },
            ],
        });
        testlab_1.expect(customer.toObject({ ignoreUnknownProperties: false })).to.eql({
            id: '123',
            email: 'xyz@example.com',
            unknown: 'abc',
            address: {
                street: '123 A St',
                city: 'San Jose',
                state: 'CA',
                zipCode: '95131',
                unknown: 'xyz',
            },
            phones: [
                { label: 'home', number: '111-222-3333' },
                { label: 'work', number: '111-222-5555' },
            ],
        });
    });
    it('gets id', () => {
        const customer = createCustomer();
        testlab_1.expect(customer.getId()).to.eql('123');
    });
    it('gets id object', () => {
        const customer = createCustomer();
        testlab_1.expect(customer.getIdObject()).to.eql({ id: '123' });
    });
    it('builds where for id', () => {
        const where = Customer.buildWhereForId('123');
        testlab_1.expect(where).to.eql({ id: '123' });
    });
    it('gets composite id', () => {
        const customer = createRealmCustomer();
        testlab_1.expect(customer.getId()).to.eql({ realm: 'org1', email: 'xyz@example.com' });
    });
    it('gets composite id object', () => {
        const customer = createRealmCustomer();
        testlab_1.expect(customer.getIdObject()).to.eql({
            realm: 'org1',
            email: 'xyz@example.com',
        });
    });
    it('builds where for composite id', () => {
        const where = RealmCustomer.buildWhereForId({
            realm: 'org1',
            email: 'xyz@example.com',
        });
        testlab_1.expect(where).to.eql({ realm: 'org1', email: 'xyz@example.com' });
    });
    it('reports helpful error when getting ids of a model with no ids', () => {
        class NoId extends __1.Entity {
        }
        NoId.definition = new __1.ModelDefinition('NoId');
        const instance = new NoId();
        testlab_1.expect(() => instance.getId()).to.throw(/missing.*id/);
    });
    it('gets id names via a static method', () => {
        const names = Customer.getIdProperties();
        testlab_1.expect(names).to.deepEqual(['id']);
    });
    it('reads model name from the definition', () => {
        testlab_1.expect(Customer.modelName).to.equal('Customer');
    });
    it('reads model name from the class name', () => {
        class MyModel extends __1.Entity {
        }
        testlab_1.expect(MyModel.modelName).to.equal('MyModel');
    });
    it('excludes hidden properties from toJSON() output', () => {
        const user = createUser();
        testlab_1.expect(user.toJSON()).to.eql({
            id: '123',
            email: 'xyz@example.com',
            firstName: 'Test User',
        });
    });
});
//# sourceMappingURL=model.unit.js.map