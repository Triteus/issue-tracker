import express from 'express';
import UserModel from '../models/User';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../../config.json';
import {IUser} from '../models/User';

const router = express.Router();


router.post('/register', async (req, res, next) => {

    const user = new UserModel({...req.body});
    try {
        await user.save();
    } catch(err) {
        // TODO: handle error when user with same email already exists
        res.send(err);
    }
    res.send({user, message: 'User created successfully!'});
})


router.post('/login', async (req, res, next) => {
    passport.authenticate('local', { session: false },
        (err, user: IUser, info) => {
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

            const userJSON = {_id: user.id, email: user.email, roles: user.roles};
            // generate web token
            const token = jwt.sign(userJSON, config.secretKey);
            return res.json({ user: userJSON, token });
        }
    )(req, res);
});

export default router;