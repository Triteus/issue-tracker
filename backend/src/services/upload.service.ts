import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ResponseError, ErrorTypes } from '../middlewares/error';
import { IService } from '../ServiceInjector';

export class UploadService implements IService {

    initUploadMiddleware() {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                const filePath = path.join(__dirname, '../../uploads');
                fs.mkdir(filePath, { recursive: true }, (err) => {
                    if (err) throw err;
                });
                cb(null, filePath)
            },
            filename: function (req, file, cb) {
                // extract original filename without extension
                const filenameArr = file.originalname.split('.');
                filenameArr.pop();
                const filename = filenameArr.join();
                cb(null, filename + '-' + Date.now() + path.extname(file.originalname))
            }
        })
        return multer({
            storage,
            fileFilter: function (req, file, callback) {
                const allowedExts = ['.jpg', '.jpeg', '.png', '.wav', '.mp3', '.gif', '.pdf', '.txt', '.odt', '.doc', '.docx', '.tex', '.rtf'];
                const ext = path.extname(file.originalname);
                if (!allowedExts.includes(ext)) {
                    return callback(new ResponseError(`File with extension ${ext} not allowed!`, ErrorTypes.UNSUPPORTED_EXT), false);
                }
                callback(null, true);
            },
        });
    }

    generatePayload(reqFiles: any) {
        const files = Array.isArray(reqFiles) ? reqFiles : reqFiles['file'];
        const filenames = files.map(f => f.filename);

        let payload: { message?: string, filenames?: string[], filename?: string } = {};
        if (filenames.length === 1) {
            payload = { message: 'File uploaded!', filename: filenames[0] };
        } else {
            payload = {
                message: 'Files uploaded!',
                filenames
            }
        }
        return payload;
    }

}