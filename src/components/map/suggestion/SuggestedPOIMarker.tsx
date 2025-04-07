import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { PointAnnotation } from '@maplibre/maplibre-react-native';

interface SuggestedPOIMarkerProps {
    location: [number, number];
}

export default function SuggestedPOIMarker ({ location }: SuggestedPOIMarkerProps) {
    return (
        <PointAnnotation
            key={`suggested-poi-${Math.round(location[0])}-${Math.round(location[1])}`}
            id={`suggested-poi-${Math.round(location[0])}}`}
            coordinate={[location[0], location[1]]}
            anchor={{ x: 0.5, y: 1 }}
        >
            <View style={styles.markerWrapper}>
                <View style={[styles.markerHitbox, styles.markerSelected]}>
                    <Icon
                        size={30}
                        source={'map-marker-check'}
                        color={'#0017EE'}
                    />
                </View>
            </View>
        </PointAnnotation>
    );
};

const styles = StyleSheet.create({
    markerWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerHitbox: {
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerSelected: {
        backgroundColor: 'rgba(0, 23, 238, 0.1)',
    },
});
