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
  it('初期表示：フォーム要素とボタンが表示される', () => {
    render(
      <FormProvider>
        <Home />
      </FormProvider>
    );
    // 入力欄・ボタン・ヒントなどが表示される
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // episode入力欄
    expect(screen.getByRole('button', { name: /AIで小説タイトルを生成/ })).toBeInTheDocument();
    expect(screen.getByText('どう書いたらいい？ 書き方のヒント')).toBeInTheDocument();
  });

  it('10文字未満でエラー表示', () => {
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
});
