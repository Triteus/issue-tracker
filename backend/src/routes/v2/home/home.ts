import { Controller, Get, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import TicketModel from '../../../models/ticket.model';
import { ProjectModel } from "../../../models/project.model";
import UserModel, { RequestWithUser } from "../../../models/user.model";
import { TicketService } from "../../../services/ticket.service";
import passport from "passport";
import { Types } from "mongoose";
import { ProjectService } from "../../../services/project.service";
import { HomeService } from "../../../services/home.service";

@Controller('api/v2/home')
export class HomeController {

    ticketService = new TicketService();
    projectService = new ProjectService();
    homeService = new HomeService();

    /**
     * Get some statistics about tickets and projects
     */

    @Get()
    @Middleware(
        passport.authenticate('jwt', { session: false }),
    )
    private async getHome(req: Request, res: Response) {
        const numProjects = await ProjectModel.countDocuments();
        const numTickets = await this.projectService.countAllTickets();
        const numUsers = await UserModel.countDocuments();
        const numTicketsCreatedLastMonth = await this.homeService.countTicketsCreatedLastMonth();
        const numTicketsCreatedLastWeek = await this.homeService.countTicketsCreatedLastWeek();

        return res.status(200).send({
            numProjects,
            numTickets,
            numUsers,
            numTicketsCreatedLastWeek,
            numTicketsCreatedLastMonth
        })
    }


    /**
     * Returns all projects that user is assigned to
     */

    @Get('assigned-projects')
    @Middleware(
        passport.authenticate('jwt', { session: false }),
    )
    private async getAssignedProjects(req: RequestWithUser, res: Response) {
        const userId = req.user._id;
        const projects = await this.projectService.findProjectsByAssignedUser(userId);
        return res.status(200).send({ projects });
    }

    /**
     * Returns the newest 10 tickets that were created or edited by user
     */

    @Get('last-tickets')
    @Middleware(
        passport.authenticate('jwt', { session: false })
    )
    private async getLastTickets(req: RequestWithUser, res: Response) {
        const userId = new Types.ObjectId(req.user._id);

        const tickets = await this.homeService.findLastTickets(10, userId);

        // make sure to add projectId again (toJSON removes all paths not belonging to ticketSchema)
        const ticketsJSON = tickets.map(ticket => {
            const ticketJSON = new TicketModel(ticket).toJSON();
            return {
                ...ticketJSON,
                projectId: ticket.projectId
            }
        })
        return res.status(200).send({ tickets: ticketsJSON });
    }
}