import { render } from '@testing-library/react';

import { MainMenu } from './main-menu.component';

describe('Game / MainMenu / Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<MainMenu />);
    expect(container).toMatchSnapshot();
  });
});
