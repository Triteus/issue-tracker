"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const upload_service_1 = require("../../services/upload.service");
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const uploadService = new upload_service_1.UploadService();
const upload = uploadService.initUploadMiddleware();
let FileController = class FileController {
    async uploadFiles(req, res) {
        if (!req.files) {
            return res.status(400).send({ message: 'No files sent!' });
        }
        res.status(201).send(uploadService.generatePayload(req.files));
    }
    async downloadFile(req, res) {
        const filename = req.params.filename;
        const filePath = path_1.default.join(__dirname, '../../../uploads/') + filename;
        res.download(filePath, (err) => {
            if (res.headersSent)
                return;
            if (err.status === 404)
                res.status(404).send({ message: `File '${filename}' not found!` });
        });
    }
};
__decorate([
    core_1.Post(),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        upload.array('file', 12)
    ])
], FileController.prototype, "uploadFiles", null);
__decorate([
    core_1.Get(':filename'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
    ])
], FileController.prototype, "downloadFile", null);
FileController = __decorate([
    core_1.Controller('api/file')
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.js.map