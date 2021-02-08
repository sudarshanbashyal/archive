import { Dispatch } from 'redux';
import {
    USER_FAILED,
    USER_SUCCESS,
    USER_LOADING,
    USER_LOGIN_FAILED,
    UserDispatchType,
    USER_LOGGED_OUT,
    TOKEN_FAILED,
} from './userActionTypes';

export const loginUser = (user: object) => async (
    dispatch: Dispatch<UserDispatchType>
) => {
    try {
        dispatch({
            type: USER_LOADING,
        });

        const res = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const data = await res.json();

        if (data.ok) {
            dispatch({
                type: USER_SUCCESS,
                payload: {
                    accessToken: data.accessToken,
                    profile: data.user,
                },
            });
        } else {
            dispatch({
                type: USER_LOGIN_FAILED,
                payload: data.error,
            });
        }
    } catch (error) {
        dispatch({
            type: USER_FAILED,
        });
    }
};

export const refreshToken = () => async (
    dispatch: Dispatch<UserDispatchType>
) => {
    try {
        dispatch({
            type: USER_LOADING,
        });
        const res = await fetch('/user/refreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();

        if (data.ok) {
            dispatch({
                type: USER_SUCCESS,
                payload: {
                    accessToken: data.accessToken,
                    profile: data.user,
                },
            });
        } else {
            dispatch({
                type: TOKEN_FAILED,
                payload: data.error,
            });
        }
    } catch (error) {
        dispatch({
            type: USER_FAILED,
        });
    }
};

export const logOutUser = async (dispatch: Dispatch<UserDispatchType>) => {
    console.log('hi');
    const res = await fetch('/user/clearToken', {
        credentials: 'include',
    });

    const data = await res.json();
    if (data.ok) {
        dispatch({
            type: USER_LOGGED_OUT,
        });
    }
};
