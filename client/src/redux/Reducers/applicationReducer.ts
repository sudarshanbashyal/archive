import {
    MODAL_CLOSE,
    MODAL_OPEN,
    CHANGE_THEME,
    ApplicationDispatchType,
} from '../Actions/applicationActionTypes';

interface DefaultApplicationStateType {
    applicationTheme: string;
    modal?: {
        modalOpen: boolean;
        modalType?: string;
    };
}

const defaultApplicationState: DefaultApplicationStateType = {
    applicationTheme: 'light',
};

export const applicationReducer = (
    state: DefaultApplicationStateType = defaultApplicationState,
    action: ApplicationDispatchType
): DefaultApplicationStateType => {
    switch (action.type) {
        case MODAL_OPEN:
            return {
                ...state,
                modal: {
                    modalOpen: true,
                    modalType: action.payload.modalType,
                },
            };

        case MODAL_CLOSE:
            return {
                ...state,
                modal: {
                    modalOpen: false,
                },
            };

        default:
            return state;
    }
};
