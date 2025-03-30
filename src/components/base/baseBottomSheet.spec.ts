import {renderHook} from '@testing-library/react-hooks';
import {useCallback} from 'react';

describe('BaseBottomSheet', () => {
    const mockOnChange = jest.fn();
    const mockOnClose = jest.fn();

    it('should call onChange with the correct index', () => {
        const {result} = renderHook(() =>
            useCallback((newIndex: number) => {
                mockOnChange(newIndex);

                if (newIndex === -1) {
                    mockOnClose();
                }
            }, [mockOnChange, mockOnClose])
        );

        const handleSheetChange = result.current;

        handleSheetChange(1);
        expect(mockOnChange).toHaveBeenCalledWith(1);
        expect(mockOnClose).not.toHaveBeenCalled();

        handleSheetChange(-1);
        expect(mockOnChange).toHaveBeenCalledWith(-1);
        expect(mockOnClose).toHaveBeenCalled();
    });
});