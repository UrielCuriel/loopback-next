import { Getter } from '@loopback/context';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, juggler } from '../../..';
import { HasOneRepositoryFactory } from '../../../';
import { Address, Customer, CustomerRelations, Order, Seller } from '../models';
import { AddressRepository } from './address.repository';
import { SellerRepository } from './seller.repository';
import { OrderRepository } from './order.repository';
export declare class CustomerRepository extends DefaultCrudRepository<Customer, typeof Customer.prototype.id, CustomerRelations> {
    protected db: juggler.DataSource;
    readonly orders: HasManyRepositoryFactory<Order, typeof Customer.prototype.id>;
    readonly address: HasOneRepositoryFactory<Address, typeof Customer.prototype.id>;
    readonly customers: HasManyRepositoryFactory<Customer, typeof Customer.prototype.id>;
    readonly sellers: HasManyThroughRepositoryFactory<Seller, Order, typeof Customer.prototype.id>;
    readonly parent: BelongsToAccessor<Customer, typeof Customer.prototype.id>;
    constructor(db: juggler.DataSource, orderRepositoryGetter: Getter<OrderRepository>, addressRepositoryGetter: Getter<AddressRepository>, sellerRepositoryGetter: Getter<SellerRepository>);
}
