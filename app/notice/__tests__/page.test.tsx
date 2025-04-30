import React from 'react';
import { render, screen } from '@testing-library/react';
import Notice from '../page';

describe('Noticeページ', () => {
  it('タイトル「注意事項」と注意リストが表示される', () => {
    render(<Notice />);
    // タイトルが表示される
    expect(screen.getByRole('heading', { name: /注意事項/ })).toBeInTheDocument();
    // 注意書きリストが表示される
    expect(screen.getByRole('list')).toBeInTheDocument();
    // 主要な注意文言が含まれているか
    expect(screen.getByText(/AI（LLM：大規模言語モデル）/)).toBeInTheDocument();
    expect(screen.getByText(/個人情報や機密情報/)).toBeInTheDocument();
    expect(screen.getByText(/スポンサー/)).toBeInTheDocument();
  });
});
