import React, { useEffect, useState } from 'react';
import Home from './components/Home/Home';
import Landing from './components/Landing/Landing';
import ModalContainer from './components/Modal/ModalContainer';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from './redux/store';
import { refreshToken } from './redux/Actions/userActions';
import { ToastContainer } from 'react-toastify';
import { changeTheme } from './redux/Actions/applicationActions';

const App = () => {
    const dispatch = useDispatch();
    // const [userLogged, setUserLogged] = useState(
    //     localStorage.getItem('userLoggedIn')
    // );

    const [applicationTheme, setApplicationTheme] = useState<string | null>(
        localStorage.getItem('applicationTheme')
    );

    // get user from the state
    const userState = useSelector((state: RootStore) => state.client);

    // get application state
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    // request the backend for token with the cookie
    useEffect(() => {
        dispatch(refreshToken());
    }, []);

    //
    useEffect(() => {
        if (applicationTheme) {
            dispatch(changeTheme(applicationTheme));
        }
    }, []);

    //

    return (
        <div
            className={
                'App ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'App-dark'
                    : '')
            }
        >
            {/* Render Home page if the user is in the store */}
            {userState.loading ? null : userState.client?.profile ? (
                <Home />
            ) : (
                <Landing />
            )}

            {/* check is modal is open */}
            {applicationState && applicationState.modal?.modalOpen && (
                <ModalContainer />
            )}

            {/* toast notification container */}
            <ToastContainer
                position="bottom-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default App;
