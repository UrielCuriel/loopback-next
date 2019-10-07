"use strict";
// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Number type
 */
class NumberType {
    constructor() {
        this.name = 'number';
    }
    isInstance(value) {
        return value == null || (!isNaN(value) && typeof value === 'number');
    }
    isCoercible(value) {
        return value == null || !isNaN(Number(value));
    }
    defaultValue() {
        return 0;
    }
    coerce(value) {
        if (value == null)
            return value;
        const n = Number(value);
        if (isNaN(n)) {
            const msg = util.format('Invalid %s: %j', this.name, value);
            throw new TypeError(msg);
        }
        return n;
    }
    serialize(value) {
        return value;
    }
}
exports.NumberType = NumberType;
//# sourceMappingURL=number.js.map