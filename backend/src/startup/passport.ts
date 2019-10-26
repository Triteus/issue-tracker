import passport from 'passport';
import LocalStrategy from 'passport-local';

import UserModel from '../models/User';
import bcrypt from 'bcrypt';

const Strategy = LocalStrategy.Strategy;

export default function initPassport() {
    passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        async function (email, password, cb) {
            try {
                const user = await UserModel.findOne({ email });
                if(!user || !await bcrypt.compare(password, user.password)) {
                    return cb(null, false, { message: 'Incorrect email or password.' });
                }
                return cb(null, user, { message: 'Logged in successfully!' });
            }
            catch (err) {
                cb(err);
            }
        }
    ));
}