import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MapCreateSuggestion from '../../src/components/map/MapCreateSuggestion';
import { ScreenState } from '../../src/state/screenStateReducer';

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

jest.mock('../../src/context/MapConfigContext', () => ({
    useMapConfig: jest.fn(),
}));

jest.mock('../../src/services/rfcService.ts', () => ({
    createSuggestionRFC: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isPending: false,
    })),
}));

jest.mock('../../src/components/CustomSnackbar.tsx', () => () => <></>);
jest.mock('../../src/components/map/suggestion/SuggestCancelDialog.tsx', () => () => <></>);
jest.mock('../../src/components/map/suggestion/MapSuggestLocationBottomSheet.tsx', () => (props: any) => {
    const { Text, TouchableOpacity } = require('react-native');

    return (
        props?.onConfirm ? (
            <TouchableOpacity onPress={props.onConfirm}>
                <Text>Confirm</Text>
            </TouchableOpacity>
        ) : null
    );
});
jest.mock('../../src/components/map/suggestion/SuggestLocationDataSheet.tsx', () => (props: any) => {
    const { Text, TouchableOpacity } = require('react-native');

    return (
        props?.onSubmit ? (
            <TouchableOpacity onPress={() => props.onSubmit({ title: 'New POI' })}>
                <Text>Submit</Text>
            </TouchableOpacity>
        ) : null
    );
});

describe('MapCreateSuggestion', () => {
    const suggestedLocation: [number, number] = [1.0, 2.0];
    const setSuggestedLocation = jest.fn();
    const bottomSheetRef = { current: {} };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(require('../../src/context/MapConfigContext').useMapConfig).mockReturnValue({
            screenState: ScreenState.SUGGESTING,
            dispatch: jest.fn(),
            cameraRef: { current: { flyTo: jest.fn() } },
            config: { mapId: 'map-123' },
        });
    });

    it('renders correctly with suggested location', () => {
        const { getByText } = render(
            <MapCreateSuggestion
                bottomSheetRef={bottomSheetRef}
                suggestedLocation={suggestedLocation}
                setSuggestedLocation={setSuggestedLocation}
            />
        );

        expect(getByText('Confirm')).toBeTruthy(); // from mock MapSuggestLocationBottomSheet
    });

    it('dispatches setFormNewPOI when confirm is pressed', async () => {
        const dispatchMock = jest.fn();
        jest.mocked(require('../../src/context/MapConfigContext').useMapConfig).mockReturnValue({
            screenState: ScreenState.SUGGESTING,
            dispatch: dispatchMock,
            cameraRef: { current: { flyTo: jest.fn() } },
            config: { mapId: 'map-123' },
        });

        const { getByText } = render(
            <MapCreateSuggestion
                bottomSheetRef={bottomSheetRef}
                suggestedLocation={suggestedLocation}
                setSuggestedLocation={setSuggestedLocation}
            />
        );

        fireEvent.press(getByText('Confirm'));
        await waitFor(() => {
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: 3,
                type: 'SET_SCREEN',
            });
        });
    });

    it('does not render Confirm button if suggestedLocation is undefined', () => {
        const { queryByText } = render(
            <MapCreateSuggestion
                bottomSheetRef={bottomSheetRef}
                suggestedLocation={undefined}
                setSuggestedLocation={setSuggestedLocation}
            />
        );
        expect(queryByText('Confirm')).toBeNull();
    });

    it('renders SuggestLocationDataSheet when screenState is FORM_POI_NEW', () => {
        jest.mocked(require('../../src/context/MapConfigContext').useMapConfig).mockReturnValue({
            screenState: ScreenState.FORM_POI_NEW,
            dispatch: jest.fn(),
            cameraRef: { current: { flyTo: jest.fn() } },
            config: { mapId: 'map-123' },
        });

        const { getByText } = render(
            <MapCreateSuggestion
                bottomSheetRef={bottomSheetRef}
                suggestedLocation={suggestedLocation}
                setSuggestedLocation={setSuggestedLocation}
            />
        );
        expect(getByText('Submit')).toBeTruthy();
    });

    it('calls suggestionMutation.mutate with correct data on submit', () => {
        const mutateMock = jest.fn();
        (require('@tanstack/react-query').useMutation as jest.Mock).mockReturnValue({
            mutate: mutateMock,
            isPending: false,
        });

        jest.mocked(require('../../src/context/MapConfigContext').useMapConfig).mockReturnValue({
            screenState: ScreenState.FORM_POI_NEW,
            dispatch: jest.fn(),
            cameraRef: { current: { flyTo: jest.fn() } },
            config: { mapId: 'map-123' },
        });

        const { getByText } = render(
            <MapCreateSuggestion
                bottomSheetRef={bottomSheetRef}
                suggestedLocation={suggestedLocation}
                setSuggestedLocation={setSuggestedLocation}
            />
        );

        fireEvent.press(getByText('Submit'));
        expect(mutateMock).toHaveBeenCalledWith({
            title: 'New POI',
            mapId: 'map-123',
            coordinate: { longitude: 1.0, latitude: 2.0 },
        });
    });

    it('calls setSuggestedLocation(undefined) when screenState is VIEWING', () => {
        jest.mocked(require('../../src/context/MapConfigContext').useMapConfig).mockReturnValue({
            screenState: ScreenState.VIEWING,
            dispatch: jest.fn(),
            cameraRef: { current: { flyTo: jest.fn() } },
            config: { mapId: 'map-123' },
        });

        render(
            <MapCreateSuggestion
                bottomSheetRef={bottomSheetRef}
                suggestedLocation={suggestedLocation}
                setSuggestedLocation={setSuggestedLocation}
            />
        );
        expect(setSuggestedLocation).toHaveBeenCalledWith(undefined);
    });
});
