import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PointAnnotation } from '@maplibre/maplibre-react-native';

interface POIClusterMarkerProps {
    id: string;
    coordinate: [number, number];
    pointCount: number;
    onPress: () => void;
}

const POIClusterMarker = ({ id, coordinate, pointCount, onPress }: POIClusterMarkerProps) => {
    const handlePress = () => {
        onPress();
    };

    return (
        <PointAnnotation
            id={`cluster-${id}`}
            coordinate={coordinate}
            onSelected={handlePress}
        >
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={handlePress}
                style={styles.touchable}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <View style={styles.clusterMarker}>
                    <Text style={styles.clusterText}>{pointCount}</Text>
                </View>
            </TouchableOpacity>
        </PointAnnotation>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clusterMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 23, 238, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    clusterText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
export default POIClusterMarker;