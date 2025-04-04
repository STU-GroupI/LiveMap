import { useRef, useCallback, useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

const useBottomSheets = (ids: string[]) => {
    const bottomSheetRefs = useRef<Record<string, BottomSheet | null>>({});

    useEffect(() => {
        ids.forEach((id) => {
            if (!bottomSheetRefs.current[id]) {
                bottomSheetRefs.current[id] = null;
            }
        });
    }, [ids]);

    const handleOpen = useCallback((id: string) => {
        Object.entries(bottomSheetRefs.current).forEach(([key, ref]) => {
            if (key === id) {
                ref?.expand();
            } else {
                ref?.close();
            }
        });

        console.log('handleOpen', id);
    }, []);

    const handleClose = useCallback((id?: string) => {
        if (id) {
            bottomSheetRefs.current[id]?.close();
        } else {
            Object.values(bottomSheetRefs.current).forEach((ref) => ref?.close());
        }
    }, []);

    return { bottomSheetRefs, handleOpen, handleClose };
};

export default useBottomSheets;
