import { Entity } from '../../..';
import { CustomerWithRelations } from './customer.model';
export declare class Address extends Entity {
    street: string;
    zipcode: string;
    city: string;
    province: string;
    customerId: number;
}
export interface AddressRelations {
    customer?: CustomerWithRelations;
}
export declare type AddressWithRelations = Address & AddressRelations;
