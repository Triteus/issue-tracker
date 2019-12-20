import { validateBody, checkResponse } from "../../../validators/test-util";
import { projectData } from "../../../test-data/project";
import { basicValidators } from "./project.validate";

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

    
    })


})