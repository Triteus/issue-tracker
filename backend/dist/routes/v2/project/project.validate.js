"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Project_1 = require("../../../models/Project");
exports.basicValidators = [
    express_validator_1.body('name').isLength({ min: 4, max: 100 }),
    express_validator_1.body('description').optional().isLength({ min: 4, max: 5000 }),
    express_validator_1.body('filenames').optional().isArray(),
    express_validator_1.body('assignedUsers').optional().isArray(),
    express_validator_1.body('tickets').not().exists(),
    express_validator_1.body('status').optional().isIn(Project_1.projectStatusArr),
    express_validator_1.body('type').optional().isIn(Project_1.projectTypeArr)
];
exports.projectValidators = {
    postProject: [
        ...exports.basicValidators
    ],
    putProject: [
        ...exports.basicValidators
    ],
    patchAssignedUsers: [
        express_validator_1.body('assignedUsers').isArray(),
        express_validator_1.body('assignedUsers.*').isMongoId()
    ]
};
//# sourceMappingURL=project.validate.js.map