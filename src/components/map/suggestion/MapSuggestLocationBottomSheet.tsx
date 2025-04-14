import React, { RefObject } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BaseBottomSheet from '../../base/baseBottomSheet.tsx';

import { Button } from 'react-native-paper';

import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface MapSuggestLocationBottomSheetProps {
    bottomSheetRef: ((ref: BottomSheet | null) => void) | RefObject<BottomSheetMethods | null>;
    onConfirm: () => void;
    onCancel: () => void;
    onFlyToLocation: () => void;
    onClose?: () => void;
}

export default function MapSuggestLocationBottomSheet({
  bottomSheetRef,
  onConfirm,
  onCancel,
  onFlyToLocation,
  onClose,
}: MapSuggestLocationBottomSheetProps) {
    return (
        <BaseBottomSheet
            bottomSheetRef={bottomSheetRef}
            index={-1}
            onClose={onClose}
            snapPoints={['20%', '20%']}
        >
            <View style={styles.modalDetails}>
                <TouchableOpacity style={styles.flyButton} onPress={onFlyToLocation}>
                    <Text style={styles.flyButtonText}>Re-center</Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <Button mode="contained" style={styles.button} onPress={onConfirm}>
                        Confirm
                    </Button>
                    <Button mode="outlined" style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                        Cancel
                    </Button>
                </View>
            </View>
        </BaseBottomSheet>
    );
}

const styles = StyleSheet.create({
    modalDetails: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 12,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#f1f1f1',
    },
    flyButton: {
        width: '100%',
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#28a745',
        alignItems: 'center',
    },
    flyButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
