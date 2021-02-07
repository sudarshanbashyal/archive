export const USER_LOADING = 'USER_LOADING';
export const USER_FAILED = 'USER_FAILED';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_LOGIN_FAILED = 'LOGIN_FAILED';

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
    profileImage: string;
    headerImage: string;
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

export type UserDispatchType =
    | UserLoading
    | UserFailed
    | UserSuccess
    | UserLoginFailed;
