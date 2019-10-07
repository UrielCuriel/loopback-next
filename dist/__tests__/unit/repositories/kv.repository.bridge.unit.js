"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('DefaultKeyValueRepository', () => {
    let ds;
    let repo;
    class Note extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    beforeEach(() => {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'kv-memory',
        });
        repo = new __1.DefaultKeyValueRepository(Note, ds);
    });
    it('implements KeyValueRepository.set()', async () => {
        const note1 = { title: 't1', content: 'c1' };
        await repo.set('note1', note1);
        const result = await repo.get('note1');
        testlab_1.expect(result).to.eql(new Note(note1));
    });
    it('implements KeyValueRepository.get() for non-existent key', async () => {
        const result = await repo.get('note1');
        testlab_1.expect(result).be.null();
    });
    it('implements KeyValueRepository.delete()', async () => {
        const note1 = { title: 't1', content: 'c1' };
        await repo.set('note1', note1);
        await repo.delete('note1');
        const result = await repo.get('note1');
        testlab_1.expect(result).be.null();
    });
    it('implements KeyValueRepository.deleteAll()', async () => {
        await repo.set('note1', { title: 't1', content: 'c1' });
        await repo.set('note2', { title: 't2', content: 'c2' });
        await repo.deleteAll();
        let result = await repo.get('note1');
        testlab_1.expect(result).be.null();
        result = await repo.get('note2');
        testlab_1.expect(result).be.null();
    });
    it('implements KeyValueRepository.ttl()', async () => {
        await repo.set('note1', { title: 't1', content: 'c1' }, { ttl: 100 });
        const result = await repo.ttl('note1');
        // The remaining ttl <= original ttl
        testlab_1.expect(result).to.be.lessThanOrEqual(100);
    });
    it('reports error from KeyValueRepository.ttl()', async () => {
        const p = repo.ttl('note2');
        return testlab_1.expect(p).to.be.rejectedWith('Cannot get TTL for unknown key "note2"');
    });
    it('implements KeyValueRepository.expire()', async () => {
        await repo.set('note1', { title: 't1', content: 'c1' }, { ttl: 100 });
        await repo.expire('note1', 200);
        const ttl = await repo.ttl('note1');
        testlab_1.expect(ttl).to.lessThanOrEqual(200);
    });
    it('implements KeyValueRepository.keys()', async () => {
        var e_1, _a;
        await repo.set('note1', { title: 't1', content: 'c1' });
        await repo.set('note2', { title: 't2', content: 'c2' });
        const keys = repo.keys();
        const keyList = [];
        try {
            for (var keys_1 = __asyncValues(keys), keys_1_1; keys_1_1 = await keys_1.next(), !keys_1_1.done;) {
                const k = keys_1_1.value;
                keyList.push(k);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) await _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        testlab_1.expect(keyList).to.eql(['note1', 'note2']);
    });
});
//# sourceMappingURL=kv.repository.bridge.unit.js.map