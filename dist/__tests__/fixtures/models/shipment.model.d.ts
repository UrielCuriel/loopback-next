import { Entity } from '../../..';
import { Order, OrderWithRelations } from './order.model';
export declare class Shipment extends Entity {
    id: number;
    name: string;
    shipmentOrders: Order[];
    constructor(data?: Partial<Shipment>);
}
export interface ShipmentRelations {
    orders?: OrderWithRelations[];
}
export declare type ShipmentWithRelations = Shipment & ShipmentRelations;
