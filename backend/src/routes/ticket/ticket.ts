import { Controller, Get, Post, Put, Patch, Delete, Middleware, ClassMiddleware } from "@overnightjs/core";
import { Request, Response, NextFunction } from "express";
import TicketModel, { ticketSchema, TicketStatus, ITicket } from '../../models/Ticket';
import { IUser, ERole, IUserDocument, RequestWithUser } from "../../models/User";
import passport = require("passport");
import { ResponseError, ErrorTypes } from "../../middlewares/error";
import Authorize from '../../middlewares/authorization';
import { TicketService } from "../../services/ticket.service";
import { validation } from '../../middlewares/validation';
import { TicketValidators } from "./ticket.validate";

const validate = validation(TicketValidators);

@Controller('api/ticket')
@ClassMiddleware([
    passport.authenticate('jwt', { session: false }),
])
export class TicketController {

    ticketService = new TicketService();

    @Post('')
    @Middleware([
        ...validate('createTicket')
    ])
    private async createIssue(req: RequestWithUser, res: Response) {
        const userId = req.user._id;
        const ticket = await this.ticketService.createTicket(userId, req.body);

        res.status(201).send({
            message: 'Ticket successfully created!',
            ticket
        })
    }


    // Tickets can only be edited by users that have support-role

    @Put(':id')
    @Middleware([
        Authorize.hasRoles(ERole.Support),
        ...validate('putTicket')
    ])
    private async editTicket(req: RequestWithUser, res: Response) {

        const ticket = await this.ticketService.findAndUpdateTicket(req.params.id, req.user._id, req.body);

        res.status(200).send({
            message: 'Ticket updated successfully!',
            ticket
        })
    }

    // Owner can delete ticket as long as it was not assigned to anybody

    @Delete(':id')
    @Middleware([
        ...validate('deleteTicket')
    ])
    private async deleteTicket(req: RequestWithUser, res: Response, next: NextFunction) {

        const ticket = await TicketModel.findById(req.params.id);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        if (req.user._id.equals(ticket.owner)) {
            if (ticket.status !== TicketStatus.OPEN) {
                throw new ResponseError('Missing permissions', ErrorTypes.NOT_AUTHORIZED);
            }
            await this.ticketService.findAndDeleteTicket(req.params.id);

        } else if (req.user.roles.includes(ERole.Support)) {
            await this.ticketService.findAndDeleteTicket(req.params.id);
        } else {
            throw new ResponseError('Missing permissions', ErrorTypes.NOT_AUTHORIZED);
        }

        res.status(200).send({
            message: 'Ticket successfully deleted!',
            ticket
        });
    }

    @Patch(':id/status')
    @Middleware([
        Authorize.hasRoles(ERole.Support),
        ...validate('changeStatus')
    ])
    private async changeStatus(req: RequestWithUser, res: Response) {
        await this.ticketService.findTicketAndChangeStatus(req.body.status, req.params.id, req.user._id);
        res.status(200).send({ message: 'Status updated!' });
    }

    @Patch(':id/sub-task')
    @Middleware([
        Authorize.hasRoles(ERole.Support),
        ...validate('changeSubTasks')
    ])
    private async changeSubTasks(req: RequestWithUser, res: Response) {
        await this.ticketService.findTicketAndChangeSubTasks(req.params.id, req.body.subTasks, req.user._id);
        res.status(200).send({message: 'Subtasks updated!'});
    }   

    @Get('')
    private async getTickets(req: Request, res: Response) {
        // pagination, 
        // sorting, 
        // filter by category, system, status
        const tickets = await TicketModel.find({}).populate('owner assignedTo lastEditor');
        res.status(200).send(tickets);
    }

    @Get(':id')
    @Middleware([
        ...validate('getTicket')
    ])
    private async getTicket(req: Request, res: Response) {

        const ticket = await TicketModel.findById(req.params.id)
            .populate('owner')
            .populate('lastEditor');
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        res.status(200).send(ticket);
    }
}