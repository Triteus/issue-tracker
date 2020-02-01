"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_service_1 = require("./ticket.service");
const testSetup_1 = require("../startup/testSetup");
const ticket_model_1 = __importStar(require("../models/ticket.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bson_1 = require("bson");
const user_1 = require("../test-data/user");
const ticket_1 = require("../test-data/ticket");
const project_model_1 = require("../models/project.model");
const project_1 = require("../test-data/project");
describe('TicketService', () => {
    const ticketService = new ticket_service_1.TicketService();
    testSetup_1.setupDB('test-ticket-service');
    let owner;
    let editor;
    let ticket;
    let project;
    beforeEach(async () => {
        project = await project_model_1.ProjectModel.create(project_1.projectData());
    });
    describe('get tickets', () => {
        let openTicket, activeTicket, closedTicket;
        beforeEach(async () => {
            owner = await user_model_1.default.create(user_1.ownerData());
            project.tickets.push(new ticket_model_1.default({ ...ticket_1.ticketData(), status: ticket_model_1.TicketStatus.OPEN, owner: owner._id }));
            project.tickets.push(new ticket_model_1.default({ ...ticket_1.ticketData(), status: ticket_model_1.TicketStatus.ACTIVE, owner: owner._id }));
            project.tickets.push(new ticket_model_1.default({ ...ticket_1.ticketData(), status: ticket_model_1.TicketStatus.CLOSED, owner: owner._id }));
            project = await project.save(),
                openTicket = project.tickets[0];
            activeTicket = project.tickets[1];
            closedTicket = project.tickets[2];
        });
        it('should get tickets grouped by status', async () => {
            const ticketsByStatus = await ticketService.groupTicketsByStatus(project);
            expect(ticketsByStatus.openTickets[0]._id).toEqual(openTicket._id);
            expect(ticketsByStatus.activeTickets[0]._id).toEqual(activeTicket._id);
            expect(ticketsByStatus.closedTickets[0]._id).toEqual(closedTicket._id);
        });
    });
    describe('create and save ticket', () => {
        beforeEach(async () => {
            owner = await user_model_1.default.create(user_1.ownerData());
        });
        it('created new ticket', async () => {
            const ticket = await ticketService.createAndSaveTicket(project, owner._id, ticket_1.ticketData());
            expect(ticket.toJSON()).toMatchObject(ticket_1.ticketData());
        });
        it('saves ticket in db', async () => {
            await ticketService.createAndSaveTicket(project, owner._id, ticket_1.ticketData());
            const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets.owner': owner._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].toJSON()).toMatchObject(ticket_1.ticketData());
        });
    });
    describe('update ticket', () => {
        beforeEach(async () => {
            owner = await user_model_1.default.create(user_1.ownerData());
            editor = await user_model_1.default.create(user_1.editorData());
            project.tickets.push(new ticket_model_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0];
        });
        it('throws ResponseError (ticket not found)', async () => {
            const id = new bson_1.ObjectID();
            await expect(ticketService.findAndUpdateTicket(project, id, editor._id, ticket.toJSON())).rejects.toThrow('Ticket not found!');
        });
        it('returns updated ticket', async () => {
            const updatedTicket = ticketService.updateTicket(ticket, editor._id, ticket_1.updatedTicketData());
            const { subTasks, ...expectedPayload } = ticket_1.updatedTicketData();
            expect(updatedTicket.toJSON()).toMatchObject(expectedPayload);
            // check if editor was changed
            expect(updatedTicket.lastEditor).toBe(editor._id);
            expect(updatedTicket.editors).toContain(editor._id);
            // check if subtasks were changed
            expect(updatedTicket.subTasks.length).toBe(ticket_1.subTasksData().length);
            updatedTicket.subTasks.forEach((subTask, index) => {
                expect(subTask).toMatchObject(ticket_1.subTasksData()[index]);
            });
        });
        it('updates and saves ticket in project', async () => {
            await ticketService.findAndUpdateTicket(project, ticket._id, editor._id, ticket_1.updatedTicketData());
            const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].toJSON()).toMatchObject(ticket_1.updatedTicketData());
        });
    }),
        describe('create history', () => {
            beforeEach(async () => {
                owner = await user_model_1.default.create(user_1.ownerData());
                editor = await user_model_1.default.create(user_1.editorData());
                ticket = new ticket_model_1.default({ ...ticket_1.ticketData(), owner: owner._id });
                project.tickets.push(new ticket_model_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
                project = await project.save();
                ticket = project.tickets[0];
            });
            it('creates history', () => {
                const history = ticketService.createEditorHistoryEntry(ticket, owner._id, { status: ticket_model_1.TicketStatus.CLOSED });
                expect(history.editorId.toString()).toBe(owner._id.toHexString());
                const pathObj = history.changedPaths[0];
                expect(pathObj.path).toBe('status');
                expect(pathObj.oldValue).toBe(ticket.status);
                expect(pathObj.newValue).toBe(ticket_model_1.TicketStatus.CLOSED);
            });
            it('creates history (affectedSystems)', () => {
                const history = ticketService.createEditorHistoryEntry(ticket, owner._id, { affectedSystems: [...ticket.affectedSystems, 'newSystem'] });
                expect(history.editorId.toString()).toBe(owner._id.toHexString());
                const pathObj = history.changedPaths[0];
                expect(pathObj.path).toBe('affectedSystems');
                expect(pathObj.oldValue.sort().join()).toBe(ticket.affectedSystems.sort().join());
                expect(pathObj.newValue.sort().join()).toBe([...ticket.affectedSystems, 'newSystem'].sort().join());
            });
            it('creates history (filenames)', () => {
                const history = ticketService.createEditorHistoryEntry(ticket, owner._id, { filenames: [...ticket.filenames, 'newFilename'] });
                expect(history.editorId.toString()).toBe(owner._id.toHexString());
                const pathObj = history.changedPaths[0];
                expect(pathObj.path).toBe('filenames');
                expect(pathObj.oldValue.sort().join()).toBe(ticket.filenames.sort().join());
                expect(pathObj.newValue.sort().join()).toBe([...ticket.filenames, 'newFilename'].sort().join());
            });
            it('adds history to ticket', () => {
                const initialLength = ticket.editorHistory.length;
                ticketService.addHistoryEntry(ticket, owner._id, { status: ticket_model_1.TicketStatus.CLOSED });
                expect(ticket.editorHistory.length).toBe(initialLength + 1);
            });
            it('does not add history to ticket (no changes)', () => {
                const initialLength = ticket.editorHistory.length;
                ticketService.addHistoryEntry(ticket, owner._id, {});
                expect(ticket.editorHistory.length).toBe(initialLength);
            });
        });
    describe('change status', () => {
        beforeEach(async () => {
            owner = await user_model_1.default.create(user_1.ownerData());
            editor = await user_model_1.default.create(user_1.editorData());
            ticket = new ticket_model_1.default({ ...ticket_1.ticketData(), owner: owner._id });
            project.tickets.push(new ticket_model_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0];
        });
        it('throws error (ticket not found)', async () => {
            const id = new bson_1.ObjectID();
            await expect(ticketService.findTicketAndChangeStatus(project, ticket_model_1.TicketStatus.ACTIVE, id, new bson_1.ObjectID()))
                .rejects.toThrow('Ticket not found!');
        });
        it('changed status of ticket', async () => {
            await ticketService.findTicketAndChangeStatus(project, ticket_model_1.TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].status).toBe(ticket_model_1.TicketStatus.ACTIVE);
        });
        it('assigns editor to ticket', async () => {
            await ticketService.findTicketAndChangeStatus(project, ticket_model_1.TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].assignedTo).toStrictEqual(editor._id);
        });
        it('removes assigned user from ticket (status switches to closed)', async () => {
            await ticketService.findTicketAndChangeStatus(project, ticket_model_1.TicketStatus.CLOSED, ticket._id, editor._id);
            const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].assignedTo).toBeFalsy();
        });
        it('removes assigned user from ticket (status switches to open)', async () => {
            await ticketService.findTicketAndChangeStatus(project, ticket_model_1.TicketStatus.OPEN, ticket._id, editor._id);
            const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].assignedTo).toBeFalsy();
        });
        it('added editor to ticket', async () => {
            await ticketService.findTicketAndChangeStatus(project, ticket_model_1.TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].lastEditor).toStrictEqual(editor._id);
            expect(updatedProject.tickets[0].editors).toContainEqual(editor._id);
        });
    }),
        describe('change sub-tasks', () => {
            beforeEach(async () => {
                owner = await user_model_1.default.create(user_1.ownerData());
                editor = await user_model_1.default.create(user_1.editorData());
                ticket = new ticket_model_1.default({ ...ticket_1.ticketData(), owner: owner._id });
                project.tickets.push(new ticket_model_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
                project = await project.save();
                ticket = project.tickets[0];
            });
            it('throws error (ticket not found)', async () => {
                await expect(ticketService.findTicketAndChangeSubTasks(project, new bson_1.ObjectID(), ticket_1.subTasksData(), editor._id)).rejects.toThrow('Ticket not found!');
            });
            it('updated sub-tasks in db', async () => {
                await ticketService.findTicketAndChangeSubTasks(project, ticket._id, ticket_1.subTasksData(), editor._id);
                const updatedProject = await project_model_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
                expect(updatedProject).toBeTruthy();
                updatedProject.tickets[0].subTasks.forEach((subTask, index) => {
                    expect(subTask).toMatchObject(ticket_1.subTasksData()[index]);
                });
            });
        });
});
//# sourceMappingURL=ticket.service.test.js.map