import { Getter } from '@loopback/context';
import { BelongsToAccessor, DefaultCrudRepository, juggler } from '../../..';
import { Customer, Order } from '../models';
import { CustomerRepository } from '../repositories';
export declare class OrderRepository extends DefaultCrudRepository<Order, typeof Order.prototype.id> {
    protected db: juggler.DataSource;
    readonly customer: BelongsToAccessor<Customer, typeof Order.prototype.id>;
    constructor(db: juggler.DataSource, customerRepositoryGetter: Getter<CustomerRepository>);
}
