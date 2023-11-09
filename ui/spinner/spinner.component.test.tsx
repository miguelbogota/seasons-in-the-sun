import { render } from '@testing-library/react';

import { Spinner } from './spinner.component';

describe('UI / Spinner', () => {
  it('should match snapshot', () => {
    const { container } = render(<Spinner />);
    expect(container).toMatchSnapshot();
  });
});
