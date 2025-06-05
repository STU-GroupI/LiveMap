export enum ScreenState {
    VIEWING,        // Normally viewing the map or an item (details too)
    SUGGESTING,     // When suggesting a new location (state in between states)
    SELECTING_POI,  // When selecting a POI
    FORM_POI_NEW,       // When creating a new POI
    FORM_POI_CHANGE,     // When changing an existing POI
    EMPTY_MAP     // When there is no map to retrieve
}

export type ScreenStateAction = {
    type: 'SET_SCREEN';
    payload: ScreenState;
};

export const screenStateReducer = (
    state: ScreenState,
    action: ScreenStateAction
): ScreenState => {
    switch (action.type) {
        case 'SET_SCREEN':
            return action.payload;
        default:
            return state;
    }
};
