import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-paper';
import { POI } from '../../models/POI/POI.ts';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import BaseBottomSheet from '../base/baseBottomSheet.tsx';

interface MapPOIBottomSheetProps {
    poi?: POI;
    bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
    onClose?: () => void;
}

export default function MapPOIBottomSheet({ poi, bottomSheetRef, onClose }: MapPOIBottomSheetProps) {
    if (!poi) {
        return null;
    }

    const schedule = [
        { day: "Monday", hours: "Closed" },
        { day: "Tuesday", hours: "11:00-18:00" },
        { day: "Wednesday", hours: "09:00-20:00" },
        { day: "Thursday", hours: "10:00-18:00" },
        { day: "Friday", hours: "09:00-17:00" },
        { day: "Saturday", hours: "Closed" },
        { day: "Sunday", hours: "10:00-18:00" },
    ];

    return (
        <BaseBottomSheet
            bottomSheetRef={bottomSheetRef}
            index={-1}
            onClose={onClose}
        >
            <View style={styles.modalImageContainer}>
                <View style={styles.imageWrapper}>
                    <Image
                        style={styles.image}
                        source={require('../../images/plus-supermarket.png')}
                    />
                </View>
                <TouchableOpacity style={styles.modalReportButton} activeOpacity={0.8}>
                    <Icon source="alert-circle-outline" size={40} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.modalDetails}>
                <Text style={styles.poiTitle}>{poi?.title}</Text>
                <View style={styles.poiRatingRow}>
                    <Text style={styles.poiRatingValue}>{poi?.rating?.toFixed(1)}</Text>
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = poi?.rating ?? 0;

                        const full = index + 1 <= ratingValue;
                        const half = index + 0.5 <= ratingValue && index + 1 > ratingValue;

                        return (
                            <Icon
                                key={`star-icon-${index}`}
                                source={full ? 'star' : half ? 'star-half-full' : 'star-outline'}
                                size={16}
                                color="#FFBB00"
                            />
                        );
                    })}
                </View>

                <View style={styles.poiDetailsRow}>
                    <Text style={styles.poiBodyText}>Body Small</Text>
                    {poi?.wheelChairAccessible && (
                        <>
                            <Text style={styles.dotSeparator}> • </Text>
                            <Icon source="wheelchair-accessibility" size={16} color="#000" />
                        </>
                    )}
                </View>

                <View>
                    <Text style={styles.timeTableHeader}>Openingstijden</Text>
                    <FlatList
                        style={styles.timeTable}
                        data={schedule}
                        keyExtractor={(item) => item.day}
                        renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={styles.cell}>{item.day}</Text>
                            <Text style={styles.cell}>{item.hours}</Text>
                        </View>
                        )}
                    />
                </View>
            </View>
        </BaseBottomSheet>
    );
}

const styles = StyleSheet.create({
    modalImageContainer: {
        position: 'relative',
        width: '100%',
        backgroundColor: '#fff',
    },
    imageWrapper: {
        width: '100%',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalReportButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'tomato',
        width: 50,
        height: 50,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalDetails: {
        padding: 8,
    },
    poiTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    poiRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    poiRatingValue: {
        fontWeight: 'bold',
        marginRight: 4,
    },
    poiDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    poiBodyText: {
        fontSize: 12,
    },
    dotSeparator: {
        fontSize: 12,
        marginHorizontal: 4,
    },
    timeTable: {
        padding: 8,
    },
    timeTableHeader: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 8,
    },
    cell: {
        flex: 1,
        fontSize: 16,
    }
});
