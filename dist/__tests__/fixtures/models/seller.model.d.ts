import { Entity } from '../../..';
import { Customer } from './customer.model';
export declare class Seller extends Entity {
    id: number;
    name: string;
    customers: Customer[];
}
