"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../../..");
let Manufacturer = class Manufacturer extends __1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    __1.property({ id: true }),
    __metadata("design:type", Number)
], Manufacturer.prototype, "id", void 0);
__decorate([
    __1.property(),
    __metadata("design:type", String)
], Manufacturer.prototype, "name", void 0);
__decorate([
    __1.belongsTo(() => Product),
    __metadata("design:type", Number)
], Manufacturer.prototype, "productId", void 0);
Manufacturer = __decorate([
    __1.model(),
    __metadata("design:paramtypes", [Object])
], Manufacturer);
exports.Manufacturer = Manufacturer;
class ManufacturerRepository extends __1.DefaultCrudRepository {
    constructor(dataSource, productRepository) {
        super(Manufacturer, dataSource);
        if (productRepository)
            this.product = this.createBelongsToAccessorFor('product', productRepository);
    }
}
exports.ManufacturerRepository = ManufacturerRepository;
let Product = class Product extends __1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    __1.property({ id: true }),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    __1.property(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    __1.hasOne(() => Manufacturer),
    __metadata("design:type", Manufacturer)
], Product.prototype, "manufacturer", void 0);
__decorate([
    __1.belongsTo(() => Category),
    __metadata("design:type", Number)
], Product.prototype, "categoryId", void 0);
Product = __decorate([
    __1.model(),
    __metadata("design:paramtypes", [Object])
], Product);
exports.Product = Product;
class ProductRepository extends __1.DefaultCrudRepository {
    constructor(dataSource, categoryRepository, manufacturerRepository) {
        super(Product, dataSource);
        if (categoryRepository)
            this.category = this.createBelongsToAccessorFor('category', categoryRepository);
        if (manufacturerRepository)
            this.manufacturer = this.createHasOneRepositoryFactoryFor('manufacturer', manufacturerRepository);
    }
}
exports.ProductRepository = ProductRepository;
let Category = class Category extends __1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    __1.property({ id: true }),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    __1.property(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    __1.hasMany(() => Product, { keyTo: 'categoryId' }),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
Category = __decorate([
    __1.model(),
    __metadata("design:paramtypes", [Object])
], Category);
exports.Category = Category;
class CategoryRepository extends __1.DefaultCrudRepository {
    constructor(dataSource, productRepository) {
        super(Category, dataSource);
        this.products = this.createHasManyRepositoryFactoryFor('products', productRepository);
    }
}
exports.CategoryRepository = CategoryRepository;
exports.testdb = new __1.juggler.DataSource({
    name: 'db',
    connector: 'memory',
});
function createCategory(properties) {
    return new Category(properties);
}
exports.createCategory = createCategory;
function createProduct(properties) {
    return new Product(properties);
}
exports.createProduct = createProduct;
function createManufacturer(properties) {
    return new Manufacturer(properties);
}
exports.createManufacturer = createManufacturer;
//# sourceMappingURL=relations-helpers-fixtures.js.map