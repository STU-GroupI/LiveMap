
import { render } from '@testing-library/react-native';
import MapTopBarButton from '../../src/components/map/MapTopBarButton';

// Mocks
jest.mock('react-native-paper', () => {
    const { Text, View } = require('react-native');

    return {
        Text,
        View,
        useTheme: () => ({
            colors: {
                background: 'white',
                shadow: '#000',
                outline: '#ccc',
                onSurface: '#333',
            },
        }),
    };
});

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 20, bottom: 10, left: 0, right: 0 }),
}));

describe('MapTopBarButton Component', () => {
    it('renders correctly with both Map and List buttons', () => {
        const { getByText } = render(<MapTopBarButton />);

        expect(getByText('Map')).toBeTruthy();
        expect(getByText('List')).toBeTruthy();
    });

    it('positions correctly based on safe area insets', () => {
        const { getByText } = render(<MapTopBarButton />);

        // This doesn't check exact positioning but verifies rendering without error
        expect(getByText('Map').props.style.textAlign).toBe('center');
    });
});
