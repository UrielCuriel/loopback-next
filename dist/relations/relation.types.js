"use strict";
// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
var RelationType;
(function (RelationType) {
    RelationType["belongsTo"] = "belongsTo";
    RelationType["embedsMany"] = "embedsMany";
    RelationType["embedsOne"] = "embedsOne";
    RelationType["hasMany"] = "hasMany";
    RelationType["hasOne"] = "hasOne";
    RelationType["referencesMany"] = "referencesMany";
    RelationType["referencesOne"] = "referencesOne";
})(RelationType = exports.RelationType || (exports.RelationType = {}));
// Re-export Getter so that users don't have to import from @loopback/context
var context_1 = require("@loopback/context");
exports.Getter = context_1.Getter;
//# sourceMappingURL=relation.types.js.map