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
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const loopback_datasource_juggler_1 = require("loopback-datasource-juggler");
const __1 = require("../..");
const product_model_1 = require("../fixtures/models/product.model");
const product_repository_1 = require("../fixtures/repositories/product.repository");
// This test shows the recommended way how to use @loopback/repository
// together with existing connectors when building LoopBack applications
describe('Repository in Thinking in LoopBack', () => {
    let repo;
    beforeEach(givenProductRepository);
    it('counts models in empty database', async () => {
        testlab_1.expect(await repo.count()).to.deepEqual({ count: 0 });
    });
    it('creates a new model', async () => {
        const p = await repo.create({ name: 'Ink Pen', slug: 'pen' });
        testlab_1.expect(p).instanceof(product_model_1.Product);
        testlab_1.expect.exists(p.id);
    });
    it('can save a model', async () => {
        const p = await repo.create({ slug: 'pencil' });
        p.name = 'Red Pencil';
        await repo.save(p);
        await repo.findById(p.id);
        testlab_1.expect(p).to.have.properties({
            slug: 'pencil',
            name: 'Red Pencil',
        });
    });
    it('rejects extra model properties (defaults to strict mode)', async () => {
        await testlab_1.expect(repo.create({ name: 'custom', extra: 'additional-data' })).to.be.rejectedWith(/extra.*not defined/);
    });
    it('allows models to allow additional properties', async () => {
        // TODO(bajtos) Add syntactic sugar to allow the following usage:
        //    @model({strict: false})
        let Flexible = class Flexible extends __1.Entity {
        };
        __decorate([
            __1.property({ id: true }),
            __metadata("design:type", Number)
        ], Flexible.prototype, "id", void 0);
        Flexible = __decorate([
            __1.model({ settings: { strict: false } })
        ], Flexible);
        const flexibleRepo = new __1.DefaultCrudRepository(Flexible, new loopback_datasource_juggler_1.DataSource({ connector: 'memory' }));
        const created = await flexibleRepo.create({
            extra: 'additional data',
        });
        const stored = await flexibleRepo.findById(created.id);
        testlab_1.expect(stored).to.containDeep({ extra: 'additional data' });
    });
    it('allows models to allow nested model properties', async () => {
        let Role = class Role extends __1.Entity {
        };
        __decorate([
            __1.property(),
            __metadata("design:type", String)
        ], Role.prototype, "name", void 0);
        Role = __decorate([
            __1.model()
        ], Role);
        let Address = class Address extends __1.Entity {
        };
        __decorate([
            __1.property(),
            __metadata("design:type", String)
        ], Address.prototype, "street", void 0);
        Address = __decorate([
            __1.model()
        ], Address);
        let User = class User extends __1.Entity {
        };
        __decorate([
            __1.property({
                type: 'number',
                id: true,
            }),
            __metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        __decorate([
            __1.property({ type: 'string' }),
            __metadata("design:type", String)
        ], User.prototype, "name", void 0);
        __decorate([
            __1.property.array(Role),
            __metadata("design:type", Array)
        ], User.prototype, "roles", void 0);
        __decorate([
            __1.property(),
            __metadata("design:type", Address)
        ], User.prototype, "address", void 0);
        User = __decorate([
            __1.model()
        ], User);
        const userRepo = new __1.DefaultCrudRepository(User, new loopback_datasource_juggler_1.DataSource({ connector: 'memory' }));
        const user = {
            id: 1,
            name: 'foo',
            roles: [{ name: 'admin' }, { name: 'user' }],
            address: { street: 'backstreet' },
        };
        const created = await userRepo.create(user);
        const stored = await userRepo.findById(created.id);
        testlab_1.expect(stored).to.containDeep(user);
    });
    function givenProductRepository() {
        const db = new loopback_datasource_juggler_1.DataSource({
            connector: 'memory',
        });
        repo = new product_repository_1.ProductRepository(db);
    }
});
//# sourceMappingURL=repository.acceptance.js.map