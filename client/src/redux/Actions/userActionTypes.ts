import { StringMappingType } from 'typescript';

export const USER_LOADING = 'USER_LOADING';
export const USER_FAILED = 'USER_FAILED';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_LOGIN_FAILED = 'LOGIN_FAILED';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const TOKEN_FAILED = 'TOKEN_SUCCESS';
export const USER_PROFILE_UPDATED = 'USER_PROFILE_UPDATED';
export const USER_ACCOUNT_UPDATED = 'USER_ACCOUNT_UPDATED';
export const USER_FOLLOWED = 'FOLLOW_USER';
export const USER_UNFOLLOWED = 'FOLLOW_USER';
export const TOPIC_FOLLOWED = 'TOPIC_FOLLOWED';
export const TOPIC_UNFOLLOWED = 'TOPIC_UNFOLLOWED';
export const USER_PROFILE_PICTURE_UPDATED = 'USER_PROFILE_PICTURE_UPDATED';
export const USER_BANNER_PICTURE_UPDATED = 'USER_BANNER_PICTURE_UPDATED';

export type UserType = {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    interest: string;
    workplace: string;
    bio: string;
    usersFollowed: number[];
    topicsFollowed: number[];
    profileImage: string | null;
    headerImage: string | null;
};

export type UserProfileType = {
    firstName: string;
    lastName: string;
    interest: string;
    bio: string;
    workplace: string;
};

type LoginErrorType = {
    message: string;
};

export type LoginDataType = {
    profile: UserType;
    accessToken: string;
};

export interface UserLoading {
    type: typeof USER_LOADING;
}

export interface UserFailed {
    type: typeof USER_FAILED;
}

export interface UserSuccess {
    type: typeof USER_SUCCESS;
    payload: LoginDataType;
}

export interface UserLoginFailed {
    type: typeof USER_LOGIN_FAILED;
    // payload: LoginErrorType;
    payload: {
        message: string;
    };
}

export interface UserLoggedOut {
    type: typeof USER_LOGGED_OUT;
}

export interface TokenRefreshFailed {
    type: typeof TOKEN_FAILED;
}

export interface UserProfileUpdated {
    type: typeof USER_PROFILE_UPDATED;
    payload: UserProfileType;
}

export interface UserAccountUpdated {
    type: typeof USER_ACCOUNT_UPDATED;
    payload: { email: string };
}

export interface UserFollowed {
    type: typeof USER_FOLLOWED;
    payload: number[];
}

export interface UserUnfollowed {
    type: typeof USER_UNFOLLOWED;
    payload: number[];
}

export interface TopicFollowed {
    type: typeof TOPIC_FOLLOWED;
    payload: number[];
}

export interface TopicUnfollowed {
    type: typeof TOPIC_UNFOLLOWED;
    payload: number[];
}

export interface UserProfilePictureUpdated {
    type: typeof USER_PROFILE_PICTURE_UPDATED;
    payload: string;
}

export interface UserBannerPictureUpdated {
    type: typeof USER_BANNER_PICTURE_UPDATED;
    payload: string;
}

export type UserDispatchType =
    | UserLoading
    | UserFailed
    | UserSuccess
    | UserLoginFailed
    | UserLoggedOut
    | TokenRefreshFailed
    | UserProfileUpdated
    | UserAccountUpdated
    | UserFollowed
    | UserUnfollowed
    | TopicFollowed
    | TopicUnfollowed
    | UserProfilePictureUpdated
    | UserBannerPictureUpdated;
