import React, {RefObject} from 'react';
import uuid from 'react-native-uuid';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import {Text} from 'react-native-paper';
import { TextInput, Button, HelperText} from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import BaseBottomSheet from '../../base/baseBottomSheet.tsx';
import {POI} from '../../../models/POI/POI.ts';

interface POIForm {
    poiId: string;
    message: string;
}

interface SuggestPOIChangeDataSheetProps {
    bottomSheetRef: ((ref: BottomSheet | null) => void) | RefObject<BottomSheetMethods | null>;
    onSubmit: (data: POIForm) => void;
    onClose?: () => void;
    onCancel: () => void;
    poi?: POI;
}

export default function SuggestPOIChangeDataSheet({
    bottomSheetRef,
    onSubmit,
    onClose,
    onCancel,
    poi,
}: SuggestPOIChangeDataSheetProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<POIForm>({
        defaultValues: {
            poiId: poi?.guid || uuid.v4(),
            message: '',
        },
    });

    return (
        <BaseBottomSheet bottomSheetRef={bottomSheetRef} index={0} onClose={onClose} snapPoints={['70%', '70%']}>
            <View style={styles.modalContent} >
                <Text variant="titleLarge" style={styles.title}>
                    {poi ? 'Suggest a change' : 'Suggest a Location'}
                </Text>

                <Controller
                    control={control}
                    name="message"
                    rules={{ required: 'Message is required' }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="Message*"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.message}
                            numberOfLines={6}
                            multiline={true}
                            style={styles.messageInput}
                        />
                    )}
                />
                {errors.message && <HelperText type="error">{errors.message.message}</HelperText>}

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                        Suggest change
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
    messageInput: {
        height: 200,
        textAlignVertical: 'top',
    },
});
