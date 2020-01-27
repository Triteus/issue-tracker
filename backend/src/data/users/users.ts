
import User, {IUserDocument, userSchema} from "../../models/user.model";
import faker from 'faker';
import bcrypt from 'bcrypt';
import { ObjectId } from "bson";

let users: Partial<IUserDocument>[] = [];

for(let i = 0; i < 100; i++) {
    users.push({
        _id: new ObjectId(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: bcrypt.hashSync(faker.internet.password(), 10),
        createdAt: faker.date.recent(1),
        updatedAt: faker.date.recent(3),
        roles: [],
        __v: 0
    })
}

export = users;