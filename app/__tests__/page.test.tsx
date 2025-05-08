import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('初期表示：フォーム要素とボタンが表示される', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // episode入力欄
    expect(screen.getByRole('button', { name: /AIで生成/ })).toBeInTheDocument();
    expect(screen.getByText('どう書いたらいい？ 書き方のヒント')).toBeInTheDocument();
  });

  it('10文字未満でエラー表示', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: '短い' } });
    fireEvent.blur(textarea); // フォーカスアウトでtouched=trueになる
    expect(screen.getByText(/10文字以上入力してください/)).toBeInTheDocument();
    // ボタンはdisabledのまま
    expect(screen.getByRole('button', { name: /AIで生成/ })).toBeDisabled();
  });

  it('サービス稼働中画面が表示される（コスト1ドル以下）', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    // サービス休止中の文言が出ていないこと
    await screen.findByRole('textbox');
    expect(screen.queryByText(/サービスは休止中/)).not.toBeInTheDocument();
  });

  it('サービス休止画面が表示される（コスト超過）', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: false, cost: 2.0 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    // サービス休止中の文言が出る
    expect(await screen.findByText(/サービスは休止中/)).toBeInTheDocument();
    expect(screen.getByText(/本日のコスト: \$2.00/)).toBeInTheDocument();
  });

  it('生成モードの選択肢が全て表示される', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    const options = [
      'ファンタジー冒険譚',
      'サイバーパンク',
      '青春恋愛小説',
      'ミステリー/推理小説',
      'ホラー/サスペンス',
      '異世界転生/転職もの',
      '昭和レトロ風味の人情話',
    ];
    options.forEach(label => {
      expect(screen.getByRole('option', { name: label })).toBeInTheDocument();
    });
  });

  it('NGワード入力時にエラーが表示される', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    // NGワード例: "死ね"
    fireEvent.change(textarea, { target: { value: 'これは死ねというNGワードを含む文章です' } });
    fireEvent.blur(textarea);
    // NGワードエラーが表示される
    expect(await screen.findByText(/不適切な内容が含まれています/)).toBeInTheDocument();
  });

  it('ローディング中はボタンに生成中...と表示される', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    // 10文字以上入力しないとボタンが有効にならないので入力する
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'これは十分な長さのエピソードです' } });
    // 生成ボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: /AIで生成/ }));
    // ボタンのテキストが「生成中...」になるか
    expect(await screen.findByRole('button', { name: /生成中/ })).toBeInTheDocument();
  });

  it('resultがセットされたとき、生成結果エリアが表示される', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ active: true, cost: 0.5 }),
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    // 疑似的に生成ボタンを押してAPIレスポンスを返す（本来はAPIモックでresultがセットされる想定）
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'これは十分な長さのエピソードです' } });
    fireEvent.click(screen.getByRole('button', { name: /AIで生成/ }));
    // 生成結果が画面に表示されるか（タイトルや紹介文の一部が表示されることを確認）
    // ここでは「NovelMe」などタイトルの一部で判定
    expect(await screen.findByText(/NovelMe/)).toBeInTheDocument();
  });

  it('errorがセットされたとき、エラー表示が出る', async () => {
    // APIの返却値でエラーを発生させる
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => { throw new Error('APIエラー'); }
    });
    await act(async () => {
      render(
        <FormProvider>
          <Home />
        </FormProvider>
      );
    });
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'これは十分な長さのエピソードです' } });
    fireEvent.click(screen.getByRole('button', { name: /AIで生成/ }));
    // エラー表示が出るか
    expect(await screen.findByText(/エラー|失敗|もう一度/)).toBeInTheDocument();
  });

  // loading状態やresult, errorのテストはコンポーネントの設計次第で工夫が必要です
});