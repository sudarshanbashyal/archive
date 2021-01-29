import React from 'react';
import ProfileSettings from './Profile/ProfileSettings';
import './settings.css';
import { Link, NavLink, Route } from 'react-router-dom';
import AccountSettings from './Account/AccountSettings';

const Settings = () => {
    return (
        <div className="settings">
            <h1>Settings</h1>
            {/* <Link to="/settings/account">account settings</Link>|
            <Link to="/settings/">profile settings</Link> */}
            <div className="settings-container">
                <div className="setting-links">
                    <ul className="links">
                        <li className="link">
                            <NavLink
                                className="inactive-link"
                                activeClassName="active-link"
                                exact={true}
                                to="/settings/"
                            >
                                Profile
                            </NavLink>
                        </li>

                        <li className="link">
                            <NavLink
                                className="inactive-link"
                                activeClassName="active-link"
                                exact={true}
                                to="/settings/account"
                            >
                                Account
                            </NavLink>
                        </li>

                        <li className="link">
                            <NavLink
                                className="inactive-link"
                                activeClassName="active-link"
                                to="/settings/about"
                            >
                                About
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="setting-content">
                    <Route
                        exact
                        path="/settings/"
                        component={ProfileSettings}
                    />

                    <Route
                        exact
                        path="/settings/account"
                        component={AccountSettings}
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
