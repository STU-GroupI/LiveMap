import { render, fireEvent } from '@testing-library/react-native';
import MapZoomInOutButton from './MapZoomInOutButton.tsx';

jest.mock('react-native-paper', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        Icon: () => <View testID="mock-icon" />,
        useTheme: () => ({
            colors: {
                background: 'white',
            },
        }),
    };
});

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ bottom: 10, right: 10 }),
}));

jest.mock('@react-native-vector-icons/material-design-icons', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: ({ name }: { name: string; size: number; color: string }) => (
            <View testID={`mock-icon-${name}`} />
        ),
    };
});

describe('MapZoomInOutButton Component', () => {
    it('calls zoomIn and zoomOut when button is pressed', () => {
        const zoomIn = jest.fn();
        const zoomOut = jest.fn();

        const { getByTestId } = render(
            <MapZoomInOutButton handleZoomIn={zoomIn} handleZoomOut={zoomOut} />
        );

        const zoomInButton = getByTestId('zoom-in');
        const zoomOutButton = getByTestId('zoom-out');

        fireEvent.press(zoomInButton);
        expect(zoomIn).toHaveBeenCalledTimes(1);

        fireEvent.press(zoomOutButton);
        expect(zoomOut).toHaveBeenCalledTimes(1);
    });
});
