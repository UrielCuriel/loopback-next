"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
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
    // Promises are not allowed yet
    // See https://github.com/strongloop/loopback-datasource-juggler/issues/1659
    // for tracking support
    beginTransaction(options, cb) {
        return cb(null, {});
    }
}
exports.CrudConnectorStub = CrudConnectorStub;
//# sourceMappingURL=crud-connector.stub.js.map