"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const express_validator_1 = require("express-validator");
async function testValidators(req, res, middlewares) {
    await Promise.all(middlewares.map(async (middleware) => {
        await middleware(req, res, () => undefined);
    }));
}
exports.testValidators = testValidators;
;
async function validateBody(payload, validators) {
    const request = node_mocks_http_1.default.createRequest({
        body: payload
    });
    const response = node_mocks_http_1.default.createResponse();
    await testValidators(request, response, validators);
    return express_validator_1.validationResult(request).array();
}
exports.validateBody = validateBody;
async function validateBodyAndParams(body, params, validators) {
    const request = node_mocks_http_1.default.createRequest({
        body, params
    });
    const response = node_mocks_http_1.default.createResponse();
    await testValidators(request, response, validators);
    return express_validator_1.validationResult(request).array();
}
exports.validateBodyAndParams = validateBodyAndParams;
/** use if you only expect one error response */
function checkResponse(errors, expectedParam, expectedMsg) {
    expect(errors.length).toBe(1);
    const err = errors[0];
    expect(err.param).toBe(expectedParam);
    expect(err.msg).toBe(expectedMsg);
}
exports.checkResponse = checkResponse;
/** use if you expect several error responses for array of objects */
function checkResponses(errors, expectedParam, expectedMsg) {
    errors.forEach((err) => {
        expect(err.param.includes(expectedParam)).toBeTruthy();
        expect(err.msg).toBe(expectedMsg);
    });
}
exports.checkResponses = checkResponses;
//# sourceMappingURL=test-util.js.map