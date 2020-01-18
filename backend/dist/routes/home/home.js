"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Project_1 = require("../../models/Project");
const User_1 = __importDefault(require("../../models/User"));
const ticket_service_1 = require("../../services/ticket.service");
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = require("mongoose");
const project_service_1 = require("../../services/project.service");
const home_service_1 = require("../../services/home.service");
let HomeController = class HomeController {
    constructor() {
        this.ticketService = new ticket_service_1.TicketService();
        this.projectService = new project_service_1.ProjectService();
        this.homeService = new home_service_1.HomeService();
    }
    /**
     * Get some statistics about tickets and projects
     */
    async getHome(req, res) {
        const numProjects = await Project_1.ProjectModel.countDocuments();
        const numTickets = await this.projectService.countAllTickets();
        const numUsers = await User_1.default.countDocuments();
        const numTicketsCreatedLastMonth = await this.homeService.countTicketsCreatedLastMonth();
        const numTicketsCreatedLastWeek = await this.homeService.countTicketsCreatedLastWeek();
        return res.status(200).send({
            numProjects,
            numTickets,
            numUsers,
            numTicketsCreatedLastWeek,
            numTicketsCreatedLastMonth
        });
    }
    /**
     * Returns all projects that user is assigned to
     */
    async getAssignedProjects(req, res) {
        const userId = req.user._id;
        const projects = await this.projectService.findProjectsByAssignedUser(userId);
        return res.status(200).send({ projects });
    }
    /**
     * Returns the newest 10 tickets that were created or edited by user
     */
    async getLastTickets(req, res) {
        const userId = new mongoose_1.Types.ObjectId(req.user._id);
        const tickets = await this.homeService.findLastTickets(10, userId);
        // make sure to add projectId again (toJSON removes all paths not belonging to ticketSchema)
        const ticketsJSON = tickets.map(ticket => {
            const ticketJSON = new Ticket_1.default(ticket).toJSON();
            return {
                ...ticketJSON,
                projectId: ticket.projectId
            };
        });
        return res.status(200).send({ tickets: ticketsJSON });
    }
};
__decorate([
    core_1.Get(),
    core_1.Middleware(passport_1.default.authenticate('jwt', { session: false }))
], HomeController.prototype, "getHome", null);
__decorate([
    core_1.Get('assigned-projects'),
    core_1.Middleware(passport_1.default.authenticate('jwt', { session: false }))
], HomeController.prototype, "getAssignedProjects", null);
__decorate([
    core_1.Get('last-tickets'),
    core_1.Middleware(passport_1.default.authenticate('jwt', { session: false }))
], HomeController.prototype, "getLastTickets", null);
HomeController = __decorate([
    core_1.Controller('api/v2/home')
], HomeController);
exports.HomeController = HomeController;
//# sourceMappingURL=home.js.map