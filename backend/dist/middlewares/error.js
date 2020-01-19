"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["NOT_FOUND"] = "NOT_FOUND";
    ErrorTypes["NOT_AUTHENTICATED"] = "NOT_AUTHENTICATED";
    ErrorTypes["NOT_AUTHORIZED"] = "NOT_AUTHORIZED";
    ErrorTypes["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorTypes["UNSUPPORTED_EXT"] = "UNSUPPORTED_EXT";
})(ErrorTypes = exports.ErrorTypes || (exports.ErrorTypes = {}));
class ResponseError extends Error {
    constructor(message, errorType) {
        super(message);
        this.name = errorType;
    }
}
exports.ResponseError = ResponseError;
class ValMethodError extends Error {
    constructor(message, methodName) {
        super(message);
        this.name = methodName;
    }
}
exports.ValMethodError = ValMethodError;
function sendError(res, status, message) {
    return res.status(status).send({ error: message });
}
/**
 * middleware for centralized error-handling
 * all thrown errors from any routes are passed to this middleware
 */
exports.default = (err, req, res, next) => {
    if (err.name === ErrorTypes.NOT_FOUND) {
        return sendError(res, 404, err.message);
    }
    if (err.name === ErrorTypes.NOT_AUTHENTICATED) {
        return sendError(res, 401, err.message);
    }
    if (err.name === ErrorTypes.BAD_REQUEST) {
        return sendError(res, 400, err.message);
    }
    if (err.name === ErrorTypes.NOT_AUTHORIZED) {
        return sendError(res, 403, err.message);
    }
    if (err.name === ErrorTypes.UNSUPPORTED_EXT) {
        return sendError(res, 400, err.message);
    }
    console.error(err);
    return res.status(500).send({ error: { message: err.message } });
};
//# sourceMappingURL=error.js.map