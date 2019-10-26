import passport from 'passport';
import LocalStrategy from 'passport-local';

import UserModel from '../models/User';



const Strategy = LocalStrategy.Strategy;

export default function initPassport() {
    passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function (email, password, cb) {
            console.log('email', email);
            return UserModel.findOne({ email: email })
            .then(user => {
                    if (!user) {
                        return cb(null, false, { message: 'Incorrect email or password.' })
                    }
                    console.log('before cb');
                    return cb(null, user, { message: 'Logged in successfully!' })
                })
                .catch(err => {
                    console.log('error thrown', err);
                    cb(err);
                });
        }
    ));
}