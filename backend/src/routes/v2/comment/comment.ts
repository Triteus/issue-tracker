import { Controller, Post, Middleware, Put, Delete, Get, ClassMiddleware, ClassOptions } from "@overnightjs/core";
import { Request, Response } from "express";
import { findProject, ResponseWithProject } from "../../../middlewares/project";
import { findTicket, ResponseWithTicket } from "../../../middlewares/ticket";
import { ResponseError, ErrorTypes } from "../../../middlewares/error";
import { CommentModel, IComment, commentSchema } from "../../../models/comment.model";
import { RequestWithUser, ERole } from "../../../models/user.model";
import { Types } from "mongoose";
import Auth from "../../../middlewares/authorization";
import passport from "passport";
import { validation } from "../../../middlewares/validation";
import { CommentValidators } from "./comment.validate";
import { CommentService } from "../../../services/comment.service";
import { ServiceInjector } from "../../../ServiceInjector";


type ResWithProjectAndTicket = ResponseWithProject & ResponseWithTicket;

const validate = validation(CommentValidators);

/** This controller is used as a child-controller for ticket-controller
 * 
 */

@Controller(':ticketId/comment')
@ClassMiddleware([
    findProject, // project needs to be fetched before every route in controller
    findTicket // ticket is needed as well
])
@ClassOptions({ mergeParams: true })
export class CommentController {

    commentService: CommentService;

    constructor(commentService?: CommentService) {
        this.commentService = commentService || ServiceInjector.getService<CommentService>('commentService');
    }

    @Get()
    private async getComments(req: Request, res: ResponseWithTicket) {

        const projectId = Types.ObjectId(req.params.projectId);
        const ticketId = Types.ObjectId(req.params.ticketId);
        const result = await this.commentService.getCommentsUpdatedAsc(projectId, ticketId, req.query);

        const comments = await CommentModel.populateComments(result);
        return res.status(200).send({ comments: CommentModel.toJSON(comments), numComments: res.locals.ticket.comments.length })
    }

    @Get(':commentId')
    private async getComment(req: Request, res: Response) {
        const ticket = res.locals.ticket;
        const commentId = req.params.commentId;
        const comment = (ticket.comments as any).id(commentId) as IComment;
        

        if (!comment) {
            throw new ResponseError('Comment not found!', ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({ comment: await CommentModel.populateComment(comment) });
    }

    @Post()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('postComment')
    ])
    private async postComment(req: RequestWithUser, res: ResWithProjectAndTicket) {
        const project = res.locals.project;
        const ticket = res.locals.ticket;
        const user = req.user;

        const comment = new CommentModel({ userId: user._id, message: req.body.message });
        ticket.comments.push(comment);
        await project.save();

        return res.status(200).send({ comment, message: 'Comment successfully created!' });
    }

    @Put(':commentId')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('putComment')
    ])
    private async putComment(req: RequestWithUser, res: ResWithProjectAndTicket) {
        const project = res.locals.project;
        const ticket = res.locals.ticket;
        const user = req.user;
        const commentId = Types.ObjectId(req.params.commentId);

        if (!commentId.equals(user._id) && !Auth.hasRoles(ERole.Admin)) {
            throw new ResponseError('No permission to change comment.', ErrorTypes.NOT_AUTHORIZED);
        }
        const comment = (ticket.comments as any).id(commentId) as IComment;

        if (!comment) {
            throw new ResponseError('Comment not found!', ErrorTypes.NOT_FOUND);
        }

        comment.message = req.body.message;
        await project.save();

        return res.status(200).send({ updatedComment: comment, message: 'Comment updated!' });
    }

    @Delete(':commentId')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('deleteComment')
    ])
    private async deleteComment(req: RequestWithUser, res: ResWithProjectAndTicket) {
        const project = res.locals.project;
        const ticket = res.locals.ticket;
        const user = req.user;
        const commentId = Types.ObjectId(req.params.commentId);

        if (!commentId.equals(user._id) && !Auth.hasRoles(ERole.Admin)) {
            throw new ResponseError('No permission to change comment.', ErrorTypes.NOT_AUTHORIZED);
        }
        const comment = (ticket.comments as any).id(commentId) as IComment;

        if (!comment) {
            throw new ResponseError('Comment not found!', ErrorTypes.NOT_FOUND);
        }

        await comment.remove();
        await project.save();

        return res.status(200).send({ message: 'Comment deleted.', deletedComment: comment })

    }

}