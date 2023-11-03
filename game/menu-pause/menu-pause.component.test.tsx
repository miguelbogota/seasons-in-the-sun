import { render } from '@testing-library/react';

import { PauseMenu } from './menu-pause.component';

describe('Game / PauseMenu / Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<PauseMenu />);
    expect(container).toMatchSnapshot();
  });
});
