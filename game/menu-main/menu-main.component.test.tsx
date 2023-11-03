import { render } from '@testing-library/react';

import { MenuMain } from './menu-main.component';

describe('Game / MenuMain / Component', () => {
  beforeAll(() => {
    global.GUN = () => ({
      // @ts-expect-error Mocking get method.
      get: () => ({}),
      user: () => ({
        // @ts-expect-error Mocking get method.
        recall: () => ({}),
      }),
      on: () => ({}),
    });
  });

  it('should match snapshot', () => {
    const { container } = render(<MenuMain />);
    expect(container).toMatchSnapshot();
  });
});
