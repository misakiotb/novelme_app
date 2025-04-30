import { render, screen } from '@testing-library/react';
import SuspendPage from '../page';

describe('SuspendPage', () => {
  it('休止中メッセージとお詫び文が表示される', () => {
    render(<SuspendPage />);
    // タイトルが表示される
    expect(screen.getByRole('heading', { name: /サービスは現在休止中です/ })).toBeInTheDocument();
    // メンテナンス文言が含まれる
    expect(screen.getByText(/NovelMeは現在システムメンテナンス/)).toBeInTheDocument();
    expect(screen.getByText(/サービス再開までしばらくお待ちください/)).toBeInTheDocument();
  });
});
