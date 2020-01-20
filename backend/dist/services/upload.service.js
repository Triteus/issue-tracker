"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const error_1 = require("../middlewares/error");
class UploadService {
    initUploadMiddleware() {
        var storage = multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                const filePath = 'uploads';
                fs_1.default.mkdir(filePath, { recursive: true }, (err) => {
                    if (err)
                        throw err;
                });
                cb(null, filePath);
            },
            filename: function (req, file, cb) {
                // extract original filename without extension
                const filenameArr = file.originalname.split('.');
                filenameArr.pop();
                const filename = filenameArr.join();
                cb(null, filename + '-' + Date.now() + path_1.default.extname(file.originalname));
            }
        });
        return multer_1.default({
            storage,
            fileFilter: function (req, file, callback) {
                const allowedExts = ['.jpg', '.jpeg', '.png', '.wav', '.mp3', '.gif', '.pdf', '.txt', '.odt', '.doc', '.docx', '.tex', '.rtf'];
                const ext = path_1.default.extname(file.originalname);
                if (!allowedExts.includes(ext)) {
                    return callback(new error_1.ResponseError(`File with extension ${ext} not allowed!`, error_1.ErrorTypes.UNSUPPORTED_EXT), false);
                }
                callback(null, true);
            },
        });
    }
    generatePayload(reqFiles) {
        const files = Array.isArray(reqFiles) ? reqFiles : reqFiles['file'];
        const filenames = files.map(f => f.filename);
        let payload = {};
        if (filenames.length === 1) {
            payload = { message: 'File uploaded!', filename: filenames[0] };
        }
        else {
            payload = {
                message: 'Files uploaded!',
                filenames
            };
        }
        return payload;
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map