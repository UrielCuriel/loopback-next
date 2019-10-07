"use strict";
// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const constraint_utils_1 = require("../../repositories/constraint-utils");
class DefaultHasManyThroughRepository {
    /**
     * Constructor of DefaultHasManyThroughEntityCrudRepository
     * @param getTargetRepository - the getter of the related target model repository instance
     * @param getThroughRepository - the getter of the related through model repository instance
     * @param getTargetConstraint - the getter of the constraint used to query target
     * @param getThroughConstraint - the getter of the constraint used to query through
     * the hasManyThrough instance
     */
    constructor(getTargetRepository, getThroughRepository, getTargetConstraint, getThroughConstraint) {
        this.getTargetRepository = getTargetRepository;
        this.getThroughRepository = getThroughRepository;
        this.getTargetConstraint = getTargetConstraint;
        this.getThroughConstraint = getThroughConstraint;
    }
    async create(targetModelData, throughModelData = {}, options, throughOptions) {
        const targetRepository = await this.getTargetRepository();
        const throughRepository = await this.getThroughRepository();
        const targetInstance = await targetRepository.create(targetModelData, options);
        const throughConstraint = this.getThroughConstraint(targetInstance);
        await throughRepository.create(constraint_utils_1.constrainDataObject(throughModelData, throughConstraint), throughOptions);
        return targetInstance;
    }
    async find(filter, options, throughOptions) {
        const targetRepository = await this.getTargetRepository();
        const throughRepository = await this.getThroughRepository();
        const throughConstraint = this.getThroughConstraint();
        const throughInstances = await throughRepository.find(constraint_utils_1.constrainFilter(undefined, throughConstraint), throughOptions);
        const targetConstraint = this.getTargetConstraint(throughInstances);
        return targetRepository.find(constraint_utils_1.constrainFilter(filter, targetConstraint), options);
    }
    async delete(where, options, throughOptions) {
        const targetRepository = await this.getTargetRepository();
        const throughRepository = await this.getThroughRepository();
        const throughConstraint = this.getThroughConstraint();
        const throughInstances = await throughRepository.find(constraint_utils_1.constrainFilter(undefined, throughConstraint), throughOptions);
        const targetConstraint = this.getTargetConstraint(throughInstances);
        return targetRepository.deleteAll(constraint_utils_1.constrainWhere(where, targetConstraint), options);
    }
    async patch(dataObject, where, options, throughOptions) {
        const targetRepository = await this.getTargetRepository();
        const throughRepository = await this.getThroughRepository();
        const throughConstraint = this.getThroughConstraint();
        const throughInstances = await throughRepository.find(constraint_utils_1.constrainFilter(undefined, throughConstraint), throughOptions);
        const targetConstraint = this.getTargetConstraint(throughInstances);
        return targetRepository.updateAll(constraint_utils_1.constrainDataObject(dataObject, targetConstraint), constraint_utils_1.constrainWhere(where, targetConstraint), options);
    }
}
exports.DefaultHasManyThroughRepository = DefaultHasManyThroughRepository;
//# sourceMappingURL=has-many-through.repository.js.map