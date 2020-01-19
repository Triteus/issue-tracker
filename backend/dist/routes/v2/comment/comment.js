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
const project_1 = require("../../../middlewares/project");
const ticket_1 = require("../../../middlewares/ticket");
const error_1 = require("../../../middlewares/error");
const Comment_1 = require("../../../models/Comment");
const User_1 = require("../../../models/User");
const mongoose_1 = require("mongoose");
const authorization_1 = __importDefault(require("../../../middlewares/authorization"));
const passport_1 = __importDefault(require("passport"));
const validation_1 = require("../../../middlewares/validation");
const comment_validate_1 = require("./comment.validate");
const comment_service_1 = require("../../../services/comment.service");
const validate = validation_1.validation(comment_validate_1.CommentValidators);
/** This controller is used as a child-controller for ticket-controller
 *
 */
let CommentController = class CommentController {
    constructor() {
        this.commentService = new comment_service_1.CommentService();
    }
    async getComments(req, res) {
        const projectId = mongoose_1.Types.ObjectId(req.params.projectId);
        const ticketId = mongoose_1.Types.ObjectId(req.params.ticketId);
        const result = await this.commentService.getCommentsUpdatedAsc(projectId, ticketId, req.query);
        const comments = await Comment_1.CommentModel.populateComments(result);
        return res.status(200).send({ comments: Comment_1.CommentModel.toJSON(comments), numComments: res.locals.ticket.comments.length });
    }
    async getComment(req, res) {
        const ticket = res.locals.ticket;
        const commentId = req.params.commentId;
        const comment = ticket.comments.id(commentId);
        if (!comment) {
            throw new error_1.ResponseError('Comment not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({ comment: await Comment_1.CommentModel.populateComment(comment) });
    }
    async postComment(req, res) {
        const project = res.locals.project;
        const ticket = res.locals.ticket;
        const user = req.user;
        const comment = new Comment_1.CommentModel({ userId: user._id, message: req.body.message });
        ticket.comments.push(comment);
        await project.save();
        return res.status(200).send({ comment, message: 'Comment successfully created!' });
    }
    async putComment(req, res) {
        const project = res.locals.project;
        const ticket = res.locals.ticket;
        const user = req.user;
        const commentId = mongoose_1.Types.ObjectId(req.params.commentId);
        if (!commentId.equals(user._id) && !authorization_1.default.hasRoles(User_1.ERole.Admin)) {
            throw new error_1.ResponseError('No permission to change comment.', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        const comment = ticket.comments.id(commentId);
        if (!comment) {
            throw new error_1.ResponseError('Comment not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        comment.message = req.body.message;
        await project.save();
        return res.status(200).send({ updatedComment: comment, message: 'Comment updated!' });
    }
    async deleteComment(req, res) {
        const project = res.locals.project;
        const ticket = res.locals.ticket;
        const user = req.user;
        const commentId = mongoose_1.Types.ObjectId(req.params.commentId);
        if (!commentId.equals(user._id) && !authorization_1.default.hasRoles(User_1.ERole.Admin)) {
            throw new error_1.ResponseError('No permission to change comment.', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        const comment = ticket.comments.id(commentId);
        if (!comment) {
            throw new error_1.ResponseError('Comment not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        await comment.remove();
        await project.save();
        return res.status(200).send({ message: 'Comment deleted.', deletedComment: comment });
    }
};
__decorate([
    core_1.Get()
], CommentController.prototype, "getComments", null);
__decorate([
    core_1.Get(':commentId')
], CommentController.prototype, "getComment", null);
__decorate([
    core_1.Post(),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('postComment')
    ])
], CommentController.prototype, "postComment", null);
__decorate([
    core_1.Put(':commentId'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('putComment')
    ])
], CommentController.prototype, "putComment", null);
__decorate([
    core_1.Delete(':commentId'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('deleteComment')
    ])
], CommentController.prototype, "deleteComment", null);
CommentController = __decorate([
    core_1.Controller(':ticketId/comment'),
    core_1.ClassMiddleware([
        project_1.findProject,
        ticket_1.findTicket // ticket is needed as well
    ]),
    core_1.ClassOptions({ mergeParams: true })
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.js.map