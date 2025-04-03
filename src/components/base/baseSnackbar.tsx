import React from 'react';
import {Snackbar, useTheme} from 'react-native-paper';

interface BaseSnackbarProps {
    children: React.ReactNode;
    visible: boolean;
    dismissSnackBar: (callback?: () => void) => void;
    icon?: string;
    action?: {
        label: string;
        onPress: () => void;
    }
}

export default function BaseSnackbar({
    children,
    icon,
    visible,
    dismissSnackBar,
    action,
}: BaseSnackbarProps) {
    const theme = useTheme();

    return (
        <Snackbar
            elevation={3}
            icon={icon}
            onIconPress={dismissSnackBar}
            visible={visible}
            onDismiss={dismissSnackBar}
            action={action}
            theme={theme}
        >
            {children}
        </Snackbar>
    );
}
