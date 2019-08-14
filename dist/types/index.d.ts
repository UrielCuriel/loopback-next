/**
 * Built-in types for LoopBack modeling
 * - Type: abstract base type
 * - StringType: string
 * - BooleanType: boolean
 * - NumberType: number
 * - DateType: Date
 * - BufferType: Buffer
 * - AnyType: any
 * - ArrayType: Array<T>
 * - UnionType: Union of types
 */
import { Type } from './type';
import { StringType } from './string';
import { BooleanType } from './boolean';
import { NumberType } from './number';
import { DateType } from './date';
import { BufferType } from './buffer';
import { AnyType } from './any';
import { ArrayType } from './array';
import { UnionType } from './union';
import { ObjectType } from './object';
import { ModelType } from './model';
export { Type, StringType, BooleanType, NumberType, DateType, BufferType, AnyType, ArrayType, UnionType, ModelType, ObjectType, };
export declare const STRING: StringType;
export declare const BOOLEAN: BooleanType;
export declare const NUMBER: NumberType;
export declare const DATE: DateType;
export declare const BUFFER: BufferType;
export declare const ANY: AnyType;
