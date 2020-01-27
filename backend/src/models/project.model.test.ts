import { ProjectModel } from "./Project"
import { projectData } from "../test-data/project"
import { ticketData } from "../test-data/ticket"
import TicketModel from "./Ticket";

describe('ProjectModel', () => {

    describe('JSON-response (toJSON())', () => {
        it('removes _id and __v from project', () => {
            const project = new ProjectModel(projectData());
            const result = project.toJSON();
            expect(result._id).toBeUndefined();
            expect(result.__v).toBeUndefined();
        })

    })

    describe('toMinimizedJSON: ', () => {
        it('returns empty ticket array for response', () => {
            const project = new ProjectModel(projectData());
            const ticket = new TicketModel(ticketData());
            project.tickets = [ticket];
            expect(project.tickets).toHaveLength(1);
            const result = ProjectModel.toMinimizedJSON([project]);
            expect(result[0].tickets).toHaveLength(0);
        })
    })


})