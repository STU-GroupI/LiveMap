import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {MD3Theme, Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function MapTopBarButton() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styles = getStyles(theme);

    return (
        <View
            style={[
                styles.topToggleBar,
                {
                    top: insets.top + 10,
                },
            ]}
        >
            <View style={styles.toggleButtonGroup}>
                <TouchableOpacity style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        topToggleBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            left: '50%',
            position: 'absolute',
            zIndex: 10,
            marginLeft: -100,
            width: 250,
        },

        toggleButtonGroup: {
            flexDirection: 'row',
            backgroundColor: theme.colors.background,
            borderRadius: 8,
            overflow: 'hidden',
            elevation: 3,
            shadowColor: theme.colors.shadow ?? '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },

        toggleButton: {
            width: 100,
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor: theme.colors.outline ?? '#ccc',
        },

        toggleButtonText: {
            fontSize: 14,
            color: theme.colors.onSurface ?? '#333',
            textAlign: 'center',
        },
    });
