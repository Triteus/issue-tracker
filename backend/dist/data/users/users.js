"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const faker_1 = __importDefault(require("faker"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const bson_1 = require("bson");
let users = [];
for (let i = 0; i < 100; i++) {
    users.push({
        _id: new bson_1.ObjectId(),
        email: faker_1.default.internet.email(),
        firstName: faker_1.default.name.firstName(),
        lastName: faker_1.default.name.lastName(),
        password: bcrypt_1.default.hashSync(faker_1.default.internet.password(), 10),
        createdAt: faker_1.default.date.recent(1),
        updatedAt: faker_1.default.date.recent(3),
        roles: [],
        __v: 0
    });
}
module.exports = users;
//# sourceMappingURL=users.js.map