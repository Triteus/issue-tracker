import { Controller, Post, Middleware, Delete, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { UploadService } from "../../services/upload.service";
import passport from "passport";
import path from 'path';
import { ServiceInjector } from "../../ServiceInjector";

const uploadService = new UploadService();
const upload = uploadService.initUploadMiddleware();


@Controller('api/file')
export class FileController {

    uploadService = ServiceInjector.getService('uploadService');

    @Post()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        upload.array('file', 12)
    ])
    private async uploadFiles(req: Request, res: Response) {

        if (!req.files) {
            return res.status(400).send({ message: 'No files sent!' });
        }

        res.status(201).send(uploadService.generatePayload(req.files));
    }

    @Get(':filename')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async downloadFile(req: Request, res: Response) {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../../uploads/') + filename;

        res.download(filePath, (err: any) => {
            if (res.headersSent) return;
            if(err.status === 404)
            res.status(404).send({message: `File '${filename}' not found!`});
        });
    }
}