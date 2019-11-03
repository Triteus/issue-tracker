import { Controller, Get, Post, Put, Patch, Delete, Middleware } from "@overnightjs/core";
import { Request, Response, NextFunction } from "express";
import TicketModel, { ticketSchema, TicketStatus, ITicket } from '../../models/Ticket';
import { IUser, ERole, IUserDocument } from "../../models/User";
import passport = require("passport");
import { ResponseError, ErrorTypes } from "../../middlewares/error";
import Authorize from '../../middlewares/authorization';
import { TicketService } from "../../services/ticket.service";
import { validation } from '../../middlewares/validation';
import { TicketValidators } from "./ticket.validate";

const validate = validation(TicketValidators);

@Controller('api/ticket')
export class TicketController {

    ticketService = new TicketService();

    @Post('')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('createTicket')
    ])
    private async createIssue(req: Request & { user: IUser }, res: Response) {
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
        passport.authenticate('jwt', { session: false }),
        Authorize.hasRoles(ERole.Support),
        ...validate('putTicket')
    ])
    private async editTicket(req: Request & { user: IUser }, res: Response) {

        const ticket = await this.ticketService.updateTicket(req.params.id, req.user._id, req.body);

        res.status(200).send({
            message: 'Ticket updated successfully!',
            ticket
        })
    }
    
    // Owner can delete ticket as long as it was not assigned to anybody
    
    @Delete(':id')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('deleteTicket')
    ])
    private async deleteTicket(req: Request & { user: IUser }, res: Response, next: NextFunction) {
        
        const ticket = await TicketModel.findById(req.params.id);
        if(!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        if(req.user._id.equals(ticket.ownerId)) {
            if (ticket.status !== TicketStatus.OPEN) {
                throw new ResponseError('Missing permissions', ErrorTypes.NOT_AUTHORIZED);
            }
            await this.ticketService.deleteTicket(req.params.id);
            
        } else if (req.user.roles.includes(ERole.Support)) {
            await this.ticketService.deleteTicket(req.params.id);
        } else {
            throw new ResponseError('Missing permissions', ErrorTypes.NOT_AUTHORIZED);
        }
        
        res.status(200).send({
            message: 'Ticket successfully deleted!',
            ticket
        });
    }
    
    /*     @Patch(':id/status')
        private async changeStatus() {
    
        } */
    
    @Get('')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async getTickets(req: Request, res: Response) {
        // pagination, 
        // sorting, 
        // filter by category, system, status
        const tickets = await TicketModel.find({});
        res.status(404).send(tickets);
    }

    @Get(':id')
    @Middleware([
        ...validate('getTicket')
    ])
    private async getTicket(req: Request, res: Response) {

        const ticket = await TicketModel.findById(req.params.id)
        .populate('ownerId')
        .populate('lastEditorId');
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }

        res.status(200).send(ticket);
    }
}