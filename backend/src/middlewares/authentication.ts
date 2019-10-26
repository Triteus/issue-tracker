import passport from 'passport';
import passportJWT from 'passport-jwt';
import config from '../../config.json';
import UserModel from '../models/User';


const {Strategy, ExtractJwt} = passportJWT;

passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
},
function (jwtPayload, cb) {
    return UserModel.findOne({_id: jwtPayload.id})
    .then(user => {
        return cb(null, user);
    })
    .catch(err => {
        return cb(err);
    })
}
));