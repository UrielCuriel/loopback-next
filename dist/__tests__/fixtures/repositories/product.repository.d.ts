import { DefaultCrudRepository, juggler } from '../../..';
import { Product } from '../models/product.model';
export { Product };
export declare class ProductRepository extends DefaultCrudRepository<Product, typeof Product.prototype.id> {
    constructor(dataSource: juggler.DataSource);
}
