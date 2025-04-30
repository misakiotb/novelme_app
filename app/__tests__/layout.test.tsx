
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: '' }),
  Geist_Mono: () => ({ variable: '' }),
}));

describe('RootLayout', () => {
  it('Header, Footer, mainが含まれる（通常時）', () => {
    render(
      <RootLayout>
        <div>テスト用メインコンテンツ</div>
      </RootLayout>
    );
    // ヘッダー・フッターの要素が含まれる
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    // main要素が含まれる
    expect(screen.getByRole('main')).toBeInTheDocument();
    // childrenが描画される
    expect(screen.getByText('テスト用メインコンテンツ')).toBeInTheDocument();
  });
});
