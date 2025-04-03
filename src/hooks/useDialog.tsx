import {useCallback, useState} from 'react';

export default function  useDialog() {
    const [visible, setVisible] = useState(false);

    const show = useCallback((callback?: () => void) => {
        setVisible(true);

        if (callback) {
            callback();
        }
    }, []);
    const hide = useCallback((callback?: () => void) => {
        setVisible(false);

        if (callback) {
            callback();
        }
    }, []);

    return { visible, show, hide };
}
