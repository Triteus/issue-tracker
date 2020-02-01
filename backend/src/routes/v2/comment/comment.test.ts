import { SuperTest, Test } from "supertest";
import supertest from "supertest";
import { setupDB } from "../../../startup/testSetup";
import { TestServer } from "../../../TestServer";
import { IUser } from "../../../models/user.model";
import TicketModel, { ITicket, } from "../../../models/ticket.model";
import { IProject, ProjectModel } from "../../../models/project.model";
import { projectData } from "../../../test-data/project";
import { ownerData, } from "../../../test-data/user";
import { ticketData, } from "../../../test-data/ticket";
import { authHeaderObject } from "../../../util/test-util";
import UserModel from "../../../models/user.model";
import { IComment, CommentModel } from "../../../models/comment.model";
import { Types } from "mongoose";
import { ProjectController } from "../project/project";
import { ProjectService } from "../../../services/project.service";
import { CommentService } from "../../../services/comment.service";
import { TicketService } from "../../../services/ticket.service";
/**
 * all given routes are assumed to be accessed like this: /project/:projectId/ticket/:ticketId/comment/
 */

describe('CommentController (child-controller)', () => {

    let projectController: ProjectController;
    let request: SuperTest<Test>;

    setupDB('test-comment-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setServices({
            'commentService': new CommentService(),
            'projectService': new ProjectService(),
            'ticketService': new TicketService()
        })
        projectController = new ProjectController();
        testServer.setControllers(projectController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    let user: IUser;

    let ticket: ITicket;
    let project: IProject;

    const baseUrl = "/api/v2";
    let url = '';

    function genUrl(projectId: Types.ObjectId, ticketId: Types.ObjectId) {
        return url = `${baseUrl}/project/${projectId}/ticket/${ticketId}/comment/`;
    }

    beforeEach(async () => {
        user = new UserModel(ownerData());
        user = await user.save();

        project = new ProjectModel(projectData());
        ticket = new TicketModel({ ...ticketData(), owner: user._id });
        project.tickets.push(ticket);
        project = await project.save();
        ticket = project.tickets[0];
        url = genUrl(project._id, ticket._id);
    })


    describe('middlewares assigned to every route (uses GET route as sample)', () => {
        it('throws 404 error if project was not found', async () => {
            const res = await request.get(genUrl(Types.ObjectId(), ticket._id))
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Project not found');
        })

        it('throws 404 error if ticket was not found', async () => {
            const res = await request.get(genUrl(project._id, Types.ObjectId()))
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Ticket not found');
        })

    })

    describe('GET /:ticketId/comment', () => {

        beforeEach(async () => {

        })

    })

    describe('GET /:ticketId/comment/:commentId', () => {
        let comment: IComment;

        beforeEach(async () => {
            comment = new CommentModel({ message: 'newly created comment', userId: user._id });
            comment = await comment.save();
        })

        it('throws 404 error (comment not found)', async () => {
            const res = await request.get(url + comment._id);
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Comment not found');
        })

    })

    describe('POST /:ticketId/comment', () => {

        beforeEach(async () => {

        })

        it('returns status 422 (validator)', async () => {
            const res = await request
                .post(url)
                .set(authHeaderObject(user.generateToken()))
                .send({ message: 'a' });
            expect(res.status).toBe(422);
        })

        it('throws error 401 (user not authenticated)', async () => {
            const res = await request.post(url)
                .send({ message: 'new comment' });
            expect(res.status).toBe(401);
        })


        it('returns status 200 with created comment', async () => {
            const res = await request.post(url)
                .set(authHeaderObject(user.generateToken()))
                .send({ message: 'new comment' });
            expect(res.status).toBe(200);
            expect(res.body.comment.message).toBe('new comment');
        })

    })

    describe('PUT /:ticketId/comment/:commentId', () => {
        let comment: IComment;
        beforeEach(async () => {
            comment = new CommentModel({ message: 'newly created comment', userId: user._id });
            ticket.comments.push(comment);
            project = await project.save();
        })

        it('returns status 422 (validator)', async () => {
            const res = await request
                .put(url + comment._id)
                .set(authHeaderObject(user.generateToken()))
                .send({ message: 'a' });
            expect(res.status).toBe(422);
        })

        it('throws error 401 (user not authenticated)', async () => {
            const res = await request.put(url + comment._id)
                .send({ message: 'updated comment message' });
            expect(res.status).toBe(401);
        })


        it('throws error 404 (comment not found)', async () => {
            const res = await request.put(url + Types.ObjectId())
                .set(authHeaderObject(user.generateToken()))
                .send({ message: 'updated comment message' });
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Comment not found');
        })

        it('returns status 200 and updated comment', async () => {
            const res = await request.put(url + comment._id)
                .set(authHeaderObject(user.generateToken()))
                .send({ message: 'updated comment message' });
            expect(res.status).toBe(200);
            expect(res.body.updatedComment.message).toBe('updated comment message');
        })

    })

    describe('DELETE /:ticketId/comment/:commentId', () => {
        let comment: IComment;
        beforeEach(async () => {
            comment = new CommentModel({ message: 'newly created comment', userId: user._id });
            ticket.comments.push(comment);
            project = await project.save();
        })

        it('returns status 422 (validator)', async () => {
            const res = await request
                .delete(url + 'invalidID')
                .set(authHeaderObject(user.generateToken()))
            expect(res.status).toBe(422);
        })

        it('throws error 401 (user not authenticated)', async () => {
            const res = await request.delete(url + comment._id)
            expect(res.status).toBe(401);
        })


        it('throws error 404 (comment not found)', async () => {
            const res = await request.delete(url + Types.ObjectId())
                .set(authHeaderObject(user.generateToken()))
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Comment not found');
        })

        it('returns status 200 and deleted comment', async () => {
            const res = await request.delete(url + comment._id)
                .set(authHeaderObject(user.generateToken()))
            expect(res.status).toBe(200);
            expect(res.body.deletedComment.message).toBe('newly created comment');
        })

    })

})