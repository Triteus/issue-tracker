import passport from 'passport';
import LocalStrategy from 'passport-local';

import UserModel from '../models/user.model';
import passportJWT from 'passport-jwt';
import config from "config";
import { JwtPayload } from '../models/jwtPayload.model';


export default function initPassport() {
    const Strategy = LocalStrategy.Strategy;
    passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        async function (email, password, cb) {
            try {
                const user = await UserModel.findOne({ email }).select('+password');
                if (!user || !await user.comparePassword(password)) {
                    return cb(null, false, { message: 'Incorrect email or password' });
                }
                return cb(null, user, { message: 'Logged in successfully!' });
            }
            catch (err) {
                cb(err);
            }
        }
    ));

    const { Strategy: JWTStrategy, ExtractJwt } = passportJWT;
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get('secretKey')
    },
        function (jwtPayload: JwtPayload, cb) {
            return UserModel.findOne({ _id: jwtPayload.id })
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                })
        }
    ));
}