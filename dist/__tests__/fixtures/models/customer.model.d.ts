import { Entity } from '../../..';
import { Order } from './order.model';
import { Address } from './address.model';
import { Seller } from './seller.model';
export declare class Customer extends Entity {
    id: number;
    name: string;
    orders: Order[];
    sellers: Seller[];
    address: Address;
}
