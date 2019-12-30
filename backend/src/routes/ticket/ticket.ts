import { Controller, Get, Post, Put, Patch, Delete, Middleware, ClassMiddleware, ClassOptions } from "@overnightjs/core";
import { Request, Response, NextFunction, request } from "express";
import TicketModel, { ticketSchema, TicketStatus, ITicket, Priority } from '../../models/Ticket';
import { IUser, ERole, IUserDocument, RequestWithUser } from "../../models/User";
import passport = require("passport");
import { ResponseError, ErrorTypes } from "../../middlewares/error";
import Authorize from '../../middlewares/authorization';
import { TicketService } from "../../services/ticket.service";
import { validation } from '../../middlewares/validation';
import { TicketValidators } from "./ticket.validate";
import { ProjectModel, IProject } from "../../models/Project";
import { findProject } from "../../middlewares/project";
import { userBelongsToProject } from "../../middlewares/ticket";

const validate = validation(TicketValidators);

@Controller(':projectId/ticket')
@ClassMiddleware([
    findProject
])
@ClassOptions({ mergeParams: true })
export class TicketController {

    ticketService = new TicketService();

    @Post('')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        userBelongsToProject,
        ...validate('createTicket')
    ])
    private async createIssue(req: RequestWithUser, res: Response) {
        const userId = req.user._id;

        const project = res.locals.project;
        const ticket = await this.ticketService.createTicket(userId, req.body);
        project.tickets.push(ticket);
        await project.save();

        res.status(201).send({
            message: 'Ticket successfully created!',
            ticket
        })
    }


    // Tickets can only be edited by users that have support-role

    @Put(':ticketId')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        userBelongsToProject,
        ...validate('putTicket')
    ])
    private async editTicket(req: RequestWithUser, res: Response) {

        const payload = req.body;
        const { ticketId } = req.params;
        const editorId = req.user._id;
        const project = res.locals.project;

        const ticket = (project.tickets as any).id(ticketId);

        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }

        this.ticketService.addHistory(ticket, editorId, payload);
        this.ticketService.updateTicket(ticket, editorId, payload);
        await project.save();

        res.status(200).send({
            message: 'Ticket updated successfully!',
            ticket
        })
    }

    // Owner can delete ticket as long as it was not assigned to anybody

    @Delete(':ticketId')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        userBelongsToProject,
        ...validate('deleteTicket')
    ])
    private async deleteTicket(req: RequestWithUser, res: Response, next: NextFunction) {

        const { ticketId, projectId } = req.params;

        const project = res.locals.project;

        const ticket = (project.tickets as any).id(ticketId);

        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        if (req.user._id.equals(ticket.owner)) {
            if (ticket.status !== TicketStatus.OPEN) {
                throw new ResponseError('Missing permissions', ErrorTypes.NOT_AUTHORIZED);
            }
            await this.ticketService.findAndDeleteTicket(project, ticketId);

        } else if (req.user.roles.includes(ERole.Support)) {
            await this.ticketService.findAndDeleteTicket(project, ticketId);
        } else {
            throw new ResponseError('Missing permissions', ErrorTypes.NOT_AUTHORIZED);
        }

        res.status(200).send({
            message: 'Ticket successfully deleted!',
            ticket
        });
    }

    @Patch(':ticketId/status')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        userBelongsToProject,
        ...validate('changeStatus')
    ])
    private async changeStatus(req: RequestWithUser, res: Response) {

        const { ticketId } = req.params;

        const project = res.locals.project;
        const ticket = (project.tickets as any).id(ticketId);

        if (!ticket) {
            throw new ResponseError('ticket not found!', ErrorTypes.NOT_FOUND);
        }

        this.ticketService.addHistory(ticket, req.user._id, { status: req.body.status });
        this.ticketService.changeStatus(ticket, req.body.status, req.user._id);

        await project.save();

        res.status(200).send({ message: 'Status updated!', ticket });
    }

    @Patch(':ticketId/title')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        userBelongsToProject,
        ...validate('changeTitle')
    ])
    private async changeTitle(req: RequestWithUser, res: Response) {
        const { ticketId } = req.params;
        const project = res.locals.project;

        const ticket = (project.tickets as any).id(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }

        this.ticketService.addHistory(ticket, req.user._id, { title: req.body.title });
        ticket.title = req.body.title;
        await project.save();

        res.status(200).send({ message: 'Title updated!', ticket });
    }

    @Patch(':ticketId/sub-task')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        userBelongsToProject,
        ...validate('changeSubTasks')
    ])
    private async changeSubTasks(req: RequestWithUser, res: Response) {

        const { ticketId } = req.params;
        const project = res.locals.project;

        //TODO add history for subtasks

        const updatedTicket = await this.ticketService.findTicketAndChangeSubTasks(project, ticketId, req.body.subTasks, req.user._id);
        res.status(200).send({ message: 'Subtasks updated!', updatedTicket });
    }


/**
 * NOTE: Tickets are aggregated. Therefore, toJSON() upon sending response does not seem to work automatically, so we need to do that manually. 
 */

    @Get('')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async getTickets(req: Request, res: Response) {

        const project = res.locals.project;
        const { sort, options: pagination, match } = this.ticketService.generateQueryObjects(req.query);

        if (req.query.groupByStatus) {
            const ticketsByStatus = await this.ticketService.groupTicketsByStatus(project, pagination, match, sort);
            const ticketsJSON = {
                openTickets: TicketModel.toJSON(ticketsByStatus.openTickets),
                activeTickets: TicketModel.toJSON(ticketsByStatus.activeTickets),
                closedTickets: TicketModel.toJSON(ticketsByStatus.closedTickets)
            }
            return res.status(200).send(ticketsJSON);
        } else {
            const tickets = await this.ticketService.getTickets(project, match, sort, pagination);
            res.status(200).send({ tickets: TicketModel.toJSON(tickets), numAllTickets: project.tickets.length });
        }
    }

    @Get(':id')
    @Middleware([
        ...validate('getTicket')
    ])
    private async getTicket(req: Request, res: Response) {

        let project = res.locals.project as IProject;
        project = await project.populate({
            path: 'tickets.owner tickets.lastEditor tickets.editorHistory.editorId',
        }).execPopulate();
        const ticket = (project.tickets as any).id(req.params.id) as ITicket;

        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        res.status(200).send(ticket);
    }

    @Get(':id/title')
    private async getTicketTitle(req: Request, res: Response) {
        let project = res.locals.project as IProject;
        const ticket = (project.tickets as any).id(req.params.id) as ITicket;
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        res.status(200).send({ title: ticket.title });
    }
    
}