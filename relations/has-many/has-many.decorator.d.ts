import { Entity, EntityResolver } from '../../model';
import { HasManyDefinition, HasManyThroughDefinition } from '../relation.types';
/**
 * Decorator for hasMany
 * Calls property.array decorator underneath the hood and infers foreign key
 * name from target model name unless explicitly specified
 * @param targetResolver - Target model for hasMany relation
 * @param definition - Optional metadata for setting up hasMany relation
 * @returns A property decorator
 */
export declare function hasMany<T extends Entity>(targetResolver: EntityResolver<T>, definition?: Partial<HasManyDefinition | HasManyThroughDefinition>): (decoratedTarget: object, key: string) => void;
