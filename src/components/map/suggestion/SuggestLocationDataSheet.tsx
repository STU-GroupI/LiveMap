import React, {useState, RefObject} from 'react';
import uuid from 'react-native-uuid';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import {Menu, Text} from 'react-native-paper';
import { TextInput, Button, HelperText, Checkbox } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import BaseBottomSheet from '../../base/baseBottomSheet.tsx';
import {Map} from '../../../models/Map/Map.ts';
import {POI} from '../../../models/POI/POI.ts';
import {POICoordinate} from '../../../models/POI/POICoordinate.ts';
import {POICategory} from '../../../models/POI/POICategory.ts';
import {POIStatus} from '../../../models/POI/POIStatus.ts';

interface POIForm {
    guid: string;
    title: string;
    description: string;
    rating: number;
    coordinate: POICoordinate;
    category: POICategory;
    status: POIStatus;
    map: Map;
    mapguid: string;
    wheelChairAccessible: boolean;
}

interface SuggestLocationDataSheetProps {
    bottomSheetRef: ((ref: BottomSheet | null) => void) | RefObject<BottomSheetMethods | null>;
    onSubmit: (data: POIForm) => void;
    onClose?: () => void;
    onCancel: () => void;
    poi?: POI;
    defaultValues?: {
        guid: string;
        coordinate: POICoordinate;
        map: Map;
    };
}

//IMPORTANT NOTE
/*
Below, I've hardcoded the dropdown values for the categories and statuses.
However, I planned on using the API endpoint to retrieve all possible categories and statuses.
It turns out there hasn't been a set endpoint for the values.
*/
const categories: POICategory[] = [
    { category: '1', categoryName: 'Entertainment' },
    { category: '2', categoryName: 'First-aid & Medical' },
    { category: '3', categoryName: 'Information' },
    { category: '4', categoryName: 'Parking' },
    { category: '5', categoryName: 'Store' },
    { category: '6', categoryName: 'Trash Bin' },
];

export default function SuggestLocationDataSheet({
    bottomSheetRef,
    onSubmit,
    onClose,
    onCancel,
    poi,
    defaultValues,

}: SuggestLocationDataSheetProps) {
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<POICategory | undefined>(categories.find(cat => cat.categoryName === poi?.category.categoryName || undefined));

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<POIForm>({
        defaultValues: {
            ...defaultValues,
            guid: poi?.guid || uuid.v4(),
            title: poi?.title || '',
            description: poi?.description || '',
            coordinate: poi?.coordinate || {longitude: 0, latitude: 0},
            category: poi?.category || selectedCategory,
            wheelChairAccessible: poi?.wheelChairAccessible || false,
        },
    });

    const handleCategorySelect = (category: POICategory) => {
        setSelectedCategory(category);
        setValue('category', category);
        setCategoryMenuVisible(false);
    };

    return (
        <BaseBottomSheet bottomSheetRef={bottomSheetRef} index={0} onClose={onClose} snapPoints={['70%', '70%']}>
            <View style={styles.modalContent} >
                <Text variant="titleLarge" style={styles.title}>
                    {poi ? 'Suggest a change' : 'Suggest a Location'}
                </Text>

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
                    name="description"
                    rules={{ required: 'Description is required' }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Description*"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.description}
                        />
                    )}
                />
                {errors.description && <HelperText type="error">{errors.description.message}</HelperText>}

                <Controller
                    control={control}
                    name="category"
                    rules={{ required: 'Category is required'}}
                    render={() => (
                        <Menu
                            visible={categoryMenuVisible}
                            onDismiss={() => setCategoryMenuVisible(false)}
                            anchor={<Button onPress={() => setCategoryMenuVisible(true)}>{selectedCategory?.categoryName || 'Select Category'}</Button>}
                        >
                            {categories.map((category) => (
                                <Menu.Item key={category.category} title={category.categoryName} onPress={() => handleCategorySelect(category)} />
                            ))}
                        </Menu>
                    )}
                />
                {errors.category && <HelperText type="error">{errors.category.message}</HelperText>}

                <Controller
                    control={control}
                    name="wheelChairAccessible"
                    defaultValue={poi?.wheelChairAccessible || false}
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
                        {poi ? 'Suggest Change' : 'Suggest Location'}
                    </Button>
                    <Button mode="outlined" onPress={onCancel}>
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
        justifyContent: 'space-between',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    },
});
