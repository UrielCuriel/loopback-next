import { Entity } from '../../..';
import { CustomerWithRelations } from './customer.model';
import { ShipmentWithRelations } from './shipment.model';
export declare class Order extends Entity {
    id: string;
    description: string;
    isShipped: boolean;
    customerId: number;
    sellerId: number;
    shipment_id: number;
}
export interface OrderRelations {
    customer?: CustomerWithRelations;
    shipment?: ShipmentWithRelations;
}
export declare type OrderWithRelations = Order & OrderRelations;
