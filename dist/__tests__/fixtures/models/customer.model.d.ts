import { Entity } from '../../..';
import { Address, AddressWithRelations } from '@loopback/repository-tests/dist/crud/relations/fixtures/models/address.model';
import { Order, OrderWithRelations } from './order.model';
import { Seller } from './seller.model';
export declare class Customer extends Entity {
    id: number;
    name: string;
    orders: Order[];
    sellers: Seller[];
    address: Address;
    customers?: Customer[];
    parentId?: number;
}
export interface CustomerRelations {
    address?: AddressWithRelations;
    orders?: OrderWithRelations[];
    customers?: CustomerWithRelations[];
    parentCustomer?: CustomerWithRelations;
}
export declare type CustomerWithRelations = Customer & CustomerRelations;
