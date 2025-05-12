const {View} = require('react-native');
const React = require('react');
require('react-native-reanimated').setUpTests();

// Mocks
jest.mock('@maplibre/maplibre-react-native', () => {
    const React = require('react');
    const View = require('react-native').View;

    return {
        __esModule: true,
        UserLocation: (props) => <View {...props} testID="MockUserLocation" />,
        MapView: (props) => <View {...props} testID="MockMapView" />,
        Camera: (props) => <View {...props} testID="MockCamera" />,
        CameraRef: jest.fn(),

        // 👇 MOCK CLASSES / STATIC OBJECTS
        LocationManager: {
            start: jest.fn(),
            stop: jest.fn(),
        },
    };
});

jest.mock('@react-native-community/geolocation', () => {
    return {
        addListener: jest.fn(),
        startObserving: jest.fn(),
        stopObserving: jest.fn(),
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn(),
    };
});

jest.mock('@react-native-vector-icons/material-design-icons', () => {
    const React = require('react');
    const View = require('react-native').View;

    return {
        __esModule: true,
        default: ({ name }) => (
            <View testID={`mock-icon-${name}`} />
        ),
    };
});

jest.mock('@tanstack/react-query', () => {
    const originalModule = jest.requireActual('@tanstack/react-query');
    return {
        ...originalModule,
        useQuery: jest.fn(), // Mock useQuery
    };
});
