import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FormProvider, useFormContext } from '../FormContext';

// テスト用のダミー子コンポーネント
function DummyConsumer() {
  const { values, setValues, reset } = useFormContext();
  return (
    <div>
      <span data-testid="episode">{values.episode}</span>
      <span data-testid="mode">{values.mode}</span>
      <button onClick={() => setValues({ episode: '新しいエピソード', mode: 'sf' })}>setValues</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

describe('FormProvider / useFormContext', () => {
  it('初期値を提供し、setValues/resetが動作する', () => {
    render(
      <FormProvider>
        <DummyConsumer />
      </FormProvider>
    );
    // 初期値の確認
    expect(screen.getByTestId('episode').textContent).toBe('');
    expect(screen.getByTestId('mode').textContent).toBe('fantasy');
    // setValuesボタンで値が変わる
    fireEvent.click(screen.getByText('setValues'));
    expect(screen.getByTestId('episode').textContent).toBe('新しいエピソード');
    expect(screen.getByTestId('mode').textContent).toBe('sf');
    // resetボタンで初期値に戻る
    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('episode').textContent).toBe('');
    expect(screen.getByTestId('mode').textContent).toBe('fantasy');
  });

  it('Provider外でuseFormContextを使うとエラー', () => {
    // Provider外で呼ぶとエラーになることを確認
    const Broken = () => {
      useFormContext();
      return null;
    };
    expect(() => render(<Broken />)).toThrow('useFormContext must be used within FormProvider');
  });
});
