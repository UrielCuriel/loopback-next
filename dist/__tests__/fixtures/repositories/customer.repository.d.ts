import { Getter } from '@loopback/context';
import { DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, juggler } from '../../..';
import { Customer, Order, Address, Seller } from '../models';
import { OrderRepository } from './order.repository';
import { HasOneRepositoryFactory } from '../../../';
import { AddressRepository } from './address.repository';
import { SellerRepository } from './seller.repository';
export declare class CustomerRepository extends DefaultCrudRepository<Customer, typeof Customer.prototype.id> {
    protected db: juggler.DataSource;
    readonly orders: HasManyRepositoryFactory<Order, typeof Customer.prototype.id>;
    readonly address: HasOneRepositoryFactory<Address, typeof Customer.prototype.id>;
    readonly sellers: HasManyThroughRepositoryFactory<Seller, Order, typeof Customer.prototype.id>;
    constructor(db: juggler.DataSource, orderRepositoryGetter: Getter<OrderRepository>, addressRepositoryGetter: Getter<AddressRepository>, sellerRepositoryGetter: Getter<SellerRepository>);
}
