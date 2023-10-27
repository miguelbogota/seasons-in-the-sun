import { render } from '@testing-library/react';

import { Signup } from './signup.component';

describe('Website / Authentication / Signup / Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<Signup />);
    expect(container).toMatchSnapshot();
  });
});
