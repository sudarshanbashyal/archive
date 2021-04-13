import {
    USER_FAILED,
    USER_SUCCESS,
    USER_LOADING,
    USER_LOGIN_FAILED,
    USER_LOGGED_OUT,
    LoginDataType,
    UserDispatchType,
    TOKEN_FAILED,
    USER_PROFILE_UPDATED,
    USER_ACCOUNT_UPDATED,
    USER_FOLLOWED,
    USER_UNFOLLOWED,
    TOPIC_FOLLOWED,
    TOPIC_UNFOLLOWED,
} from '../Actions/userActionTypes';

interface DefaultUserState {
    loading: boolean;
    client?: LoginDataType | null; // optional field
    error?: string | null; // optional field
}

const defaultUserState: DefaultUserState = {
    loading: true,
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

        case USER_PROFILE_UPDATED:
            return {
                ...state,
                loading: false,
                error: '',
                client: {
                    accessToken: state.client!.accessToken,
                    profile: {
                        ...state.client!.profile,
                        ...action.payload,
                    },
                },
            };

        case USER_ACCOUNT_UPDATED:
            return {
                ...state,
                loading: false,
                error: '',
                client: {
                    accessToken: state.client!.accessToken,
                    profile: {
                        ...state.client!.profile,
                        email: action.payload.email,
                    },
                },
            };

        case USER_FOLLOWED:
            return {
                ...state,
                loading: false,
                error: '',
                client: {
                    accessToken: state.client!.accessToken,
                    profile: {
                        ...state.client!.profile,
                        usersFollowed: action.payload,
                    },
                },
            };

        case USER_UNFOLLOWED:
            return {
                ...state,
                loading: false,
                error: '',
                client: {
                    accessToken: state.client!.accessToken,
                    profile: {
                        ...state.client!.profile,
                        usersFollowed: action.payload,
                    },
                },
            };

        case TOPIC_FOLLOWED:
            return {
                ...state,
                loading: false,
                error: '',
                client: {
                    accessToken: state.client!.accessToken,
                    profile: {
                        ...state.client!.profile,
                        topicsFollowed: action.payload,
                    },
                },
            };

        case TOPIC_UNFOLLOWED:
            return {
                ...state,
                loading: false,
                error: '',
                client: {
                    accessToken: state.client!.accessToken,
                    profile: {
                        ...state.client!.profile,
                        topicsFollowed: action.payload,
                    },
                },
            };

        default:
            return state;
    }
};
