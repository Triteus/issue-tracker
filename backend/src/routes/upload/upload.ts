import { Controller, Post, Middleware, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import multer from 'multer';
import path from 'path';
import { UploadService } from "../../services/upload.service";
import passport from "passport";

const uploadService = new UploadService();
const upload = uploadService.initUploadMiddleware();

@Controller('api/file')
export class UploadController {

    @Post()
    @Middleware([
        passport.authenticate('jwt', {session: false}),
        upload.array('file', 12)
    ])
    private async uploadFiles(req: Request, res: Response) {

        if(!req.files) {
            return res.status(400).send({message: 'No files sent!'});
        }

        res.status(201).send(uploadService.generatePayload(req.files));
    }
}