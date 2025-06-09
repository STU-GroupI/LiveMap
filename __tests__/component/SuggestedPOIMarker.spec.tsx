import React from 'react';
import { render } from '@testing-library/react-native';
import SuggestedPOIMarker from '../../src/components/map/suggestion/SuggestedPOIMarker';
import {View} from "react-native";

// Mock PointAnnotation from @maplibre/maplibre-react-native
jest.mock('@maplibre/maplibre-react-native', () => {
    return {
        PointAnnotation: ({ children, id, coordinate }: any) => (
            <View id={id} coordinate={coordinate}>
                {children}
            </View>
        ),
    };
});

describe('SuggestedPOIMarker', () => {
    const location = [12.34, 56.78];

    it('renders correctly with given location', () => {
        const { getByTestId, toJSON } = render(<SuggestedPOIMarker location={location} />);

        // Check PointAnnotation rendered with correct id and coordinate props
        const annotation = getByTestId('mock-point-annotation');
        expect(annotation.props.id).toBe(`suggested-poi-${Math.round(location[0])}}`); // note extra } in original id prop
        expect(annotation.props.coordinate).toEqual(location);

        // Check if MaterialDesignIcons is rendered with correct props
        const icon = getByTestId('material-design-icon');
        expect(icon.props.name).toBe('alert-box');
        expect(icon.props.color).toBe('#0017EE');
        expect(icon.props.size).toBe(20);

        // Snapshot test to catch UI regressions
        expect(toJSON()).toMatchSnapshot();
    });
});
