import { FileController } from "./file";
import { SuperTest, Test } from "supertest";
import { setupDB } from "../../startup/testSetup";
import { TestServer } from "../../TestServer";
import supertest = require("supertest");
import { Request, Response, NextFunction} from "express";
import UserModel, { IUser } from "../../models/user.model";
import { ownerData } from "../../test-data/user";
import fs from 'fs';

describe('UploadController', () => {

    const uploadController = new FileController();
    let request: SuperTest<Test>;

    setupDB('test-upload-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(uploadController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    describe('POST /api/file', () => {
        const url = '/api/file';

        let user: IUser;
        let token: string;
       
        beforeEach(async () => {
            user = await UserModel.create(ownerData());
            token = user.generateToken();
        })

        it('returns status 401 (not authenticated)', async () => {
            const res = await request.post(url).send({});
            expect(res.status).toBe(401);
        })
        
        it('returns status 400 (no files sent)', async () => {
            const res = await request.post(url).send({})
            .set({Authorization: 'Bearer ' + token});
            expect(res.status).toBe(400);
        })

        it('returns status 201', async () => {
            // TODO: figure out how to properly mock multer
        })

    })

    describe('GET /api/file', () => {
        const url = '/api/file';

        let user: IUser;
        let token: string;
       
        beforeEach(async () => {
            user = await UserModel.create(ownerData());
            token = user.generateToken();
        })

        it('returns 401 (not authenticated)', async () => {
            const res = await request.get(url + '/abc.png');
            expect(res.status).toBe(401);
        })

        it('returns 404 (file not found)', async () => {
            const res = await request.get(url + '/unknown-file.pdf')
            .set({Authorization: 'Bearer ' + token});
            expect(res.status).toBe(404);
        })

    })

})