import React from 'react';
import { StyleSheet } from 'react-native';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';

import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

interface BaseDialogProps {
    children: React.ReactNode;
    title?: String,
    iconSource?: String,
    onSubmit?: () => void;
    onDismiss?: () => void;
    visible: boolean;
    hide: (callback?: () => void) => void;
    submitText?: string;
    dismissText?: string;
}

export default function BaseDialog({
    children,
    title,
    iconSource,
    onSubmit,
    onDismiss,
    visible,
    hide,
    submitText,
    dismissText,
}: BaseDialogProps) {
    const theme = useTheme();
    const styles = getStyles();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={() => hide()}>
                {iconSource && (
                    <Dialog.Icon icon={iconSource as IconSource} color={theme.colors.primary} />
                )}

                <Dialog.Title style={styles.titleContainer}>
                    {title && (
                        <Text style={[styles.title, iconSource ? styles.centerTitle : {}]}>
                            {title}
                        </Text>
                    )}
                </Dialog.Title>

                <Dialog.Content>
                    {children}
                </Dialog.Content>

                <Dialog.Actions style={styles.actions}>
                    <Button textColor="red" onPress={() => hide(onDismiss)}>{dismissText ?? 'Cancel'}</Button>
                    <Button textColor="purple" onPress={() => hide(onSubmit)}>{submitText ?? 'Ok'}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const getStyles = () =>
    StyleSheet.create({
        titleContainer: {
            flexDirection: 'column',
            alignItems: 'center',
        },
        title: {
            marginLeft: 12,
            fontSize: 18,
        },
        centerTitle: {
            textAlign: 'center',
            marginLeft: 0,
        },
        actions: {
            justifyContent: 'space-between',
            paddingHorizontal: 20,
        },
    });

