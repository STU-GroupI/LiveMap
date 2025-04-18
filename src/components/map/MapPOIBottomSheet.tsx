import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {DataTable, Avatar, Text, IconButton, Chip} from 'react-native-paper';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {POI} from '../../models/POI/POI.ts';

import {useMapConfig} from '../../context/MapConfigContext.tsx';
import BaseBottomSheet from '../base/baseBottomSheet.tsx';
import useSnackbar from '../../hooks/useSnackbar.tsx';
import useDialog from '../../hooks/useDialog.tsx';
import useBottomSheets from '../../hooks/useBottomSheet.tsx';
import CustomSnackbar from '../CustomSnackbar.tsx';
import SuggestCancelDialog from './suggestion/SuggestCancelDialog.tsx';
import SuggestPOIChangeDataSheet from './suggestion/SuggestPOIChangeDataSheet.tsx';
import {createChangeRFC} from '../../services/apiService.ts';
import {setFormEditPOI, setViewing} from '../../state/screenStateActions.ts';
import {ScreenState} from '../../state/screenStateReducer.ts';

interface MapPOIBottomSheetProps {
    poi?: POI;
    bottomSheetRef: React.RefObject<Record<string, BottomSheetMethods | null>>;
    onClose?: () => void;
}

export default function MapPOIBottomSheet({ poi, bottomSheetRef, onClose }: MapPOIBottomSheetProps) {
    const {
        screenState,
        dispatch,
    } = useMapConfig();

    const [ snackbarMessage, setSnackbarMessage ] = React.useState<string>('');

    const { handleOpen, handleClose } = useBottomSheets(['detail', 'location', 'dataform']);

    const { visibleSnackbar, toggleSnackBar, dismissSnackBar } = useSnackbar();
    const { visibleDialog, showDialog, hideDialog } = useDialog();


    const handleSuggestChange = () => {
        handleClose();
        dispatch(setFormEditPOI());
        handleOpen('dataform');
    };

    if (!poi) {
        return null;
    }

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
                    dispatch(setViewing());
                }} onDismiss={() => {}}
            />

            { (screenState === ScreenState.FORM_POI_CHANGE) && (
                <SuggestPOIChangeDataSheet
                    poi={poi}
                    onCancel={() => {
                        showDialog();
                    }}
                    onSubmit={(data) =>{
                        createChangeRFC(data).finally(() => {
                            handleClose();

                            setSnackbarMessage('Your suggestion has been submitted!');
                            toggleSnackBar();

                            dispatch(setViewing());
                        }).catch(() => {
                            setSnackbarMessage('Your suggestion could not be submitted!');
                            toggleSnackBar();
                        });
                    }}
                    onClose={() => dispatch(setViewing())}
                    bottomSheetRef={(ref) => (bottomSheetRef.current.dataform = ref)}
                />
            )}

            { (screenState === ScreenState.VIEWING) && (
                <BaseBottomSheet
                    bottomSheetRef={(ref) => (bottomSheetRef.current.detail = ref)}
                    index={-1}
                    onClose={onClose}
                >
                    <View style={styles.container}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../images/plus-supermarket.png')} style={styles.image} />
                            <IconButton icon="alert-circle-outline" size={28} containerColor="red" iconColor="white" style={styles.reportButton} onPress={handleSuggestChange} />
                        </View>

                        <BottomSheetScrollView>
                            <View style={styles.content}>
                                {poi?.category && (
                                    <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
                                        {poi.category?.categoryName}
                                    </Chip>
                                )}

                                <Text variant="titleLarge" style={styles.title}>
                                    {poi?.title}
                                </Text>

                                <Text variant="bodyMedium" style={styles.description}>
                                    {poi?.description}
                                </Text>

                                <View style={styles.iconRow}>
                                    {poi?.wheelChairAccessible && (
                                        <View style={styles.iconItem}>
                                            <Avatar.Icon size={24} icon="wheelchair-accessibility" style={styles.icon} />
                                            <Text style={styles.iconText}>Accessible</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.content}>
                                <Text variant="titleLarge" style={styles.title}>
                                    Opening Hours
                                </Text>
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title>Day</DataTable.Title>
                                        <DataTable.Title>Open - closed</DataTable.Title>
                                    </DataTable.Header>

                                    {poi.openingHours
                                        .sort((a, b) => (a.dayIndex < b.dayIndex ? -1 : 1))
                                        .map((item, index) => (
                                        <DataTable.Row key={'opening-hours-row-' + index + '-' + item.guid}>
                                            <DataTable.Cell>{item.dayOfWeek}</DataTable.Cell>
                                            <DataTable.Cell>{item.start} - {item.end}</DataTable.Cell>
                                        </DataTable.Row>
                                    ))}
                                </DataTable>
                            </View>
                        </BottomSheetScrollView>
                    </View>
                </BaseBottomSheet>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingBottom: 15,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    reportButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'tomato',
    },
    content: {
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    categoryChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#d7d7d7',
        marginBottom: 5,
    },
    categoryText: {
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    description: {
        marginTop: 5,
        color: '#666',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    iconItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    icon: {
        backgroundColor: '#f5f5f5',
        marginRight: 5,
    },
    iconText: {
        fontSize: 14,
        color: '#333',
    },
    actionButton: {
        marginTop: 15,
        backgroundColor: '#d9534f',
    },
});
