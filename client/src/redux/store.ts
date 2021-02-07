import { createStore, applyMiddleware, combineReducers } from 'redux';
import { userReducer } from './Reducers/userReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { applicationReducer } from './Reducers/applicationReducer';

const rootReducer = combineReducers({
    client: userReducer,
    application: applicationReducer,
});

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export type RootStore = ReturnType<typeof rootReducer>;
