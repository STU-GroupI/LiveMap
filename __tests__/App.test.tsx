import React from 'react';
import axios from 'axios';
import App from '../App';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('axios');

test('renders correctly', async () => {
  (axios.get as jest.Mock).mockResolvedValue({ data: {} });

  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });

  await new Promise(resolve => setTimeout(resolve, 0));
});
