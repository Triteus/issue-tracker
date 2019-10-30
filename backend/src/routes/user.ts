import { Controller, Get, Middleware, Delete, Patch, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import passport = require('passport');
import UserModel, { IUser, ERole } from '../models/User';

import Authorize from '../middlewares/authorization';
import { validationResult, body } from 'express-validator';
import { validateEmail, validateEmailOptional } from '../validators/email';
import { UserValidation } from './user.validate';
import { validate } from '../validators/validate';

@Controller('api/user')
export class UserController {
    @Get('')

    private async getUsers(req: Request, res: Response) {
        const users = await UserModel.find();
        // do not send hashed pw!
        res.status(200).send(users);
    }

    @Get(':id')
    @Middleware(passport.authenticate('jwt', {session: false}))
    private async getUser(req: Request, res: Response) {
        const user = await UserModel.findOne({_id: req.params.id});
        if(!user) {
            return res.status(404).send({message: 'User not found!'});
        }
        res.status(200).send(user);
    }

    @Delete(':id')
    @Middleware([
        passport.authenticate('jwt', {session: false}),
        Authorize.hasRoles(ERole.Admin)
    ])
    private async deleteUser(req: Request & {user: IUser}, res: Response) {
        const user = await UserModel.findOneAndDelete({_id: req.params.id});
        if(!user) {
            return res.status(404).send({message: 'User not found!'});
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
        UserValidation.change,
        validate
    ])
    private async changeUser(req: Request & {user: IUser}, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        const userPayload = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, userPayload, {new: true});

        if(!updatedUser) {
            return res.status(404).send({message: "Cannot alter user: User not found."});
        }
        return res.status(200).send({updatedUser, message: 'User successfully updated!'});
    }
}


