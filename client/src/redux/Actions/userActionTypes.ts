export const USER_LOADING = 'USER_LOADING';
export const USER_FAILED = 'USER_FAILED';
export const USER_SUCCESS = 'USER_SUCCESS';

export type UserType = {
    first_name: string;
    last_name: string;
    email: string;
    interest: string;
    workplace: string;
    bio: string;
    userId: number;
    accessToken: string;
    profileImage: string;
    headerImage: string;
    followingTopics: number[];
    followingUsers: number[];
};

export interface UserLoading {
    type: typeof USER_LOADING;
}

export interface UserFailed {
    type: typeof USER_FAILED;
}

export interface UserSuccess {
    type: typeof USER_SUCCESS;
    payload: UserType;
}

export type UserDispatchType = UserLoading | UserFailed | UserSuccess;
