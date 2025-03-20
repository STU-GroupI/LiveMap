import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import {View, StyleSheet, ActivityIndicator, Image, Text, TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-paper';
import { POI } from '../models/POI';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface MapPOIBottomSheetProps {
    poi?: POI;
    bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
}

export default function MapPOIBottomSheet({ poi, bottomSheetRef }: MapPOIBottomSheetProps) {
    const [index, setIndex] = useState(0);

    const handleSheetChanges = useCallback((index: number) => {
        setIndex(index);
    }, []);

    return (
        <BottomSheet
                    ref={ bottomSheetRef }
                    onChange={ handleSheetChanges }
                    snapPoints={['40%', '70%']}
                    enablePanDownToClose={true}
                    enableDynamicSizing={false}
                >
                    <BottomSheetScrollView style={styles.modalContentContainer}>
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

                        <View style={{ padding: 8 }}>
                            <Text style={{ fontSize: 32 }}>{poi?.title}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>{poi?.rating}</Text>
                                <Icon source="star" size={16} color="#FFBB00" />
                                <Icon source="star" size={16} color="#FFBB00" />
                                <Icon source="star" size={16} color="#FFBB00" />
                                <Icon source="star" size={16} color="#FFBB00" />
                                <Icon source="star" size={16} color="#FFBB00" />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12 }}>Body Small</Text>
                                {
                                    poi?.wheelChairAccessible && (
                                        <>
                                            <Text style={{ fontSize: 12 }}> • </Text>
                                            <Icon source="wheelchair-accessibility" size={16} color="#000" />
                                        </>
                                    )
                                }
                            </View>
                            <View>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>AAA</Text>
                                <Text>BBB</Text>
                            </View>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
    );
}

const styles = StyleSheet.create({
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
