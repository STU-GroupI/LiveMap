import React from 'react';
import {Snackbar, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';

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
    const styles = getStyles();

    return (
        <Snackbar
            elevation={3}
            icon={icon}
            onIconPress={dismissSnackBar}
            visible={visible}
            onDismiss={dismissSnackBar}
            action={action}
            theme={theme}
            style={styles.snackbar}
        >
            {children}
        </Snackbar>
    );
}

const getStyles = () =>
    StyleSheet.create({
        snackbar: {
            zIndex: 10,
        },
    });
