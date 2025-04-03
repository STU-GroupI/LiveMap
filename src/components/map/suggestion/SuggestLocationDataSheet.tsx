import React, {useState, RefObject} from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, HelperText, Checkbox } from 'react-native-paper';
import BaseBottomSheet from '../../base/baseBottomSheet.tsx';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import uuid from 'react-native-uuid';
import { Menu } from 'react-native-paper';

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
    defaultValues?: {
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
        const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
        const [statusMenuVisible, setStatusMenuVisible] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState<POICategory | undefined>(undefined);
        const [selectedStatus, setSelectedStatus] = useState<POIStatus | undefined>(undefined);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<POIForm>({
                defaultValues: {
                    ...defaultValues,
                    guid: uuid.v4(),
                    title: '',
                    description: '',
                    rating: 0,
                    coordinate: {longitude: 0, latitude: 0},
                    category: selectedCategory,
                    status: { id: '3', label: 'Pending' },
                    wheelChairAccessible: false,
                },
            });

    //IMPORTANT NOTE
    /*
    Below, I've hardcoded the dropdown values for the categories and statuses.
    However, I planned on using the API endpoint to retrieve all possible categories and statuses.
    It turns out there hasn't been a set endpoint for the values.
    */
    const categories = [
        { id: '1', name: 'Entertainment' },
        { id: '2', name: 'First-Aid & Medical' },
        { id: '3', name: 'Information' },
        { id: '4', name: 'Parking' },
        { id: '5', name: 'Store' },
        { id: '6', name: 'Trash Bin' },
    ];

    const statuses = [
        { id: '1', label: 'Active' },
        { id: '2', label: 'Inactive' },
        { id: '3', label: 'Pending' },
    ];

    const handleCategorySelect = (category: POICategory) => {
        setSelectedCategory(category);
        setValue('category', category);
        setCategoryMenuVisible(false);
    };

    return (
        <BaseBottomSheet bottomSheetRef={bottomSheetRef} index={0} onClose={onClose} snapPoints={['70%', '70%']}>
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
                    name="category"
                    rules={{ required: 'Category is required'}}
                    render={() => (
                <Menu
                    visible={categoryMenuVisible}
                    onDismiss={() => setCategoryMenuVisible(false)}
                    anchor={<Button onPress={() => setCategoryMenuVisible(true)}>{selectedCategory?.name || 'Select Category'}</Button>}
                >
                    {categories.map((category) => (
                        <Menu.Item key={category.id} title={category.name} onPress={() => handleCategorySelect(category)} />
                    ))}
                </Menu>
                )}
            />
                {errors.category && <HelperText type="error">{errors.category.message}</HelperText>}

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
});
