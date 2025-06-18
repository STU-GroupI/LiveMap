import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

interface SuggestedPOIMarkerProps {
    location: [number, number];
}

export default function SuggestedPOIMarker ({ location }: SuggestedPOIMarkerProps) {
    return (
        <PointAnnotation
            key={`suggested-poi-${Math.round(location[0])}-${Math.round(location[1])}`}
            id={`suggested-poi-${Math.round(location[0])}`}
            coordinate={[location[0], location[1]]}
            anchor={{ x: 0.5, y: 0.5 }}
        >
            <View style={[styles.markerCircle, styles.markerSelected]}>
                <MaterialDesignIcons
                    size={20}
                    color="#0017EE"
                    name="alert-box"
                />
            </View>
        </PointAnnotation>
    );
}

const styles = StyleSheet.create({
    markerCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderColor: '#e1e1e1',
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    markerSelected: {
        borderColor: '#0017EE',
        borderWidth: 2,
    },
});
