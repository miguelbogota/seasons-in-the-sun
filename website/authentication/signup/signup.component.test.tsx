import { render } from '@testing-library/react';

import { Signup } from './signup.component';

describe('Website / Authentication / Signup / Component', () => {
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
    const { container } = render(<Signup />);
    expect(container).toMatchSnapshot();
  });
});
