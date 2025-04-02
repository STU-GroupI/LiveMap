import React, { RefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, HelperText, Checkbox } from 'react-native-paper';
import BaseBottomSheet from '../../base/baseBottomSheet.tsx';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface POICoordinate {
    latitude: number;
    longitude: number;
}

interface POICategory {
    id: string;
    name: string;
}

interface POIStatus {
    id: string;
    label: string;
}

interface Map {
    id: string;
    name: string;
}

interface POIForm {
    guid: string;
    title: string;
    rating: number;
    coordinate: POICoordinate;
    category: POICategory;
    status: POIStatus;
    map: Map;
    wheelChairAccessible: boolean;
}

interface SuggestLocationDataSheetProps {
    bottomSheetRef: ((ref: BottomSheet | null) => void) | RefObject<BottomSheetMethods | null>;
    onSubmit: (data: POIForm) => void;
    onClose?: () => void;
    onCancel: () => void;
    defaultValues: {
        guid: string;
        coordinate: POICoordinate;
        map: Map;
        };
}

export default function SuggestLocationDataSheet({
    bottomSheetRef,
    onSubmit,
    onClose,
    onCancel,
    defaultValues,

}: SuggestLocationDataSheetProps) {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<POIForm>({
                defaultValues: {
                    ...defaultValues,
                    title: '',
                    rating: 0,
                    category: { id: '', name: '' },
                    status: { id: '', label: '' },
                    wheelChairAccessible: false,
                },
            });

    return (
        <BaseBottomSheet bottomSheetRef={bottomSheetRef} index={-1} onClose={onClose} snapPoints={['40%']}>
            <View style={styles.modalContent}>
                <Controller
                    control={control}
                    name="title"
                    rules={{ required: 'Title is required' }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Title*"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.title}
                        />
                    )}
                />
                {errors.title && <HelperText type="error">{errors.title.message}</HelperText>}

                <Controller
                    control={control}
                    name="rating"
                    rules={{ required: 'Rating is required', min: 1, max: 10 }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Rating (1-10)*"
                            keyboardType="numeric"
                            value={value?.toString()}
                            onChangeText={(text) => onChange(parseFloat(text) || 0)}
                            error={!!errors.rating}
                        />
                    )}
                />
                {errors.rating && <HelperText type="error">{errors.rating.message}</HelperText>}

                <Controller
                    control={control}
                    name="wheelChairAccessible"
                    render={({ field: { value } }) => (
                        <Checkbox.Item
                            label="Wheelchair Accessible"
                            status={value ? 'checked' : 'unchecked'}
                            onPress={() => setValue('wheelChairAccessible', !value)}
                        />
                    )}
                />

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                        Submit
                    </Button>
                    <Button mode="outlined" style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                        Cancel
                    </Button>
                </View>
            </View>
        </BaseBottomSheet>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 16,
        gap: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 16,
        alignItems: 'center',
    },
});
