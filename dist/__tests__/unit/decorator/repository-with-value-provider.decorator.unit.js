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
let MyController = class MyController {
    constructor(noteRepo) {
        this.noteRepo = noteRepo;
    }
};
MyController = __decorate([
    __param(0, __1.repository('noteRepo')),
    __metadata("design:paramtypes", [Object])
], MyController);
let MyRepositoryProvider = class MyRepositoryProvider {
    constructor(myModel, dataSource) {
        this.myModel = myModel;
        this.dataSource = dataSource;
    }
    value() {
        return new __1.DefaultCrudRepository(this.myModel, this
            .dataSource);
    }
};
MyRepositoryProvider = __decorate([
    __param(0, context_1.inject('models.Note')),
    __param(1, context_1.inject('dataSources.memory')),
    __metadata("design:paramtypes", [Object, __1.juggler.DataSource])
], MyRepositoryProvider);
describe('repository class', () => {
    let ctx;
    before(function () {
        const ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
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
        ctx = new context_1.Context();
        ctx.bind('models.Note').to(Note);
        ctx.bind('dataSources.memory').to(ds);
        ctx.bind('repositories.noteRepo').toProvider(MyRepositoryProvider);
        ctx.bind('controllers.MyController').toClass(MyController);
    });
    // tslint:disable-next-line:max-line-length
    it('supports referencing predefined repository by name via constructor', async () => {
        const myController = await ctx.get('controllers.MyController');
        testlab_1.expect(myController.noteRepo instanceof __1.DefaultCrudRepository).to.be.true();
    });
});
//# sourceMappingURL=repository-with-value-provider.decorator.unit.js.map