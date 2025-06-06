import {ScreenState, ScreenStateAction} from './screenStateReducer.ts';

export const setViewing = (): ScreenStateAction => ({
    type: 'SET_SCREEN',
    payload: ScreenState.VIEWING,
});

export const setEmpty = (): ScreenStateAction => ({
    type: 'SET_SCREEN',
    payload: ScreenState.EMPTY_MAP,
    });

export const setSuggesting = (): ScreenStateAction => ({
    type: 'SET_SCREEN',
    payload: ScreenState.SUGGESTING,
});

export const setSelectingPOI = (): ScreenStateAction => ({
    type: 'SET_SCREEN',
    payload: ScreenState.SELECTING_POI,
});

export const setFormNewPOI = (): ScreenStateAction => ({
    type: 'SET_SCREEN',
    payload: ScreenState.FORM_POI_NEW,
});

export const setFormEditPOI = (): ScreenStateAction => ({
    type: 'SET_SCREEN',
    payload: ScreenState.FORM_POI_CHANGE,
});
