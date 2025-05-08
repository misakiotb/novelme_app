import React from 'react';
import { render, screen } from '@testing-library/react';
import NovelMeLogo from '../NovelMeLogo';

describe('NovelMeLogo', () => {
  it('SVGロゴが描画される', () => {
    render(<NovelMeLogo size={44} />);
    const svg = screen.getByTestId('novelme-logo-svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', (44 * 6).toString());
    expect(svg).toHaveAttribute('height', '44');
  });

  it('デフォルト値（size未指定）で描画', () => {
    render(<NovelMeLogo />);
    const svg = screen.getByTestId('novelme-logo-svg');
    expect(svg).toHaveAttribute('width', (44 * 6).toString());
    expect(svg).toHaveAttribute('height', '44');
  });

  it('異なるsize（100）で描画', () => {
    render(<NovelMeLogo size={100} />);
    const svg = screen.getByTestId('novelme-logo-svg');
    expect(svg).toHaveAttribute('width', (100 * 6).toString());
    expect(svg).toHaveAttribute('height', '100');
  });

  it('size=0や負値でも描画', () => {
    const { unmount } = render(<NovelMeLogo size={0} />);
    const svgZero = screen.getByTestId('novelme-logo-svg');
    expect(svgZero).toHaveAttribute('width', '0');
    expect(svgZero).toHaveAttribute('height', '0');
    unmount();

    render(<NovelMeLogo size={-10} />);
    const svgNeg = screen.getByTestId('novelme-logo-svg');
    expect(svgNeg).toHaveAttribute('width', (-10 * 6).toString());
    expect(svgNeg).toHaveAttribute('height', '-10');
  });
});
