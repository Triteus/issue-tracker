import { Controller, Get, Middleware, Delete, Patch, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import passport = require('passport');
import UserModel, { IUser, ERole, RequestWithUser } from '../../models/User';

import Authorize from '../../middlewares/authorization';
import { validationResult } from 'express-validator';
import { UserValidators } from './user.validate';
import { ResponseError, ErrorTypes } from '../../middlewares/error';
import { validation } from '../../middlewares/validation';

const validate = validation(UserValidators);

@Controller('api/user')
export class UserController {
    @Get('')

    private async getUsers(req: Request, res: Response) {
        const users = await UserModel.find();
        res.status(200).send(users);
    }

    @Get(':id')
    @Middleware([
        passport.authenticate('jwt', {session: false}),
    ])
    private async getUser(req: Request, res: Response) {
        
        const user = await UserModel.findOne({_id: req.params.id});
        if(!user) {
            throw new ResponseError('User not found', ErrorTypes.NOT_FOUND);
        }
        res.status(200).send(user);
    }

    @Delete(':id')
    @Middleware([
        passport.authenticate('jwt', {session: false}),
        Authorize.hasRoles(ERole.Admin)
    ])
    private async deleteUser(req: RequestWithUser, res: Response) {
        const user = await UserModel.findOneAndDelete({_id: req.params.id});
        if(!user) {
            throw new ResponseError('User not found', ErrorTypes.NOT_FOUND);
        }
        res.status(200).send({
            message: 'User successfully deleted!',
            deletedUser: user
    })
    }

    /** route to change email, username, ... 
     * changing pw and roles is not handled separately in auth-controller
    */
    @Patch(':id')
    @Middleware([
        passport.authenticate('jwt', {session: false}),
        Authorize.isAccOwner(),
        ...validate('change')
    ])
    private async changeUser(req: RequestWithUser, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        const userPayload = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, userPayload, {new: true});

        if(!updatedUser) {
            throw new ResponseError('Cannot alter user: User not found', ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({updatedUser, message: 'User successfully updated!'});
    }
}


