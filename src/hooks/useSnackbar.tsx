import { useCallback, useState} from 'react';


const useSnackbar = () => {
    const [visible, setVisible] = useState(false);

    const toggleSnackBar = useCallback(() => setVisible(!visible), [visible]);
    const dismissSnackBar = useCallback(() => setVisible(false), []);

    return {
        visible,
        toggleSnackBar,
        dismissSnackBar,
    };
};

export default useSnackbar;
