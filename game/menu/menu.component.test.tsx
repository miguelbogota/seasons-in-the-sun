import { render } from '@testing-library/react';

import { GameMenu } from './menu.component';

describe('Game / Menu / Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<GameMenu />);
    expect(container).toMatchSnapshot();
  });
});
