import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMapConfig } from '../../../context/MapConfigContext.tsx';
import { ScreenState } from '../../../state/screenStateReducer.ts';

interface props {
    handleCreateSuggestion: () => void;
    active: boolean;
}

export default function SuggestPOIButton({ handleCreateSuggestion, active }: props) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styles = getStyles(theme, insets, active);

    const { screenState } = useMapConfig();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(screenState === ScreenState.VIEWING);
    }, [screenState]);

    if (!isVisible) {
        return null;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.suggestButton}
                onPress={handleCreateSuggestion}
                testID="suggest-poi-btn"
            >
                <Text style={styles.suggestButtonText}>Suggest POI</Text>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (theme: MD3Theme, insets: EdgeInsets, active: boolean) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            position: 'absolute',
            top: insets.top + 10,
            left: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            width: 90,
            elevation: 3,
            shadowColor: theme.colors.shadow ?? '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },

        suggestButton: {
            backgroundColor: active ? theme.colors.primary : theme.colors.background,
            width: '100%',
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 6,
            padding: 5,
        },

        suggestButtonText: {
            color: active ? theme.colors.background : theme.colors.primary,
            fontSize: 14,
            textAlign: 'center',
        },
    });
