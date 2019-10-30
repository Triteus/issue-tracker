import { Request, Response, NextFunction } from "express";

export enum ErrorTypes {
    NOT_FOUND = 'NOT_FOUND',
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    NOT_AUTHORIZED = 'NOT_AUTHORIZED',
    BAD_REQUEST = 'BAD_REQUEST'
}


export class ResponseError extends Error {
    constructor(message: string, errorType: ErrorTypes) {
        super(message);
        this.name = errorType;
    }
}

function sendError(res: Response, status: number, message: string) {
    return res.status(status).send({ error: message });
}

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

    next(err);
};