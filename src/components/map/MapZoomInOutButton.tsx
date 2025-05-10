import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {MD3Theme, useTheme} from 'react-native-paper';

interface props {
    handleZoomIn: () => void;
    handleZoomOut: () => void;
}

export default function MapZoomInOutButton({handleZoomIn, handleZoomOut}: props) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styles = getStyles(theme);

    return (
        <View
            style={[
                styles.controls,
                {
                    top: insets.top + 10,
                    right: insets.right + 10,
                },
            ]}
        >
            <View style={styles.zoomControlContainer}>
                <TouchableOpacity
                    style={[styles.zoomButton, styles.zoomTopButton]}
                    onPress={handleZoomIn}
                    testID={'zoom-in'}
                >
                    <MaterialDesignIcons name="plus" size={20} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.zoomButton, styles.zoomBottomButton]}
                    onPress={handleZoomOut}
                    testID={'zoom-out'}
                >
                    <MaterialDesignIcons name="minus" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>

    );
}

const getStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        controls: {
            position: 'absolute',
        },
        zoomControlContainer: {
            flexDirection: 'column',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.colors.background,
            elevation: 4,
            shadowColor: theme.colors.shadow ?? '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            marginBottom: 6,
        },
        zoomButton: {
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        zoomTopButton: {
            borderBottomWidth: 1,
            borderColor: theme.colors.outline ?? '#ddd',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        zoomBottomButton: {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
    });
