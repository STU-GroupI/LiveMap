import React from 'react';
import {useMapConfig} from '../config/MapConfigContext.tsx';
import useLocation from '../hooks/UseLocation.tsx';
import Loader from '../components/Loader.tsx';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Camera, MapView, PointAnnotation, UserLocation} from '@maplibre/maplibre-react-native';
import {Icon} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MapScreen = () => {
    const {
        config,
        pois,
        loading,
        cameraRef,
        handleRecenter,
    } = useMapConfig();
    const { hasPermission } = useLocation();
    const insets = useSafeAreaInsets();

    if (loading || !hasPermission) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapStyle={config.mapStyle}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={config.center}
                />

                {pois.map((poi, idx) => (
                    <PointAnnotation
                        key={idx}
                        id={idx.toString()}
                        coordinate={[poi.longitude, poi.latitude]}
                        anchor={{ x: 0.45, y: 0.9 }}
                        onSelected={() => console.log('POI selected:', poi)}
                    >
                        <Icon size={30} source="map-marker" />
                    </PointAnnotation>
                ))}

                <UserLocation showsUserHeadingIndicator={true}/>
            </MapView>

            <View
                style={[
                    styles.controls,
                    {
                        top: insets.top + 10,
                        right: insets.right + 10,
                    },
                ]}
            >
                <TouchableOpacity style={styles.button} onPress={handleRecenter}>
                    <Icon source="crosshairs-gps" size={26} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    controls: {
        position: 'absolute',
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapScreen;
