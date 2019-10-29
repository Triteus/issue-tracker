import passport from 'passport';
import LocalStrategy from 'passport-local';

import UserModel from '../models/User';
import passportJWT from 'passport-jwt';
import config from '../../config.json';


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
        secretOrKey: config.secretKey
    },
        function (jwtPayload, cb) {
            return UserModel.findOne({ _id: jwtPayload._id })
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                })
        }
    ));
}