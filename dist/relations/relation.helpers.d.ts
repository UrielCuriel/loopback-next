import { Entity, EntityCrudRepository, Filter, Options } from '..';
/**
 * Finds model instances that contain any of the provided foreign key values.
 *
 * @param targetRepository - The target repository where the model instances are found
 * @param fkName - Name of the foreign key
 * @param fkValues - One value or array of values of the foreign key to be included
 * @param scope - Additional scope constraints (not currently supported)
 * @param options - Options for the operations
 */
export declare function findByForeignKeys<Target extends Entity, TargetRelations extends object, ForeignKey extends StringKeyOf<Target>>(targetRepository: EntityCrudRepository<Target, unknown, TargetRelations>, fkName: ForeignKey, fkValues: Target[ForeignKey][] | Target[ForeignKey], scope?: Filter<Target>, options?: Options): Promise<(Target & TargetRelations)[]>;
declare type StringKeyOf<T> = Extract<keyof T, string>;
export {};
