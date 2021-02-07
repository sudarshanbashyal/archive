import {
    USER_FAILED,
    USER_SUCCESS,
    USER_LOADING,
    USER_LOGIN_FAILED,
    UserType,
    LoginDataType,
    UserLoading,
    UserFailed,
    UserSuccess,
    UserDispatchType,
} from '../Actions/userActionTypes';

interface DefaultUserState {
    loading: boolean;
    client?: LoginDataType | null; // optional field
    error?: string; // optional field
}

const defaultUserState: DefaultUserState = {
    loading: false,
};

export const userReducer = (
    state: DefaultUserState = defaultUserState,
    action: UserDispatchType
): DefaultUserState => {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                loading: true,
            };

        case USER_SUCCESS:
            return {
                loading: false,
                error: '',
                client: {
                    profile: action.payload.profile,
                    accessToken: action.payload.accessToken,
                },
            };

        case USER_LOGIN_FAILED:
            return {
                ...state,
                error: action.payload.message,
            };

        case USER_FAILED:
            return {
                ...state,
                loading: false,
            };

        default:
            return state;
    }
};
