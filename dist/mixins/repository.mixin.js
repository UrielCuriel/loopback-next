"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const debugFactory = require("debug");
const repositories_1 = require("../repositories");
const debug = debugFactory('loopback:repository:mixin');
/**
 * A mixin class for Application that creates a .repository()
 * function to register a repository automatically. Also overrides
 * component function to allow it to register repositories automatically.
 *
 * @example
 * ```ts
 * class MyApplication extends RepositoryMixin(Application) {}
 * ```
 *
 * Please note: the members in the mixin function are documented in a dummy class
 * called <a href="#RepositoryMixinDoc">RepositoryMixinDoc</a>
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RepositoryMixin(superClass) {
    return class extends superClass {
        // A mixin class has to take in a type any[] argument!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args) {
            super(...args);
        }
        /**
         * Add a repository to this application.
         *
         * @param repoClass - The repository to add.
         *
         * @example
         * ```ts
         *
         * class NoteRepo {
         *   model: any;
         *
         *   constructor() {
         *     const ds: juggler.DataSource = new juggler.DataSource({
         *       name: 'db',
         *       connector: 'memory',
         *     });
         *
         *     this.model = ds.createModel(
         *       'note',
         *       {title: 'string', content: 'string'},
         *       {}
         *     );
         *   }
         * };
         *
         * app.repository(NoteRepo);
         * ```
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repository(repoClass, name) {
            const binding = context_1.createBindingFromClass(repoClass, {
                name,
                namespace: 'repositories',
                type: 'repository',
                defaultScope: context_1.BindingScope.TRANSIENT,
            });
            this.add(binding);
            return binding;
        }
        /**
         * Retrieve the repository instance from the given Repository class
         *
         * @param repo - The repository class to retrieve the instance of
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async getRepository(repo) {
            return this.get(`repositories.${repo.name}`);
        }
        /**
         * Add the dataSource to this application.
         *
         * @param dataSource - The dataSource to add.
         * @param name - The binding name of the datasource; defaults to dataSource.name
         *
         * @example
         * ```ts
         *
         * const ds: juggler.DataSource = new juggler.DataSource({
         *   name: 'db',
         *   connector: 'memory',
         * });
         *
         * app.dataSource(ds);
         *
         * // The datasource can be injected with
         * constructor(@inject('datasources.db') dataSource: DataSourceType) {
         *
         * }
         * ```
         */
        dataSource(dataSource, name) {
            // We have an instance of
            if (dataSource instanceof repositories_1.juggler.DataSource) {
                const key = `datasources.${name || dataSource.name}`;
                return this.bind(key)
                    .to(dataSource)
                    .tag('datasource');
            }
            else if (typeof dataSource === 'function') {
                const binding = context_1.createBindingFromClass(dataSource, {
                    name: name || dataSource.dataSourceName,
                    namespace: 'datasources',
                    type: 'datasource',
                    defaultScope: context_1.BindingScope.SINGLETON,
                });
                this.add(binding);
                return binding;
            }
            else {
                throw new Error('not a valid DataSource.');
            }
        }
        /**
         * Add a component to this application. Also mounts
         * all the components repositories.
         *
         * @param component - The component to add.
         *
         * @example
         * ```ts
         *
         * export class ProductComponent {
         *   controllers = [ProductController];
         *   repositories = [ProductRepo, UserRepo];
         *   providers = {
         *     [AUTHENTICATION_STRATEGY]: AuthStrategy,
         *     [AUTHORIZATION_ROLE]: Role,
         *   };
         * };
         *
         * app.component(ProductComponent);
         * ```
         */
        component(component, name) {
            super.component(component, name);
            this.mountComponentRepositories(component);
        }
        /**
         * Get an instance of a component and mount all it's
         * repositories. This function is intended to be used internally
         * by component()
         *
         * @param component - The component to mount repositories of
         */
        mountComponentRepositories(component) {
            const componentKey = `components.${component.name}`;
            const compInstance = this.getSync(componentKey);
            if (compInstance.repositories) {
                for (const repo of compInstance.repositories) {
                    this.repository(repo);
                }
            }
        }
        /**
         * Update or recreate the database schema for all repositories.
         *
         * **WARNING**: By default, `migrateSchema()` will attempt to preserve data
         * while updating the schema in your target database, but this is not
         * guaranteed to be safe.
         *
         * Please check the documentation for your specific connector(s) for
         * a detailed breakdown of behaviors for automigrate!
         *
         * @param options - Migration options, e.g. whether to update tables
         * preserving data or rebuild everything from scratch.
         */
        async migrateSchema(options = {}) {
            const operation = options.existingSchema === 'drop' ? 'automigrate' : 'autoupdate';
            // Instantiate all repositories to ensure models are registered & attached
            // to their datasources
            const repoBindings = this.findByTag('repository');
            await Promise.all(repoBindings.map(b => this.get(b.key)));
            // Look up all datasources and update/migrate schemas one by one
            const dsBindings = this.findByTag('datasource');
            for (const b of dsBindings) {
                const ds = await this.get(b.key);
                if (operation in ds && typeof ds[operation] === 'function') {
                    debug('Migrating dataSource %s', b.key);
                    await ds[operation](options.models);
                }
                else {
                    debug('Skipping migration of dataSource %s', b.key);
                }
            }
        }
    };
}
exports.RepositoryMixin = RepositoryMixin;
/**
 * A dummy class created to generate the tsdoc for the members in repository
 * mixin. Please don't use it.
 *
 * The members are implemented in function
 * <a href="#RepositoryMixin">RepositoryMixin</a>
 */
