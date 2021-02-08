import {
    USER_FAILED,
    USER_SUCCESS,
    USER_LOADING,
    USER_LOGIN_FAILED,
    USER_LOGGED_OUT,
    LoginDataType,
    UserDispatchType,
    TOKEN_FAILED,
} from '../Actions/userActionTypes';

interface DefaultUserState {
    loading: boolean;
    client?: LoginDataType | null; // optional field
    error?: string | null; // optional field
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
                loading: false,
                error: action.payload.message,
            };

        case USER_FAILED:
            return {
                ...state,
                loading: false,
            };

        case USER_LOGGED_OUT:
            return {
                ...state,
                client: null,
            };

        case TOKEN_FAILED:
            return {
                ...state,
                loading: false,
            };

        default:
            return state;
    }
};
