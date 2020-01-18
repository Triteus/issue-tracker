"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// no ts-definition
require('mongoose-type-email');
const config_1 = __importDefault(require("config"));
var ERole;
(function (ERole) {
    ERole["Admin"] = "admin";
    ERole["Support"] = "support";
    ERole["Visitor"] = "visitor";
})(ERole = exports.ERole || (exports.ERole = {}));
exports.userSchema = new mongoose_1.default.Schema({
    email: {
        type: mongoose_1.default.SchemaTypes.Email,
        required: true,
        unique: true
    },
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    roles: {
        type: [String],
        default: [],
        enum: Object.keys(ERole).map(k => ERole[k])
    }
}, {
    toJSON: { virtuals: true, versionKey: false, transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        } },
    toObject: { virtuals: true },
    timestamps: true
});
exports.userSchema.methods.comparePassword = function (pw) {
    return bcrypt_1.default.compare(pw, this.password);
};
exports.userSchema.methods.generateToken = function () {
    const userJSON = { id: this.id, email: this.email, roles: this.roles, username: this.username };
    // generate web token
    return jsonwebtoken_1.default.sign(userJSON, config_1.default.get('secretKey'));
};
exports.userSchema.statics.hashPassword = async function (plainPW) {
    // hash password
    const saltRounds = 10;
    const salt = await bcrypt_1.default.genSalt(saltRounds);
    return bcrypt_1.default.hash(plainPW, salt);
};
// instead of 'save'-hook, we use validate hook to be able to unit test
exports.userSchema.pre('validate', async function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        user.password = await bcrypt_1.default.hash(user.password, salt);
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.userSchema.virtual("username").get(function () {
    return this.firstName + " " + this.lastName;
});
exports.default = mongoose_1.default.model('User', exports.userSchema);
//# sourceMappingURL=User.js.map