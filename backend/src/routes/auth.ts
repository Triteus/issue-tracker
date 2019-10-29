import UserModel from '../models/User';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Controller, Middleware, Post, Put } from '@overnightjs/core';
import config from '../../config.json';
import User, { IUser } from '../models/User';
import { Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import { validateEmail } from '../validators/email';
import { validatePW } from '../validators/password';
import Authorize from '../middlewares/authorization';


@Controller('api/auth')
export class AuthController {

    @Post('register')
    @Middleware([
        validateEmail, 
        validatePW,
        body('firstName').exists().withMessage('First name is missing').trim(),
        body('lastName').exists().withMessage('Last name is missing').trim()
    ])
    private async register(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email, password, firstName, lastName } = req.body;
        // hash password
        const hashedPW = await UserModel.hashPassword(password);
        // create new user
        let user: IUser;
        try {
            user = await User.create({ email, password: hashedPW, firstName, lastName });
        } catch (err) {
            res.send(err);
        }

        const {password: pw, ...payload} = user;

        res.status(201).send({
            user: payload,
            message: 'User created successfully!'
        });
    }

    @Post('login')
    @Middleware([
        body('email').isEmail()
        .withMessage('Invalid e-mail')
        .trim().normalizeEmail(),
        body('password').exists()
        .withMessage('Missing password')
        .trim()
    ])
    private async login(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

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
                        res.send(err);
                    }
                });

                const userJSON = { _id: user.id, email: user.email, roles: user.roles, username: user.username };
                // generate web token
                const token = jwt.sign(userJSON, config.secretKey);
                return res.json({ user: userJSON, token });
            }
        )(req, res);
    }

    @Put('password/:id')
    @Middleware([
        passport.authenticate('jwt', {session: false}),
        Authorize.isAccOwner(),
        param('id').exists(),
        body('oldPW').exists().trim(),
        body('newPW').exists().trim(),
        body('newPWConfirm').exists().trim().custom((pwConfirm, {req}) => {
            if(req.body.newPW !== pwConfirm) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
    ])
    private async changePassword(req: Request & {user: IUser}, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
        const {oldPW, newPW} = req.body;
        const user = await UserModel.findById(req.params.id).select('+password');
      
        if(!user) {
            return res.status(404).send({message: 'User not found!'});
        }
        if(!user.comparePassword(oldPW)) {
            return res.status(400).send({message: 'Invalid old password!'});
        }

        user.password = await UserModel.hashPassword(newPW);
        await user.save();
        
        return res.status(200).send({message: 'Password successfully changed!', user});
    }
}