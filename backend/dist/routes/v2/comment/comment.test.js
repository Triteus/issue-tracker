"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testSetup_1 = require("../../../startup/testSetup");
const TestServer_1 = require("../../../TestServer");
const ticket_model_1 = __importDefault(require("../../../models/ticket.model"));
const project_model_1 = require("../../../models/project.model");
const project_1 = require("../../../test-data/project");
const user_1 = require("../../../test-data/user");
const ticket_1 = require("../../../test-data/ticket");
const test_util_1 = require("../../../util/test-util");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const comment_model_1 = require("../../../models/comment.model");
const mongoose_1 = require("mongoose");
const project_2 = require("../project/project");
const project_service_1 = require("../../../services/project.service");
const comment_service_1 = require("../../../services/comment.service");
const ticket_service_1 = require("../../../services/ticket.service");
/**
 * all given routes are assumed to be accessed like this: /project/:projectId/ticket/:ticketId/comment/
 */
describe('CommentController (child-controller)', () => {
    let projectController;
    let request;
    testSetup_1.setupDB('test-comment-controller');
    beforeAll(async (done) => {
        const testServer = new TestServer_1.TestServer();
        // set services for child-controllers
        testServer.setServicesForChildControllers({
            'commentService': new comment_service_1.CommentService(),
            'ticketService': new ticket_service_1.TicketService()
        });
        projectController = new project_2.ProjectController(new project_service_1.ProjectService());
        testServer.setControllers(projectController);
        request = supertest_1.default(testServer.getExpressInstance());
        done();
    });
    let user;
    let ticket;
    let project;
    const baseUrl = "/api/v2";
    let url = '';
    function genUrl(projectId, ticketId) {
        return url = `${baseUrl}/project/${projectId}/ticket/${ticketId}/comment/`;
    }
    beforeEach(async () => {
        user = new user_model_1.default(user_1.ownerData());
        user = await user.save();
        project = new project_model_1.ProjectModel(project_1.projectData());
        ticket = new ticket_model_1.default({ ...ticket_1.ticketData(), owner: user._id });
        project.tickets.push(ticket);
        project = await project.save();
        ticket = project.tickets[0];
        url = genUrl(project._id, ticket._id);
    });
    describe('middlewares assigned to every route (uses GET route as sample)', () => {
        it('throws 404 error if project was not found', async () => {
            const res = await request.get(genUrl(mongoose_1.Types.ObjectId(), ticket._id));
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Project not found');
        });
        it('throws 404 error if ticket was not found', async () => {
            const res = await request.get(genUrl(project._id, mongoose_1.Types.ObjectId()));
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Ticket not found');
        });
    });
    describe('GET /:ticketId/comment', () => {
        beforeEach(async () => {
        });
    });
    describe('GET /:ticketId/comment/:commentId', () => {
        let comment;
        beforeEach(async () => {
            comment = new comment_model_1.CommentModel({ message: 'newly created comment', userId: user._id });
            comment = await comment.save();
        });
        it('throws 404 error (comment not found)', async () => {
            const res = await request.get(url + comment._id);
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Comment not found');
        });
    });
    describe('POST /:ticketId/comment', () => {
        beforeEach(async () => {
        });
        it('returns status 422 (validator)', async () => {
            const res = await request
                .post(url)
                .set(test_util_1.authHeaderObject(user.generateToken()))
                .send({ message: 'a' });
            expect(res.status).toBe(422);
        });
        it('throws error 401 (user not authenticated)', async () => {
            const res = await request.post(url)
                .send({ message: 'new comment' });
            expect(res.status).toBe(401);
        });
        it('returns status 200 with created comment', async () => {
            const res = await request.post(url)
                .set(test_util_1.authHeaderObject(user.generateToken()))
                .send({ message: 'new comment' });
            expect(res.status).toBe(200);
            expect(res.body.comment.message).toBe('new comment');
        });
    });
    describe('PUT /:ticketId/comment/:commentId', () => {
        let comment;
        beforeEach(async () => {
            comment = new comment_model_1.CommentModel({ message: 'newly created comment', userId: user._id });
            ticket.comments.push(comment);
            project = await project.save();
        });
        it('returns status 422 (validator)', async () => {
            const res = await request
                .put(url + comment._id)
                .set(test_util_1.authHeaderObject(user.generateToken()))
                .send({ message: 'a' });
            expect(res.status).toBe(422);
        });
        it('throws error 401 (user not authenticated)', async () => {
            const res = await request.put(url + comment._id)
                .send({ message: 'updated comment message' });
            expect(res.status).toBe(401);
        });
        it('throws error 404 (comment not found)', async () => {
            const res = await request.put(url + mongoose_1.Types.ObjectId())
                .set(test_util_1.authHeaderObject(user.generateToken()))
                .send({ message: 'updated comment message' });
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Comment not found');
        });
        it('returns status 200 and updated comment', async () => {
            const res = await request.put(url + comment._id)
                .set(test_util_1.authHeaderObject(user.generateToken()))
                .send({ message: 'updated comment message' });
            expect(res.status).toBe(200);
            expect(res.body.updatedComment.message).toBe('updated comment message');
        });
    });
    describe('DELETE /:ticketId/comment/:commentId', () => {
        let comment;
        beforeEach(async () => {
            comment = new comment_model_1.CommentModel({ message: 'newly created comment', userId: user._id });
            ticket.comments.push(comment);
            project = await project.save();
        });
        it('returns status 422 (validator)', async () => {
            const res = await request
                .delete(url + 'invalidID')
                .set(test_util_1.authHeaderObject(user.generateToken()));
            expect(res.status).toBe(422);
        });
        it('throws error 401 (user not authenticated)', async () => {
            const res = await request.delete(url + comment._id);
            expect(res.status).toBe(401);
        });
        it('throws error 404 (comment not found)', async () => {
            const res = await request.delete(url + mongoose_1.Types.ObjectId())
                .set(test_util_1.authHeaderObject(user.generateToken()));
            expect(res.status).toBe(404);
            expect(res.body.error).toContain('Comment not found');
        });
        it('returns status 200 and deleted comment', async () => {
            const res = await request.delete(url + comment._id)
                .set(test_util_1.authHeaderObject(user.generateToken()));
            expect(res.status).toBe(200);
            expect(res.body.deletedComment.message).toBe('newly created comment');
        });
    });
});
//# sourceMappingURL=comment.test.js.map