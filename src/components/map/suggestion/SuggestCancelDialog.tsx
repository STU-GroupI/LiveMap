import React from 'react';
import { Text } from 'react-native-paper';
import BaseDialog from '../../base/baseDialog.tsx';

interface SuggestedCancelDialogProps {
    visible: boolean;
    hide: (callback?: () => void) => void;
    onSubmit: () => void;
    onDismiss: () => void;
}

export default function SuggestCancelDialog ({ visible, hide, onDismiss, onSubmit }: SuggestedCancelDialogProps) {
    return (
        <BaseDialog
            iconSource={'alert'}
            title={'Abandon Suggestion'}
            visible={visible}
            hide={hide}
            onDismiss={onDismiss}
            onSubmit={onSubmit}
            submitText={'Yes'}
            dismissText={'No'}
        >
            <Text>Are you sure you want to cancel this suggestion and leave your changes?</Text>
        </BaseDialog>
    );
}
