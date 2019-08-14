import * as legacy from 'loopback-datasource-juggler';
import { Options, DataObject } from '../common-types';
import { Entity } from '../model';
import { KeyValueRepository, KeyValueFilter } from './kv.repository';
import { juggler } from './legacy-juggler-bridge';
/**
 * An implementation of KeyValueRepository based on loopback-datasource-juggler
 */
export declare class DefaultKeyValueRepository<T extends Entity> implements KeyValueRepository<T> {
    private entityClass;
    /**
     * A legacy KeyValueModel class
     */
    kvModelClass: typeof juggler.KeyValueModel;
    /**
     * Construct a KeyValueRepository with a legacy DataSource
     * @param ds - Legacy DataSource
     */
    constructor(entityClass: typeof Entity & {
        prototype: T;
    }, ds: juggler.DataSource);
    delete(key: string, options?: Options): Promise<void>;
    deleteAll(options?: Options): Promise<void>;
    protected toEntity(modelData: legacy.ModelData): T;
    get(key: string, options?: Options): Promise<T>;
    set(key: string, value: DataObject<T>, options?: Options): Promise<void>;
    expire(key: string, ttl: number, options?: Options): Promise<void>;
    ttl(key: string, options?: Options): Promise<number>;
    keys(filter?: KeyValueFilter, options?: Options): AsyncIterable<string>;
}
