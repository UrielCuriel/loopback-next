import { Entity } from '../../..';
export declare class Product extends Entity {
    id: number;
    name: string;
    slug: string;
    constructor(data?: Partial<Product>);
}
