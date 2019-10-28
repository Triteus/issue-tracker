import { TestServer } from '../TestServer'
import { AuthController } from './auth';
import supertest, { SuperTest, Test } from 'supertest';
import mongoose from 'mongoose';
import { setupDB } from '../startup/testSetup';


describe('AuthController', () => {

    const authController = new AuthController();
    let request: SuperTest<Test>;

    setupDB('test-auth-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(authController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    it('should pass endpoint', async (done) => {
        const res = await request.post('/api/auth/register').send({
            firstName: 'Joe',
            lastName: 'Mama',
            email: 'test@mail.com',
            password: 'password'

        });
        expect(res.status).toBe(200);
        done();
    })
})