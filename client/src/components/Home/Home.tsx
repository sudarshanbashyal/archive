import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { loadingAnimation } from 'src/assets/SVGs';
import Feed from '../Feed/Feed';
import Navbar from '../Navbar/Navbar';
import Settings from '../Settings/Settings';

const EditorPage = React.lazy(() => import('../Editor/EditorPage'));
const Explore = React.lazy(() => import('../Explore/Explore'));
const Profile = React.lazy(() => import('../Profile/Profile'));
const Reader = React.lazy(() => import('../Reader/Reader'));

const Home = () => {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Feed} />

                    <React.Suspense fallback={loadingAnimation}>
                        <Route
                            exact
                            path="/user/:section?/:id/"
                            component={Profile}
                        />
                        <Route path="/settings" component={Settings} />
                        <Route exact path="/explore" component={Explore} />
                        <Route
                            exact
                            path="/editor/:id?"
                            component={EditorPage}
                        />
                        <Route exact path="/blog/:id" component={Reader} />
                    </React.Suspense>
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default Home;
