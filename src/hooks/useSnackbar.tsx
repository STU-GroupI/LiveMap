import { useCallback, useState} from 'react';


const useSnackbar = () => {
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);

    const toggleSnackBar = useCallback(() => {
        setVisibleSnackbar(true);
    }, []);

    const dismissSnackBar = useCallback(() => setVisibleSnackbar(false), []);

    return {
        visibleSnackbar,
        toggleSnackBar,
        dismissSnackBar,
    };
};

export default useSnackbar;
