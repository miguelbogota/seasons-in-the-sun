import { render } from '@testing-library/react';

import { MenuMain } from './menu-main.component';

describe('Game / MenuMain / Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<MenuMain />);
    expect(container).toMatchSnapshot();
  });
});
