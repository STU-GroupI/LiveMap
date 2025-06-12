import { render, fireEvent } from '@testing-library/react-native';
import POIMarker from '../../src/components/map/POIMarker';
import { POI } from '../../src/models/POI/POI';
import {POIStatus} from '../../src/models/POI/POIStatus.ts';

// Mocks
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

jest.mock('../../src/util/MaterialDesignIconsHelpers', () => ({
    formatIconName: (name: string) => `formatted-${name}`,
}));

const samplePOI: POI = {
    guid: '1234',
    title: 'Sample POI',
    image: 'https://example.com/image.jpg',
    description: 'This is a sample point of interest.',
    coordinate: {
        latitude: 37.7749,
        longitude: -122.4194,
    },
    category: {
        category: 'Transportation',
        categoryName: 'Transportation',
        iconName: 'bike',
    },
    status: POIStatus.Active,
    map: {
        id: 'map-1234',
        name: 'Sample Map',
        imageUrl: 'https://example.com/map.jpg',
        bounds: [],
        area: [],
        pointsOfInterest: [],
    },
    wheelChairAccessible: false,
    openingHours: [],
};

describe('POIMarker Component', () => {
    it('renders correctly and uses formatted icon name', () => {
        const { getByTestId } = render(
            <POIMarker poi={samplePOI} isActive={false} onSelect={jest.fn()} />
        );

        // Check the icon rendering
        expect(getByTestId('mock-icon-formatted-bike')).toBeTruthy();
        expect(getByTestId('point-annotation-poi-1234')).toBeTruthy();
    });

    it('calls onSelect when annotation is selected', () => {
        const onSelectMock = jest.fn();

        const { getByTestId } = render(
            <POIMarker poi={samplePOI} isActive={false} onSelect={onSelectMock} />
        );

        fireEvent(getByTestId('point-annotation-poi-1234'), 'touchStart');
        expect(onSelectMock).toHaveBeenCalledWith(samplePOI);
    });

    it('renders with active style when isActive is true', () => {
        const { getByTestId } = render(
            <POIMarker poi={samplePOI} isActive={true} onSelect={jest.fn()} />
        );

        expect(getByTestId('mock-icon-formatted-bike')).toBeTruthy();
        expect(getByTestId('point-annotation-poi-1234')).toBeTruthy();
    });
});

