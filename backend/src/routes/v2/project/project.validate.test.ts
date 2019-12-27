import { validateBody, checkResponse } from "../../../validators/test-util";
import { projectData } from "../../../test-data/project";
import { basicValidators, projectValidators } from "./project.validate";
import { Types } from "mongoose";

describe('Ticket validators', () => {

    describe('Basic validators', () => {

        const validators = basicValidators;

        it('throws (name < 4 characters)', async () => {
            const errors = await validateBody({ ...projectData(), name: 'a' }, validators);
            checkResponse(errors, 'name', 'Invalid value');
        })

        it('throws (name > 100 characters)', async () => {
            const errors = await validateBody({ ...projectData(), name: 'a'.repeat(101) }, validators);
            checkResponse(errors, 'name', 'Invalid value');
        })

        it('throws (description < 4 characters)', async () => {
            const errors = await validateBody({ ...projectData(), description: 'a' }, validators);
            checkResponse(errors, 'description', 'Invalid value');
        })

        it('throws (description > 5000 characters)', async () => {
            const errors = await validateBody({ ...projectData(), description: 'a'.repeat(5001) }, validators);
            checkResponse(errors, 'description', 'Invalid value');
        })

        it('throws (filenames is not array)', async () => {
            const errors = await validateBody({ ...projectData(), filenames: 'invalid' }, validators);
            checkResponse(errors, 'filenames', 'Invalid value');
        })

        it('throws (assignedUsers is not array)', async () => {
            const errors = await validateBody({ ...projectData(), assignedUsers: 'invalid' }, validators);
            checkResponse(errors, 'assignedUsers', 'Invalid value');
        })
        
        it('throws (invalid status)', async () => {
            const errors = await validateBody({ ...projectData(), status: 'invalid' }, validators);
            checkResponse(errors, 'status', 'Invalid value');
        })

        it('throws (invalid type)', async () => {
            const errors = await validateBody({ ...projectData(), type: 'invalid' }, validators);
            checkResponse(errors, 'type', 'Invalid value');
        })

        it('passes', async () => {
            const errors = await validateBody({ ...projectData() }, validators);
            expect(errors.length).toBe(0);
        })
    
    })

    describe('patchAssignedUsers validators', () => {
        const validators = projectValidators.patchAssignedUsers;

        it('throws (not an array)', async () => {
            const errors = await validateBody({assignedUsers: 'invalid' }, validators);
            checkResponse(errors, 'assignedUsers', 'Invalid value');
        })

        it('throws (includes inavalid objectid)', async () => {
            const errors = await validateBody({assignedUsers: ['invalidId'] }, validators);
            checkResponse(errors, 'assignedUsers[0]', 'Invalid value');
        })

        it('passes', async () => {
            const errors = await validateBody({assignedUsers: [new Types.ObjectId()] }, validators);
            console.log(errors);
            expect(errors.length).toBe(0);
        })


    })


})