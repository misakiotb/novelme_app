import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('ロゴとトップページリンクが表示される', () => {
    render(<Header />);
    // トップページへのリンクが存在
    const link = screen.getByRole('link', { name: /トップページへ/ });
    expect(link).toBeInTheDocument();
    // ロゴコンポーネント（alt属性やdata-testid等で判定）
    // ここではロゴSVGが含まれていることだけ確認
    expect(link.innerHTML).toMatch(/svg|logo/i);
  });
});
