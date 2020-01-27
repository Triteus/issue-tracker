import UserModel, { RequestWithUser } from '../../models/user.model';
import passport from 'passport';
import { Controller, Middleware, Post, Put, Get } from '@overnightjs/core';
import User, { IUser } from '../../models/user.model';
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
                return res.json({ token: user.generateToken() });
            }
        )(req, res);
    }

    @Get('token')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('getToken')
    ])
    private async getToken(req: RequestWithUser, res: Response) {
        const user = req.user;
        return res.json({token: user.generateToken()});
    }

    @Put('password')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('changePassword')
    ])
    private async changePassword(req: RequestWithUser, res: Response) {

        const { oldPW, newPW } = req.body;
        const user = await UserModel.findById(req.user._id).select('+password');

        if (!user) {
            throw new ResponseError('User not found!', ErrorTypes.NOT_FOUND);
        }
        if (!await user.comparePassword(oldPW)) {
            throw new ResponseError('Invalid old password!', ErrorTypes.BAD_REQUEST);
        }

        user.password = newPW;
        const updatedUser = await user.save();

        return res.status(200).send({ message: 'Password successfully changed!', user: updatedUser });
    }

    //TODO: Add route to change role
}