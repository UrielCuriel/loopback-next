import { Getter } from '@loopback/context';
import { BelongsToAccessor, DefaultCrudRepository, juggler } from '../../..';
import { Customer, Order, OrderRelations, Shipment } from '../models';
import { CustomerRepository, ShipmentRepository } from '../repositories';
export declare class OrderRepository extends DefaultCrudRepository<Order, typeof Order.prototype.id, OrderRelations> {
    protected db: juggler.DataSource;
    readonly customer: BelongsToAccessor<Customer, typeof Order.prototype.id>;
    readonly shipment: BelongsToAccessor<Shipment, typeof Order.prototype.id>;
    constructor(db: juggler.DataSource, customerRepositoryGetter: Getter<CustomerRepository>, shipmentRepositoryGetter: Getter<ShipmentRepository>);
}
