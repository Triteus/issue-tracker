import multer from 'multer';
import path from 'path';

export class UploadService {

    initUploadMiddleware() {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                // WARNING: all file-extensions are allowed with this implementation
                // TODO: restrict allowed extensions

                // extract original filename without extension
                const filenameArr = file.originalname.split('.');
                filenameArr.pop();
                const filename = filenameArr.join();
                cb(null, filename + '-' + Date.now() + path.extname(file.originalname))
            }
        })
        return multer({ storage });
    }

    generatePayload(reqFiles: any) {
        const files = Array.isArray(reqFiles) ? reqFiles : reqFiles['file'];
        const filenames = files.map(f => f.filename);
        
        let payload: {message?: string, filenames?: string[], filename?: string} = {};
        if(filenames.length === 1) {
            payload = {message: 'File uploaded!', filename: filenames[0]};
        } else {
            payload = {
                message: 'Files uploaded!',
                filenames
            }
        }
        return payload;
    }

}