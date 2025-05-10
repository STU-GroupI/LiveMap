import React from 'react';
import axios from 'axios';
import App from '../App';
import { render, screen, waitFor } from '@testing-library/react-native';

jest.mock('axios');

test('renders App component correctly', async () => {
  (axios.get as jest.Mock).mockResolvedValue({ data: {} });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('app-container')).toBeDefined();
  });
});
