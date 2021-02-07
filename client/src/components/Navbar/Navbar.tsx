import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { bookmarkStrokeIcon, exploreIcon, pencilIcon } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import Dropdown from './Dropdown/Dropdown';
import './navbar.css';

const Navbar = () => {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    // get current route
    const currentRoute = useLocation();

    // set dropdown to false on route change
    useEffect(() => {
        setDropdown(false);
    }, [currentRoute.pathname, applicationState.modal?.modalOpen]);

    // array of nav-items
    const navbarLinks = [
        {
            link: '/editor',
            icon: pencilIcon,
        },
        {
            link: '/explore',
            icon: exploreIcon,
        },
        {
            link: '/',
            icon: bookmarkStrokeIcon,
        },
    ];

    return (
        <div className="navbar">
            <div className="nav-container">
                <div className="logo">
                    <Link style={{ textDecoration: 'none' }} to="/">
                        <div>Archive.</div>
                    </Link>
                </div>

                <div className="nav-items">
                    {navbarLinks.map(navbarLink => (
                        <Link key={navbarLink.link} to={navbarLink.link}>
                            {navbarLink.icon}
                        </Link>
                    ))}

                    <div
                        className="nav-profile-picture"
                        onClick={() => {
                            setDropdown(!dropdown);
                        }}
                    ></div>
                </div>

                {dropdown && (
                    <div className="navbar-dropdown">
                        <Dropdown />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
