import { render } from '@testing-library/react';

import { Authentication } from './authentication.component';

describe('Website / Authentication / Component', () => {
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
    const { container } = render(<Authentication />);
    expect(container).toMatchSnapshot();
  });
});
