"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const types = require("../../../");
describe('types', () => {
    describe('string', () => {
        const stringType = new types.StringType();
        it('checks isInstance', () => {
            testlab_1.expect(stringType.isInstance('str')).to.be.true();
            testlab_1.expect(stringType.isInstance(null)).to.be.true();
            testlab_1.expect(stringType.isInstance(undefined)).to.be.true();
            testlab_1.expect(stringType.isInstance(true)).to.be.false();
            testlab_1.expect(stringType.isInstance({ x: 1 })).to.be.false();
            testlab_1.expect(stringType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(stringType.isInstance(1)).to.be.false();
            testlab_1.expect(stringType.isInstance(new Date())).to.be.false();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(stringType.isCoercible('str')).to.be.true();
            testlab_1.expect(stringType.isCoercible(null)).to.be.true();
            testlab_1.expect(stringType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(stringType.isCoercible(true)).to.be.true();
            testlab_1.expect(stringType.isCoercible({ x: 1 })).to.be.true();
            testlab_1.expect(stringType.isCoercible(1)).to.be.true();
            testlab_1.expect(stringType.isCoercible(new Date())).to.be.true();
        });
        it('creates defaultValue', () => {
            testlab_1.expect(stringType.defaultValue()).to.be.equal('');
        });
        it('coerces values', () => {
            testlab_1.expect(stringType.coerce('str')).to.equal('str');
            testlab_1.expect(stringType.coerce(null)).to.equal(null);
            testlab_1.expect(stringType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(stringType.coerce(true)).to.equal('true');
            testlab_1.expect(stringType.coerce({ x: 1 })).to.equal('{"x":1}');
            testlab_1.expect(stringType.coerce([1, '2'])).to.equal('[1,"2"]');
            testlab_1.expect(stringType.coerce(1)).to.equal('1');
            const date = new Date();
            testlab_1.expect(stringType.coerce(date)).to.equal(date.toJSON());
        });
        it('serializes values', () => {
            testlab_1.expect(stringType.serialize('str')).to.eql('str');
            testlab_1.expect(stringType.serialize(null)).null();
            testlab_1.expect(stringType.serialize(undefined)).undefined();
        });
    });
    describe('boolean', () => {
        const booleanType = new types.BooleanType();
        it('checks isInstance', () => {
            testlab_1.expect(booleanType.isInstance('str')).to.be.false();
            testlab_1.expect(booleanType.isInstance(null)).to.be.true();
            testlab_1.expect(booleanType.isInstance(undefined)).to.be.true();
            testlab_1.expect(booleanType.isInstance(true)).to.be.true();
            testlab_1.expect(booleanType.isInstance(false)).to.be.true();
            testlab_1.expect(booleanType.isInstance({ x: 1 })).to.be.false();
            testlab_1.expect(booleanType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(booleanType.isInstance(1)).to.be.false();
            testlab_1.expect(booleanType.isInstance(new Date())).to.be.false();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(booleanType.isCoercible('str')).to.be.true();
            testlab_1.expect(booleanType.isCoercible(null)).to.be.true();
            testlab_1.expect(booleanType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(booleanType.isCoercible(true)).to.be.true();
            testlab_1.expect(booleanType.isCoercible({ x: 1 })).to.be.true();
            testlab_1.expect(booleanType.isCoercible(1)).to.be.true();
            testlab_1.expect(booleanType.isCoercible(new Date())).to.be.true();
        });
        it('creates defaultValue', () => {
            testlab_1.expect(booleanType.defaultValue()).to.be.equal(false);
        });
        it('coerces values', () => {
            testlab_1.expect(booleanType.coerce('str')).to.equal(true);
            testlab_1.expect(booleanType.coerce(null)).to.equal(null);
            testlab_1.expect(booleanType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(booleanType.coerce(true)).to.equal(true);
            testlab_1.expect(booleanType.coerce(false)).to.equal(false);
            testlab_1.expect(booleanType.coerce({ x: 1 })).to.equal(true);
            testlab_1.expect(booleanType.coerce([1, '2'])).to.equal(true);
            testlab_1.expect(booleanType.coerce('')).to.equal(false);
            testlab_1.expect(booleanType.coerce('true')).to.equal(true);
            // string 'false' is boolean true
            testlab_1.expect(booleanType.coerce('false')).to.equal(true);
            testlab_1.expect(booleanType.coerce(0)).to.equal(false);
            testlab_1.expect(booleanType.coerce(1)).to.equal(true);
            const date = new Date();
            testlab_1.expect(booleanType.coerce(date)).to.equal(true);
        });
        it('serializes values', () => {
            testlab_1.expect(booleanType.serialize(true)).to.eql(true);
            testlab_1.expect(booleanType.serialize(false)).to.eql(false);
            testlab_1.expect(booleanType.serialize(null)).null();
            testlab_1.expect(booleanType.serialize(undefined)).undefined();
        });
    });
    describe('number', () => {
        const numberType = new types.NumberType();
        it('checks isInstance', () => {
            testlab_1.expect(numberType.isInstance('str')).to.be.false();
            testlab_1.expect(numberType.isInstance(null)).to.be.true();
            testlab_1.expect(numberType.isInstance(undefined)).to.be.true();
            testlab_1.expect(numberType.isInstance(NaN)).to.be.false();
            testlab_1.expect(numberType.isInstance(true)).to.be.false();
            testlab_1.expect(numberType.isInstance({ x: 1 })).to.be.false();
            testlab_1.expect(numberType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(numberType.isInstance(1)).to.be.true();
            testlab_1.expect(numberType.isInstance(1.1)).to.be.true();
            testlab_1.expect(numberType.isInstance(new Date())).to.be.false();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(numberType.isCoercible('str')).to.be.false();
            testlab_1.expect(numberType.isCoercible('1')).to.be.true();
            testlab_1.expect(numberType.isCoercible('1.1')).to.be.true();
            testlab_1.expect(numberType.isCoercible(null)).to.be.true();
            testlab_1.expect(numberType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(numberType.isCoercible(true)).to.be.true();
            testlab_1.expect(numberType.isCoercible(false)).to.be.true();
            testlab_1.expect(numberType.isCoercible({ x: 1 })).to.be.false();
            testlab_1.expect(numberType.isCoercible(1)).to.be.true();
            testlab_1.expect(numberType.isCoercible(1.1)).to.be.true();
            // Date can be converted to number
            testlab_1.expect(numberType.isCoercible(new Date())).to.be.true();
        });
        it('creates defaultValue', () => {
            testlab_1.expect(numberType.defaultValue()).to.be.equal(0);
        });
        it('coerces values', () => {
            testlab_1.expect(() => numberType.coerce('str')).to.throw(/Invalid number/);
            testlab_1.expect(numberType.coerce('1')).to.equal(1);
            testlab_1.expect(numberType.coerce('1.1')).to.equal(1.1);
            testlab_1.expect(numberType.coerce(null)).to.equal(null);
            testlab_1.expect(numberType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(numberType.coerce(true)).to.equal(1);
            testlab_1.expect(numberType.coerce(false)).to.equal(0);
            testlab_1.expect(() => numberType.coerce({ x: 1 })).to.throw(/Invalid number/);
            testlab_1.expect(() => numberType.coerce([1, '2'])).to.throw(/Invalid number/);
            testlab_1.expect(numberType.coerce(1)).to.equal(1);
            testlab_1.expect(numberType.coerce(1.1)).to.equal(1.1);
            const date = new Date();
            testlab_1.expect(numberType.coerce(date)).to.equal(date.getTime());
        });
        it('serializes values', () => {
            testlab_1.expect(numberType.serialize(1)).to.eql(1);
            testlab_1.expect(numberType.serialize(1.1)).to.eql(1.1);
            testlab_1.expect(numberType.serialize(null)).null();
            testlab_1.expect(numberType.serialize(undefined)).undefined();
        });
    });
    describe('date', () => {
        const dateType = new types.DateType();
        it('checks isInstance', () => {
            testlab_1.expect(dateType.isInstance('str')).to.be.false();
            testlab_1.expect(dateType.isInstance(null)).to.be.true();
            testlab_1.expect(dateType.isInstance(undefined)).to.be.true();
            testlab_1.expect(dateType.isInstance(NaN)).to.be.false();
            testlab_1.expect(dateType.isInstance(true)).to.be.false();
            testlab_1.expect(dateType.isInstance({ x: 1 })).to.be.false();
            testlab_1.expect(dateType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(dateType.isInstance(1)).to.be.false();
            testlab_1.expect(dateType.isInstance(1.1)).to.be.false();
            testlab_1.expect(dateType.isInstance(new Date())).to.be.true();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(dateType.isCoercible('str')).to.be.false();
            testlab_1.expect(dateType.isCoercible('1')).to.be.true();
            testlab_1.expect(dateType.isCoercible('1.1')).to.be.true();
            testlab_1.expect(dateType.isCoercible(null)).to.be.true();
            testlab_1.expect(dateType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(dateType.isCoercible(true)).to.be.true();
            testlab_1.expect(dateType.isCoercible(false)).to.be.true();
            testlab_1.expect(dateType.isCoercible({ x: 1 })).to.be.false();
            testlab_1.expect(dateType.isCoercible(1)).to.be.true();
            testlab_1.expect(dateType.isCoercible(1.1)).to.be.true();
            // Date can be converted to number
            testlab_1.expect(dateType.isCoercible(new Date())).to.be.true();
        });
        it('creates defaultValue', () => {
            const d = new Date();
            const v = dateType.defaultValue();
            testlab_1.expect(v.getTime()).to.aboveOrEqual(d.getTime());
            testlab_1.expect(v.getTime()).to.approximately(d.getTime(), 50);
        });
        it('coerces values', () => {
            testlab_1.expect(() => dateType.coerce('str')).to.throw(/Invalid date/);
            // '1' will be parsed as local 2001-01-01
            testlab_1.expect(dateType.coerce('1')).to.eql(new Date('01/01/2001'));
            // '1.1' will be parsed as local 2001-01-01
            testlab_1.expect(dateType.coerce('1.1')).to.eql(new Date('01/01/2001'));
            testlab_1.expect(dateType.coerce(null)).to.equal(null);
            testlab_1.expect(dateType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(dateType.coerce(true)).to.eql(new Date(1));
            testlab_1.expect(dateType.coerce(false)).to.eql(new Date(0));
            testlab_1.expect(() => dateType.coerce({ x: 1 })).to.throw(/Invalid date/);
            testlab_1.expect(dateType.coerce([1, '2'])).to.eql(new Date('01/02/2001'));
            testlab_1.expect(dateType.coerce(1)).to.eql(new Date('1970-01-01T00:00:00.001Z'));
            testlab_1.expect(dateType.coerce(1.1)).to.eql(new Date('1970-01-01T00:00:00.001Z'));
            const date = new Date();
            testlab_1.expect(dateType.coerce(date)).to.equal(date);
        });
        it('serializes values', () => {
            const date = new Date();
            testlab_1.expect(dateType.serialize(date)).to.eql(date.toJSON());
            testlab_1.expect(dateType.serialize(null)).null();
            testlab_1.expect(dateType.serialize(undefined)).undefined();
        });
    });
    describe('buffer', () => {
        const bufferType = new types.BufferType();
        it('checks isInstance', () => {
            testlab_1.expect(bufferType.isInstance(Buffer.from([1]))).to.be.true();
            testlab_1.expect(bufferType.isInstance(Buffer.from('123'))).to.be.true();
            testlab_1.expect(bufferType.isInstance('str')).to.be.false();
            testlab_1.expect(bufferType.isInstance(null)).to.be.true();
            testlab_1.expect(bufferType.isInstance(undefined)).to.be.true();
            testlab_1.expect(bufferType.isInstance(true)).to.be.false();
            testlab_1.expect(bufferType.isInstance({ x: 1 })).to.be.false();
            testlab_1.expect(bufferType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(bufferType.isInstance(1)).to.be.false();
            testlab_1.expect(bufferType.isInstance(new Date())).to.be.false();
            testlab_1.expect(bufferType.isInstance([1])).to.be.false();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(bufferType.isCoercible('str')).to.be.true();
            testlab_1.expect(bufferType.isCoercible(null)).to.be.true();
            testlab_1.expect(bufferType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(bufferType.isCoercible(Buffer.from('12'))).to.be.true();
            testlab_1.expect(bufferType.isCoercible([1, 2])).to.be.true();
            testlab_1.expect(bufferType.isCoercible({ x: 1 })).to.be.false();
            testlab_1.expect(bufferType.isCoercible(1)).to.be.false();
            testlab_1.expect(bufferType.isCoercible(new Date())).to.be.false();
        });
        it('creates defaultValue', () => {
            testlab_1.expect(bufferType.defaultValue().equals(Buffer.from([]))).to.be.true();
        });
        it('coerces values', () => {
            testlab_1.expect(bufferType.coerce('str').equals(Buffer.from('str'))).to.be.true();
            testlab_1.expect(bufferType.coerce([1]).equals(Buffer.from([1]))).to.be.true();
            testlab_1.expect(bufferType.coerce(null)).to.equal(null);
            testlab_1.expect(bufferType.coerce(undefined)).to.equal(undefined);
            const buf = Buffer.from('12');
            testlab_1.expect(bufferType.coerce(buf)).exactly(buf);
            testlab_1.expect(() => bufferType.coerce(1)).to.throw(/Invalid buffer/);
            testlab_1.expect(() => bufferType.coerce(new Date())).to.throw(/Invalid buffer/);
            testlab_1.expect(() => bufferType.coerce(true)).to.throw(/Invalid buffer/);
            testlab_1.expect(() => bufferType.coerce(false)).to.throw(/Invalid buffer/);
        });
        it('serializes values', () => {
            testlab_1.expect(bufferType.serialize(Buffer.from('str'), { encoding: 'utf-8' })).to.eql('str');
            testlab_1.expect(bufferType.serialize(Buffer.from('str'))).to.eql('c3Ry');
            testlab_1.expect(bufferType.serialize(null)).null();
            testlab_1.expect(bufferType.serialize(undefined)).undefined();
        });
    });
    describe('any', () => {
        const anyType = new types.AnyType();
        it('checks isInstance', () => {
            testlab_1.expect(anyType.isInstance('str')).to.be.true();
            testlab_1.expect(anyType.isInstance(null)).to.be.true();
            testlab_1.expect(anyType.isInstance(undefined)).to.be.true();
            testlab_1.expect(anyType.isInstance(true)).to.be.true();
            testlab_1.expect(anyType.isInstance({ x: 1 })).to.be.true();
            testlab_1.expect(anyType.isInstance([1, 2])).to.be.true();
            testlab_1.expect(anyType.isInstance(1)).to.be.true();
            testlab_1.expect(anyType.isInstance(new Date())).to.be.true();
            testlab_1.expect(anyType.isInstance(Buffer.from('123'))).to.be.true();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(anyType.isCoercible('str')).to.be.true();
            testlab_1.expect(anyType.isCoercible(null)).to.be.true();
            testlab_1.expect(anyType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(anyType.isCoercible(true)).to.be.true();
            testlab_1.expect(anyType.isCoercible({ x: 1 })).to.be.true();
            testlab_1.expect(anyType.isCoercible(1)).to.be.true();
            testlab_1.expect(anyType.isCoercible([1, '2'])).to.be.true();
            testlab_1.expect(anyType.isCoercible(new Date())).to.be.true();
            testlab_1.expect(anyType.isCoercible(Buffer.from('123'))).to.be.true();
        });
        it('creates defaultValue', () => {
            testlab_1.expect(anyType.defaultValue()).to.equal(undefined);
        });
        it('coerces values', () => {
            testlab_1.expect(anyType.coerce('str')).to.equal('str');
            testlab_1.expect(anyType.coerce(null)).to.equal(null);
            testlab_1.expect(anyType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(anyType.coerce(true)).to.equal(true);
            const obj = { x: 1 };
            testlab_1.expect(anyType.coerce(obj)).to.equal(obj);
            const arr = [1, '2'];
            testlab_1.expect(anyType.coerce(arr)).to.equal(arr);
            testlab_1.expect(anyType.coerce(1)).to.equal(1);
            const date = new Date();
            testlab_1.expect(anyType.coerce(date)).to.equal(date);
            const buf = Buffer.from('12');
            testlab_1.expect(anyType.coerce(buf)).to.equal(buf);
        });
        it('serializes values', () => {
            testlab_1.expect(anyType.serialize('str')).to.eql('str');
            testlab_1.expect(anyType.serialize(1)).to.eql(1);
            testlab_1.expect(anyType.serialize([1, '2'])).to.eql([1, '2']);
            testlab_1.expect(anyType.serialize(null)).null();
            testlab_1.expect(anyType.serialize(undefined)).undefined();
            const date = new Date();
            testlab_1.expect(anyType.serialize(date)).to.eql(date.toJSON());
            const obj = { x: 1 };
            testlab_1.expect(anyType.serialize(obj)).to.eql(obj);
            const json = {
                x: 1,
                y: 2,
                toJSON() {
                    return { a: json.x + json.y };
                },
            };
            testlab_1.expect(anyType.serialize(json)).to.eql({ a: 3 });
        });
    });
    describe('array', () => {
        const stringType = new types.StringType();
        const arrayType = new types.ArrayType(stringType);
        it('checks isInstance', () => {
            testlab_1.expect(arrayType.isInstance('str')).to.be.false();
            testlab_1.expect(arrayType.isInstance(null)).to.be.true();
            testlab_1.expect(arrayType.isInstance(undefined)).to.be.true();
            testlab_1.expect(arrayType.isInstance(NaN)).to.be.false();
            testlab_1.expect(arrayType.isInstance(true)).to.be.false();
            testlab_1.expect(arrayType.isInstance({ x: 1 })).to.be.false();
            testlab_1.expect(arrayType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(arrayType.isInstance([1, '2'])).to.be.false();
            testlab_1.expect(arrayType.isInstance(['1'])).to.be.true();
            testlab_1.expect(arrayType.isInstance(['1', 'a'])).to.be.true();
            testlab_1.expect(arrayType.isInstance(['1', 'a', null])).to.be.true();
            testlab_1.expect(arrayType.isInstance(['1', 'a', undefined])).to.be.true();
            testlab_1.expect(arrayType.isInstance([])).to.be.true();
            testlab_1.expect(arrayType.isInstance(1)).to.be.false();
            testlab_1.expect(arrayType.isInstance(1.1)).to.be.false();
            testlab_1.expect(arrayType.isInstance(new Date())).to.be.false();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(arrayType.isCoercible('str')).to.be.false();
            testlab_1.expect(arrayType.isCoercible('1')).to.be.false();
            testlab_1.expect(arrayType.isCoercible('1.1')).to.be.false();
            testlab_1.expect(arrayType.isCoercible(null)).to.be.true();
            testlab_1.expect(arrayType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(arrayType.isCoercible(true)).to.be.false();
            testlab_1.expect(arrayType.isCoercible(false)).to.be.false();
            testlab_1.expect(arrayType.isCoercible({ x: 1 })).to.be.false();
            testlab_1.expect(arrayType.isCoercible(1)).to.be.false();
            testlab_1.expect(arrayType.isCoercible(1.1)).to.be.false();
            testlab_1.expect(arrayType.isCoercible(new Date())).to.be.false();
            testlab_1.expect(arrayType.isCoercible([])).to.be.true();
            testlab_1.expect(arrayType.isCoercible(['1'])).to.be.true();
            testlab_1.expect(arrayType.isCoercible(['1', 2])).to.be.true();
        });
        it('creates defaultValue', () => {
            testlab_1.expect(arrayType.defaultValue()).to.be.eql([]);
        });
        it('coerces values', () => {
            testlab_1.expect(() => arrayType.coerce('str')).to.throw(/Invalid array/);
            testlab_1.expect(() => arrayType.coerce('1')).to.throw(/Invalid array/);
            testlab_1.expect(() => arrayType.coerce('1.1')).to.throw(/Invalid array/);
            testlab_1.expect(arrayType.coerce(null)).to.equal(null);
            testlab_1.expect(arrayType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(() => arrayType.coerce(true)).to.throw(/Invalid array/);
            testlab_1.expect(() => arrayType.coerce(false)).to.throw(/Invalid array/);
            testlab_1.expect(() => arrayType.coerce({ x: 1 })).to.throw(/Invalid array/);
            testlab_1.expect(() => arrayType.coerce(1)).to.throw(/Invalid array/);
            const date = new Date();
            testlab_1.expect(() => arrayType.coerce(date)).to.throw(/Invalid array/);
            testlab_1.expect(arrayType.coerce([1, '2'])).to.eql(['1', '2']);
            testlab_1.expect(arrayType.coerce(['2'])).to.eql(['2']);
            testlab_1.expect(arrayType.coerce([null, undefined, '2'])).to.eql([
                null,
                undefined,
                '2',
            ]);
            testlab_1.expect(arrayType.coerce([true, '2'])).to.eql(['true', '2']);
            testlab_1.expect(arrayType.coerce([false, '2'])).to.eql(['false', '2']);
            testlab_1.expect(arrayType.coerce([date])).to.eql([date.toJSON()]);
        });
        it('serializes values', () => {
            testlab_1.expect(arrayType.serialize(['a'])).to.eql(['a']);
            testlab_1.expect(arrayType.serialize(null)).null();
            testlab_1.expect(arrayType.serialize(undefined)).undefined();
        });
    });
    describe('union', () => {
        const numberType = new types.NumberType();
        const booleanType = new types.BooleanType();
        const unionType = new types.UnionType([numberType, booleanType]);
        it('checks isInstance', () => {
            testlab_1.expect(unionType.isInstance('str')).to.be.false();
            testlab_1.expect(unionType.isInstance(null)).to.be.true();
            testlab_1.expect(unionType.isInstance(undefined)).to.be.true();
            testlab_1.expect(unionType.isInstance(NaN)).to.be.false();
            testlab_1.expect(unionType.isInstance(true)).to.be.true();
            testlab_1.expect(unionType.isInstance({ x: 1 })).to.be.false();
            testlab_1.expect(unionType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(unionType.isInstance(1)).to.be.true();
            testlab_1.expect(unionType.isInstance(1.1)).to.be.true();
            testlab_1.expect(unionType.isInstance(new Date())).to.be.false();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(unionType.isCoercible('str')).to.be.true();
            testlab_1.expect(unionType.isCoercible('1')).to.be.true();
            testlab_1.expect(unionType.isCoercible('1.1')).to.be.true();
            testlab_1.expect(unionType.isCoercible(null)).to.be.true();
            testlab_1.expect(unionType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(unionType.isCoercible(true)).to.be.true();
            testlab_1.expect(unionType.isCoercible(false)).to.be.true();
            testlab_1.expect(unionType.isCoercible({ x: 1 })).to.be.true();
            testlab_1.expect(unionType.isCoercible(1)).to.be.true();
            testlab_1.expect(unionType.isCoercible(1.1)).to.be.true();
            // Date can be converted to number
            testlab_1.expect(unionType.isCoercible(new Date())).to.be.true();
        });
        it('creates defaultValue', () => {
            testlab_1.expect(unionType.defaultValue()).to.be.equal(0);
        });
        it('coerces values', () => {
            testlab_1.expect(unionType.coerce('str')).to.equal(true);
            testlab_1.expect(unionType.coerce('1')).to.equal(1);
            testlab_1.expect(unionType.coerce('1.1')).to.equal(1.1);
            testlab_1.expect(unionType.coerce(null)).to.equal(null);
            testlab_1.expect(unionType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(unionType.coerce(true)).to.equal(true);
            testlab_1.expect(unionType.coerce(false)).to.equal(false);
            testlab_1.expect(unionType.coerce({ x: 1 })).to.equal(true);
            testlab_1.expect(unionType.coerce([1, '2'])).to.equal(true);
            testlab_1.expect(unionType.coerce(1)).to.equal(1);
            testlab_1.expect(unionType.coerce(1.1)).to.equal(1.1);
            const date = new Date();
            testlab_1.expect(unionType.coerce(date)).to.equal(date.getTime());
            // Create a new union type to test invalid value
            const dateType = new types.DateType();
            const numberOrDateType = new types.UnionType([numberType, dateType]);
            testlab_1.expect(() => numberOrDateType.coerce('str')).to.throw(/Invalid union/);
        });
        it('serializes values', () => {
            testlab_1.expect(unionType.serialize(1)).to.equal(1);
            testlab_1.expect(unionType.serialize(1.1)).to.equal(1.1);
            testlab_1.expect(unionType.serialize(true)).to.equal(true);
            testlab_1.expect(unionType.serialize(false)).to.equal(false);
            testlab_1.expect(unionType.serialize(null)).null();
            testlab_1.expect(unionType.serialize(undefined)).undefined();
        });
    });
    describe('model', () => {
        class Address extends types.ValueObject {
        }
        class Customer extends types.Entity {
            constructor(data) {
                super();
                if (data != null) {
                    this.id = data.id;
                    this.email = data.email;
                    this.address = data.address;
                }
            }
        }
        const modelType = new types.ModelType(Customer);
        it('checks isInstance', () => {
            testlab_1.expect(modelType.isInstance('str')).to.be.false();
            testlab_1.expect(modelType.isInstance(null)).to.be.true();
            testlab_1.expect(modelType.isInstance(undefined)).to.be.true();
            testlab_1.expect(modelType.isInstance(NaN)).to.be.false();
            testlab_1.expect(modelType.isInstance(true)).to.be.false();
            testlab_1.expect(modelType.isInstance({ id: 'c1' })).to.be.false();
            testlab_1.expect(modelType.isInstance([1, 2])).to.be.false();
            testlab_1.expect(modelType.isInstance(1)).to.be.false();
            testlab_1.expect(modelType.isInstance(1.1)).to.be.false();
            testlab_1.expect(modelType.isInstance(new Customer())).to.be.true();
        });
        it('checks isCoercible', () => {
            testlab_1.expect(modelType.isCoercible('str')).to.be.false();
            testlab_1.expect(modelType.isCoercible('1')).to.be.false();
            testlab_1.expect(modelType.isCoercible('1.1')).to.be.false();
            testlab_1.expect(modelType.isCoercible(null)).to.be.true();
            testlab_1.expect(modelType.isCoercible(undefined)).to.be.true();
            testlab_1.expect(modelType.isCoercible(true)).to.be.false();
            testlab_1.expect(modelType.isCoercible(false)).to.be.false();
            testlab_1.expect(modelType.isCoercible({ x: 1 })).to.be.true();
            testlab_1.expect(modelType.isCoercible(1)).to.be.false();
            testlab_1.expect(modelType.isCoercible(1.1)).to.be.false();
            testlab_1.expect(modelType.isCoercible([1])).to.be.false();
            testlab_1.expect(modelType.isCoercible(new Customer())).to.be.true();
        });
        it('creates defaultValue', () => {
            const d = new Customer();
            const v = modelType.defaultValue();
            testlab_1.expect(d).to.be.eql(v);
        });
        it('coerces values', () => {
            testlab_1.expect(() => modelType.coerce('str')).to.throw(/Invalid model/);
            testlab_1.expect(modelType.coerce(null)).to.equal(null);
            testlab_1.expect(modelType.coerce(undefined)).to.equal(undefined);
            testlab_1.expect(() => modelType.coerce(true)).to.throw(/Invalid model/);
            testlab_1.expect(() => modelType.coerce(false)).to.throw(/Invalid model/);
            testlab_1.expect(() => modelType.coerce(1)).to.throw(/Invalid model/);
            testlab_1.expect(() => modelType.coerce(1.1)).to.throw(/Invalid model/);
            testlab_1.expect(() => modelType.coerce([1, '2'])).to.throw(/Invalid model/);
            const customer = modelType.coerce({ id: 'c1' });
            testlab_1.expect(customer instanceof Customer).to.be.true();
        });
        it('serializes values', () => {
            const customer = new Customer({ id: 'c1' });
            testlab_1.expect(modelType.serialize(customer)).to.eql(customer.toJSON());
            testlab_1.expect(modelType.serialize(null)).null();
            testlab_1.expect(modelType.serialize(undefined)).undefined();
        });
    });
});
//# sourceMappingURL=type.unit.js.map