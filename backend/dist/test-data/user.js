"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
function ownerData() {
    return {
        firstName: 'Joe',
        lastName: 'Mama',
        email: 'owner@mail.com',
        password: 'password'
    };
}
exports.ownerData = ownerData;
function editorData() {
    return {
        firstName: 'Editor',
        lastName: 'Rian',
        email: 'editor@mail.com',
        password: 'password',
        roles: [User_1.ERole.Support]
    };
}
exports.editorData = editorData;
function randomUserData() {
    return {
        firstName: 'Random',
        lastName: 'User',
        email: 'randomuser@mail.com',
        password: 'password'
    };
}
exports.randomUserData = randomUserData;
//# sourceMappingURL=user.js.map