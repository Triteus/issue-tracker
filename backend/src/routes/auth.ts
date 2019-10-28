import UserModel from '../models/User';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Controller, Middleware, Post } from '@overnightjs/core';
import config from '../../config.json';
import User, { IUser } from '../models/User';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { validateEmail } from '../validators/email';
import { validatePW } from '../validators/password';

@Controller('api/auth')
export class AuthController {

    @Post('register')
    @Middleware([validateEmail, validatePW])
    private async register(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // hash password
        const hashedPW = await UserModel.hashPassword(password);

        // create new user
        let user: IUser;
        try {
            user = await User.create({ email, password: hashedPW });
        } catch (err) {
            res.send(err);
        }
        res.send({
            user: { email: user.email, roles: user.roles },
            message: 'User created successfully!'
        });
    }

    @Post('login')
    @Middleware([
        body('email').trim().normalizeEmail(),
        body('password').trim()
    ])
    private async login(req: Request, res: Response) {
        passport.authenticate('local', { session: false },
            (err, user: IUser, info: string) => {
                if (err || !user) {
                    return res.status(400).json({
                        message: info,
                        user: user,
                        err
                    });
                }
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }
                });

                const userJSON = { _id: user.id, email: user.email, roles: user.roles };
                // generate web token
                const token = jwt.sign(userJSON, config.secretKey);
                return res.json({ user: userJSON, token });
            }
        )(req, res);
    }
}