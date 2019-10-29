import { validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    //const extractedErrors = []
    //errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
    return res.status(422).json({
      errors: errors.array(),
    })
  }