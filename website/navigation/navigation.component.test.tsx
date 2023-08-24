import { render } from '@testing-library/react';

import { Navigation } from './navigation.component';

describe('Website / Navigation / Component', () => {
  it('should match snapshot', () => {
    const { container } = render(<Navigation />);
    expect(container).toMatchSnapshot();
  });
});
