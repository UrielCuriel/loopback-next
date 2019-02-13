"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const constraint_utils_1 = require("../../repositories/constraint-utils");
class DefaultHasManyThroughRepository {
    /**
     * Constructor of DefaultHasManyEntityCrudRepository
     * @param getTargetRepository the getter of the related target model repository instance
     * @param constraint the key value pair representing foreign key name to constrain
     * the target repository instance
     */
    constructor(getTargetRepository, getThroughRepository, getAdvancedConstraint) {
        this.getTargetRepository = getTargetRepository;
        this.getThroughRepository = getThroughRepository;
        this.getAdvancedConstraint = getAdvancedConstraint;
    }
    async create(targetModelData, throughModelData = {}, options, throughOptions) {
        const targetRepository = await this.getTargetRepository();
        const targetInstance = await targetRepository.create(targetModelData, options);
        const advancedConstraint = await this.getAdvancedConstraint(targetInstance);
        const throughRepository = await this.getThroughRepository();
        await throughRepository.create(constraint_utils_1.constrainDataObject(throughModelData, advancedConstraint.dataObject), throughOptions);
        return targetInstance;
    }
    async find(filter, options) {
        const advancedConstraint = await this.getAdvancedConstraint();
        const targetRepository = await this.getTargetRepository();
        return targetRepository.find(constraint_utils_1.constrainFilter(filter, advancedConstraint.filter), options);
    }
    async delete(where, options) {
        const advancedConstraint = await this.getAdvancedConstraint();
        const targetRepository = await this.getTargetRepository();
        return targetRepository.deleteAll(constraint_utils_1.constrainWhere(where, advancedConstraint.where), options);
    }
    async patch(dataObject, where, options) {
        const advancedConstraint = await this.getAdvancedConstraint();
        const targetRepository = await this.getTargetRepository();
        return targetRepository.updateAll(constraint_utils_1.constrainDataObject(dataObject, advancedConstraint.dataObject), constraint_utils_1.constrainWhere(where, advancedConstraint.where), options);
    }
}
exports.DefaultHasManyThroughRepository = DefaultHasManyThroughRepository;
//# sourceMappingURL=has-many-through.repository.js.map