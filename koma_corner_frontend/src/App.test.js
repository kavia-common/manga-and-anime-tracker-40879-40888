import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders navbar brand', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  const brand = screen.getByText(/Koma Corner/i);
  expect(brand).toBeInTheDocument();
});
