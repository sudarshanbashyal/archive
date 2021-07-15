import { useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
    showFailureToast,
    showSuccessToast,
} from 'src/components/Utils/ToastNotification';
import {
    USER_FAILED,
    USER_SUCCESS,
    USER_LOGIN_FAILED,
    UserDispatchType,
    USER_LOGGED_OUT,
    TOKEN_FAILED,
    UserProfileType,
    USER_PROFILE_UPDATED,
    USER_ACCOUNT_UPDATED,
    USER_FOLLOWED,
    USER_UNFOLLOWED,
    TOPIC_FOLLOWED,
    TOPIC_UNFOLLOWED,
    USER_PROFILE_PICTURE_UPDATED,
    USER_BANNER_PICTURE_UPDATED,
    TOGGLE_BOOKMARK,
} from './userActionTypes';

export const loginUser =
    (user: object) => async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            // dispatch({
            //     type: USER_LOADING,
            // });

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

export const refreshToken =
    () => async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            // dispatch({
            //     type: USER_LOADING,
            // });
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
        window.location.replace('/');
    }
};

export const updateUserProfile =
    (userProfile: UserProfileType, accessToken: string) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
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
                showSuccessToast('Profile Successfully Updated!');
            }
        } catch (error) {}
    };

export const updateUserAccount =
    (userAccount: Object, accessToken: string | undefined) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch('/user/updateUserAccount', {
                method: 'POST',
                headers: {
                    authorization: `bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userAccount),
            });

            const data = await res.json();

            if (data.ok) {
                dispatch({
                    type: USER_ACCOUNT_UPDATED,
                    payload: data.user,
                });
                showSuccessToast('Account Successfully Updated!');
            } else if (
                !data.ok &&
                data.error.message === 'Incorrect credentials.'
            ) {
                showFailureToast('Incorrect credentials. Please try again');
            }

            //
        } catch (error) {}
    };

export const followUser =
    (userId: number, accessToken: string | undefined) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch(`/user/followUser/${userId}`, {
                headers: {
                    authorization: `bearer ${accessToken}`,
                },
            });

            const data = await res.json();
            if (data.ok) {
                dispatch({
                    type: USER_FOLLOWED,
                    payload: data.newList,
                });
                showSuccessToast('User Followed!');
            }
        } catch (error) {}
    };

export const unfollowUser =
    (userId: number, accessToken: string | undefined) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch(`/user/unfollowUser/${userId}`, {
                headers: {
                    authorization: `bearer ${accessToken}`,
                },
            });

            const data = await res.json();
            if (data.ok) {
                dispatch({
                    type: USER_UNFOLLOWED,
                    payload: data.newList,
                });
                showSuccessToast('User Unfollowed!');
            }
        } catch (error) {}
    };

export const followTopic =
    (topicId: number, accessToken: string | undefined) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch(`/blog/followTopic/${topicId}`, {
                headers: {
                    authorization: `bearer ${accessToken}`,
                },
            });

            const data = await res.json();
            if (data.ok) {
                dispatch({
                    type: TOPIC_FOLLOWED,
                    payload: data.topics,
                });
                showSuccessToast('Topic Followed!');
            }
        } catch (error) {}
    };

export const unfollowTopic =
    (topicId: number, accessToken: string | undefined) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch(`/blog/unfollowTopic/${topicId}`, {
                headers: {
                    authorization: `bearer ${accessToken}`,
                },
            });

            const data = await res.json();
            if (data.ok) {
                dispatch({
                    type: TOPIC_UNFOLLOWED,
                    payload: data.topics,
                });
                showSuccessToast('Topic Unfollowed!');
            }
        } catch (error) {}
    };

export const updateUserProfileImage =
    (
        encodedImage: string | ArrayBuffer | null,
        accessToken: string | undefined
    ) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch('/user/updateProfileImage', {
                method: 'POST',
                headers: {
                    authorization: `bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    encodedImage,
                }),
            });

            const data = await res.json();
            if (data.ok) {
                dispatch({
                    type: USER_PROFILE_PICTURE_UPDATED,
                    payload: data.user.profileImage,
                });
                showSuccessToast('Profile Picture Updated!');
            }
            //
        } catch (error) {}
    };

export const updateUserBannerImage =
    (
        encodedImage: string | ArrayBuffer | null,
        accessToken: string | undefined
    ) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch('/user/updateBannerImage', {
                method: 'POST',
                headers: {
                    authorization: `bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    encodedImage,
                }),
            });

            const data = await res.json();
            if (data.ok) {
                dispatch({
                    type: USER_BANNER_PICTURE_UPDATED,
                    payload: data.user.headerImage,
                });
                showSuccessToast('Banner Updated!');
            }
            //
        } catch (error) {}
    };

export const toggleBookmark =
    (id: number, status: string, accessToken: string | undefined) =>
    async (dispatch: Dispatch<UserDispatchType>) => {
        try {
            const res = await fetch(`/blog/toggleBookmark/${id}/${status}`, {
                headers: {
                    authorization: `bearer ${accessToken}`,
                },
                credentials: 'include',
            });

            const data = await res.json();
            if (data.ok) {
                dispatch({
                    type: TOGGLE_BOOKMARK,
                    payload: data.bookmarks,
                });
                let successMessage;
                if (status === 'array_append') {
                    successMessage = 'Bookmark saved!';
                } else {
                    successMessage = 'Bookmark unsaved!';
                }
                showSuccessToast(successMessage);
            }

            //
        } catch (error) {}
    };
