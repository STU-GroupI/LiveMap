import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import { POI } from '../../models/POI/POI.ts';

interface POIMarkerProps {
    poi: POI;
    isActive: boolean;
    onSelect: (poi: POI) => void;
}

export default function POIMarker ({ poi, isActive, onSelect }: POIMarkerProps) {
    return (
        <PointAnnotation
            key={`poi-${poi.guid}-${isActive ? 'active' : 'inactive'}`}
            id={`poi-${poi.guid}`}
            coordinate={[poi.coordinate.longitude, poi.coordinate.latitude]}
            anchor={{ x: 0.5, y: 1 }}
            onSelected={() => onSelect(poi)}
        >
            <View style={styles.markerWrapper}>
                <View style={[styles.markerHitbox, isActive && styles.markerSelected]}>
                    <Icon
                        size={30}
                        source={isActive ? 'map-marker-check' : 'map-marker'}
                        color={isActive ? '#0017EE' : '#000'}
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
