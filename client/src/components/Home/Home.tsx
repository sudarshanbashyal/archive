import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import EditorPage from '../Editor/EditorPage';
import Explore from '../Explore/Explore';
import Feed from '../Feed/Feed';
import Navbar from '../Navbar/Navbar';
import Profile from '../Profile/Profile';
import Reader from '../Reader/Reader';
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
                    <Route exact path="/editor/:id?" component={EditorPage} />
                    <Route exact path="/blog/:id" component={Reader} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default Home;
