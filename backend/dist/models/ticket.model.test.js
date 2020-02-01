"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_model_1 = __importStar(require("./ticket.model"));
const ticket_1 = require("../test-data/ticket");
const mongoose_1 = require("mongoose");
describe('Ticket model', () => {
    describe('set subTasks', () => {
        it('sets subTasks (method)', async () => {
            // we assume that user with id exists 
            const editorId = new mongoose_1.Types.ObjectId();
            const ticket = new ticket_model_1.default(ticket_1.ticketData());
            const subTasks = ticket_1.subTasksData();
            ticket.setSubTasks(subTasks, editorId);
            subTasks.forEach((task, index) => {
                expect(ticket.subTasks[index]).toMatchObject(task);
            });
        });
    });
    it('sets editor (method)', async () => {
        const id = new mongoose_1.Types.ObjectId();
        const ticket = new ticket_model_1.default(ticket_1.ticketData());
        ticket.setEditor(id);
        expect(ticket.lastEditor).toEqual(id);
        expect(ticket.editors).toContainEqual(id);
    });
    it('sets editor and saves (method)', async () => {
        jest.spyOn(ticket_model_1.default.prototype, 'save')
            .mockImplementationOnce(() => Promise.resolve());
        const id = new mongoose_1.Types.ObjectId();
        const ticket = new ticket_model_1.default(ticket_1.ticketData());
        await expect(ticket.setEditorAndSave(id)).resolves.not.toThrow();
    });
    describe('change status method', () => {
        it('clears path assigend when status switches to open', async () => {
            const ticket = new ticket_model_1.default(ticket_1.ticketData());
            // status must be in active status to have assigned user
            ticket.status = ticket_model_1.TicketStatus.ACTIVE;
            ticket.assignedTo = new mongoose_1.Types.ObjectId();
            const editorId = new mongoose_1.Types.ObjectId();
            ticket.changeStatus(ticket_model_1.TicketStatus.OPEN, editorId);
            expect(ticket.status).toBe(ticket_model_1.TicketStatus.OPEN);
            expect(ticket.assignedTo).toBeFalsy();
        });
        it('clears path assigendTo when status switches to closed', async () => {
            const ticket = new ticket_model_1.default(ticket_1.ticketData());
            // status must be in active status to have assigned user
            ticket.status = ticket_model_1.TicketStatus.ACTIVE;
            ticket.assignedTo = new mongoose_1.Types.ObjectId();
            const editorId = new mongoose_1.Types.ObjectId();
            ticket.changeStatus(ticket_model_1.TicketStatus.CLOSED, editorId);
            expect(ticket.status).toBe(ticket_model_1.TicketStatus.CLOSED);
            expect(ticket.assignedTo).toBeFalsy();
        });
        it('changes path assignedTo to given editorId', async () => {
            const ticket = new ticket_model_1.default(ticket_1.ticketData());
            ticket.assignedTo = null;
            const editorId = new mongoose_1.Types.ObjectId();
            ticket.changeStatus(ticket_model_1.TicketStatus.ACTIVE, editorId);
            expect(ticket.status).toBe(ticket_model_1.TicketStatus.ACTIVE);
            expect(ticket.assignedTo).toEqual(editorId);
        });
    });
    describe('toJSON', () => {
        it('delete path "__v" and "_id" (to JSON)', () => {
            const ticket = new ticket_model_1.default(ticket_1.ticketData());
            const ticketJSON = ticket.toJSON();
            expect(ticketJSON._id).toBeFalsy();
            expect(ticketJSON.__v).toBeFalsy();
        });
        it('maps from editorHistory.editorId to editorHistory.editor', () => {
            const id = new mongoose_1.Types.ObjectId();
            const history = { editorId: id, editedAt: new Date(), changedPaths: [] };
            const ticket = new ticket_model_1.default({ ...ticket_1.ticketData(), editorHistory: [history] });
            const ticketJSON = ticket.toJSON();
            expect(ticketJSON.editorHistory[0].editorID).toBeFalsy();
            expect(ticketJSON.editorHistory[0].editor.toString()).toBe(id.toHexString());
        });
    });
    it('performs tolowercase on all strings in affectedSystems', () => {
        const data = { ...ticket_1.ticketData(), affectedSystems: ['JIRA', 'Confluence', 'OUTLOOK', 'dfdFkldsjfF'] };
        const ticket = new ticket_model_1.default(data);
        data.affectedSystems.forEach(system => {
            expect(ticket.affectedSystems).toContain(system.toLowerCase());
        });
    });
});
//# sourceMappingURL=ticket.model.test.js.map