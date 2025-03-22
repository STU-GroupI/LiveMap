import { useRef, useCallback } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

const useBottomSheet = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleOpen = useCallback(() => {
        bottomSheetRef.current?.expand();
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleClose = useCallback((callback?: () => void) => {
        bottomSheetRef.current?.close();
        bottomSheetRef.current?.snapToIndex(-1);

        if (callback) {
            callback();
        }
    }, []);

    return { bottomSheetRef, handleOpen, handleClose };
};

export default useBottomSheet;
