"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
/**
 * A mock up connector implementation
 */
class CrudConnectorStub {
    constructor() {
        this.entities = [];
    }
    connect() {
        return Promise.resolve();
    }
    disconnect() {
        return Promise.resolve();
    }
    ping() {
        return Promise.resolve();
    }
    create(modelClass, entity, options) {
        this.entities.push(entity);
        return Promise.resolve(entity);
    }
    find(modelClass, filter, options) {
        return Promise.resolve(this.entities);
    }
    updateAll(modelClass, data, where, options) {
        for (const p in data) {
            for (const e of this.entities) {
                e[p] = data[p];
            }
        }
        return Promise.resolve({ count: this.entities.length });
    }
    deleteAll(modelClass, where, options) {
        const items = this.entities.splice(0, this.entities.length);
        return Promise.resolve({ count: items.length });
    }
    count(modelClass, where, options) {
        return Promise.resolve({ count: this.entities.length });
    }
}
/**
 * A mock up model class
 */
class Customer extends __1.Entity {
    constructor(data) {
        super();
        if (data && typeof data.id === 'number') {
            this.id = data.id;
        }
        if (data && typeof data.email === 'string') {
            this.email = data.email;
        }
    }
}
describe('CrudRepositoryImpl', () => {
    let ds;
    let repo;
    before(() => {
        const connector = new CrudConnectorStub();
        ds = {
            name: 'myDataSource',
            settings: {},
            connector: connector,
        };
        repo = new __1.CrudRepositoryImpl(ds, Customer);
    });
    beforeEach(async () => {
        await repo.deleteAll();
    });
    it('creates an entity', async () => {
        const customer = await repo.create({ id: 1, email: 'john@example.com' });
        testlab_1.expect(customer.id).to.be.eql(1);
    });
    it('updates all entities', async () => {
        await repo.create({ id: 1, email: 'john@example.com' });
        await repo.create({ id: 2, email: 'mary@example.com' });
        const result = await repo.updateAll({ email: 'xyz@example.com' });
        testlab_1.expect(result.count).to.be.eql(2);
    });
    it('find all entities', async () => {
        const c1 = await repo.create({ id: 1, email: 'john@example.com' });
        const c2 = await repo.create({ id: 2, email: 'mary@example.com' });
        const customers = await repo.find();
        testlab_1.expect(customers).to.eql([c1, c2]);
    });
    it('delete all entities', async () => {
        await repo.create({ id: 1, email: 'john@example.com' });
        await repo.create({ id: 2, email: 'mary@example.com' });
        const result = await repo.deleteAll();
        testlab_1.expect(result.count).to.be.eql(2);
    });
    it('count all entities', async () => {
        await repo.create({ id: 1, email: 'john@example.com' });
        const result = await repo.count();
        testlab_1.expect(result.count).to.be.eql(1);
    });
});
//# sourceMappingURL=crud.repository.unit.js.map