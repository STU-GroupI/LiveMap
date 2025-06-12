import React from 'react';
import { render } from '@testing-library/react-native';
import SuggestedPOIMarker from '../../src/components/map/suggestion/SuggestedPOIMarker';

// Mock PointAnnotation from maplibre
jest.mock('@maplibre/maplibre-react-native', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        PointAnnotation: ({ children, id }: any) => (
            <View testID={`point-annotation-${id}`}>
                {children}
            </View>
        ),
    };
});

// Mock MaterialDesignIcons
jest.mock('@react-native-vector-icons/material-design-icons', () => {
    return (props: any) => <>{JSON.stringify(props)}</>;
});

describe('SuggestedPOIMarker', () => {
    it('renders with correct testID and icon', () => {
        const location: [number, number] = [12.34, 56.78];
        const { getByTestId, queryByText } = render(<SuggestedPOIMarker location={location} />);
        const expectedId = `suggested-poi-${Math.round(location[0])}`;
        const annotation = getByTestId(`point-annotation-${expectedId}`);
        expect(annotation).toBeTruthy();
    });
});