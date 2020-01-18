"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const User_1 = __importDefault(require("../models/User"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const config_1 = __importDefault(require("config"));
function initPassport() {
    const Strategy = passport_local_1.default.Strategy;
    passport_1.default.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async function (email, password, cb) {
        try {
            const user = await User_1.default.findOne({ email }).select('+password');
            if (!user || !await user.comparePassword(password)) {
                return cb(null, false, { message: 'Incorrect email or password' });
            }
            return cb(null, user, { message: 'Logged in successfully!' });
        }
        catch (err) {
            cb(err);
        }
    }));
    const { Strategy: JWTStrategy, ExtractJwt } = passport_jwt_1.default;
    passport_1.default.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config_1.default.get('secretKey')
    }, function (jwtPayload, cb) {
        return User_1.default.findOne({ _id: jwtPayload.id })
            .then(user => {
            return cb(null, user);
        })
            .catch(err => {
            return cb(err);
        });
    }));
}
exports.default = initPassport;
//# sourceMappingURL=passport.js.map