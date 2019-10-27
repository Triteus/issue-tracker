import { Controller, Get, Middleware, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import passport = require('passport');
import UserModel, { IUser } from '../models/User';


@Controller('api/user')
export class UserController {
    @Get('')
    @Middleware(passport.authenticate('jwt', {session: false}))
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

    /** TODO: Add authorization: admin, owner*/
    @Delete(':id')
    @Middleware(passport.authenticate('jwt', {session: false}))
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
}


