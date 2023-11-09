import { render } from '@testing-library/react';

import { Signin } from './signin.component';

describe('Website / Authentication / Signin / Component', () => {
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
    const { container } = render(<Signin />);
    expect(container).toMatchSnapshot();
  });
});
