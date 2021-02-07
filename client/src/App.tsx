import React, { useEffect, useState } from 'react';
import Home from './components/Home/Home';
import Landing from './components/Landing/Landing';
import ModalContainer from './components/Modal/ModalContainer';
import Navbar from './components/Navbar/Navbar';
import Cookies from 'js-cookie';
import './index.css';
import { useSelector } from 'react-redux';
import { RootStore } from './redux/store';

const App = () => {
    // get user from the state
    const userState = useSelector((state: RootStore) => state.client);

    // get application state
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    // request the backend for token with the cookie
    useEffect(() => {}, []);

    return (
        <div className="App">
            {/* Render Home page if the user is in the store */}
            {userState && userState.client ? <Home /> : <Landing />}

            {/* check is modal is open */}
            {applicationState && applicationState.modal?.modalOpen && (
                <ModalContainer />
            )}
        </div>
    );
};

export default App;
