import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SuggestPOIButton from '../../src/components/map/suggestion/SuggestPOIButton';
import { useMapConfig } from '../../src/context/MapConfigContext';

jest.mock('../../src/context/MapConfigContext', () => ({
    useMapConfig: jest.fn(),
}));

describe('SuggestPOIButton', () => {
    const mockHandleCreateSuggestion = jest.fn();

    const renderComponent = (screenState = 'VIEWING', active = false) => {
        (useMapConfig as jest.Mock).mockReturnValue({ screenState });
        return render(
            <SuggestPOIButton
                handleCreateSuggestion={mockHandleCreateSuggestion}
                active={active}
            />
        );
    };

    it('renders button when screen state is VIEWING', () => {
        const { getByText } = renderComponent('VIEWING');
        expect(getByText('Suggest POI')).toBeTruthy();
    });

    it('does not render button if screen state is not VIEWING', () => {
        const { queryByText } = renderComponent('SUGGESTING');
        expect(queryByText('Suggest POI')).toBeNull();
    });

    it('calls handleCreateSuggestion on press', () => {
        const { getByText } = renderComponent('VIEWING');
        fireEvent.press(getByText('Suggest POI'));
        expect(mockHandleCreateSuggestion).toHaveBeenCalled();
    });

    it('applies active styles when active is true', () => {
        const { getByText } = renderComponent('VIEWING', true);
        const buttonText = getByText('Suggest POI');

        expect(buttonText.props.style).toEqual(
            expect.objectContaining({
                color: expect.stringMatching(/^#/) // color from theme, e.g. #fff
            })
        );
    });
});