class RepositoryMixinDoc {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
        throw new Error('This is a dummy class created for apidoc!' + 'Please do not use it!');
    }
    /**
     * Add a repository to this application.
     *
     * @param repo - The repository to add.
     *
     * @example
     * ```ts
     *
     * class NoteRepo {
     *   model: any;
     *
     *   constructor() {
     *     const ds: juggler.DataSource = new juggler.DataSource({
     *       name: 'db',
     *       connector: 'memory',
     *     });
     *
     *     this.model = ds.createModel(
     *       'note',
     *       {title: 'string', content: 'string'},
     *       {}
     *     );
     *   }
     * };
     *
     * app.repository(NoteRepo);
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository(repo) {
        throw new Error();
    }
    /**
     * Retrieve the repository instance from the given Repository class
     *
     * @param repo - The repository class to retrieve the instance of
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getRepository(repo) {
        return new repo();
    }
    /**
     * Add the dataSource to this application.
     *
     * @param dataSource - The dataSource to add.
     * @param name - The binding name of the datasource; defaults to dataSource.name
     *
     * @example
     * ```ts
     *
     * const ds: juggler.DataSource = new juggler.DataSource({
     *   name: 'db',
     *   connector: 'memory',
     * });
     *
     * app.dataSource(ds);
     *
     * // The datasource can be injected with
     * constructor(@inject('datasources.db') dataSource: DataSourceType) {
     *
     * }
     * ```
     */
    dataSource(dataSource, name) {
        throw new Error();
    }
    /**
     * Add a component to this application. Also mounts
     * all the components repositories.
     *
     * @param component - The component to add.
     *
     * @example
     * ```ts
     *
     * export class ProductComponent {
     *   controllers = [ProductController];
     *   repositories = [ProductRepo, UserRepo];
     *   providers = {
     *     [AUTHENTICATION_STRATEGY]: AuthStrategy,
     *     [AUTHORIZATION_ROLE]: Role,
     *   };
     * };
     *
     * app.component(ProductComponent);
     * ```
     */
    component(component) {
        throw new Error();
    }
    /**
     * Get an instance of a component and mount all it's
     * repositories. This function is intended to be used internally
     * by component()
     *
     * @param component - The component to mount repositories of
     */
    mountComponentRepository(component) { }
    /**
     * Update or recreate the database schema for all repositories.
     *
     * **WARNING**: By default, `migrateSchema()` will attempt to preserve data
     * while updating the schema in your target database, but this is not
     * guaranteed to be safe.
     *
     * Please check the documentation for your specific connector(s) for
     * a detailed breakdown of behaviors for automigrate!
     *
     * @param options - Migration options, e.g. whether to update tables
     * preserving data or rebuild everything from scratch.
     */
    async migrateSchema(options) { }
}
exports.RepositoryMixinDoc = RepositoryMixinDoc;
//# sourceMappingURL=repository.mixin.js.map