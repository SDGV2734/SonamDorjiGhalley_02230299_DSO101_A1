import { render, screen } from '@testing-library/react';

jest.mock('axios', () => {
  const axiosMock = {
    get: jest.fn(() => new Promise(() => {})),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  return {
    __esModule: true,
    ...axiosMock,
    default: axiosMock,
  };
});

import App from './App';

test('renders task heading', () => {
  render(<App />);
  const linkElement = screen.getByRole('heading', { name: /my tasks/i });
  expect(linkElement).toBeInTheDocument();
});
