import { BelongsToAccessor, DefaultCrudRepository, Entity, Getter, HasManyRepositoryFactory, HasOneRepositoryFactory, juggler } from '../../../..';
export declare class Manufacturer extends Entity {
    id: number;
    name: string;
    productId: number;
    constructor(data: Partial<Manufacturer>);
}
interface ManufacturerRelations {
    products?: ProductWithRelations;
}
export declare class ManufacturerRepository extends DefaultCrudRepository<Manufacturer, typeof Manufacturer.prototype.id, ManufacturerRelations> {
    readonly product: BelongsToAccessor<Product, typeof Manufacturer.prototype.id>;
    constructor(dataSource: juggler.DataSource, productRepository?: Getter<ProductRepository>);
}
export declare class Product extends Entity {
    id: number;
    name: string;
    manufacturer: Manufacturer;
    categoryId: number;
    constructor(data: Partial<Product>);
}
interface ProductRelations {
    manufacturer?: ManufacturerRelations;
}
declare type ProductWithRelations = Product & ProductRelations;
export declare class ProductRepository extends DefaultCrudRepository<Product, typeof Product.prototype.id, ProductRelations> {
    readonly category: BelongsToAccessor<Category, typeof Product.prototype.id>;
    readonly manufacturer: HasOneRepositoryFactory<Manufacturer, typeof Product.prototype.id>;
    constructor(dataSource: juggler.DataSource, categoryRepository?: Getter<CategoryRepository>, manufacturerRepository?: Getter<ManufacturerRepository>);
}
export declare class Category extends Entity {
    id?: number;
    name: string;
    products?: Product[];
    constructor(data: Partial<Category>);
}
interface CategoryRelations {
    products?: ProductWithRelations;
}
export declare class CategoryRepository extends DefaultCrudRepository<Category, typeof Category.prototype.id, CategoryRelations> {
    readonly products: HasManyRepositoryFactory<Product, typeof Category.prototype.id>;
    constructor(dataSource: juggler.DataSource, productRepository: Getter<ProductRepository>);
}
export declare const testdb: juggler.DataSource;
export declare function createCategory(properties: Partial<Category>): Category;
export declare function createProduct(properties: Partial<Product>): Product;
export declare function createManufacturer(properties: Partial<Manufacturer>): Manufacturer;
export {};
