import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import MapPOIBottomSheet from '../../src/components/map/MapPOIBottomSheet';
import {ScreenState} from '../../src/state/screenStateReducer';
import {POI} from '../../src/models/POI/POI';
import {POIStatus} from '../../src/models/POI/POIStatus.ts';

// === Mocks ===

// React Query
jest.mock('@tanstack/react-query', () => ({
    useMutation: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
}));

// Context and Hooks
jest.mock('../../src/context/MapConfigContext', () => ({
    useMapConfig: () => ({
        screenState: 'VIEWING',
        dispatch: jest.fn(),
    }),
}));

jest.mock('../../src/hooks/useBottomSheet.tsx', () => () => ({
    handleOpen: jest.fn(),
    handleClose: jest.fn(),
}));

jest.mock('../../src/hooks/useSnackbar.tsx', () => () => ({
    visibleSnackbar: false,
    toggleSnackBar: jest.fn(),
    dismissSnackBar: jest.fn(),
}));

jest.mock('../../src/hooks/useDialog.tsx', () => () => ({
    visibleDialog: false,
    showDialog: jest.fn(),
    hideDialog: jest.fn(),
}));

// Components
jest.mock('../../src/components/base/baseBottomSheet.tsx', () => ({ children }: any) => (
    <>{children}</>
));
jest.mock('../../src/components/CustomSnackbar.tsx', () => () => <></>);
jest.mock('../../src/components/map/suggestion/SuggestCancelDialog.tsx', () => () => <></>);
jest.mock('../../src/components/map/suggestion/SuggestPOIChangeDataSheet.tsx', () => () => <></>);

jest.mock('@react-native-vector-icons/material-design-icons', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: ({ name }: { name: string }) => <View testID={`mock-icon-${name}`} />,
    };
});

jest.mock('../../src/util/MaterialDesignIconsHelpers', () => ({
    formatIconName: (name: string) => `formatted-${name}`,
}));

// === Sample POI Data ===
const mockPOI: POI = {
    guid: 'poi-1',
    title: 'Test POI',
    description: 'A nice place to test.',
    coordinate: {
        latitude: 1.0,
        longitude: 2.0,
    },
    category: {
        category : 'Transportation',
        iconName: 'bike',
        categoryName: 'Bike Parking',
    },
    wheelChairAccessible: true,
    image: 'https://example.com/image.jpg',
    status: POIStatus.Active,
    map: {
        guid: 'map-1',
        name: 'Test Map',
    },
    openingHours: [
        {
            dayIndex: 1,
            dayOfWeek: 'Monday',
            start: '08:00',
            end: '17:00',
            guid: 'open-1',
        },
    ],
};

// === Tests ===

describe('MapPOIBottomSheet Component', () => {
    const bottomSheetRef = { current: {} };

    it('returns null if no POI is provided', () => {
        const { toJSON } = render(<MapPOIBottomSheet bottomSheetRef={bottomSheetRef} />);
        expect(toJSON()).toBeNull();
    });

    it('renders with POI in viewing mode', async () => {
        const { getByText, getByTestId, queryByText } = render(
            <MapPOIBottomSheet poi={mockPOI} bottomSheetRef={bottomSheetRef} />
        );

        // Wait for the POI title to appear to ensure the component is rendered
        await waitFor(() => {
            expect(queryByText('Test POI')).toBeTruthy();
        });

        expect(getByText('Test POI')).toBeTruthy();
        expect(getByText('Bike Parking')).toBeTruthy();
        expect(getByText('A nice place to test.')).toBeTruthy();
        expect(getByText('Monday')).toBeTruthy();
        expect(getByText('08:00 - 17:00')).toBeTruthy();
        expect(getByTestId('mock-icon-formatted-bike')).toBeTruthy();
    });

    it('handles "Report" button press and triggers form flow', async () => {
        const mockDispatch = jest.fn();
        const mockHandleClose = jest.fn();
        const mockHandleOpen = jest.fn();

        // Import the modules and access the functions directly
        const mapConfigModule = require('../../src/context/MapConfigContext');
        const useBottomSheetModule = require('../../src/hooks/useBottomSheet.tsx');

        jest.spyOn(mapConfigModule, 'useMapConfig').mockReturnValue({
            screenState: ScreenState.VIEWING,
            dispatch: mockDispatch,
        });

        const { getByText, queryAllByText } = render(
            <MapPOIBottomSheet poi={mockPOI} bottomSheetRef={bottomSheetRef} />
        );

        // Try to find the "Report" button by text, fallback to querying all nodes with that text
        let reportButton;
        try {
            reportButton = getByText('Report');
        } catch {
            // If not found by text, try to find any node with the text 'Report'
            const candidates = queryAllByText('Report');
            reportButton = candidates.length > 0 ? candidates[0] : null;
            if (!reportButton) {
                throw new Error('Could not find the "Report" button');
            }
        }

        fireEvent.press(reportButton);

        await waitFor(() => {
            expect(mockHandleClose).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalled();
            expect(mockHandleOpen).toHaveBeenCalledWith('dataform');
        });

        jest.restoreAllMocks();
    });
});
