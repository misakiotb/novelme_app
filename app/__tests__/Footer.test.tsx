import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('コピーライトやフッター要素が表示される', () => {
    render(<Footer />);
    // 例: コピーライト表記が含まれることを確認（表記内容は実装に合わせて修正）
    expect(screen.getByText(/copyright|©|novelme/i)).toBeInTheDocument();
  });
});
