import { UploadService } from "./upload.service"

describe('UploadService', () => {

    const uploadService = new UploadService();

    it ('returns payload containing one file', async () => {
        const payload = uploadService.generatePayload([{filename: 'test.png'}]);
        expect(payload.filename).toBe('test.png');
    })
    
    it('returns payload containing multiple files', async () => {
        const payload = uploadService.generatePayload([{filename: 'file1.png'}, {filename: 'file2.png'}]);
        expect(payload.filenames).toContain('file1.png');
        expect(payload.filenames).toContain('file2.png');
    })
})