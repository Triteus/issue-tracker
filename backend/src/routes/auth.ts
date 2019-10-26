import UserModel from '../models/User';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import config from '../../config.json';
import { IUser } from '../models/User';
import { Request, Response } from 'express';
import { check, body, validationResult } from 'express-validator';

@Controller('api/auth')
export class AuthController {

    @Post('register')
    @Middleware([
        body('email')
            .trim()
            .isEmail().withMessage('Invalid e-mail')
            .bail()
            .normalizeEmail()
            .custom(val => {
                return UserModel.findOne({ email: val })
                    .then(user => {
                        if (user) {
                            return Promise.reject('E-mail already in use');
                        }
                    });
            }),
        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage('Password must at least be 6 characters long')
    ])
    private async register(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user = new UserModel({ ...req.body });
        try {
            await user.save();
        } catch (err) {
            res.send(err);
        }
        res.send({ user, message: 'User created successfully!' });
    }

    @Post('login')
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