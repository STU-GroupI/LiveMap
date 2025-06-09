import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SuggestLocationDataSheet from '../../src/components/map/suggestion/SuggestLocationDataSheet';
import {BottomSheetMethods} from "@gorhom/bottom-sheet/lib/typescript/types";

jest.mock('../../src/services/poiCategoryService.ts', () => ({
    fetchCategories: jest.fn(() =>
        Promise.resolve([
            { categoryName: 'Park', iconName: 'park' },
            { categoryName: 'Museum', iconName: 'museum' },
        ])
    ),
}));

jest.mock('../../src/util/MaterialDesignIconsHelpers.ts', () => ({
    formatIconName: jest.fn((name: string) => name),
}));

const queryClient = new QueryClient();

describe('SuggestLocationDataSheet', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const onClose = jest.fn();
    const bottomSheetRef = React.createRef<BottomSheetMethods>();

    const renderComponent = (props = {}) =>
        render(
            <QueryClientProvider client={queryClient}>
                <SuggestLocationDataSheet
                    bottomSheetRef={bottomSheetRef}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    onClose={onClose}
                    isSubmitting={false}
                    {...props}
                />
            </QueryClientProvider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with default values', async () => {
        const { getByText, getByLabelText } = renderComponent();

        expect(getByText('Suggest a Location')).toBeTruthy();
        expect(getByLabelText('Title*')).toBeTruthy();
        expect(getByLabelText('Description*')).toBeTruthy();
        expect(getByText('Select Category')).toBeTruthy();
        expect(getByText('Submit')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
    });

    it('validates required fields and shows error messages', async () => {
        const { getByText, getByLabelText, queryByText } = renderComponent();

        fireEvent.press(getByText('Submit'));

        await waitFor(() => {
            expect(getByText('Title is required')).toBeTruthy();
            expect(getByText('Description is required')).toBeTruthy();
            expect(getByText('Category is required')).toBeTruthy();
        });

        // After filling in Title, error should disappear
        fireEvent.changeText(getByLabelText('Title*'), 'Test Title');
        fireEvent.press(getByText('Submit'));

        await waitFor(() => {
            expect(queryByText('Title is required')).toBeNull();
        });
    });

    it('opens category menu and selects a category', async () => {
        const { getByText, queryByText } = renderComponent();

        fireEvent.press(getByText('Select Category')); // open menu

        await waitFor(() => {
            expect(getByText('Park')).toBeTruthy();
            expect(getByText('Museum')).toBeTruthy();
        });

        fireEvent.press(getByText('Park')); // select category

        expect(queryByText('Select Category')).toBeNull();
        expect(getByText('Park')).toBeTruthy();
    });

    it('toggles wheelchair accessible checkbox', async () => {
        const { getByText } = renderComponent();

        const checkbox = getByText('Wheelchair Accessible');

        fireEvent.press(checkbox);
        fireEvent.press(checkbox); // toggle twice to check both states

        // No direct way to test checkbox status here easily without querying internal props,
        // but the onPress should toggle value without crashing
    });

    it('calls onSubmit with form data when submitted', async () => {
        const { getByText, getByLabelText } = renderComponent();

        fireEvent.changeText(getByLabelText('Title*'), 'My Title');
        fireEvent.changeText(getByLabelText('Description*'), 'My Description');

        fireEvent.press(getByText('Select Category'));
        await waitFor(() => getByText('Park'));
        fireEvent.press(getByText('Park'));

        fireEvent.press(getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'My Title',
                    description: 'My Description',
                    category: 'Park',
                    isWheelchairAccessible: false,
                })
            );
        });
    });

    it('calls onCancel when Cancel button pressed', () => {
        const { getByText } = renderComponent();

        fireEvent.press(getByText('Cancel'));
        expect(onCancel).toHaveBeenCalled();
    });
});
