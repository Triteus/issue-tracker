"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
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
        roles: [user_model_1.ERole.Support]
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