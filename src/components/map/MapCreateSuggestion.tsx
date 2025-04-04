import React from 'react';
import CustomSnackbar from '../CustomSnackbar.tsx';
import SuggestCancelDialog from './suggestion/SuggestCancelDialog.tsx';
import {ScreenState} from '../../interfaces/MapConfig.ts';
import MapSuggestLocationBottomSheet from './suggestion/MapSuggestLocationBottomSheet.tsx';
import SuggestLocationDataSheet from './suggestion/SuggestLocationDataSheet.tsx';
import useBottomSheets from '../../hooks/useBottomSheet.tsx';
import useSnackbar from '../../hooks/useSnackbar.tsx';
import useDialog from '../../hooks/useDialog.tsx';
import {useMapConfig} from '../../config/MapConfigContext.tsx';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {createSuggestionRFC} from '../../services/apiService.ts';

interface props {
    bottomSheetRef: React.RefObject<Record<string, BottomSheetMethods | null>>
    suggestedLocation: [number, number] | undefined;
    setSuggestedLocation: (location: [number, number] | undefined) => void;
}

export default function MapCreateSuggestion({ bottomSheetRef, suggestedLocation, setSuggestedLocation }: props) {
    const {
        screenState,
        setScreenState,
        cameraRef,
    } = useMapConfig();
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');

    const { handleOpen, handleClose } = useBottomSheets(['detail', 'location', 'dataform']);

    const { visibleSnackbar, toggleSnackBar, dismissSnackBar } = useSnackbar();
    const { visibleDialog, showDialog, hideDialog } = useDialog();

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
                onSubmit={() => {
                    handleClose();
                    setScreenState(ScreenState.SUGGESTING);
                    handleOpen('location');
                }} onDismiss={() => {}}
            />

            {suggestedLocation && (
                <MapSuggestLocationBottomSheet
                    onConfirm={() => {
                        setScreenState(ScreenState.FORM);
                        handleClose();

                        setSuggestedLocation(suggestedLocation);
                        cameraRef?.current?.flyTo([suggestedLocation[0], suggestedLocation[1]]);

                        handleOpen('dataform');
                    }}
                    onCancel={() => {
                        setScreenState(ScreenState.VIEWING);
                        handleClose();
                        setSuggestedLocation(undefined);
                    }}
                    onClose={() => {
                        if (screenState === ScreenState.SUGGESTING) {
                            setScreenState(ScreenState.VIEWING);
                        }
                    }}
                    onFlyToLocation={() => cameraRef?.current?.flyTo([suggestedLocation[0], suggestedLocation[1]])}
                    bottomSheetRef={(ref) => (bottomSheetRef.current.location = ref)}
                />
            )}

            { (screenState === ScreenState.FORM && suggestedLocation) && (
                <SuggestLocationDataSheet
                    onCancel={() => {
                        showDialog();
                    }}
                    onSubmit={(data) =>{
                        data.coordinate = { longitude: suggestedLocation[0], latitude: suggestedLocation[1] };
                        data.mapId = '41c751fc-82dd-2cdb-4e44-87b47ff984ed'; // Replace with actual mapId

                        createSuggestionRFC(data).then(() => {
                            handleClose();

                            setSnackbarMessage('Your suggestion has been submitted!');
                            toggleSnackBar();

                            setSuggestedLocation(undefined);
                            setScreenState(ScreenState.VIEWING);
                        }).catch(() => {
                            setSnackbarMessage('Your suggestion could not be submitted!');
                            toggleSnackBar();
                        });
                    }}
                    bottomSheetRef={(ref) => (bottomSheetRef.current.dataform = ref)}
                />
            )}
        </>
    );
}

