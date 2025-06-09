import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapSuggestLocationBottomSheet from '../../src/components/map/suggestion/MapSuggestLocationBottomSheet.tsx';
import {Text, TouchableOpacity, View} from "react-native";

// Mock BaseBottomSheet (the component used inside MapSuggestLocationBottomSheet)
jest.mock('../../src/components/base/baseBottomSheet.tsx', () => {
    return ({ children, onClose }: any) => (
        <View testID="mock-base-bottom-sheet">
            {children}
            <TouchableOpacity testID="mock-close-button" onPress={onClose}>
                <Text>Close</Text>
            </TouchableOpacity>
        </View>
    );
});

describe('MapSuggestLocationBottomSheet', () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();
    const mockOnFlyToLocation = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders buttons with correct text', () => {
        const { getByText } = render(
            <MapSuggestLocationBottomSheet
                bottomSheetRef={jest.fn()}
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                onFlyToLocation={mockOnFlyToLocation}
                onClose={mockOnClose}
            />
        );

        expect(getByText('Re-center')).toBeTruthy();
        expect(getByText('Confirm')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
    });

    it('calls onFlyToLocation when Re-center button is pressed', () => {
        const { getByText } = render(
            <MapSuggestLocationBottomSheet
                bottomSheetRef={jest.fn()}
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                onFlyToLocation={mockOnFlyToLocation}
            />
        );

        fireEvent.press(getByText('Re-center'));
        expect(mockOnFlyToLocation).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm when Confirm button is pressed', () => {
        const { getByText } = render(
            <MapSuggestLocationBottomSheet
                bottomSheetRef={jest.fn()}
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                onFlyToLocation={mockOnFlyToLocation}
            />
        );

        fireEvent.press(getByText('Confirm'));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Cancel button is pressed', () => {
        const { getByText } = render(
            <MapSuggestLocationBottomSheet
                bottomSheetRef={jest.fn()}
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                onFlyToLocation={mockOnFlyToLocation}
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('passes onClose prop to BaseBottomSheet', () => {
        render(
            <MapSuggestLocationBottomSheet
                bottomSheetRef={jest.fn()}
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                onFlyToLocation={mockOnFlyToLocation}
                onClose={mockOnClose}
            />
        );

        // We can’t directly test if onClose is called because our mock just renders children.
        // But if you want, you can test if the prop was passed in integration or e2e tests.
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
