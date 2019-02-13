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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
let MyController = class MyController {
    constructor(noteRepo) {
        this.noteRepo = noteRepo;
    }
};
__decorate([
    __1.repository('noteRepo'),
    __metadata("design:type", Object)
], MyController.prototype, "noteRepo2", void 0);
MyController = __decorate([
    __param(0, __1.repository('noteRepo')),
    __metadata("design:paramtypes", [Object])
], MyController);
describe('repository decorator', () => {
    let ctx;
    let defaultRepo;
    let noteRepo;
    let ds;
    class Note extends __1.Entity {
    }
    Note.definition = new __1.ModelDefinition({
        name: 'note',
        properties: {
            title: 'string',
            content: 'string',
            id: { type: 'number', id: true },
        },
    });
    class NoteRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Note, dataSource);
        }
    }
    before(function () {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
        defaultRepo = new __1.DefaultCrudRepository(Note, ds);
        noteRepo = new NoteRepository(ds);
        ctx = new context_1.Context();
        ctx.bind('models.Note').to(Note);
        ctx.bind('datasources.memory').to(ds);
        ctx.bind('repositories.noteRepo').to(defaultRepo);
        ctx.bind(`repositories.${NoteRepository.name}`).to(noteRepo);
        ctx.bind('controllers.MyController').toClass(MyController);
    });
    // tslint:disable-next-line:max-line-length
    it('supports referencing predefined repository by name via constructor', async () => {
        const myController = await ctx.get('controllers.MyController');
        testlab_1.expect(myController.noteRepo).exactly(defaultRepo);
    });
    // tslint:disable-next-line:max-line-length
    it('supports referencing predefined repository by name via property', async () => {
        const myController = await ctx.get('controllers.MyController');
        testlab_1.expect(myController.noteRepo2).exactly(defaultRepo);
    });
    it('throws not implemented for class-level @repository', () => {
        testlab_1.expect(() => {
            let Controller1 = 
            // tslint:disable-next-line:no-unused
            class Controller1 {
            };
            Controller1 = __decorate([
                __1.repository('noteRepo')
                // tslint:disable-next-line:no-unused
            ], Controller1);
        }).to.throw(/not implemented/);
    });
    it('supports @repository(model, dataSource) by names', async () => {
        let Controller2 = class Controller2 {
            constructor(repo) {
                this.repo = repo;
            }
        };
        Controller2 = __decorate([
            __param(0, __1.repository('Note', 'memory')),
            __metadata("design:paramtypes", [Object])
        ], Controller2);
        ctx.bind('controllers.Controller2').toClass(Controller2);
        const myController = await ctx.get('controllers.Controller2');
        testlab_1.expect(myController.repo).to.be.not.null();
    });
    it('supports @repository(model, dataSource)', async () => {
        let Controller3 = class Controller3 {
            constructor(repo) {
                this.repo = repo;
            }
        };
        Controller3 = __decorate([
            __param(0, __1.repository(Note, ds)),
            __metadata("design:paramtypes", [Object])
        ], Controller3);
        ctx.bind('controllers.Controller3').toClass(Controller3);
        const myController = await ctx.get('controllers.Controller3');
        const r = myController.repo;
        testlab_1.expect(r).to.be.instanceof(__1.DefaultCrudRepository);
        testlab_1.expect(r.dataSource).to.be.exactly(ds);
    });
    it('rejects @repository("")', async () => {
        let Controller4 = class Controller4 {
            constructor(repo) {
                this.repo = repo;
            }
        };
        Controller4 = __decorate([
            __param(0, __1.repository('')),
            __metadata("design:paramtypes", [Object])
        ], Controller4);
        ctx.bind('controllers.Controller4').toClass(Controller4);
        try {
            await ctx.get('controllers.Controller4');
            throw new Error('Repository resolver should have thrown an error.');
        }
        catch (err) {
            testlab_1.expect(err).to.match(/invalid repository/i);
        }
    });
    describe('@repository.getter() ', () => {
        it('accepts repository name', async () => {
            let TestController = class TestController {
                constructor(getRepo) {
                    this.getRepo = getRepo;
                }
            };
            TestController = __decorate([
                __param(0, __1.repository.getter('NoteRepository')),
                __metadata("design:paramtypes", [Function])
            ], TestController);
            ctx.bind('TestController').toClass(TestController);
            const controller = await ctx.get('TestController');
            const repoGetter = controller.getRepo;
            testlab_1.expect(repoGetter).to.be.a.Function();
            const repo = await repoGetter();
            testlab_1.expect(repo).to.be.exactly(noteRepo);
        });
        it('accepts repository class', async () => {
            let TestController = class TestController {
                constructor(getRepo) {
                    this.getRepo = getRepo;
                }
            };
            TestController = __decorate([
                __param(0, __1.repository.getter(NoteRepository)),
                __metadata("design:paramtypes", [Function])
            ], TestController);
            ctx.bind('TestController').toClass(TestController);
            const controller = await ctx.get('TestController');
            const repoGetter = controller.getRepo;
            testlab_1.expect(repoGetter).to.be.a.Function();
            const repo = await repoGetter();
            testlab_1.expect(repo).to.be.exactly(noteRepo);
        });
    });
});
//# sourceMappingURL=repository.decorator.unit.js.map