import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Explore from '../Explore/Explore';
import Feed from '../Feed/Feed';
import ModalContainer from '../Modal/ModalContainer';
import Navbar from '../Navbar/Navbar';
import Profile from '../Profile/Profile';
import Settings from '../Settings/Settings';

const Home = () => {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Feed} />
                    <Route exact path="/user/:id" component={Profile} />
                    <Route path="/settings" component={Settings} />
                    <Route exact path="/explore" component={Explore} />
                </Switch>
                <ModalContainer />
            </BrowserRouter>
        </div>
    );
};

export default Home;
