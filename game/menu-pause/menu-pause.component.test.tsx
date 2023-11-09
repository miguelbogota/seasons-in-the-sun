import { render } from '@testing-library/react';

import { MenuPause } from './menu-pause.component';

describe('Game / MenuPause / Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<MenuPause />);
    expect(container).toMatchSnapshot();
  });
});
