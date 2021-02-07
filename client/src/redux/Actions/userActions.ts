import { Dispatch } from 'redux';
import {
    USER_FAILED,
    USER_SUCCESS,
    USER_LOADING,
    USER_LOGIN_FAILED,
    UserDispatchType,
} from './userActionTypes';

export const loginUser = (user: object) => async (
    dispatch: Dispatch<UserDispatchType>
) => {
    try {
        dispatch({
            type: USER_LOADING,
        });
        console.log(user);
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
