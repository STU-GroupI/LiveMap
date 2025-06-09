import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import POIClusterMarker from '../../src/components/map/POIClusterMarker';

// Mocks
jest.mock('@maplibre/maplibre-react-native', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        PointAnnotation: ({ children, onSelected, id }: any) => (
            <View testID={`point-annotation-${id}`} onTouchStart={onSelected}>
                {children}
            </View>
        ),
    };
});

describe('POIClusterMarker Component', () => {
    const props = {
        id: 'cluster-123',
        coordinate: [12.34, 56.78] as [number, number],
        pointCount: 5,
        onPress: jest.fn(),
    };

    it('renders correctly with the given point count', () => {
        const { getByText, getByTestId } = render(<POIClusterMarker {...props} />);
        expect(getByText('5')).toBeTruthy();
        expect(getByTestId('point-annotation-cluster-123')).toBeTruthy();
    });

    it('calls onPress when TouchableOpacity is pressed', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <POIClusterMarker {...props} onPress={onPressMock} />
        );

        fireEvent.press(getByText('5'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('calls onPress when PointAnnotation is selected', () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(
            <POIClusterMarker {...props} onPress={onPressMock} />
        );

        fireEvent(getByTestId('point-annotation-cluster-123'), 'touchStart');
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});
