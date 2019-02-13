import { Getter } from '@loopback/context';
import { BelongsToAccessor, DefaultCrudRepository, juggler } from '../../..';
import { Customer, Address } from '../models';
import { CustomerRepository } from '../repositories';
export declare class AddressRepository extends DefaultCrudRepository<Address, typeof Address.prototype.zipcode> {
    protected db: juggler.DataSource;
    readonly customer: BelongsToAccessor<Customer, typeof Address.prototype.zipcode>;
    constructor(db: juggler.DataSource, customerRepositoryGetter: Getter<CustomerRepository>);
}
