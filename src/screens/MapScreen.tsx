import React, { useState  } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {Icon} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {useMapConfig} from '../config/MapConfigContext.tsx';
import useLocation from '../hooks/UseLocation.tsx';
import useBottomSheet from '../hooks/useBottomSheet.tsx';
import Loader from '../components/Loader.tsx';

import {Camera, MapView, UserLocation} from '@maplibre/maplibre-react-native';
import { POI } from '../models/POI.ts';
import MapPOIBottomSheet from '../components/MapPOIBottomSheet.tsx';
import POIMarker from '../components/POIMarker.tsx';

const MapScreen = () => {
    const {
        config,
        pois,
        loading,
        cameraRef,
        handleRecenter,
    } = useMapConfig();
    const { hasPermission } = useLocation();
    const { bottomSheetRef, handleOpen, handleClose } = useBottomSheet();
    const insets = useSafeAreaInsets();

    const [activePoi, setActivePoi] = useState<POI|undefined>();

    if (loading || !hasPermission) {
        return <Loader />;
    }

    const handlePoiSelect = (selectedPoi: POI) => {
        if (activePoi?.guid !== selectedPoi.guid) {
            cameraRef?.current?.flyTo([selectedPoi.longitude, selectedPoi.latitude]);
            handleClose(() => setActivePoi(undefined));

            setActivePoi({ ...selectedPoi });
            setTimeout(() => handleOpen(), 0);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapStyle={config.mapStyle}
                rotateEnabled={false}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={config.center}
                />

                {pois.length > 0 && pois.map((mapPoi) => (
                    <POIMarker
                        key={`poi-${mapPoi.guid}`}
                        poi={mapPoi}
                        isActive={activePoi?.guid === mapPoi.guid}
                        onSelect={handlePoiSelect}
                    />
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
                <TouchableOpacity style={styles.button} onPress= {() => handleRecenter} activeOpacity={0.9}>
                    <Icon source="crosshairs-gps" size={26} color="#000" />
                </TouchableOpacity>
            </View>

            {activePoi && (
                <MapPOIBottomSheet bottomSheetRef={bottomSheetRef} poi={activePoi} onClose={() => setActivePoi(undefined)}/>
            )}
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
    markerWrapper: {
        padding: 10,
        backgroundColor: 'transparent',
    },
    markerHitbox: {
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    markerSelected: {
        backgroundColor: 'rgba(0, 23, 238, 0.1)',
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
