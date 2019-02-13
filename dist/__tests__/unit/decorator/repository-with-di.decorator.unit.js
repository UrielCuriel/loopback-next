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
const testlab_1 = require("@loopback/testlab");
const context_1 = require("@loopback/context");
const __1 = require("../../../");
describe('repository class', () => {
    let ctx;
    before(givenCtx);
    // tslint:disable-next-line:max-line-length
    it('supports referencing predefined repository by name via constructor', async () => {
        const myController = await ctx.get('controllers.StringBoundController');
        testlab_1.expect(myController.noteRepo instanceof __1.DefaultCrudRepository).to.be.true();
    });
    it('supports referencing predefined repository via constructor', async () => {
        const myController = await ctx.get('controllers.RepositoryBoundController');
        testlab_1.expect(myController.noteRepo instanceof __1.DefaultCrudRepository).to.be.true();
    });
    const ds = new __1.juggler.DataSource({
        name: 'db',
        connector: 'memory',
    });
    class Note extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Note.definition = new __1.ModelDefinition({
        name: 'note',
        properties: {
            title: 'string',
            content: 'string',
            id: { type: 'number', id: true },
        },
    });
    let MyRepository = class MyRepository extends __1.DefaultCrudRepository {
        constructor(myModel, dataSource) {
            super(myModel, dataSource);
        }
    };
    MyRepository = __decorate([
        __param(0, context_1.inject('models.Note')),
        __param(1, context_1.inject('dataSources.memory')),
        __metadata("design:paramtypes", [Object, __1.juggler.DataSource])
    ], MyRepository);
    let StringBoundController = class StringBoundController {
        constructor(noteRepo) {
            this.noteRepo = noteRepo;
        }
    };
    StringBoundController = __decorate([
        __param(0, __1.repository('MyRepository')),
        __metadata("design:paramtypes", [Object])
    ], StringBoundController);
    let RepositoryBoundController = class RepositoryBoundController {
        constructor(noteRepo) {
            this.noteRepo = noteRepo;
        }
    };
    RepositoryBoundController = __decorate([
        __param(0, __1.repository(MyRepository)),
        __metadata("design:paramtypes", [Object])
    ], RepositoryBoundController);
    function givenCtx() {
        ctx = new context_1.Context();
        ctx.bind('models.Note').to(Note);
        ctx.bind('dataSources.memory').to(ds);
        ctx.bind('repositories.MyRepository').toClass(MyRepository);
        ctx
            .bind('controllers.StringBoundController')
            .toClass(StringBoundController);
        ctx
            .bind('controllers.RepositoryBoundController')
            .toClass(RepositoryBoundController);
    }
});
//# sourceMappingURL=repository-with-di.decorator.unit.js.map