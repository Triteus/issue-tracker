"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_model_1 = require("./project.model");
const project_1 = require("../test-data/project");
const ticket_1 = require("../test-data/ticket");
const ticket_model_1 = __importDefault(require("./ticket.model"));
describe('ProjectModel', () => {
    describe('JSON-response (toJSON())', () => {
        it('removes _id and __v from project', () => {
            const project = new project_model_1.ProjectModel(project_1.projectData());
            const result = project.toJSON();
            expect(result._id).toBeUndefined();
            expect(result.__v).toBeUndefined();
        });
    });
    describe('toMinimizedJSON: ', () => {
        it('returns empty ticket array for response', () => {
            const project = new project_model_1.ProjectModel(project_1.projectData());
            const ticket = new ticket_model_1.default(ticket_1.ticketData());
            project.tickets = [ticket];
            expect(project.tickets).toHaveLength(1);
            const result = project_model_1.ProjectModel.toMinimizedJSON([project]);
            expect(result[0].tickets).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=project.model.test.js.map