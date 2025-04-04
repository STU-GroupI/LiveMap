import {useCallback, useState} from 'react';

export default function  useDialog() {
    const [visibleDialog, setVisibleDialog] = useState(false);

    const showDialog = useCallback((callback?: () => void) => {
        setVisibleDialog(true);

        if (callback) {
            callback();
        }
    }, []);
    const hideDialog = useCallback((callback?: () => void) => {
        setVisibleDialog(false);

        if (callback) {
            callback();
        }
    }, []);

    return { visibleDialog, showDialog, hideDialog };
}
