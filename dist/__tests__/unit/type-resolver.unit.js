"use strict";
// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const type_resolver_1 = require("../../type-resolver");
class SomeModel {
    constructor(name) {
        this.name = name;
    }
}
const A_DATE_STRING = '2018-01-01T00:00:00.000Z';
describe('isTypeResolver', () => {
    it('returns false when the arg is a class', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(SomeModel)).to.be.false();
    });
    it('returns false when the arg is not a function', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(123)).to.be.false();
    });
    it('returns false when the arg is String type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(String)).to.be.false();
    });
    it('returns false when the arg is Number type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(Number)).to.be.false();
    });
    it('returns false when the arg is Boolean type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(Boolean)).to.be.false();
    });
    it('returns false when the arg is Object type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(Object)).to.be.false();
    });
    it('returns false when the arg is Array type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(Object)).to.be.false();
    });
    it('returns false when the arg is Date type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(Date)).to.be.false();
    });
    it('returns false when the arg is RegExp type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(RegExp)).to.be.false();
    });
    it('returns false when the arg is Buffer type', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(Buffer)).to.be.false();
    });
    it('returns true when the arg is any other function', () => {
        testlab_1.expect(type_resolver_1.isTypeResolver(() => SomeModel)).to.be.true();
    });
});
describe('resolveType', () => {
    it('resolves the arg when the value is a resolver', () => {
        const ctor = type_resolver_1.resolveType(() => SomeModel);
        testlab_1.expect(ctor).to.eql(SomeModel);
        const inst = new ctor('a-name');
        testlab_1.expect(inst).to.have.property('name', 'a-name');
    });
    it('returns the arg when the value is a type', () => {
        const ctor = type_resolver_1.resolveType(SomeModel);
        testlab_1.expect(ctor).to.eql(SomeModel);
        const inst = new ctor('a-name');
        testlab_1.expect(inst).to.have.property('name', 'a-name');
    });
    it('supports Date type', () => {
        const ctor = type_resolver_1.resolveType(Date);
        testlab_1.expect(ctor).to.eql(Date);
        const inst = new ctor(A_DATE_STRING);
        testlab_1.expect(inst.toISOString()).to.equal(A_DATE_STRING);
    });
    it('supports Date resolver', () => {
        const ctor = type_resolver_1.resolveType(() => Date);
        testlab_1.expect(ctor).to.eql(Date);
        const inst = new ctor(A_DATE_STRING);
        testlab_1.expect(inst.toISOString()).to.equal(A_DATE_STRING);
    });
});
describe('isBuiltinType', () => {
    it('returns true for Number', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(Number)).to.eql(true);
    });
    it('returns true for String', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(String)).to.eql(true);
    });
    it('returns true for Boolean', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(Boolean)).to.eql(true);
    });
    it('returns true for Object', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(Object)).to.eql(true);
    });
    it('returns true for Function', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(Function)).to.eql(true);
    });
    it('returns true for Date', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(Date)).to.eql(true);
    });
    it('returns true for Array', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(Array)).to.eql(true);
    });
    it('returns false for any other function', () => {
        testlab_1.expect(type_resolver_1.isBuiltinType(SomeModel)).to.eql(false);
    });
});
//# sourceMappingURL=type-resolver.unit.js.map