import { FilenamePipe } from './filename.pipe';

describe('FilenamePipe', () => {
  it('create an instance', () => {
    const pipe = new FilenamePipe();
    expect(pipe).toBeTruthy();
  });

  it('remove timestamp from simple filename', () => {
    const filename = 'filename123-21323423423.png';
    const pipe = new FilenamePipe();
    expect(pipe.transform(filename)).toBe('filename123.png');
  });

  it('removes timestamp from "complex" filename', () => {
    const filename = 'filename_123-bla-xyz-234234234135.jpg';
    const pipe = new FilenamePipe();
    expect(pipe.transform(filename)).toBe('filename_123-bla-xyz.jpg');
  });
});
