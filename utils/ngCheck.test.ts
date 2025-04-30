import { containsNgWord } from './ngCheck';

describe('containsNgWord', () => {
  it('NGワードが含まれていない場合はfalse', () => {
    expect(containsNgWord('これは普通の文章です')).toBe(false);
  });

  it('NGワードが含まれている場合はtrue', () => {
    expect(containsNgWord('これはばかという言葉が含まれています')).toBe(true);
    expect(containsNgWord('死ねというワード')).toBe(true);
  });

  it('複数NGワードが含まれていてもtrue', () => {
    expect(containsNgWord('差別と暴力の言葉')).toBe(true);
  });

  it('NGワードが部分一致で検出される', () => {
    expect(containsNgWord('パワハラ上司')).toBe(true);
  });
});
