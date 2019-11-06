import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';

export async function testValidators(req: MockRequest<Request>, res: MockResponse<Response>, middlewares: any[]) {
    await Promise.all(middlewares.map(async (middleware) => {
        await middleware(req, res, () => undefined);
    }));
};

export async function validateBody(payload: Object, validators: any[]) {
    const request = httpMocks.createRequest({
        body: payload
    })
    const response = httpMocks.createResponse();
    await testValidators(request, response, validators);
    return validationResult(request).array();
}
export async function validateBodyAndParams(body: Object, params: Object, validators: any[]) {
    const request = httpMocks.createRequest({
        body, params
    })
    const response = httpMocks.createResponse();
    await testValidators(request, response, validators);
    return validationResult(request).array();
}

/** use if you only expect one error response */
export function checkResponse(errors: any[], expectedParam: String, expectedMsg: String) {
    expect(errors.length).toBe(1);
    const err = errors[0];
    expect(err.param).toBe(expectedParam);
    expect(err.msg).toBe(expectedMsg);
}

/** use if you expect several error responses for array of objects */
export function checkResponses(errors: any[], expectedParam: String, expectedMsg: string) {
    errors.forEach((err) => {
        expect(err.param.includes(expectedParam)).toBeTruthy();
        expect(err.msg).toBe(expectedMsg);
    })
}
