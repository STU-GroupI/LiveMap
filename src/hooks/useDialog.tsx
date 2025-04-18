import {useCallback, useState} from 'react';

export default function  useDialog() {
    const [visibleDialog, setVisibleDialog] = useState(false);

    const showDialog = useCallback((callback?: () => void) => {
        setVisibleDialog(true);

        if (typeof callback === 'function') {
            callback();
        }
    }, []);
    const hideDialog = useCallback((callback?: () => void) => {
        setVisibleDialog(false);

        if (typeof callback === 'function') {
            callback();
        }
    }, []);

    return { visibleDialog, showDialog, hideDialog };
}
