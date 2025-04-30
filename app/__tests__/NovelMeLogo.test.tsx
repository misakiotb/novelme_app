import React from 'react';
import { render, screen } from '@testing-library/react';
import NovelMeLogo from '../NovelMeLogo';

describe('NovelMeLogo', () => {
  it('SVGロゴが描画される', () => {
    render(<NovelMeLogo size={44} />);
    // SVG要素が存在するか
    const svg = screen.getByTestId('novelme-logo-svg');
    expect(svg).toBeInTheDocument();
  });
});
