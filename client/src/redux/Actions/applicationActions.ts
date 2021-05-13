import { Dispatch } from 'redux';
import {
    MODAL_CLOSE,
    MODAL_OPEN,
    CHANGE_THEME,
    ApplicationDispatchType,
} from './applicationActionTypes';

export const openModal =
    (modalType: string) => (dispatch: Dispatch<ApplicationDispatchType>) => {
        dispatch({
            type: MODAL_OPEN,
            payload: { modalType },
        });
    };

export const closeModal = (dispatch: Dispatch<ApplicationDispatchType>) => {
    dispatch({
        type: MODAL_CLOSE,
    });
};

export const changeTheme =
    (theme: string) => (dispatch: Dispatch<ApplicationDispatchType>) => {
        dispatch({
            type: CHANGE_THEME,
            payload: theme,
        });
        localStorage.setItem('applicationTheme', theme);
    };
