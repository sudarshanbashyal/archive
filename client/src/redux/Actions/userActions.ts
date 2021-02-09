import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Dispatch } from 'redux';
import { userReducer } from '../Reducers/userReducer';
import { RootStore } from '../store';
import {
    USER_FAILED,
    USER_SUCCESS,
    USER_LOADING,
    USER_LOGIN_FAILED,
    UserDispatchType,
    USER_LOGGED_OUT,
    TOKEN_FAILED,
    UserProfileType,
    USER_PROFILE_UPDATED,
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
            localStorage.setItem('userLoggedIn', 'true');
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
            localStorage.setItem('userLoggedIn', 'true');
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
    const res = await fetch('/user/clearToken', {
        credentials: 'include',
    });

    const data = await res.json();
    if (data.ok) {
        dispatch({
            type: USER_LOGGED_OUT,
        });
        localStorage.setItem('userLoggedIn', 'false');
    }
};

export const updateUserProfile = (
    userProfile: UserProfileType,
    accessToken: string
) => async (dispatch: Dispatch<UserDispatchType>) => {
    try {
        const res = await fetch('/user/updateUserProfile', {
            method: 'POST',
            headers: {
                authorization: `bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userProfile),
        });

        const data = await res.json();

        if (data.ok) {
            dispatch({
                type: USER_PROFILE_UPDATED,
                payload: data.user,
            });
        }
    } catch (error) {}
};
