import { DataObject } from '../../common-types';
import { Entity } from '../../model';
import { EntityCrudRepository } from '../../repositories/repository';
import { Getter, HasManyThroughDefinition } from '../relation.types';
import { HasManyThroughRepository } from './has-many-through.repository';
import { Filter, Where } from '../../query';
export declare type HasManyThroughRepositoryFactory<Target extends Entity, Through extends Entity, ForeignKeyType> = (fkValue: ForeignKeyType) => HasManyThroughRepository<Target, Through>;
export interface AdvancedConstraint<T extends Entity> {
    dataObject: DataObject<T>;
    filter: Filter<T>;
    where: Where<T>;
}
/**
 * Enforces a constraint on a repository based on a relationship contract
 * between models. For example, if a Customer model is related to an Order model
 * via a HasMany relation, then, the relational repository returned by the
 * factory function would be constrained by a Customer model instance's id(s).
 *
 * @param relationMetadata The relation metadata used to describe the
 * relationship and determine how to apply the constraint.
 * @param targetRepositoryGetter The repository which represents the target model of a
 * relation attached to a datasource.
 * @returns The factory function which accepts a foreign key value to constrain
 * the given target repository
 */
export declare function createHasManyThroughRepositoryFactory<Target extends Entity, TargetID, Through extends Entity, ThroughID, ForeignKeyType>(relationMetadata: HasManyThroughDefinition, targetRepositoryGetter: Getter<EntityCrudRepository<Target, TargetID>>, throughRepositoryGetter: Getter<EntityCrudRepository<Through, ThroughID>>): HasManyThroughRepositoryFactory<Target, Through, ForeignKeyType>;
