import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FormProvider } from '../FormContext';

// useRouterをモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

import Home from '../page';

describe('Home(page.tsx)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('初期表示：フォーム要素とボタンが表示される', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    render(
      <FormProvider>
        <Home />
      </FormProvider>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // episode入力欄
    expect(screen.getByRole('button', { name: /AIで小説タイトルを生成/ })).toBeInTheDocument();
    expect(screen.getByText('どう書いたらいい？ 書き方のヒント')).toBeInTheDocument();
  });

  it('10文字未満でエラー表示', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    render(
      <FormProvider>
        <Home />
      </FormProvider>
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: '短い' } });
    fireEvent.blur(textarea); // フォーカスアウトでtouched=trueになる
    expect(screen.getByText(/10文字以上入力してください/)).toBeInTheDocument();
    // ボタンはdisabledのまま
    expect(screen.getByRole('button', { name: /AIで小説タイトルを生成/ })).toBeDisabled();
  });

  it('サービス稼働中画面が表示される（コスト1ドル以下）', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    render(
      <FormProvider>
        <Home />
      </FormProvider>
    );
    // サービス休止中の文言が出ていないこと
    await screen.findByRole('textbox');
    expect(screen.queryByText(/サービスは休止中/)).not.toBeInTheDocument();
  });

  it('サービス休止画面が表示される（コスト超過）', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: false, cost: 2.0 }),
    });
    render(
      <FormProvider>
        <Home />
      </FormProvider>
    );
    // サービス休止中の文言が出る
    expect(await screen.findByText(/サービスは休止中/)).toBeInTheDocument();
    expect(screen.getByText(/本日のコスト: \$2.00/)).toBeInTheDocument();
  });
});
