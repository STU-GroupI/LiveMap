import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import { POI } from '../../models/POI/POI.ts';

interface POIMarkerProps {
    poi: POI;
    isActive: boolean;
    onSelect: (poi: POI) => void;
}

export default function POIMarker({ poi, isActive, onSelect }: POIMarkerProps) {
    const iconName = poi.category.iconName || 'map-marker';

    return (
        <PointAnnotation
            key={`poi-${poi.guid}-${isActive ? 'active' : 'inactive'}`}
            id={`poi-${poi.guid}`}
            coordinate={[poi.coordinate.longitude, poi.coordinate.latitude]}
            anchor={{ x: 0.5, y: 1 }}
            onSelected={() => onSelect(poi)}
        >
            <View style={[styles.markerCircle, isActive && styles.markerSelected]}>
                <MaterialDesignIcons
                    size={20}
                    color={isActive ? '#0017EE' : '#001743'}
                    name={iconName as any}
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
