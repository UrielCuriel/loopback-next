import { Getter } from '@loopback/context';
import { HasManyThroughRepositoryFactory, DefaultCrudRepository, juggler } from '../../..';
import { Customer, Seller, Order } from '../models';
import { CustomerRepository, OrderRepository } from '../repositories';
export declare class SellerRepository extends DefaultCrudRepository<Seller, typeof Seller.prototype.id> {
    protected db: juggler.DataSource;
    readonly customers: HasManyThroughRepositoryFactory<Customer, Order, typeof Seller.prototype.id>;
    constructor(db: juggler.DataSource, customerRepositoryGetter: Getter<CustomerRepository>, orderRepositoryGetter: Getter<OrderRepository>);
}
