import { Request, Response, NextFunction } from "express";
import winston = require("winston");

export enum ErrorTypes {
    NOT_FOUND = 'NOT_FOUND',
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    NOT_AUTHORIZED = 'NOT_AUTHORIZED',
    BAD_REQUEST = 'BAD_REQUEST',
    UNSUPPORTED_EXT = 'UNSUPPORTED_EXT'
}


export class ResponseError extends Error {
    constructor(message: string, errorType: ErrorTypes) {
        super(message);
        this.name = errorType;
    }
}

export class ValMethodError extends Error {
    constructor(message: string, methodName: string) {
        super(message);
        this.name = methodName;
    }
}

function sendError(res: Response, status: number, message: string) {
    return res.status(status).send({ error: message });
}

/**
 * middleware for centralized error-handling
 * all thrown errors from any routes are passed to this middleware
 */

export default (err: Error, req: Request, res: Response, next: NextFunction) => {

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

    if(err.name === ErrorTypes.UNSUPPORTED_EXT) {
        return sendError(res, 400, err.message);
    }

    console.error(err);
    return res.status(500).send({error: {message: err.message}});
};