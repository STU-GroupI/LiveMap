import React, {useState, RefObject} from 'react';
import { TextInput, Button, HelperText, Checkbox, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';

import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import BaseBottomSheet from '../../base/baseBottomSheet.tsx';

import {POI} from '../../../models/POI/POI.ts';
import {POICoordinate} from '../../../models/POI/POICoordinate.ts';
import {useQuery} from '@tanstack/react-query';
import {fetchCategories} from '../../../services/poiCategoryService.ts';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {formatIconName} from '../../../util/MaterialDesignIconsHelpers.ts';

interface Map {
    id: string;
    name: string;
}

interface POIForm {
    title: string;
    description: string;
    coordinate: POICoordinate;
    category: string;
    map: Map;
    mapId: string;
    isWheelchairAccessible: boolean;
}

interface SuggestLocationDataSheetProps {
    bottomSheetRef: ((ref: BottomSheet | null) => void) | RefObject<BottomSheetMethods | null>;
    onSubmit: (data: POIForm) => void;
    isSubmitting: boolean;
    onClose?: () => void;
    onCancel: () => void;
    poi?: POI;
    defaultValues?: {
        guid: string;
        coordinate: POICoordinate;
        map: Map;
    };
}

export default function SuggestLocationDataSheet({
    bottomSheetRef,
    onSubmit,
    isSubmitting,
    onClose,
    onCancel,
    poi,
    defaultValues,

}: SuggestLocationDataSheetProps) {
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const { data: categories = []} = useQuery({
        queryKey: ['poiCategories'],
        queryFn: fetchCategories,
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<POIForm>({
        defaultValues: {
            ...defaultValues,
            title: '',
            description: '',
            coordinate: {longitude: 0, latitude: 0},
            category: selectedCategory,
            isWheelchairAccessible: false,
        },
    });

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setValue('category', category);
        setCategoryMenuVisible(false);
    };

    const leadingIcon = (category: string) => {
        const iconName = categories.find((cat) => cat.categoryName === category)?.iconName;
        const formattedIconName = iconName ? formatIconName(iconName) : 'map-marker';
        return formattedIconName ? <MaterialDesignIcons name={formattedIconName as any} size={20} color="#000" /> : <></>;
    };

    return (
        <BaseBottomSheet
            bottomSheetRef={bottomSheetRef}
            index={0}
            onClose={onClose}
            enablePanDownToClose={false}
            snapPoints={['70%', '70%']}
        >
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
                            anchor={<Button onPress={() => setCategoryMenuVisible(true)}>{selectedCategory || 'Select Category'}</Button>}
                        >
                            {categories.map((category, idx) => (
                                <Menu.Item
                                    key={idx}
                                    title={category.categoryName}
                                    onPress={() => handleCategorySelect(category.categoryName)}
                                    leadingIcon={() => leadingIcon(category.categoryName)}
                                />
                            ))}
                        </Menu>
                    )}
                />
                {errors.category && <HelperText type="error">{errors.category.message}</HelperText>}

                <Controller
                    control={control}
                    name="isWheelchairAccessible"
                    render={({ field: { value } }) => (
                        <Checkbox.Item
                            label="Wheelchair Accessible"
                            status={value ? 'checked' : 'unchecked'}
                            onPress={() => setValue('isWheelchairAccessible', !value)}
                        />
                    )}
                />

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                        Submit
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
