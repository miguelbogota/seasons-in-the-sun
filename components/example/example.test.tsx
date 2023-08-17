import { render } from '@testing-library/react';

import { Example } from './example';

describe('Example', () => {
  it('should match snapshot', () => {
    const { container } = render(<Example />);
    expect(container).toMatchSnapshot();
  });
});
