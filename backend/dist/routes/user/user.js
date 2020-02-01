"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const passport = require("passport");
const user_model_1 = __importStar(require("../../models/user.model"));
const authorization_1 = __importDefault(require("../../middlewares/authorization"));
const express_validator_1 = require("express-validator");
const user_validate_1 = require("./user.validate");
const error_1 = require("../../middlewares/error");
const validation_1 = require("../../middlewares/validation");
const validate = validation_1.validation(user_validate_1.UserValidators);
let UserController = class UserController {
    async getUsers(req, res) {
        const users = await user_model_1.default.find();
        res.status(200).send(users);
    }
    async getUser(req, res) {
        const user = await user_model_1.default.findOne({ _id: req.params.id });
        if (!user) {
            throw new error_1.ResponseError('User not found', error_1.ErrorTypes.NOT_FOUND);
        }
        res.status(200).send(user);
    }
    async deleteUser(req, res) {
        const user = await user_model_1.default.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            throw new error_1.ResponseError('User not found', error_1.ErrorTypes.NOT_FOUND);
        }
        res.status(200).send({
            message: 'User successfully deleted!',
            deletedUser: user
        });
    }
    /** route to change email, username, ...
     * changing pw and roles is not handled separately in auth-controller
    */
    async changeUser(req, res) {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const userId = req.params.id;
        const userPayload = req.body;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new error_1.ResponseError('Cannot alter user: User not found', error_1.ErrorTypes.NOT_FOUND);
        }
        user.set(userPayload);
        const updatedUser = await user.save();
        return res.status(200).send({ updatedUser, message: 'User successfully updated!' });
    }
};
__decorate([
    core_1.Get('')
], UserController.prototype, "getUsers", null);
__decorate([
    core_1.Get(':id'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
], UserController.prototype, "getUser", null);
__decorate([
    core_1.Delete(':id'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        authorization_1.default.hasRoles(user_model_1.ERole.Admin)
    ])
], UserController.prototype, "deleteUser", null);
__decorate([
    core_1.Patch(':id'),
    core_1.Middleware([
        passport.authenticate('jwt', { session: false }),
        authorization_1.default.isAccOwner(),
        ...validate('change')
    ])
], UserController.prototype, "changeUser", null);
UserController = __decorate([
    core_1.Controller('api/user')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.js.map