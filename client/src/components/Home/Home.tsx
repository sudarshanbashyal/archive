import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Feed from '../Feed/Feed';
import Navbar from '../Navbar/Navbar';
import Profile from '../Profile/Profile';

const Home = () => {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Profile />
                <Switch></Switch>
            </BrowserRouter>
        </div>
    );
};

export default Home;
