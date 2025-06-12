import { render, fireEvent } from '@testing-library/react-native';
import SuggestPOIButton from '../../src/components/map/suggestion/SuggestPOIButton';
import { useMapConfig } from '../../src/context/MapConfigContext';
import { ScreenState } from '../../src/state/screenStateReducer';

jest.mock('../../src/context/MapConfigContext', () => ({
    useMapConfig: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-paper', () => {
    const actual = jest.requireActual('react-native-paper');
    return {
        ...actual,
        useTheme: () => ({
            colors: {
                background: '#fff',
                primary: '#0017EE',
                shadow: '#000',
            },
        }),
        Text: actual.Text,
    };
});

describe('SuggestPOIButton', () => {
    const mockHandleCreateSuggestion = jest.fn();

    const renderComponent = (screenState = ScreenState.VIEWING, active = false) => {
        (useMapConfig as jest.Mock).mockReturnValue({ screenState });
        return render(
            <SuggestPOIButton
                handleCreateSuggestion={mockHandleCreateSuggestion}
                active={active}
            />
        );
    };

    it('renders button when screen state is VIEWING', () => {
        const { queryAllByText } = renderComponent(ScreenState.VIEWING);
        expect(queryAllByText(/suggest poi/i).length).toBeGreaterThan(0);
    });

    it('does not render button if screen state is not VIEWING', () => {
        const { queryAllByText } = renderComponent(ScreenState.SUGGESTING);
        expect(queryAllByText(/suggest poi/i).length).toBe(0);
    });

    it('calls handleCreateSuggestion on press', () => {
        const { queryAllByText } = renderComponent(ScreenState.VIEWING);
        const matches = queryAllByText(/suggest poi/i);
        expect(matches.length).toBeGreaterThan(0);
        fireEvent.press(matches[0]);
        expect(mockHandleCreateSuggestion).toHaveBeenCalled();
    });

    it('applies active styles when active is true', () => {
        const { getByTestId } = renderComponent(ScreenState.VIEWING, true);
        const button = getByTestId('suggest-poi-btn');
        // The style prop may be an array, so flatten it
        const style = Array.isArray(button.props.style)
            ? Object.assign({}, ...button.props.style)
            : button.props.style;

        // Debug: print the style if the test fails
        if (style.backgroundColor !== '#0017EE') {

            console.log('Button style:', style);
        }

        expect(style.backgroundColor).toBe('#0017EE');
    });
});
