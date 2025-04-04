import React from 'react';
import BaseSnackbar from './base/baseSnackbar.tsx';

interface CustomSnackbarProps {
    visible: boolean;
    dismissSnackBar: (callback?: () => void) => void;
    message: string;
}

export default function CustomSnackbar({
    visible,
    dismissSnackBar,
    message,
}: CustomSnackbarProps) {
    return (
        <BaseSnackbar
            visible={visible}
            dismissSnackBar={dismissSnackBar}
        >
            {message}
        </BaseSnackbar>
    );
}
