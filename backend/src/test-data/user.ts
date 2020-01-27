import { ERole } from "../models/user.model"

export function ownerData() {
    return {
        firstName: 'Joe',
        lastName: 'Mama',
        email: 'owner@mail.com',
        password: 'password'
    }
}

export function editorData() {
    return {
        firstName: 'Editor',
        lastName: 'Rian',
        email: 'editor@mail.com',
        password: 'password',
        roles: [ERole.Support]
    }
}

export function randomUserData() {
    return {
        firstName: 'Random',
        lastName: 'User',
        email: 'randomuser@mail.com',
        password: 'password'
    }
}