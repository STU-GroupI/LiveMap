import React, { useCallback, useMemo, useRef, useState  } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import {Icon, Button} from 'react-native-paper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {useMapConfig} from '../config/MapConfigContext.tsx';
import useLocation from '../hooks/UseLocation.tsx';
import Loader from '../components/Loader.tsx';

import {Camera, MapView, PointAnnotation, UserLocation} from '@maplibre/maplibre-react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { POI } from '../models/POI.ts';
import MapPOIBottomSheet from '../components/MapPOIBottomSheet.tsx';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

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

    // ref
    const bottomSheetRef = useRef<BottomSheetMethods | null>(null);

    const [poi, setPoi] = useState<POI|undefined>();

    // callbacks
    const handleOpenSheet = () => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.snapToIndex(0);
        }
    };

    if (loading || !hasPermission) {
        return <Loader />;
    } 

    return (
        <View style={styles.container}>
            <GestureHandlerRootView style={{ flex: 1 }}>
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
                        onSelected={() => {
                            setPoi(poi);
                            handleOpenSheet();
                        }}
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
                    <TouchableOpacity style={styles.button} onPress= {() => { handleOpenSheet(); handleRecenter}} activeOpacity={0.9}>
                        <Icon source="crosshairs-gps" size={26} color="#000" />
                    </TouchableOpacity>
                </View>

                <MapPOIBottomSheet bottomSheetRef={bottomSheetRef} poi={poi} />
            </GestureHandlerRootView>
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
