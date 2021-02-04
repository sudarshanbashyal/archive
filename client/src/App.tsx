import React from 'react';
import Home from './components/Home/Home';
import Landing from './components/Landing/Landing';
import ModalContainer from './components/Modal/ModalContainer';
import Navbar from './components/Navbar/Navbar';
import './index.css';

const App = () => {
    return (
        <div className="App">
            <Landing />
            <ModalContainer />
        </div>
    );
};

export default App;
