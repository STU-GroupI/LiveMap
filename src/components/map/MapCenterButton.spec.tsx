import { render, fireEvent } from '@testing-library/react-native';
import MapCenterButton from './MapCenterButton';

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

describe('MapCenterButton Component', () => {
    it('calls handleRecenter when button is pressed', () => {
        const handleRecenter = jest.fn();

        const { getByTestId } = render(
            <MapCenterButton handleRecenter={handleRecenter} />
        );

        const button = getByTestId('mock-icon');

        fireEvent.press(button);
        expect(handleRecenter).toHaveBeenCalledTimes(1);
    });
});
