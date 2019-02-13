import { Entity } from '../../..';
export declare class Order extends Entity {
    id: string;
    description?: string;
    isShipped: boolean;
    customerId: number;
    sellerId: number;
}
