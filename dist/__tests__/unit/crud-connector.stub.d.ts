import { Callback } from 'loopback-datasource-juggler';
import { Class, Count, CrudConnector, Entity, EntityData, Filter, Options, Where } from '../..';
/**
 * A mock up connector implementation
 */
export declare class CrudConnectorStub implements CrudConnector {
    private entities;
    name: 'my-connector';
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    ping(): Promise<void>;
    create(modelClass: Class<Entity>, entity: EntityData, options?: Options): Promise<EntityData>;
    find(modelClass: Class<Entity>, filter?: Filter, options?: Options): Promise<EntityData[]>;
    updateAll(modelClass: Class<Entity>, data: EntityData, where?: Where, options?: Options): Promise<Count>;
    deleteAll(modelClass: Class<Entity>, where?: Where, options?: Options): Promise<Count>;
    count(modelClass: Class<Entity>, where?: Where, options?: Options): Promise<Count>;
    beginTransaction(options: Options, cb: Callback): void;
}
