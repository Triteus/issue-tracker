import UserModel from '../models/User';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Controller, Middleware, Post } from '@overnightjs/core';
import config from '../../config.json';
import User, { IUser } from '../models/User';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

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

        const { email, password } = req.body;

        // hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPW = await bcrypt.hash(password, salt);

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