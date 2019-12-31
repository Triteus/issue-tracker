import { TicketService } from "./ticket.service";
import { setupDB } from "../startup/testSetup";
import { ERole, IUser } from "../models/User";
import TicketModel, { ITicket, TicketStatus } from "../models/Ticket";
import UserModel from "../models/User";
import { ObjectID } from "bson";
import { ownerData, editorData } from "../test-data/user";
import { ticketData, subTasksData, updatedTicketData } from "../test-data/ticket";
import { IProject, ProjectModel } from "../models/Project";
import { projectData } from "../test-data/project";

describe('TicketService', () => {

    const ticketService = new TicketService();

    setupDB('test-ticket-service');

    let owner: IUser;
    let editor: IUser;
    let ticket: ITicket;
    let project: IProject;
    
    beforeEach(async () => {
        project = await ProjectModel.create(projectData());    
    })

    describe('get tickets', () => {
        
        let openTicket: ITicket, activeTicket: ITicket, closedTicket: ITicket;

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            project.tickets.push(new TicketModel({...ticketData(), status: TicketStatus.OPEN, owner: owner._id}));
            project.tickets.push(new TicketModel({...ticketData(), status: TicketStatus.ACTIVE, owner: owner._id}));
            project.tickets.push(new TicketModel({...ticketData(), status: TicketStatus.CLOSED, owner: owner._id}));
            project = await project.save(),
            
            openTicket = (project.tickets as any)[0] as ITicket;
            activeTicket = (project.tickets as any)[1] as ITicket;
            closedTicket = (project.tickets as any)[2] as ITicket;
        })

        it('should get tickets grouped by status', async () => {
            const ticketsByStatus = await ticketService.groupTicketsByStatus(project);
            expect(ticketsByStatus.openTickets[0]._id).toEqual(openTicket._id);
            expect(ticketsByStatus.activeTickets[0]._id).toEqual(activeTicket._id);
            expect(ticketsByStatus.closedTickets[0]._id).toEqual(closedTicket._id);
        })

    })

    describe('create and save ticket', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
        })

        it('created new ticket', async () => {
            const ticket = await ticketService.createAndSaveTicket(project, owner._id, ticketData());
            expect(ticket.toJSON()).toMatchObject(ticketData());
        })

        it('saves ticket in db', async () => {
            await ticketService.createAndSaveTicket(project, owner._id, ticketData());
            const updatedProject = await ProjectModel.findOne({'tickets.owner': owner._id});
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].toJSON()).toMatchObject(ticketData());
        })

    })

    describe('update ticket', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());

            project.tickets.push(new TicketModel({...ticketData(), owner: owner._id}));
            project = await project.save();
            ticket = project.tickets[0] as ITicket;
        })

         it('throws ResponseError (ticket not found)', async () => {
            const id = new ObjectID();
            await expect(ticketService.findAndUpdateTicket(project, id, editor._id, ticket.toJSON())).rejects.toThrow('Ticket not found!');
        })
    

        it('returns updated ticket', async () => {
            const updatedTicket = ticketService.updateTicket(ticket, editor._id, updatedTicketData() as any);
            const {subTasks, ...expectedPayload } = updatedTicketData();
            expect(updatedTicket.toJSON()).toMatchObject(expectedPayload);
            // check if editor was changed
            expect(updatedTicket.lastEditor).toBe(editor._id);
            expect(updatedTicket.editors).toContain(editor._id);
            // check if subtasks were changed
            expect(updatedTicket.subTasks.length).toBe(subTasksData().length);
            updatedTicket.subTasks.forEach((subTask, index) => {
                expect(subTask).toMatchObject(subTasksData()[index]);
            })
        }) 

        it('updates and saves ticket in project', async () => {
            await ticketService.findAndUpdateTicket(project, ticket._id, editor._id, updatedTicketData() as any);
            const updatedProject = await ProjectModel.findOne({'tickets._id': ticket._id});
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].toJSON()).toMatchObject(updatedTicketData());
        })
    }),

    describe('create history', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());

            ticket = new TicketModel({...ticketData(), owner: owner._id});
            project.tickets.push(new TicketModel({...ticketData(), owner: owner._id}));
            project = await project.save();
            ticket = project.tickets[0] as ITicket;
        })


        it('creates history', () => {
            const history = ticketService.createEditorHistory(ticket, owner._id, {status: TicketStatus.CLOSED});
            expect(history.editorId.toString()).toBe(owner._id.toHexString());
            const pathObj = history.changedPaths[0];
            expect(pathObj.path).toBe('status');
            expect(pathObj.oldValue).toBe(ticket.status);
            expect(pathObj.newValue).toBe(TicketStatus.CLOSED);
        })

        it('creates history (affectedSystems)', () => {
            const history = ticketService.createEditorHistory(ticket, owner._id, {affectedSystems: [...ticket.affectedSystems, 'newSystem']});
            expect(history.editorId.toString()).toBe(owner._id.toHexString());
            const pathObj = history.changedPaths[0];
            expect(pathObj.path).toBe('affectedSystems');
            expect(pathObj.oldValue).toBe(ticket.affectedSystems.join());
            expect(pathObj.newValue).toBe([...ticket.affectedSystems, 'newSystem'].join());
        })

        it('adds history to ticket', () => {
            const initialLength = ticket.editorHistory.length;
            ticketService.addHistory(ticket, owner._id, {status: TicketStatus.CLOSED});
            expect(ticket.editorHistory.length).toBe(initialLength + 1);
        })

    })

    describe('change status', () => {      
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());

            ticket = new TicketModel({...ticketData(), owner: owner._id});
            project.tickets.push(new TicketModel({...ticketData(), owner: owner._id}));
            project = await project.save();
            ticket = project.tickets[0] as ITicket;
        })

        it('throws error (ticket not found)', async () => {
            const id = new ObjectID();
            await expect(ticketService.findTicketAndChangeStatus(project, TicketStatus.ACTIVE, id, new ObjectID()))
            .rejects.toThrow('Ticket not found!');
        })

        it('changed status of ticket', async () => {
            await ticketService.findTicketAndChangeStatus(project, TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedProject = await ProjectModel.findOne({'tickets._id': ticket._id})
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].status).toBe(TicketStatus.ACTIVE);
        })

        it('assigns editor to ticket', async () => {
            await ticketService.findTicketAndChangeStatus(project, TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedProject = await ProjectModel.findOne({'tickets._id': ticket._id})
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].assignedTo).toStrictEqual(editor._id);
        })

        it('removes assigned user from ticket (status switches to closed)', async () => {
            await ticketService.findTicketAndChangeStatus(project, TicketStatus.CLOSED, ticket._id, editor._id);
            const updatedProject = await ProjectModel.findOne({'tickets._id': ticket._id})
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].assignedTo).toBeFalsy();
        })

        it('removes assigned user from ticket (status switches to open)', async () => {
            await ticketService.findTicketAndChangeStatus(project, TicketStatus.OPEN, ticket._id, editor._id);
            const updatedProject = await ProjectModel.findOne({'tickets._id': ticket._id})
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].assignedTo).toBeFalsy();
        })

        it('added editor to ticket', async () => {
            await ticketService.findTicketAndChangeStatus(project, TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedProject = await ProjectModel.findOne({'tickets._id': ticket._id})
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].lastEditor).toStrictEqual(editor._id);
            expect(updatedProject.tickets[0].editors).toContainEqual(editor._id);
        })
    }),

    describe('change sub-tasks', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
      
            ticket = new TicketModel({...ticketData(), owner: owner._id});
            project.tickets.push(new TicketModel({...ticketData(), owner: owner._id}));
            project = await project.save();
            ticket = project.tickets[0] as ITicket;
        })

        it('throws error (ticket not found)', async () => {
            await expect(ticketService.findTicketAndChangeSubTasks(project, new ObjectID(), subTasksData(), editor._id)).rejects.toThrow('Ticket not found!');
        })

        it('updated sub-tasks in db', async () => {
            await ticketService.findTicketAndChangeSubTasks(project, ticket._id, subTasksData(), editor._id);
            const updatedProject = await ProjectModel.findOne({'tickets._id': ticket._id})
            expect(updatedProject).toBeTruthy();
            updatedProject.tickets[0].subTasks.forEach((subTask, index) => {
                expect(subTask).toMatchObject(subTasksData()[index]);
            })
        })
    })
})