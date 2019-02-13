"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('legacy loopback-datasource-juggler', () => {
    let ds;
    before(function () {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
        testlab_1.expect(ds.settings.name).to.eql('db');
        testlab_1.expect(ds.settings.connector).to.eql('memory');
    });
    it('creates models', () => {
        /* tslint:disable-next-line:variable-name */
        const Note = ds.createModel('note', { title: 'string', content: 'string', id: { type: 'number', id: true } }, {});
        /* tslint:disable-next-line:variable-name */
        const Note2 = __1.bindModel(Note, ds);
        testlab_1.expect(Note2.modelName).to.eql('note');
        testlab_1.expect(Note2.definition).to.eql(Note.definition);
        testlab_1.expect(Note2.create).to.exactly(Note.create);
    });
});
describe('DefaultCrudRepository', () => {
    let ds;
    class Note extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Note.definition = new __1.ModelDefinition({
        name: 'Note',
        properties: {
            title: 'string',
            content: 'string',
            id: { name: 'id', type: 'number', id: true },
        },
    });
    beforeEach(() => {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
    });
    context('constructor', () => {
        class ShoppingList extends __1.Entity {
        }
        ShoppingList.definition = new __1.ModelDefinition({
            name: 'ShoppingList',
            properties: {
                id: {
                    type: 'number',
                    id: true,
                },
                created: {
                    type: () => Date,
                },
                toBuy: {
                    type: 'array',
                    itemType: 'string',
                },
                toVisit: {
                    type: Array,
                    itemType: () => String,
                },
            },
        });
        it('converts PropertyDefinition with array type', () => {
            const originalPropertyDefinition = Object.assign({}, ShoppingList.definition.properties);
            const listDefinition = new __1.DefaultCrudRepository(ShoppingList, ds)
                .modelClass.definition;
            const jugglerPropertyDefinition = {
                created: { type: Date },
                toBuy: {
                    type: [String],
                },
                toVisit: {
                    type: [String],
                },
            };
            testlab_1.expect(listDefinition.properties).to.containDeep(jugglerPropertyDefinition);
            testlab_1.expect(ShoppingList.definition.properties).to.containDeep(originalPropertyDefinition);
        });
    });
    it('shares the backing PersistedModel across repo instances', () => {
        const model1 = new __1.DefaultCrudRepository(Note, ds).modelClass;
        const model2 = new __1.DefaultCrudRepository(Note, ds).modelClass;
        testlab_1.expect(model1 === model2).to.be.true();
    });
    it('implements Repository.create()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        const result = await repo.findById(note.id);
        testlab_1.expect(result.toJSON()).to.eql(note.toJSON());
    });
    it('implements Repository.createAll()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const notes = await repo.createAll([
            { title: 't3', content: 'c3' },
            { title: 't4', content: 'c4' },
        ]);
        testlab_1.expect(notes.length).to.eql(2);
    });
    it('implements Repository.find()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.createAll([
            { title: 't1', content: 'c1' },
            { title: 't2', content: 'c2' },
        ]);
        const notes = await repo.find({ where: { title: 't1' } });
        testlab_1.expect(notes.length).to.eql(1);
    });
    it('implements Repository.findOne()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.createAll([
            { title: 't1', content: 'c1' },
            { title: 't1', content: 'c2' },
        ]);
        const note = await repo.findOne({
            where: { title: 't1' },
            order: ['content DESC'],
        });
        testlab_1.expect(note).to.not.be.null();
        testlab_1.expect(note && note.title).to.eql('t1');
        testlab_1.expect(note && note.content).to.eql('c2');
    });
    it('returns null if Repository.findOne() does not return a value', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.createAll([
            { title: 't1', content: 'c1' },
            { title: 't1', content: 'c2' },
        ]);
        const note = await repo.findOne({
            where: { title: 't5' },
            order: ['content DESC'],
        });
        testlab_1.expect(note).to.be.null();
    });
    describe('findById', () => {
        it('returns the correct instance', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const note = await repo.create({ title: 'a-title', content: 'a-content' });
            const result = await repo.findById(note.id);
            testlab_1.expect(result && result.toJSON()).to.eql(note.toJSON());
        });
        it('throws when the instance does not exist', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            await testlab_1.expect(repo.findById(999999)).to.be.rejectedWith({
                code: 'ENTITY_NOT_FOUND',
                message: 'Entity not found: Note with id 999999',
            });
        });
    });
    it('implements Repository.delete()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        await repo.delete(note);
        const found = await repo.find({ where: { id: note.id } });
        testlab_1.expect(found).to.be.empty();
    });
    it('implements Repository.deleteById()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        await repo.deleteById(note.id);
        const found = await repo.find({ where: { id: note.id } });
        testlab_1.expect(found).to.be.empty();
    });
    it('throws EntityNotFoundError when deleting an unknown id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await testlab_1.expect(repo.deleteById(99999)).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('implements Repository.deleteAll()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.deleteAll({ title: 't3' });
        testlab_1.expect(result.count).to.eql(1);
    });
    it('implements Repository.updateById()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        const id = note.id;
        const delta = { content: 'c4' };
        await repo.updateById(id, delta);
        const updated = await repo.findById(id);
        testlab_1.expect(updated.toJSON()).to.eql(Object.assign(note.toJSON(), delta));
    });
    it('throws EntityNotFound error when updating an unknown id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await testlab_1.expect(repo.updateById(9999, { title: 't4' })).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('implements Repository.updateAll()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.updateAll({ content: 'c5' }, {});
        testlab_1.expect(result.count).to.eql(2);
        const notes = await repo.find({ where: { title: 't3' } });
        testlab_1.expect(notes[0].content).to.eql('c5');
    });
    it('implements Repository.updateAll() without a where object', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.updateAll({ content: 'c5' });
        testlab_1.expect(result.count).to.eql(2);
        const notes = await repo.find();
        const titles = notes.map(n => `${n.title}:${n.content}`);
        testlab_1.expect(titles).to.deepEqual(['t3:c5', 't4:c5']);
    });
    it('implements Repository.count()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.count();
        testlab_1.expect(result.count).to.eql(2);
    });
    it('implements Repository.save() without id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.save(new Note({ title: 't3', content: 'c3' }));
        const result = await repo.findById(note.id);
        testlab_1.expect(result.toJSON()).to.eql(note.toJSON());
    });
    it('implements Repository.save() with id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note1 = await repo.create({ title: 't3', content: 'c3' });
        note1.content = 'c4';
        const note = await repo.save(note1);
        const result = await repo.findById(note.id);
        testlab_1.expect(result.toJSON()).to.eql(note1.toJSON());
    });
    it('implements Repository.replaceById()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        await repo.replaceById(note.id, { title: 't4', content: undefined });
        const result = await repo.findById(note.id);
        testlab_1.expect(result.toJSON()).to.eql({
            id: note.id,
            title: 't4',
            content: undefined,
        });
    });
    it('throws EntityNotFound error when replacing an unknown id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await testlab_1.expect(repo.replaceById(9999, { title: 't4' })).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('implements Repository.exists()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note1 = await repo.create({ title: 't3', content: 'c3' });
        const ok = await repo.exists(note1.id);
        testlab_1.expect(ok).to.be.true();
    });
});
//# sourceMappingURL=legacy-juggler-bridge.unit.js.map