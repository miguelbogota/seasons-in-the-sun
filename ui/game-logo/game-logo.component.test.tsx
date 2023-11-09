import { render } from '@testing-library/react';

import { GameLogo } from './game-logo.component';

describe('UI / GameLogo', () => {
  it('should match snapshot', () => {
    const { container } = render(<GameLogo />);
    expect(container).toMatchSnapshot();
  });
});
