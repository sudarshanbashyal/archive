import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { loadingAnimation } from 'src/assets/SVGs';
// import EditorPage from '../Editor/EditorPage';
// import Explore from '../Explore/Explore';
// import Feed from '../Feed/Feed';
import Navbar from '../Navbar/Navbar';
// import Profile from '../Profile/Profile';
// import Reader from '../Reader/Reader';
import Settings from '../Settings/Settings';

const EditorPage = React.lazy(() => import('../Editor/EditorPage'));
const Explore = React.lazy(() => import('../Explore/Explore'));
const Feed = React.lazy(() => import('../Feed/Feed'));
const Profile = React.lazy(() => import('../Profile/Profile'));
const Reader = React.lazy(() => import('../Reader/Reader'));

const Home = () => {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <React.Suspense fallback={loadingAnimation}>
                        <Route exact path="/" component={Feed} />
                        <Route exact path="/user/:id" component={Profile} />
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
