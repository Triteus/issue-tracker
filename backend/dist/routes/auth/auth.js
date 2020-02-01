"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../models/user.model"));
const passport_1 = __importDefault(require("passport"));
const core_1 = require("@overnightjs/core");
const user_model_2 = __importDefault(require("../../models/user.model"));
const auth_validate_1 = require("./auth.validate");
const error_1 = require("../../middlewares/error");
const validation_1 = require("../../middlewares/validation");
const validate = validation_1.validation(auth_validate_1.AuthValidators);
let AuthController = class AuthController {
    async register(req, res, next) {
        const { email, password, firstName, lastName } = req.body;
        // create new user
        let user;
        user = await user_model_2.default.create({ email, password, firstName, lastName });
        const { password: pw, ...payload } = user.toJSON();
        res.status(201).send({
            user: payload,
            message: 'User created successfully!'
        });
    }
    async login(req, res) {
        passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(403).json({
                    ...info,
                    user: user,
                    err
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    throw err;
                }
            });
            return res.json({ token: user.generateToken() });
        })(req, res);
    }
    async getToken(req, res) {
        const user = req.user;
        return res.json({ token: user.generateToken() });
    }
    async changePassword(req, res) {
        const { oldPW, newPW } = req.body;
        const user = await user_model_1.default.findById(req.user._id).select('+password');
        if (!user) {
            throw new error_1.ResponseError('User not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        if (!await user.comparePassword(oldPW)) {
            throw new error_1.ResponseError('Invalid old password!', error_1.ErrorTypes.BAD_REQUEST);
        }
        user.password = newPW;
        const updatedUser = await user.save();
        return res.status(200).send({ message: 'Password successfully changed!', user: updatedUser });
    }
};
__decorate([
    core_1.Post('register'),
    core_1.Middleware([
        ...validate('register')
    ])
], AuthController.prototype, "register", null);
__decorate([
    core_1.Post('login'),
    core_1.Middleware([
        ...validate('login')
    ])
], AuthController.prototype, "login", null);
__decorate([
    core_1.Get('token'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('getToken')
    ])
], AuthController.prototype, "getToken", null);
__decorate([
    core_1.Put('password'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('changePassword')
    ])
], AuthController.prototype, "changePassword", null);
AuthController = __decorate([
    core_1.Controller('api/auth')
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.js.map