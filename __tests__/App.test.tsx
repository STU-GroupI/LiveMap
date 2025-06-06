import React from 'react';
import axios from 'axios';
import App from '../App';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';

jest.mock('axios');
jest.mock('../src/components/map/POIMarker.tsx', () => {
  return ({ poi, isActive, onSelect }: { poi: any; isActive: boolean; onSelect: () => void }) => {
    return (
        <div data-testid={`poi-marker-${poi.guid}`} onClick={onSelect}>
          {isActive ? `Active POI: ${poi.guid}` : `POI: ${poi.guid}`}
        </div>
    );
  };
});

describe('App Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders App component correctly with mocked data', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: {} });

    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'mapConfig') {
        return {
          data: {
            mapId: 'mockMapId',
            mapStyle: 'mockStyle',
            center: [0, 0],
            zoom: 10,
            minZoom: 5,
            maxZoom: 15,
          },
          isLoading: false,
        };
      }
      if (queryKey[0] === 'pois' && queryKey[1] === 'mockMapId') {
        return {
          data: [
            { guid: '0000-0000-0000-0000', name: 'Mock POI', coordinate: { latitude: 0, longitude: 0 }, category: { iconName: 'mockIcon' } },
          ],
          isLoading: false,
        };
      }
      return { data: [], isLoading: true };
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('app-container')).toBeDefined();
    });
  });
});
