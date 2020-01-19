"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_util_1 = require("../../../validators/test-util");
const project_1 = require("../../../test-data/project");
const project_validate_1 = require("./project.validate");
const mongoose_1 = require("mongoose");
describe('Ticket validators', () => {
    describe('Basic validators', () => {
        const validators = project_validate_1.basicValidators;
        it('throws (name < 4 characters)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), name: 'a' }, validators);
            test_util_1.checkResponse(errors, 'name', 'Invalid value');
        });
        it('throws (name > 100 characters)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), name: 'a'.repeat(101) }, validators);
            test_util_1.checkResponse(errors, 'name', 'Invalid value');
        });
        it('throws (description < 4 characters)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), description: 'a' }, validators);
            test_util_1.checkResponse(errors, 'description', 'Invalid value');
        });
        it('throws (description > 5000 characters)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), description: 'a'.repeat(5001) }, validators);
            test_util_1.checkResponse(errors, 'description', 'Invalid value');
        });
        it('throws (filenames is not array)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), filenames: 'invalid' }, validators);
            test_util_1.checkResponse(errors, 'filenames', 'Invalid value');
        });
        it('throws (assignedUsers is not array)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), assignedUsers: 'invalid' }, validators);
            test_util_1.checkResponse(errors, 'assignedUsers', 'Invalid value');
        });
        it('throws (invalid status)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), status: 'invalid' }, validators);
            test_util_1.checkResponse(errors, 'status', 'Invalid value');
        });
        it('throws (invalid type)', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData(), type: 'invalid' }, validators);
            test_util_1.checkResponse(errors, 'type', 'Invalid value');
        });
        it('passes', async () => {
            const errors = await test_util_1.validateBody({ ...project_1.projectData() }, validators);
            expect(errors.length).toBe(0);
        });
    });
    describe('patchAssignedUsers validators', () => {
        const validators = project_validate_1.projectValidators.patchAssignedUsers;
        it('throws (not an array)', async () => {
            const errors = await test_util_1.validateBody({ assignedUsers: 'invalid' }, validators);
            test_util_1.checkResponse(errors, 'assignedUsers', 'Invalid value');
        });
        it('throws (includes inavalid objectid)', async () => {
            const errors = await test_util_1.validateBody({ assignedUsers: ['invalidId'] }, validators);
            test_util_1.checkResponse(errors, 'assignedUsers[0]', 'Invalid value');
        });
        it('passes', async () => {
            const errors = await test_util_1.validateBody({ assignedUsers: [new mongoose_1.Types.ObjectId()] }, validators);
            console.log(errors);
            expect(errors.length).toBe(0);
        });
    });
});
//# sourceMappingURL=project.validate.test.js.map