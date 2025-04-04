import React from 'react';
import CustomSnackbar from '../CustomSnackbar.tsx';
import SuggestCancelDialog from './suggestion/SuggestCancelDialog.tsx';
import {ScreenState} from '../../interfaces/MapConfig.ts';
import MapSuggestLocationBottomSheet from './suggestion/MapSuggestLocationBottomSheet.tsx';
import MapPOIBottomSheet from './MapPOIBottomSheet.tsx';
import SuggestLocationDataSheet from './suggestion/SuggestLocationDataSheet.tsx';
import useBottomSheets from '../../hooks/useBottomSheet.tsx';
import {POI} from '../../models/POI/POI.ts';
import useSnackbar from '../../hooks/useSnackbar.tsx';
import useDialog from '../../hooks/useDialog.tsx';
import {useMapConfig} from '../../config/MapConfigContext.tsx';

interface props {
    suggestedLocation: [number, number] | undefined;
    setSuggestedLocation: (location: [number, number] | undefined) => void;
    activePoi?: POI | undefined;
    setActivePoi: (poi: POI | undefined) => void;
}

export default function MapCreateSuggestion({ suggestedLocation, setSuggestedLocation, activePoi, setActivePoi }: props) {
    const {
        screenState,
        setScreenState,
        cameraRef,
    } = useMapConfig();

    const { bottomSheetRefs, handleOpen, handleClose } = useBottomSheets(['detail', 'location', 'dataform']);

    const { visibleSnackbar, toggleSnackBar, dismissSnackBar } = useSnackbar();
    const { visibleDialog, showDialog, hideDialog } = useDialog();

    return (
        <>
            <CustomSnackbar
                visible={visibleSnackbar}
                dismissSnackBar={dismissSnackBar}
                message="Your suggestion has been submitted!"
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
                    bottomSheetRef={(ref) => (bottomSheetRefs.current.location = ref)}
                />
            )}

            {activePoi && (
                <MapPOIBottomSheet
                    bottomSheetRef={(ref) => (bottomSheetRefs.current.detail = ref)}
                    poi={activePoi}
                    onClose={() => {
                        setActivePoi(undefined);
                    }}
                />
            )}

            { (screenState === ScreenState.FORM && suggestedLocation) && (
                <SuggestLocationDataSheet
                    onCancel={() => {
                        showDialog();
                    }}
                    onSubmit={(data) =>{
                        handleClose();
                        toggleSnackBar();

                        //The coordinates are added in using this class given there's an instance variable for them.
                        data.coordinate = { latitude: suggestedLocation[0], longitude: suggestedLocation[1]};
                        //The mapguid is hardcoded for now, but it will be dynamically set up
                        data.mapguid = '2b0bf3ea-0f37-dc37-8143-ab809c55727d';
                        //Console.log for testing purposes
                        //console.log('Submitted POI Data:', data);

                        //TO-DO: Create a POST request to the API to store the new data using the apiService.ts

                        setSuggestedLocation(undefined);
                        setScreenState(ScreenState.VIEWING);
                    }}
                    bottomSheetRef={(ref) => (bottomSheetRefs.current.dataform = ref)}
                />
            )}
        </>
    );
}

