import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import {Icon, Button} from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {useMapConfig} from '../config/MapConfigContext.tsx';
import useLocation from '../hooks/UseLocation.tsx';
import Loader from '../components/Loader.tsx';

import {Camera, MapView, UserLocation} from '@maplibre/maplibre-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

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
    const bottomSheetRef = useRef<BottomSheet>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

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
                    <TouchableOpacity style={styles.button} onPress={handleRecenter} activeOpacity={0.9}>
                        <Icon source="crosshairs-gps" size={26} color="#000" />
                    </TouchableOpacity>
                </View>

                <BottomSheet
                    ref={ bottomSheetRef }
                    onChange={ handleSheetChanges }
                    snapPoints={['40%', '70%']}
                >
                    <BottomSheetView style={styles.modalContentContainer}>
                        <View style={styles.modalImageContainer}>
                            <View style={{ width: '100%', overflow: 'hidden' }}>
                                <Image 
                                    style={{ width: '100%', height: 200, resizeMode: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                                    source={require('../images/plus-supermarket.png')} />
                            </View>
                            <TouchableOpacity style={styles.modalReportButton} activeOpacity={0.8}>
                                <Icon source="alert-circle-outline" size={40} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 32 }}>Supermarkt Landal Plus</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>4,5</Text>
                            <Icon source="star" size={16} color="#FFBB00" />
                            <Icon source="star" size={16} color="#FFBB00" />
                            <Icon source="star" size={16} color="#FFBB00" />
                            <Icon source="star" size={16} color="#FFBB00" />
                            <Icon source="star" size={16} color="#FFBB00" />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12 }}>Body Small</Text>
                            <Text style={{ fontSize: 12 }}> • </Text>
                            <Icon source="wheelchair-accessibility" size={16} color="#000" />
                        </View>
                    </BottomSheetView>
                </BottomSheet>
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

    modalContentContainer: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    modalImageContainer: {
        position: 'relative',
        width: '100%',
        backgroundColor: '#fff',
    },
    modalReportButton: {
        position: 'absolute',
        top: 16,
        right: 16,

        backgroundColor: 'tomato',
        width: 50,
        height: 50,
        borderRadius: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default MapScreen;
