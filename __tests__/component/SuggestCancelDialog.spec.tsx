import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SuggestCancelDialog from '../../src/components/map/suggestion/SuggestCancelDialog';

// Mock BaseDialog for testing purposes
jest.mock('../../src/components/base/baseDialog.tsx', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');

    return ({
                children,
                visible,
                onDismiss,
                onSubmit,
                submitText,
                dismissText,
                title,
            }: any) => {
        if (!visible) {
            return null;
        }

        return (
            <View testID="mock-base-dialog">
                <Text>{title}</Text>
                {children}
                <TouchableOpacity testID="submit-button" onPress={onSubmit}>
                    <Text>{submitText}</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="dismiss-button" onPress={onDismiss}>
                    <Text>{dismissText}</Text>
                </TouchableOpacity>
            </View>
        );
    };
});

describe('SuggestCancelDialog', () => {
    const mockHide = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnDismiss = jest.fn();

    it('renders with correct title and message when visible', () => {
        const { getByText } = render(
            <SuggestCancelDialog
                visible={true}
                hide={mockHide}
                onSubmit={mockOnSubmit}
                onDismiss={mockOnDismiss}
            />
        );

        expect(getByText('Abandon Suggestion')).toBeTruthy();
        expect(getByText('Are you sure you want to cancel this suggestion and leave your changes?')).toBeTruthy();
    });

    it('does not render dialog when visible is false', () => {
        const { queryByText } = render(
            <SuggestCancelDialog
                visible={false}
                hide={mockHide}
                onSubmit={mockOnSubmit}
                onDismiss={mockOnDismiss}
            />
        );

        expect(queryByText('Abandon Suggestion')).toBeNull();
    });

    it('calls onSubmit when submit button is pressed', () => {
        const { getByTestId } = render(
            <SuggestCancelDialog
                visible={true}
                hide={mockHide}
                onSubmit={mockOnSubmit}
                onDismiss={mockOnDismiss}
            />
        );

        fireEvent.press(getByTestId('submit-button'));
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when dismiss button is pressed', () => {
        const { getByTestId } = render(
            <SuggestCancelDialog
                visible={true}
                hide={mockHide}
                onSubmit={mockOnSubmit}
                onDismiss={mockOnDismiss}
            />
        );

        fireEvent.press(getByTestId('dismiss-button'));
        expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
});
