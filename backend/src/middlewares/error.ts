import { Request, Response, NextFunction } from "express";

export default (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err.message === 'access denied') {
      res.status(403);
      res.json({ error: err.message });
    }

    next(err);
  };