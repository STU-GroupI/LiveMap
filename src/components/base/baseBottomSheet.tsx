import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

interface BaseBottomSheetProps {
    children: React.ReactNode;
    bottomSheetRef: ((ref: BottomSheet | null) => void) | React.RefObject<BottomSheetMethods | null>;
    index?: number;
    onChange?: (index: number) => void;
    onClose?: () => void;
    snapPoints?: (string | number)[];
    background?: string;
}

export default function BaseBottomSheet({
    children,
    bottomSheetRef,
    onChange,
    onClose,
    snapPoints = ["40%", "70%"],
    background = '#fff',
}: BaseBottomSheetProps) {
    const styles = getStyles(background);
    const handleSheetChange = useCallback(
        (newIndex: number) => {
            onChange?.(newIndex);
            if (newIndex === -1) {
                onClose?.();
            }
        },
        [onChange, onClose]
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose
            onChange={handleSheetChange}
            style={styles.bottomSheetContainer}
        >
            <BottomSheetScrollView style={styles.scrollContainer}>{children}</BottomSheetScrollView>
        </BottomSheet>
    );
}

const getStyles = (background: string) => StyleSheet.create({
    bottomSheetContainer: {
        zIndex: 100,
        elevation: 100,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: background,
    },
});
