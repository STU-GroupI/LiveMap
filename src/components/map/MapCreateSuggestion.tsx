import React, { useEffect } from 'react';
import CustomSnackbar from '../CustomSnackbar.tsx';
import SuggestCancelDialog from './suggestion/SuggestCancelDialog.tsx';
import MapSuggestLocationBottomSheet from './suggestion/MapSuggestLocationBottomSheet.tsx';
import SuggestLocationDataSheet from './suggestion/SuggestLocationDataSheet.tsx';
import useBottomSheets from '../../hooks/useBottomSheet.tsx';
import useSnackbar from '../../hooks/useSnackbar.tsx';
import useDialog from '../../hooks/useDialog.tsx';
import { useMapConfig } from '../../context/MapConfigContext.tsx';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { setFormNewPOI, setSuggesting, setViewing } from '../../state/screenStateActions.ts';
import { ScreenState } from '../../state/screenStateReducer.ts';
import { createSuggestionRFC } from '../../services/rfcService.ts';
import { useMutation } from '@tanstack/react-query';

interface props {
    bottomSheetRef: React.RefObject<Record<string, BottomSheetMethods | null>>
    suggestedLocation: [number, number] | undefined;
    setSuggestedLocation: (location: [number, number] | undefined) => void;
}

export default function MapCreateSuggestion({ bottomSheetRef, suggestedLocation, setSuggestedLocation }: props) {
    const {
        screenState,
        dispatch,
        cameraRef,
        config,
    } = useMapConfig();

    const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');

    const { handleOpen, handleClose } = useBottomSheets(['detail', 'location', 'dataform']);
    const { visibleSnackbar, toggleSnackBar, dismissSnackBar } = useSnackbar();
    const { visibleDialog, showDialog, hideDialog } = useDialog();

    const suggestionMutation = useMutation({
        mutationFn: createSuggestionRFC,
        onSuccess: () => {
            setSnackbarMessage('Your suggestion has been submitted!');
            toggleSnackBar();
            dispatch(setViewing());
        },
        onError: (err) => {
            console.log(err);
            setSnackbarMessage('Your suggestion could not be submitted!');
            toggleSnackBar();
        },
    });

    useEffect(() => {
        if (screenState === ScreenState.SUGGESTING && suggestedLocation) {
            handleOpen('location');
            cameraRef?.current?.flyTo([suggestedLocation[0], suggestedLocation[1]]);
        }
        else if (screenState === ScreenState.FORM_POI_NEW && suggestedLocation) {
            handleOpen('dataform');
        }
        else if (screenState === ScreenState.VIEWING) {
            handleClose();
            setSuggestedLocation(undefined);
        }
    }, [screenState, suggestedLocation, handleOpen, handleClose, cameraRef, setSuggestedLocation]);

    const handleConfirmSuggestion = () => {
        dispatch(setFormNewPOI());
    };

    const handleCancelSuggestion = () => {
        dispatch(setViewing());
    };

    const handleSubmitSuggestion = (data: any) => {
        if (suggestedLocation) {
            data.mapId = config.mapId;
            data.coordinate = { longitude: suggestedLocation[0], latitude: suggestedLocation[1] };

            suggestionMutation.mutate(data);
        }
    };

    return (
        <>
            <CustomSnackbar
                visible={visibleSnackbar}
                dismissSnackBar={dismissSnackBar}
                message={snackbarMessage}
            />

            <SuggestCancelDialog
                visible={visibleDialog}
                hide={hideDialog}
                onSubmit={() => dispatch(setSuggesting())}
                onDismiss={() => {}}
            />

            {suggestedLocation && (
                <MapSuggestLocationBottomSheet
                    onConfirm={handleConfirmSuggestion}
                    onCancel={handleCancelSuggestion}
                    onFlyToLocation={() => cameraRef?.current?.flyTo([suggestedLocation[0], suggestedLocation[1]])}
                    bottomSheetRef={(ref) => (bottomSheetRef.current.location = ref)}
                />
            )}

            {screenState === ScreenState.FORM_POI_NEW && suggestedLocation && (
                <SuggestLocationDataSheet
                    onCancel={showDialog}
                    onSubmit={handleSubmitSuggestion}
                    isSubmitting={suggestionMutation.isPending}
                    bottomSheetRef={(ref) => (bottomSheetRef.current.dataform = ref)}
                />
            )}
        </>
    );
}
