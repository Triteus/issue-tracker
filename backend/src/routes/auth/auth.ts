import UserModel, { RequestWithUser } from '../../models/User';
import passport from 'passport';
import { Controller, Middleware, Post, Put } from '@overnightjs/core';
import User, { IUser } from '../../models/User';
import { Request, Response, NextFunction } from 'express';
import Authorize from '../../middlewares/authorization';
import { AuthValidators } from './auth.validate';
import { ErrorTypes, ResponseError } from '../../middlewares/error';
import { validation } from '../../middlewares/validation';


const validate = validation(AuthValidators);

@Controller('api/auth')
export class AuthController {

    @Post('register')
    @Middleware([
        ...validate('register')
    ])
    private async register(req: Request, res: Response, next: NextFunction) {

        const { email, password, firstName, lastName } = req.body;
        // create new user
        let user: IUser;
        user = await User.create({ email, password, firstName, lastName });

        const { password: pw, ...payload } = user.toJSON();

        res.status(201).send({
            user: payload,
            message: 'User created successfully!'
        });
    }

    @Post('login')
    @Middleware([
        ...validate('login')
    ])
    private async login(req: Request, res: Response) {
        passport.authenticate('local', { session: false },
            (err, user: IUser, info: any) => {
                if (err || !user) {
                    return res.status(403).json({
                        ...info,
                        user: user,
                        err
                    });
                }
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        throw err;
                    }
                });
                const userJSON = { _id: user.id, email: user.email, roles: user.roles, username: user.username };
                return res.json({ user: userJSON, token: user.generateToken() });
            }
        )(req, res);
    }

    @Put('password/:id')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        Authorize.isAccOwner(),
        ...validate('changePassword')
    ])
    private async changePassword(req: RequestWithUser, res: Response) {

        const { oldPW, newPW } = req.body;
        const user = await UserModel.findById(req.params.id).select('+password');

        if (!user) {
            throw new ResponseError('User not found!', ErrorTypes.NOT_FOUND);
        }
        if (!await user.comparePassword(oldPW)) {
            throw new ResponseError('Invalid old password!', ErrorTypes.BAD_REQUEST);
        }

        user.password = newPW;
        await user.save();

        return res.status(200).send({ message: 'Password successfully changed!', user });
    }

    //TODO: Add route to change role
}