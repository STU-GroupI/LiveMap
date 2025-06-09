import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SuggestPOIChangeDataSheet from '../../src/components/map/suggestion/SuggestPOIChangeDataSheet';

const mockPOI = {
    guid: 'poi-123',
    title: 'Test POI',
    description: 'Description',
};

describe('SuggestPOIChangeDataSheet', () => {
    it('renders the form with title and message input', () => {
        const { getByText, getByLabelText } = render(
            <SuggestPOIChangeDataSheet
                bottomSheetRef={() => {}}
                onSubmit={jest.fn()}
                onCancel={jest.fn()}
                isSubmitting={false}
                poi={mockPOI as any}
            />
        );

        expect(getByText('Suggest a change')).toBeTruthy();
        expect(getByLabelText('Message*')).toBeTruthy();
    });

    it('shows validation error when message is empty', async () => {
        const { getByText } = render(
            <SuggestPOIChangeDataSheet
                bottomSheetRef={() => {}}
                onSubmit={jest.fn()}
                onCancel={jest.fn()}
                isSubmitting={false}
                poi={mockPOI as any}
            />
        );

        fireEvent.press(getByText('Suggest change'));

        await waitFor(() => {
            expect(getByText('Message is required')).toBeTruthy();
        });
    });

    it('calls onSubmit with correct data', async () => {
        const handleSubmit = jest.fn();

        const { getByLabelText, getByText } = render(
            <SuggestPOIChangeDataSheet
                bottomSheetRef={() => {}}
                onSubmit={handleSubmit}
                onCancel={jest.fn()}
                isSubmitting={false}
                poi={mockPOI as any}
            />
        );

        fireEvent.changeText(getByLabelText('Message*'), 'This is my change request');
        fireEvent.press(getByText('Suggest change'));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith({
                poiId: 'poi-123',
                suggestedPoiId: 'poi-123',
                message: 'This is my change request',
            });
        });
    });

    it('calls onCancel when cancel button is pressed', () => {
        const handleCancel = jest.fn();

        const { getByText } = render(
            <SuggestPOIChangeDataSheet
                bottomSheetRef={() => {}}
                onSubmit={jest.fn()}
                onCancel={handleCancel}
                isSubmitting={false}
                poi={mockPOI as any}
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(handleCancel).toHaveBeenCalled();
    });

    it('disables the submit button while submitting', () => {
        const { getByText } = render(
            <SuggestPOIChangeDataSheet
                bottomSheetRef={() => {}}
                onSubmit={jest.fn()}
                onCancel={jest.fn()}
                isSubmitting={true}
                poi={mockPOI as any}
            />
        );

        expect(getByText('Suggest change').props.accessibilityState.disabled).toBe(true);
    });
});
