"use strict";
// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Definition for a model
 */
class ModelDefinition {
    constructor(nameOrDef) {
        if (typeof nameOrDef === 'string') {
            nameOrDef = { name: nameOrDef };
        }
        const { name, properties, settings, relations } = nameOrDef;
        this.name = name;
        this.properties = {};
        if (properties) {
            for (const p in properties) {
                this.addProperty(p, properties[p]);
            }
        }
        this.settings = settings || new Map();
        this.relations = relations || {};
    }
    /**
     * Add a property
     * @param name - Property definition or name (string)
     * @param definitionOrType - Definition or property type
     */
    addProperty(name, definitionOrType) {
        const definition = definitionOrType.type
            ? definitionOrType
            : { type: definitionOrType };
        this.properties[name] = definition;
        return this;
    }
    /**
     * Add a setting
     * @param name - Setting name
     * @param value - Setting value
     */
    addSetting(name, value) {
        this.settings[name] = value;
        return this;
    }
    /**
     * Define a new relation.
     * @param definition - The definition of the new relation.
     */
    addRelation(definition) {
        this.relations[definition.name] = definition;
        return this;
    }
    /**
     * Get an array of names of ID properties, which are specified in
     * the model settings or properties with `id` attribute.
     *
     * @example
     * ```ts
     * {
     *   settings: {
     *     id: ['id']
     *   }
     *   properties: {
     *     id: {
     *       type: 'string',
     *       id: true
     *     }
     *   }
     * }
     * ```
     */
    idProperties() {
        if (typeof this.settings.id === 'string') {
            return [this.settings.id];
        }
        else if (Array.isArray(this.settings.id)) {
            return this.settings.id;
        }
        const idProps = Object.keys(this.properties).filter(prop => this.properties[prop].id);
        return idProps;
    }
}
exports.ModelDefinition = ModelDefinition;
function asJSON(value) {
    if (value == null)
        return value;
    if (typeof value.toJSON === 'function') {
        return value.toJSON();
    }
    // Handle arrays
    if (Array.isArray(value)) {
        return value.map(item => asJSON(item));
    }
    return value;
}
function asObject(value, options) {
    if (value == null)
        return value;
    if (typeof value.toObject === 'function') {
        return value.toObject(options);
    }
    if (typeof value.toJSON === 'function') {
        return value.toJSON();
    }
    if (Array.isArray(value)) {
        return value.map(item => asObject(item, options));
    }
    return value;
}
/**
 * Base class for models
 */
class Model {
    constructor(data) {
        Object.assign(this, data);
    }
    static get modelName() {
        return (this.definition && this.definition.name) || this.name;
    }
    /**
     * Serialize into a plain JSON object
     */
    toJSON() {
        const def = this.constructor.definition;
        if (def == null || def.settings.strict === false) {
            return this.toObject({ ignoreUnknownProperties: false });
        }
        const copyPropertyAsJson = (key) => {
            json[key] = asJSON(this[key]);
        };
        const json = {};
        const hiddenProperties = def.settings.hiddenProperties || [];
        for (const p in def.properties) {
            if (p in this && !hiddenProperties.includes(p)) {
                copyPropertyAsJson(p);
            }
        }
        for (const r in def.relations) {
            const relName = def.relations[r].name;
            if (relName in this) {
                copyPropertyAsJson(relName);
            }
        }
        return json;
    }
    /**
     * Convert to a plain object as DTO
     */
    toObject(options) {
        let obj;
        if (options && options.ignoreUnknownProperties === false) {
            obj = {};
            for (const p in this) {
                const val = this[p];
                obj[p] = asObject(val, options);
            }
        }
        else {
            obj = this.toJSON();
        }
        return obj;
    }
}
exports.Model = Model;
/**
 * Base class for value objects - An object that contains attributes but has no
 * conceptual identity. They should be treated as immutable.
 */
class ValueObject extends Model {
}
exports.ValueObject = ValueObject;
/**
 * Base class for entities which have unique ids
 */
class Entity extends Model {
    /**
     * Get the names of identity properties (primary keys).
     */
    static getIdProperties() {
        return this.definition.idProperties();
    }
    /**
     * Get the identity value for a given entity instance or entity data object.
     *
     * @param entityOrData - The data object for which to determine the identity
     * value.
     */
    static getIdOf(entityOrData) {
        if (typeof entityOrData.getId === 'function') {
            return entityOrData.getId();
        }
        const idName = this.definition.idName();
        return entityOrData[idName];
    }
    /**
     * Get the identity value. If the identity is a composite key, returns
     * an object.
     */
    getId() {
        const definition = this.constructor.definition;
        const idProps = definition.idProperties();
        if (idProps.length === 1) {
            return this[idProps[0]];
        }
        if (!idProps.length) {
            throw new Error(`Invalid Entity ${this.constructor.name}:` +
                'missing primary key (id) property');
        }
        return this.getIdObject();
    }
    /**
     * Get the identity as an object, such as `{id: 1}` or
     * `{schoolId: 1, studentId: 2}`
     */
    getIdObject() {
        const definition = this.constructor.definition;
        const idProps = definition.idProperties();
        const idObj = {};
        for (const idProp of idProps) {
            idObj[idProp] = this[idProp];
        }
        return idObj;
    }
    /**
     * Build the where object for the given id
     * @param id - The id value
     */
    static buildWhereForId(id) {
        const where = {};
        const idProps = this.definition.idProperties();
        if (idProps.length === 1) {
            where[idProps[0]] = id;
        }
        else {
            for (const idProp of idProps) {
                where[idProp] = id[idProp];
            }
        }
        return where;
    }
}
exports.Entity = Entity;
/**
 * Domain events
 */
class Event {
}
exports.Event = Event;
//# sourceMappingURL=model.js.map