import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon, MD3Theme, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface props {
    handleRecenter: () => void;
}

export default function MapCenterButton({handleRecenter}: props) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styles = getStyles(theme);

    return (
        <View
            style={[
                styles.controls,
                {
                    bottom: insets.bottom + 10,
                    right: insets.right + 10,
                },
            ]}
        >
            <TouchableOpacity style={styles.button} onPress={handleRecenter}>
                <Icon source="crosshairs-gps" size={26} color="#000" />
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        controls: {
            position: 'absolute',
        },

        button: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

