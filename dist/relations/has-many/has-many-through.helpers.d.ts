import { DataObject } from '../../common-types';
import { Entity } from '../../model';
import { HasManyThroughDefinition } from '../relation.types';
/**
 * Relation definition with optional metadata (e.g. `keyTo`) filled in.
 * @internal
 */
export declare type HasManyThroughResolvedDefinition = HasManyThroughDefinition & {
    keyTo: string;
    keyThrough: string;
    targetPrimaryKey: string;
};
/**
 * Creates constraint used to query target
 * @param relationMeta - hasManyThrough metadata to resolve
 * @param throughInstances - Instances of through entities used to constrain the target
 * @internal
 */
export declare function createTargetConstraint<Target extends Entity, Through extends Entity>(relationMeta: HasManyThroughResolvedDefinition, throughInstances: Through[]): DataObject<Target>;
/**
 * Creates constraint used to query through
 * @param relationMeta - hasManyThrough metadata to resolve
 * @param fkValue - Value of the foreign key used to constrain through
 * @param targetInstance - Instance of target entity used to constrain through
 * @internal
 */
export declare function createThroughConstraint<Target extends Entity, Through extends Entity, ForeignKeyType>(relationMeta: HasManyThroughResolvedDefinition, fkValue?: ForeignKeyType, targetInstance?: Target): DataObject<Through>;
/**
 * Resolves given hasMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * belongsTo metadata
 * @param relationMeta - hasManyThrough metadata to resolve
 * @internal
 */
export declare function resolveHasManyThroughMetadata(relationMeta: HasManyThroughDefinition): HasManyThroughResolvedDefinition;
