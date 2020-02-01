"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const ticket_model_1 = __importStar(require("../../models/ticket.model"));
const user_model_1 = require("../../models/user.model");
const passport = require("passport");
const error_1 = require("../../middlewares/error");
const validation_1 = require("../../middlewares/validation");
const ticket_validate_1 = require("./ticket.validate");
const project_1 = require("../../middlewares/project");
const ticket_1 = require("../../middlewares/ticket");
const comment_1 = require("../v2/comment/comment");
const ServiceInjector_1 = require("../../ServiceInjector");
const validate = validation_1.validation(ticket_validate_1.TicketValidators);
let TicketController = class TicketController {
    constructor(ticketService) {
        this.ticketService = ticketService || ServiceInjector_1.ServiceInjector.getService('ticketService');
    }
    async createIssue(req, res) {
        const userId = req.user._id;
        const project = res.locals.project;
        const ticket = await this.ticketService.createTicket(userId, req.body);
        project.tickets.push(ticket);
        await project.save();
        res.status(201).send({
            message: 'Ticket successfully created!',
            ticket
        });
    }
    // Tickets can only be edited by users that have support-role
    async editTicket(req, res) {
        const payload = req.body;
        const { ticketId } = req.params;
        const editorId = req.user._id;
        const project = res.locals.project;
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        this.ticketService.addHistoryEntry(ticket, editorId, payload);
        this.ticketService.updateTicket(ticket, editorId, payload);
        await project.save();
        res.status(200).send({
            message: 'Ticket updated successfully!',
            ticket
        });
    }
    // Owner can delete ticket as long as it was not assigned to anybody
    async deleteTicket(req, res, next) {
        const { ticketId, projectId } = req.params;
        const project = res.locals.project;
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        if (req.user._id.equals(ticket.owner)) {
            if (ticket.status !== ticket_model_1.TicketStatus.OPEN) {
                throw new error_1.ResponseError('Missing permissions', error_1.ErrorTypes.NOT_AUTHORIZED);
            }
            await this.ticketService.findAndDeleteTicket(project, ticketId);
        }
        else if (req.user.roles.includes(user_model_1.ERole.Support)) {
            await this.ticketService.findAndDeleteTicket(project, ticketId);
        }
        else {
            throw new error_1.ResponseError('Missing permissions', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        res.status(200).send({
            message: 'Ticket successfully deleted!',
            ticket
        });
    }
    async changeStatus(req, res) {
        const { ticketId } = req.params;
        const project = res.locals.project;
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        this.ticketService.addHistoryEntry(ticket, req.user._id, { status: req.body.status });
        this.ticketService.changeStatus(ticket, req.body.status, req.user._id);
        await project.save();
        res.status(200).send({ message: 'Status updated!', ticket });
    }
    async changeTitle(req, res) {
        const { ticketId } = req.params;
        const project = res.locals.project;
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        this.ticketService.addHistoryEntry(ticket, req.user._id, { title: req.body.title });
        ticket.title = req.body.title;
        await project.save();
        res.status(200).send({ message: 'Title updated!', ticket });
    }
    async changeSubTasks(req, res) {
        const { ticketId } = req.params;
        const project = res.locals.project;
        //TODO add history for subtasks
        const updatedTicket = await this.ticketService.findTicketAndChangeSubTasks(project, ticketId, req.body.subTasks, req.user._id);
        res.status(200).send({ message: 'Subtasks updated!', updatedTicket });
    }
    /**
     * NOTE: Tickets are aggregated. Therefore, toJSON() upon sending response does not seem to work automatically, so we need to do that manually.
     */
    async getTickets(req, res) {
        const project = res.locals.project;
        const { sort, options: pagination, match } = this.ticketService.generateQueryObjects(req.query);
        if (req.query.groupByStatus) {
            const ticketsByStatus = await this.ticketService.groupTicketsByStatus(project, pagination, match, sort);
            const ticketsJSON = {
                openTickets: ticket_model_1.default.toJSON(ticketsByStatus.openTickets),
                activeTickets: ticket_model_1.default.toJSON(ticketsByStatus.activeTickets),
                closedTickets: ticket_model_1.default.toJSON(ticketsByStatus.closedTickets)
            };
            return res.status(200).send(ticketsJSON);
        }
        else {
            const tickets = await this.ticketService.getTickets(project, match, sort, pagination);
            const numTickets = await this.ticketService.countTickets(project, match);
            res.status(200).send({ tickets: ticket_model_1.default.toJSON(tickets), numAllTickets: numTickets });
        }
    }
    async getTicket(req, res) {
        let project = res.locals.project;
        project = await project.populate({
            path: 'tickets.owner tickets.lastEditor tickets.editorHistory.editorId',
        }).execPopulate();
        const ticket = project.tickets.id(req.params.id);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        res.status(200).send(ticket);
    }
    async getTicketTitle(req, res) {
        let project = res.locals.project;
        const ticket = project.tickets.id(req.params.id);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        res.status(200).send({ title: ticket.title });
    }
};
__decorate([
    core_1.Post(''),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        ticket_1.userBelongsToProject,
        ...validate('createTicket')
    ])
], TicketController.prototype, "createIssue", null);
__decorate([
    core_1.Put(':ticketId'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        ticket_1.userBelongsToProject,
        ...validate('putTicket')
    ])
], TicketController.prototype, "editTicket", null);
__decorate([
    core_1.Delete(':ticketId'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        ticket_1.userBelongsToProject,
        ...validate('deleteTicket')
    ])
], TicketController.prototype, "deleteTicket", null);
__decorate([
    core_1.Patch(':ticketId/status'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        ticket_1.userBelongsToProject,
        ...validate('changeStatus')
    ])
], TicketController.prototype, "changeStatus", null);
__decorate([
    core_1.Patch(':ticketId/title'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        ticket_1.userBelongsToProject,
        ...validate('changeTitle')
    ])
], TicketController.prototype, "changeTitle", null);
__decorate([
    core_1.Patch(':ticketId/sub-task'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        ticket_1.userBelongsToProject,
        ...validate('changeSubTasks')
    ])
], TicketController.prototype, "changeSubTasks", null);
__decorate([
    core_1.Get(''),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
], TicketController.prototype, "getTickets", null);
__decorate([
    core_1.Get(':id'),
    core_1.Middleware([
        ...validate('getTicket')
    ])
], TicketController.prototype, "getTicket", null);
__decorate([
    core_1.Get(':id/title')
], TicketController.prototype, "getTicketTitle", null);
TicketController = __decorate([
    core_1.Controller(':projectId/ticket'),
    core_1.Children([
        new comment_1.CommentController()
    ]),
    core_1.ClassMiddleware([
        project_1.findProject
    ]),
    core_1.ClassOptions({ mergeParams: true })
], TicketController);
exports.TicketController = TicketController;
//# sourceMappingURL=ticket.js.map