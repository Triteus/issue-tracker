"use strict";
// taken from https://zellwk.com/blog/jest-and-mongoose/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.Promise = global.Promise;
async function removeAllCollections() {
    const collections = Object.keys(mongoose_1.default.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose_1.default.connection.collections[collectionName];
        await collection.deleteMany({});
    }
}
async function dropAllCollections() {
    const collections = Object.keys(mongoose_1.default.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose_1.default.connection.collections[collectionName];
        try {
            await collection.drop();
        }
        catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === 'ns not found')
                return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes('a background operation is currently running'))
                return;
            console.log(error.message);
        }
    }
}
function setupDB(databaseName) {
    // Connect to Mongoose
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/${databaseName}`;
        await mongoose_1.default.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });
    // Cleans up database between each test
    afterEach(async () => {
        await removeAllCollections();
    });
    // Disconnect Mongoose
    afterAll(async () => {
        await dropAllCollections();
        await mongoose_1.default.connection.close();
    });
}
exports.setupDB = setupDB;
//# sourceMappingURL=testSetup.js.map