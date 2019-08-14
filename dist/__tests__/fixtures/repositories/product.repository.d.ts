import { DefaultCrudRepository, juggler } from '../../..';
import { Product, ProductRelations } from '../models/product.model';
export { Product };
export declare class ProductRepository extends DefaultCrudRepository<Product, typeof Product.prototype.id, ProductRelations> {
    constructor(dataSource: juggler.DataSource);
}
