import { Getter } from '@loopback/context';
import { OrderRepository } from '.';
import { DefaultCrudRepository, HasManyRepositoryFactory, juggler } from '../../..';
import { Order, Shipment, ShipmentRelations } from '../models';
export declare class ShipmentRepository extends DefaultCrudRepository<Shipment, typeof Shipment.prototype.id, ShipmentRelations> {
    protected db: juggler.DataSource;
    readonly orders: HasManyRepositoryFactory<Order, typeof Shipment.prototype.id>;
    constructor(db: juggler.DataSource, orderRepositoryGetter: Getter<OrderRepository>);
}
