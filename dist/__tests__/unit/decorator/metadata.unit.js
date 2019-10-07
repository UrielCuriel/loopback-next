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
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('Repository', () => {
    describe('getAllClassMetadata', () => {
        class Oops {
        }
        __decorate([
            __1.property(),
            __metadata("design:type", String)
        ], Oops.prototype, "oopsie", void 0);
        let Colour = class Colour {
        };
        __decorate([
            __1.property({}),
            __metadata("design:type", String)
        ], Colour.prototype, "rgb", void 0);
        Colour = __decorate([
            __1.model()
        ], Colour);
        let Widget = class Widget {
        };
        __decorate([
            __1.property(),
            __metadata("design:type", Number)
        ], Widget.prototype, "id", void 0);
        __decorate([
            __1.property.array(Colour),
            __metadata("design:type", Array)
        ], Widget.prototype, "colours", void 0);
        Widget = __decorate([
            __1.model()
        ], Widget);
        let Samoflange = class Samoflange {
        };
        Samoflange = __decorate([
            __1.model()
        ], Samoflange);
        let Phlange = class Phlange {
        };
        __decorate([
            __1.property(),
            __metadata("design:type", Number)
        ], Phlange.prototype, "id", void 0);
        __decorate([
            __1.property(),
            __metadata("design:type", Boolean)
        ], Phlange.prototype, "canFlap", void 0);
        __decorate([
            __1.property.array(Colour),
            __metadata("design:type", Array)
        ], Phlange.prototype, "colours", void 0);
        Phlange = __decorate([
            __1.model()
        ], Phlange);
        it('returns empty object for classes without @model', () => {
            const meta = __1.ModelMetadataHelper.getModelMetadata(Oops);
            testlab_1.expect(meta).to.deepEqual({});
        });
        it('retrieves metadata for classes with @model', () => {
            const meta = __1.ModelMetadataHelper.getModelMetadata(Samoflange);
            testlab_1.expect(meta).to.deepEqual(new __1.ModelDefinition({
                name: 'Samoflange',
                properties: {},
                settings: new Map(),
            }));
        });
        it('retrieves metadata for classes with @model and @property', () => {
            const meta = __1.ModelMetadataHelper.getModelMetadata(Widget);
            testlab_1.expect(meta).to.deepEqual(new __1.ModelDefinition({
                properties: {
                    id: {
                        type: Number,
                    },
                    colours: {
                        type: Array,
                        itemType: Colour,
                    },
                },
                settings: new Map(),
                name: 'Widget',
            }));
        });
        it('returns cached metadata instead of recreating it', () => {
            const classMeta = context_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Phlange);
            classMeta.properties = {
                foo: {
                    type: String,
                },
            };
            // Intentionally change the metadata to be different from the Phlange
            // class metadata
            context_1.MetadataInspector.defineMetadata(__1.MODEL_WITH_PROPERTIES_KEY.key, classMeta, Phlange);
            const meta = __1.ModelMetadataHelper.getModelMetadata(Phlange);
            testlab_1.expect(meta.properties).to.eql(classMeta.properties);
        });
    });
});
//# sourceMappingURL=metadata.unit.js.map