import { Controller, Post, Middleware, Delete, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { UploadService } from "../../services/upload.service";
import passport from "passport";
import path from 'path';

const uploadService = new UploadService();
const upload = uploadService.initUploadMiddleware();


const delay = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('lul');
        }, 2000)
    })
}

@Controller('api/file')
export class FileController {

    @Post()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        upload.array('file', 12)
    ])
    private async uploadFiles(req: Request, res: Response) {

        await delay();
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
        const file =  path.join(__dirname, '../../../uploads/') + filename;
        res.download(file, (err: any) => {
            if (res.headersSent) return;
            if(err.status === 404)
            res.status(404).send({message: `File '${filename}' not found!`});
        });
    }
}