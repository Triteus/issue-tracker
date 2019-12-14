import { CategoryNamePipe } from './category-name.pipe';

describe('CategoryPipe', () => {
  it('create an instance', () => {
    const pipe = new CategoryNamePipe();
    expect(pipe).toBeTruthy();
  });
});
